"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bus, MapPin, IndianRupee, Calendar, Star, Download, Share2, ArrowLeft, Users, Phone, Mail } from "lucide-react"
import { mockBookings } from "@/lib/mock-user-data"
import type { UserBooking } from "@/lib/types"

export default function BookingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [booking, setBooking] = useState<UserBooking | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch booking details
    setIsLoading(true)
    setTimeout(() => {
      const foundBooking = mockBookings.find((b) => b.id === params.id)
      setBooking(foundBooking || null)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleDownloadTicket = () => {
    // Simulate ticket download
    console.log("Downloading ticket for booking:", booking?.bookingReference)
  }

  const handleShareTicket = () => {
    if (navigator.share && booking) {
      navigator.share({
        title: "Bus Ticket - BusYatra",
        text: `My bus booking: ${booking.bookingReference}`,
        url: window.location.href,
      })
    }
  }

  const goBack = () => {
    router.push("/my-bookings")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
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
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-black text-primary">BusYatra</h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Booking not found</h2>
          <Button onClick={goBack}>Back to My Bookings</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bus className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-black text-primary">BusYatra</h1>
          </div>
          <Button variant="outline" onClick={goBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bookings
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black">Booking Details</h2>
            <p className="text-muted-foreground">Reference: {booking.bookingReference}</p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Journey Information */}
            <Card>
              <CardHeader>
                <CardTitle>Journey Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{booking.route.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-semibold">{booking.route.to}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(booking.journeyDate).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">{booking.operator}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{booking.busName}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{booking.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-4">
                      <div>
                        <p className="text-lg font-semibold">{formatTime(booking.departureTime)}</p>
                        <p className="text-sm text-muted-foreground">Departure</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{formatTime(booking.arrivalTime)}</p>
                        <p className="text-sm text-muted-foreground">Arrival</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seat Information */}
            <Card>
              <CardHeader>
                <CardTitle>Seat Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Selected Seats</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats.map((seat) => (
                      <Badge key={seat} variant="secondary">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Support Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>Customer Support: 1800-123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Email: support@busyatra.com</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  For any queries or assistance, please contact our 24/7 customer support team.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Details */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <div className="flex items-center font-bold text-primary">
                      <IndianRupee className="h-4 w-4" />
                      <span>{booking.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Payment Status</span>
                    <span className="text-green-600 font-medium">Paid</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Booked On</span>
                    <span>{new Date(booking.bookedAt).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button onClick={handleDownloadTicket} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Ticket
                  </Button>
                  <Button onClick={handleShareTicket} variant="outline" className="w-full bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Ticket
                  </Button>
                </div>

                {/* Important Notes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Important Notes</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Arrive 15 minutes before departure</li>
                    <li>• Carry valid ID proof</li>
                    <li>• Keep this booking reference handy</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
