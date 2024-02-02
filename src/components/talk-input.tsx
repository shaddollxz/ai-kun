import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { useState } from 'react'

export function TalkInput({
  onValueChange,
  placeholder = '请输入',
  className,
}: {
  placeholder?: string
  className?: ClassValue
  onValueChange: (v: string) => void
}) {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className={clsx('flex py-2 px-4 bg-gray-600 rounded-full', className)}>
      <input
        value={inputValue}
        className="flex-1 bg-gray-600 focus-visible:outline-none"
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div
        className="bg-orange-400 rounded-full cursor-pointer"
        onClick={() => {
          if (inputValue) {
            onValueChange(inputValue)
            setInputValue('')
          }
        }}
      >
        icon
      </div>
    </div>
  )
}
