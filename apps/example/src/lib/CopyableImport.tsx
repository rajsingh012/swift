import { useState } from 'react'
import { useToast } from './toast'

export function CopyableImport({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.show(`${label} copied`)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer rounded border border-gray-300 bg-white px-2 py-0.5 text-xs text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto rounded bg-gray-900 p-3 text-xs leading-relaxed text-gray-100 dark:border dark:border-gray-700">
        {code}
      </pre>
    </div>
  )
}
