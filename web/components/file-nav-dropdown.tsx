'use client'

import * as React from 'react'
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
  label?: string
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

export function FileNavDropdown({ files, label }: FileNavDropdownProps) {
  const [selectedPath, setSelectedPath] = React.useState<string | null>(null)

  const handleValueChange = (anchorId: string | null) => {
    if (!anchorId) return
    const file = files.find((f) => f.anchorId === anchorId)
    if (file) {
      setSelectedPath(file.path)
    }
    const element = document.getElementById(anchorId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
      )}
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full sm:w-auto sm:min-w-48">
        <SelectValue placeholder={`${files.length} files`}>
          {selectedPath && (
            <span className="font-mono text-xs">{selectedPath}</span>
          )}
        </SelectValue>
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
    </div>
  )
}
