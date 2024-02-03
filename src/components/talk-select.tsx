import type { SelectOption } from '@/types/message'
import { uniqueId } from '@/utils/unique-id'

export function TalkSelect<T>({
  options,
  onSelect,
}: {
  options: SelectOption<T>[]
  onSelect: (option: SelectOption<T>) => void
}) {
  return (
    <div className="w-full p-2 bg-gray-700 rounded-2xl">
      {options.map((option) => {
        return (
          <div
            key={`${option.label}+${uniqueId()}`}
            className="p-2 border-b cursor-pointer border-gray-600 last:border-none"
            onClick={() => onSelect(option)}
          >
            {option.label}
          </div>
        )
      })}
    </div>
  )
}
