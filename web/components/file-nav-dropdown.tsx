'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlusIcon, MinusIcon } from 'lucide-react'

interface FileItem {
  path: string
  status: string
  anchorId: string
}

interface FileNavDropdownProps {
  files: FileItem[]
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'added':
      return <PlusIcon className="size-3 text-green-500" />
    case 'removed':
      return <MinusIcon className="size-3 text-red-500" />
    default:
      return null
  }
}

export function FileNavDropdown({ files }: FileNavDropdownProps) {
  const handleValueChange = (anchorId: string | null) => {
    if (!anchorId) return
    const element = document.getElementById(anchorId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="min-w-64">
        <SelectValue placeholder={`${files.length} files`} />
      </SelectTrigger>
      <SelectContent align="end">
        {files.map((file) => (
          <SelectItem key={file.anchorId} value={file.anchorId}>
            <div className="flex items-center gap-2">
              {getStatusIcon(file.status)}
              <span className="font-mono text-xs">{file.path}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
