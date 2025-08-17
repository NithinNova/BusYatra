"use client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Bus } from "@/lib/types"

interface SeatLayoutProps {
  bus: Bus
  onSeatSelect: (seatIndex: number) => void
  selectedSeats: string[]
}

export function SeatLayout({ bus, onSeatSelect, selectedSeats }: SeatLayoutProps) {
  const getSeatNumber = (index: number) => {
    const row = Math.floor(index / bus.seatLayout.seatsPerRow)
    const seat = index % bus.seatLayout.seatsPerRow
    const rowLetter = String.fromCharCode(65 + row) // A, B, C, etc.
    return `${rowLetter}${seat + 1}`
  }

  const getSeatState = (index: number) => {
    return bus.seatLayout.layout[index] || "available"
  }

  const isSeatSelected = (seatNumber: string) => {
    return selectedSeats.includes(seatNumber)
  }

  const isSeatDisabled = (seatState: string) => {
    return seatState === "booked" || seatState === "unavailable"
  }

  const renderSeat = (index: number) => {
    const seatNumber = getSeatNumber(index)
    const seatState = getSeatState(index)
    const isSelected = isSeatSelected(seatNumber)
    const isDisabled = isSeatDisabled(seatState)

    let seatColor = "bg-white border-gray-300"
    if (seatState === "booked") seatColor = "bg-gray-400 border-gray-400"
    if (seatState === "unavailable") seatColor = "bg-gray-400 border-gray-400"
    if (seatState === "women") seatColor = "bg-pink-200 border-pink-300"
    if (isSelected) seatColor = "bg-purple-500 border-purple-500"

    return (
      <button
        key={index}
        disabled={isDisabled}
        onClick={() => !isDisabled && onSeatSelect(index)}
        className={cn(
          "w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-semibold transition-all",
          seatColor,
          isSelected ? "text-white" : "text-gray-700",
          !isDisabled && "hover:scale-105 cursor-pointer",
          isDisabled && "cursor-not-allowed opacity-60",
        )}
      >
        {seatNumber}
      </button>
    )
  }

  const renderSeatRows = () => {
    const rows = []
    const totalSeats = bus.seatLayout.layout.length
    const seatsPerRow = bus.seatLayout.seatsPerRow

    for (let i = 0; i < totalSeats; i += seatsPerRow) {
      const rowSeats = []

      // Left side seats (first half)
      const leftSeats = Math.floor(seatsPerRow / 2)
      for (let j = 0; j < leftSeats; j++) {
        if (i + j < totalSeats) {
          rowSeats.push(renderSeat(i + j))
        }
      }

      // Aisle space
      rowSeats.push(
        <div key={`aisle-${i}`} className="w-8 flex justify-center">
          <div className="w-1 h-8 bg-gray-200 rounded"></div>
        </div>,
      )

      // Right side seats (second half)
      for (let j = leftSeats; j < seatsPerRow; j++) {
        if (i + j < totalSeats) {
          rowSeats.push(renderSeat(i + j))
        }
      }

      rows.push(
        <div key={`row-${i}`} className="flex items-center justify-center gap-2">
          {rowSeats}
        </div>,
      )
    }

    return rows
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4">1. Select Seat</h3>
        <div className="flex items-center justify-end gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
            <span>available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 border-2 border-gray-400 rounded"></div>
            <span>unavailable</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-pink-200 border-2 border-pink-300 rounded"></div>
            <span>women</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 border-2 border-purple-500 rounded"></div>
            <span>selected</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
        {/* Driver section */}
        <div className="flex justify-start mb-6">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white rounded-full"></div>
          </div>
        </div>

        {/* Seat grid */}
        <div className="space-y-3 max-w-xs mx-auto">{renderSeatRows()}</div>

        {/* Last row single seat if needed */}
        {bus.seatLayout.layout.length % 4 !== 0 && (
          <div className="flex justify-center mt-4">
            <div className="w-12 h-12 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-xs font-semibold">
              {getSeatNumber(bus.seatLayout.layout.length - 1)}
            </div>
          </div>
        )}
      </div>

      {/* Selected seats info */}
      {selectedSeats.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-800 mb-2">Selected Seats</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <Badge key={seat} className="bg-purple-500 text-white">
                {seat}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
