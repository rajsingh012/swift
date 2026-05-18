export type IconFormat = 'svg' | 'webp' | 'png' | 'jpeg'

export interface IconBlobOptions {
  format: IconFormat
  size?: number
  quality?: number
  color?: string
  background?: string
}

export interface DownloadIconOptions extends IconBlobOptions {
  filename?: string
}

const DEFAULT_SIZE = 256
const DEFAULT_QUALITY = 0.92

function serializeSvg(svg: SVGSVGElement, color?: string): string {
  const clone = svg.cloneNode(true) as SVGSVGElement
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  }
  let resolved = color
  if (!resolved && typeof window !== 'undefined') {
    resolved = getComputedStyle(svg).color
  }
  clone.setAttribute('color', resolved || '#000')
  return new XMLSerializer().serializeToString(clone)
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load SVG'))
    img.src = src
  })
}

export async function iconToBlob(
  svg: SVGSVGElement,
  options: IconBlobOptions,
): Promise<Blob> {
  const source = serializeSvg(svg, options.color)

  if (options.format === 'svg') {
    return new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
  }

  const size = options.size ?? DEFAULT_SIZE
  const quality = options.quality ?? DEFAULT_QUALITY
  const mime =
    options.format === 'webp'
      ? 'image/webp'
      : options.format === 'jpeg'
        ? 'image/jpeg'
        : 'image/png'

  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`
  const img = await loadImage(dataUrl)

  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  const background = options.background ?? (options.format === 'jpeg' ? '#ffffff' : undefined)
  if (background) {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, size, size)
  }
  ctx.drawImage(img, 0, 0, size, size)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error(`Canvas toBlob failed for ${mime}`))
      },
      mime,
      quality,
    )
  })
}

export async function downloadIcon(
  svg: SVGSVGElement,
  options: DownloadIconOptions,
): Promise<void> {
  const blob = await iconToBlob(svg, options)
  const filename = options.filename ?? `icon.${options.format}`
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
