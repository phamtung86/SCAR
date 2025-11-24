import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatMoney } from "@/lib/utils/money-format"
import { CarDTO } from "@/types/car"

interface CarSelectWithImageProps {
  cars: CarDTO[]
  onSelect: (car: CarDTO) => void
  selectedCar: CarDTO | null
}

export function CarSelectWithImage({ cars, onSelect, selectedCar }: CarSelectWithImageProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background"
        >
          {selectedCar ? selectedCar.title : "-- Chọn xe --"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0 bg-popover z-50" align="start">
        <Command>
          <CommandInput placeholder="Tìm kiếm xe..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy xe.</CommandEmpty>
            <CommandGroup>
              {cars.map((car) => (
                <CommandItem
                  key={car.id}
                  value={car.title}
                  onSelect={() => {
                    onSelect(car)
                    setOpen(false)
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <img
                      src={car.carImages?.[0]?.imageUrl}
                      alt={car.title}
                      className="w-20 h-14 object-cover rounded border border-border"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{car.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {car.model} • {car.year}
                      </p>
                      <p className="text-sm font-semibold text-red-700">
                        {formatMoney(car.price)}
                      </p>
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedCar?.id === car.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
