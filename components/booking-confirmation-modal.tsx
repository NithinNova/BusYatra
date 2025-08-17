"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Share2, IndianRupee, Bus, Phone } from "lucide-react"
import type { Bus as BusType } from "@/lib/types"

interface PassengerDetails {
  name: string
  age: string
  gender: string
  phone?: string
}

interface BookingData {
  busId: string
  selectedSeats: string[]
  from: string
  to: string
  date: string
  totalAmount: number
}

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  bookingReference: string
  bus: BusType
  bookingData: BookingData
  passengerDetails: PassengerDetails[]
}

export function BookingConfirmationModal({
  isOpen,
  onClose,
  bookingReference,
  bus,
  bookingData,
  passengerDetails,
}: BookingConfirmationModalProps) {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const handleDownloadTicket = () => {
    setIsDownloading(true)
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false)
      // In a real app, this would generate and download a PDF ticket
      console.log("Downloading ticket for booking:", bookingReference)
    }, 2000)
  }

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: "Bus Ticket - BusYatra",
        text: `My bus booking confirmed! Reference: ${bookingReference}`,
        url: window.location.origin,
      })
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`Bus booking confirmed! Reference: ${bookingReference}`)
    }
  }

  const goToMyBookings = () => {
    onClose()
    router.push("/my-bookings")
  }

  const goHome = () => {
    onClose()
    router.push("/")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-6 w-6" />
            <span className="font-serif">Booking Confirmed!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative bg-gradient-to-r from-orange-50 via-white to-green-50 border-2 border-dashed border-orange-300 rounded-lg p-6">
            {/* Ticket Header */}
            <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
              <h2 className="text-2xl font-serif font-bold text-orange-600 mb-1">BusYatra</h2>
              <p className="text-sm text-gray-600">Your Journey Partner</p>
              <div className="mt-3 bg-green-100 border border-green-300 rounded-full px-4 py-1 inline-block">
                <span className="text-green-700 font-bold text-sm">CONFIRMED TICKET</span>
              </div>
            </div>

            {/* PNR and Journey Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium mb-1">PNR NUMBER</p>
                  <p className="text-xl font-bold text-red-700 tracking-wider">{bookingReference}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">{bookingData.from}</p>
                    <p className="text-xs text-gray-500">FROM</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <Bus className="h-5 w-5 text-blue-500" />
                    <div className="flex-1 h-0.5 bg-blue-300 mx-2"></div>
                    <Bus className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">{bookingData.to}</p>
                    <p className="text-xs text-gray-500">TO</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium mb-1">DEPARTURE</p>
                    <p className="text-lg font-bold text-blue-700">{formatTime(bus.departureTime)}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-purple-600 font-medium mb-1">ARRIVAL</p>
                    <p className="text-lg font-bold text-purple-700">{formatTime(bus.arrivalTime)}</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600 font-medium mb-1">TRAVEL DATE</p>
                  <p className="text-sm font-bold text-gray-800">
                    {new Date(bookingData.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Bus Details */}
            <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">BUS OPERATOR</p>
                  <p className="font-bold text-gray-800">{bus.operator}</p>
                  <p className="text-sm text-gray-600">{bus.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">BUS NUMBER</p>
                  <p className="font-bold text-gray-800">{bus.busNumber}</p>
                  <Badge variant="outline" className="mt-1">
                    {bus.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">SEAT NUMBERS</p>
                  <div className="flex flex-wrap gap-1">
                    {bookingData.selectedSeats.map((seat) => (
                      <span key={seat} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-bold">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
              <p className="text-xs text-gray-500 font-medium mb-3">PASSENGER DETAILS</p>
              <div className="space-y-2">
                {passengerDetails.map((passenger, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{passenger.name}</p>
                        <p className="text-sm text-gray-600">
                          {passenger.age} years • {passenger.gender}
                        </p>
                        {passenger.phone && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {passenger.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">SEAT</p>
                      <p className="font-bold text-red-600">{bookingData.selectedSeats[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fare Details */}
            <div className="border-t-2 border-dashed border-gray-300 pt-4">
              <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg p-4">
                <div>
                  <p className="text-xs text-green-600 font-medium mb-1">TOTAL FARE PAID</p>
                  <p className="text-sm text-green-700">
                    Payment Status: <span className="font-bold">CONFIRMED</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-2xl font-bold text-green-700">
                    <IndianRupee className="h-6 w-6" />
                    <span>{bookingData.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Footer */}
            <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4 text-center">
              <p className="text-xs text-gray-500 mb-2">
                Please arrive 15 minutes before departure • Carry valid ID proof • Support: 1800-123-4567
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span>Generated on {new Date().toLocaleString("en-IN")}</span>
                <span>•</span>
                <span>BusYatra.com</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleDownloadTicket}
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={isDownloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? "Downloading..." : "Download Ticket"}
            </Button>
            <Button onClick={handleShareTicket} variant="outline" className="flex-1 bg-transparent">
              <Share2 className="h-4 w-4 mr-2" />
              Share Ticket
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={goToMyBookings} className="flex-1">
              View My Bookings
            </Button>
            <Button onClick={goHome} variant="outline" className="flex-1 bg-transparent">
              Book Another Trip
            </Button>
          </div>

          {/* Important Notes */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h4 className="font-medium text-blue-800 mb-2">Important Notes</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Please arrive at the boarding point 15 minutes before departure</li>
                <li>• Carry a valid ID proof during travel</li>
                <li>• Cancellation charges may apply as per policy</li>
                <li>• Contact support for any assistance: 1800-123-4567</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
