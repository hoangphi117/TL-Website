import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface EnumSelectProps<T extends string> {
  value: T;
  options: readonly {value: T, label: string}[];
  placeholder?: string;
  onChange: (val: T) => void;
}

export function EnumSelect<T extends string>({value, options, placeholder, onChange} : EnumSelectProps<T>) {
  return (
    <Select value={value} onValueChange={onChange} >
      <SelectTrigger>
        <SelectValue placeholder={placeholder}/>
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}