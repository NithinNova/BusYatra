"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bus, MapPin, Clock, IndianRupee, Users, Star, Wifi, Snowflake, Tv, ArrowLeft } from "lucide-react"
import { SeatLayout } from "@/components/seat-layout"
import { mockBuses } from "@/lib/mock-data"
import { savePassengerInfo, getPassengerInfo } from "@/lib/localStorage"
import type { Bus as BusType } from "@/lib/types"

function SeatSelectionContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bus, setBus] = useState<BusType | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const searchData = {
    busId: searchParams.get("busId") || "",
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || "",
    passengers: Number.parseInt(searchParams.get("passengers") || "1"),
  }

  useEffect(() => {
    // Simulate API call to get bus details
    setIsLoading(true)
    setTimeout(() => {
      const foundBus = mockBuses.find((b) => b.id === searchData.busId)
      if (foundBus) {
        // Simulate some booked seats
        const bookedSeats = ["A1", "A2", "B3", "C4", "D1", "E2", "F3"]
        const updatedLayout = foundBus.seatLayout.layout.map((seat, index) => {
          const seatNumber = getSeatNumber(index, foundBus.seatLayout.seatsPerRow)
          return bookedSeats.includes(seatNumber) ? "booked" : "available"
        })

        setBus({
          ...foundBus,
          seatLayout: {
            ...foundBus.seatLayout,
            layout: updatedLayout,
          },
        })
      }
      setIsLoading(false)
    }, 1000)
  }, [searchData.busId])

  const getSeatNumber = (index: number, seatsPerRow: number) => {
    const row = Math.floor(index / seatsPerRow)
    const seat = index % seatsPerRow
    const rowLetter = String.fromCharCode(65 + row) // A, B, C, etc.
    return `${rowLetter}${seat + 1}`
  }

  const handleSeatSelect = (seatIndex: number) => {
    if (!bus) return

    const seatNumber = getSeatNumber(seatIndex, bus.seatLayout.seatsPerRow)
    const currentSeatState = bus.seatLayout.layout[seatIndex]

    if (currentSeatState === "booked" || currentSeatState === "unavailable") {
      return // Can't select booked or unavailable seats
    }

    if (selectedSeats.includes(seatNumber)) {
      // Deselect seat
      setSelectedSeats((prev) => prev.filter((seat) => seat !== seatNumber))
      const newLayout = [...bus.seatLayout.layout]
      newLayout[seatIndex] = "available"
      setBus({
        ...bus,
        seatLayout: {
          ...bus.seatLayout,
          layout: newLayout,
        },
      })
    } else {
      // Select seat (check passenger limit)
      if (selectedSeats.length < searchData.passengers) {
        setSelectedSeats((prev) => [...prev, seatNumber])
        const newLayout = [...bus.seatLayout.layout]
        newLayout[seatIndex] = "selected"
        setBus({
          ...bus,
          seatLayout: {
            ...bus.seatLayout,
            layout: newLayout,
          },
        })
      }
    }
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const calculateDuration = (departure: string, arrival: string) => {
    const [depHour, depMin] = departure.split(":").map(Number)
    const [arrHour, arrMin] = arrival.split(":").map(Number)

    let totalMinutes = arrHour * 60 + arrMin - (depHour * 60 + depMin)
    if (totalMinutes < 0) totalMinutes += 24 * 60 // Next day arrival

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }

  const totalFare = bus ? selectedSeats.length * bus.price : 0

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0 || !bus) return

    const queryParams = new URLSearchParams({
      busId: bus.id,
      selectedSeats: selectedSeats.join(","),
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      totalAmount: totalFare.toString(),
    })

    router.push(`/booking?${queryParams.toString()}`)
  }

  const goBack = () => {
    const queryParams = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      passengers: searchData.passengers.toString(),
    })
    router.push(`/search?${queryParams.toString()}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-black text-primary">BusYatra</h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!bus) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-black text-primary">BusYatra</h1>
            </div>
            <Button
              variant="outline"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Bus not found</h2>
          <Button onClick={goBack}>Go Back to Search</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-teal-600" />
            <h1 className="text-2xl font-black text-teal-600">BusYatra</h1>
          </div>
          <Button
            variant="outline"
            onClick={goBack}
            className="border-teal-200 text-teal-700 hover:bg-teal-50 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Journey Summary */}
        <Card className="mb-6 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <span className="font-semibold text-gray-800">{searchData.from}</span>
                  <span className="text-teal-400">→</span>
                  <span className="font-semibold text-gray-800">{searchData.to}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <span className="text-gray-700">{new Date(searchData.date).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-teal-100 text-teal-800 border-teal-200">
                Select {searchData.passengers} seat{searchData.passengers > 1 ? "s" : ""}
              </Badge>
            </div>

            {/* Bus Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">{bus.operator}</h3>
                <p className="text-gray-600 font-medium">{bus.name}</p>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="border-teal-200 text-teal-700">
                    {bus.type}
                  </Badge>
                  <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-700">{bus.rating}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {bus.amenities.includes("WiFi") && (
                    <div className="flex items-center space-x-1 text-teal-600">
                      <Wifi className="h-4 w-4" />
                      <span className="text-xs font-medium">WiFi</span>
                    </div>
                  )}
                  {bus.amenities.includes("AC") && (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Snowflake className="h-4 w-4" />
                      <span className="text-xs font-medium">AC</span>
                    </div>
                  )}
                  {bus.amenities.includes("Entertainment") && (
                    <div className="flex items-center space-x-1 text-purple-600">
                      <Tv className="h-4 w-4" />
                      <span className="text-xs font-medium">TV</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-700">{formatTime(bus.departureTime)}</p>
                    <p className="text-sm text-gray-600 font-medium">{bus.route.from}</p>
                  </div>
                  <div className="text-center mx-4">
                    <p className="text-sm text-gray-500 font-medium">
                      {calculateDuration(bus.departureTime, bus.arrivalTime)}
                    </p>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-teal-300 to-cyan-300 my-2"></div>
                    <p className="text-xs text-gray-400">Direct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-700">{formatTime(bus.arrivalTime)}</p>
                    <p className="text-sm text-gray-600 font-medium">{bus.route.to}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-gray-800">
                  <span className="text-xl">Select Your Seats</span>
                  <div className="flex items-center space-x-2 text-sm text-teal-600 bg-white/70 px-3 py-1 rounded-full">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{bus.availableSeats} available</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SeatLayout bus={bus} onSeatSelect={handleSeatSelect} selectedSeats={selectedSeats} />
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-t-lg">
                <CardTitle className="text-gray-800">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800">Selected Seats</h4>
                  {selectedSeats.length === 0 ? (
                    <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg text-center">No seats selected</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <Badge key={seat} className="bg-teal-100 text-teal-800 border-teal-200 px-3 py-1">
                          {seat}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Separator className="bg-teal-100" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      Base Fare ({selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""})
                    </span>
                    <div className="flex items-center font-semibold text-gray-800">
                      <IndianRupee className="h-4 w-4" />
                      <span>{totalFare.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Taxes & Fees</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      <span>0</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-teal-100" />

                <div className="flex justify-between text-lg font-bold bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg">
                  <span className="text-gray-800">Total Amount</span>
                  <div className="flex items-center text-teal-700">
                    <IndianRupee className="h-5 w-5" />
                    <span>{totalFare.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToBooking}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
                  disabled={selectedSeats.length === 0 || selectedSeats.length !== searchData.passengers}
                >
                  {selectedSeats.length === 0
                    ? "Select Seats to Continue"
                    : selectedSeats.length !== searchData.passengers
                      ? `Select ${searchData.passengers - selectedSeats.length} more seat${searchData.passengers - selectedSeats.length !== 1 ? "s" : ""}`
                      : "Proceed to Booking"}
                </Button>

                {selectedSeats.length > 0 && selectedSeats.length !== searchData.passengers && (
                  <p className="text-sm text-gray-500 text-center bg-amber-50 p-2 rounded-lg border border-amber-200">
                    Please select exactly {searchData.passengers} seat{searchData.passengers > 1 ? "s" : ""} for{" "}
                    {searchData.passengers} passenger{searchData.passengers > 1 ? "s" : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SeatSelectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SeatSelectionContent />
    </Suspense>
  )
}
