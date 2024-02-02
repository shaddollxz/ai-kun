import type { SelectOption } from '@/types/message'

export function TalkSelect<T>({
  options,
  onSelect,
}: {
  options: SelectOption<T>[]
  onSelect: (option: SelectOption<T>) => void
}) {
  return (
    <div className="w-full p-2 bg-gray-500 rounded-2xl">
      {options.map((option) => {
        return (
          <div
            key={option.label}
            className="p-2 border-b cursor-pointer border-white last:border-none"
            onClick={() => onSelect(option)}
          >
            {option.label}
          </div>
        )
      })}
    </div>
  )
}
