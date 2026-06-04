import { useEffect, useState, type RefObject } from 'react'

/* ------------------------------------------------------------------ *
 * Focusable element discovery — used by focus-trap / initial-focus
 * logic in every modal-style overlay.
 * ------------------------------------------------------------------ */

export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.getAttribute('aria-hidden') !== 'true' &&
      el.offsetParent !== null,
  )
}

/* ------------------------------------------------------------------ *
 * Presence — keeps a node mounted through its CSS exit animation.
 * Caller flips `data-state="closed"` off the returned flag; we wait for
 * `animationend`, then unmount. Falls back to immediate unmount when no
 * animation is defined (prefers-reduced-motion → none).
 * ------------------------------------------------------------------ */

export function usePresence(
  present: boolean,
  nodeRef: RefObject<HTMLElement | null>,
): boolean {
  const [mounted, setMounted] = useState(present)

  useEffect(() => {
    if (present) {
      setMounted(true)
      return
    }
    if (!mounted) return

    const el = nodeRef.current
    if (!el) {
      setMounted(false)
      return
    }

    const styles = window.getComputedStyle(el)
    if (styles.animationName === 'none' || styles.display === 'none') {
      setMounted(false)
      return
    }

    let settled = false
    const finish = (event: AnimationEvent) => {
      if (event.target !== el || settled) return
      settled = true
      setMounted(false)
    }
    el.addEventListener('animationend', finish)
    el.addEventListener('animationcancel', finish)
    // Safety net if the animation never reports (interrupted layout, etc.).
    const timeout = window.setTimeout(() => {
      if (!settled) setMounted(false)
    }, 1500)

    return () => {
      el.removeEventListener('animationend', finish)
      el.removeEventListener('animationcancel', finish)
      window.clearTimeout(timeout)
    }
  }, [present, mounted, nodeRef])

  return mounted
}

/* ------------------------------------------------------------------ *
 * Scroll lock — ref-counted so nested modal overlays lock/unlock once.
 * Uses position:fixed so iOS Safari actually stops scrolling.
 * ------------------------------------------------------------------ */

let scrollLockCount = 0
let savedScrollY = 0
let savedBodyStyles: {
  overflow: string
  position: string
  top: string
  width: string
  paddingRight: string
} | null = null

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return

    if (scrollLockCount === 0) {
      const body = document.body
      savedScrollY = window.scrollY
      savedBodyStyles = {
        overflow: body.style.overflow,
        position: body.style.position,
        top: body.style.top,
        width: body.style.width,
        paddingRight: body.style.paddingRight,
      }
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth
      body.style.position = 'fixed'
      body.style.top = `-${savedScrollY}px`
      body.style.width = '100%'
      body.style.overflow = 'hidden'
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`
    }
    scrollLockCount += 1

    return () => {
      scrollLockCount -= 1
      if (scrollLockCount === 0 && savedBodyStyles) {
        const body = document.body
        body.style.overflow = savedBodyStyles.overflow
        body.style.position = savedBodyStyles.position
        body.style.top = savedBodyStyles.top
        body.style.width = savedBodyStyles.width
        body.style.paddingRight = savedBodyStyles.paddingRight
        savedBodyStyles = null
        window.scrollTo(0, savedScrollY)
      }
    }
  }, [active])
}

/* ------------------------------------------------------------------ *
 * Inert background — hides everything outside the overlay's portal
 * root from pointers + assistive tech while a modal is open.
 * ------------------------------------------------------------------ */

export function useInertBackground(
  active: boolean,
  nodeRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    if (!active || typeof document === 'undefined') return
    const node = nodeRef.current
    if (!node) return

    // Walk up to the direct child of <body> that contains this overlay.
    let portalRoot: HTMLElement = node
    while (portalRoot.parentElement && portalRoot.parentElement !== document.body) {
      portalRoot = portalRoot.parentElement
    }

    const siblings = Array.from(document.body.children).filter(
      (el) => el !== portalRoot,
    ) as HTMLElement[]

    const restore = siblings.map((el) => ({
      el,
      ariaHidden: el.getAttribute('aria-hidden'),
      inert: el.inert,
    }))

    siblings.forEach((el) => {
      el.setAttribute('aria-hidden', 'true')
      el.inert = true
    })

    return () => {
      restore.forEach(({ el, ariaHidden, inert }) => {
        if (ariaHidden === null) el.removeAttribute('aria-hidden')
        else el.setAttribute('aria-hidden', ariaHidden)
        el.inert = inert
      })
    }
  }, [active, nodeRef])
}

/* ------------------------------------------------------------------ *
 * Overlay stack — only the top-most open overlay reacts to Escape and
 * outside-clicks, so nested overlays dismiss one layer at a time.
 * Shared across Sheet, DatePicker, TimePicker — anything stackable.
 * ------------------------------------------------------------------ */

const overlayStack: string[] = []

export function pushOverlay(id: string): void {
  overlayStack.push(id)
}

export function removeOverlay(id: string): void {
  const index = overlayStack.lastIndexOf(id)
  if (index !== -1) overlayStack.splice(index, 1)
}

export function isTopOverlay(id: string): boolean {
  return overlayStack[overlayStack.length - 1] === id
}
