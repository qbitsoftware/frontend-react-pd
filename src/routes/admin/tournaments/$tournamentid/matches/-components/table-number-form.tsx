import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TableNumberFormProps {
  matchId: string
  initialTableNumber: number
}

export function TableNumberForm({ matchId, initialTableNumber }: TableNumberFormProps) {
  const [tableNumber, setTableNumber] = useState(initialTableNumber)
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically make an API call to update the table number
    console.log(`Updating table number for match ${matchId} to ${tableNumber}`)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Input
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(Number(e.target.value))}
          className="w-20"
        />
        <Button type="submit" size="sm">
          Save
        </Button>
      </form>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <span>{tableNumber}</span>
      <Button onClick={() => setIsEditing(true)} size="sm">
        Edit
      </Button>
    </div>
  )
}

