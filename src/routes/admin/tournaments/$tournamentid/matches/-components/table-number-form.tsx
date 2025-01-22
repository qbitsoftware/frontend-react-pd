import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface TableNumberFormProps {
  matchId: string
  initialTableNumber: number
}

export function TableNumberForm({ matchId, initialTableNumber }: TableNumberFormProps) {
  const [tableNumber, setTableNumber] = useState(initialTableNumber)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTableNumber(Number(e.target.value))
    e.preventDefault()
    console.log(`Updating table number for match ${matchId} to ${tableNumber}`)
    // siia tuleb db query
  }


    return (
        <Input
          type="number"
          value={tableNumber}
          onChange={(e) => handleChange(e)}
          className="w-20"
        />
    )
  }


