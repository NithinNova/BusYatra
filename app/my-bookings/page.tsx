"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bus, MapPin, IndianRupee, Calendar, Star, Download, X, Search, Filter, Eye, ArrowLeft } from "lucide-react"
import { CancellationModal } from "@/components/cancellation-modal"
import { getBookings, cancelBooking } from "@/lib/localStorage"
import type { UserBooking } from "@/lib/types"
import { toast } from "sonner"

export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<UserBooking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<UserBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [showCancellationModal, setShowCancellationModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(null)

  useEffect(() => {
    // Fetch bookings from localStorage
    setIsLoading(true)
    setTimeout(() => {
      const userBookings = getBookings()
      setBookings(userBookings)
      setFilteredBookings(userBookings)
      setIsLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let filtered = [...bookings]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.route.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.route.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.bookingReference.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.journeyDate).getTime() - new Date(a.journeyDate).getTime()
        case "date-asc":
          return new Date(a.journeyDate).getTime() - new Date(b.journeyDate).getTime()
        case "amount-desc":
          return b.totalAmount - a.totalAmount
        case "amount-asc":
          return a.totalAmount - b.totalAmount
        default:
          return 0
      }
    })

    setFilteredBookings(filtered)
  }, [bookings, searchQuery, statusFilter, sortBy])

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

  const canCancelBooking = (booking: UserBooking) => {
    const journeyDate = new Date(booking.journeyDate)
    const now = new Date()
    const timeDiff = journeyDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)
    return booking.status === "confirmed" && hoursDiff > 2 // Can cancel if more than 2 hours before journey
  }

  const handleCancelBooking = (booking: UserBooking) => {
    setSelectedBooking(booking)
    setShowCancellationModal(true)
  }

  const handleCancellationConfirm = (reason: string) => {
    if (!selectedBooking) return

    // Cancel booking using localStorage utility
    const success = cancelBooking(selectedBooking.id)
    
    if (success) {
      // Update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id ? { ...booking, status: "cancelled" as const } : booking,
        ),
      )

      toast.success("Booking Cancelled", {
        description: `Your booking ${selectedBooking.bookingReference} has been cancelled successfully.`,
      })
    } else {
      toast.error("Failed to cancel booking", {
        description: "Please try again.",
      })
    }

    setShowCancellationModal(false)
    setSelectedBooking(null)
  }

  const handleDownloadTicket = (booking: UserBooking) => {
    // Simulate ticket download
    toast.success("Downloading Ticket", {
      description: `Ticket for ${booking.bookingReference} is being downloaded.`,
    })
  }

  const handleViewDetails = (bookingId: string) => {
    router.push(`/booking-details/${bookingId}`)
  }

  const goBack = () => {
    router.push("/")
  }

  const activeBookings = filteredBookings.filter((b) => b.status === "confirmed")
  const completedBookings = filteredBookings.filter((b) => b.status === "completed")
  const cancelledBookings = filteredBookings.filter((b) => b.status === "cancelled")

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
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black">My Bookings</h2>
            <p className="text-muted-foreground">Manage all your bus bookings</p>
          </div>
          <Button onClick={() => router.push("/")}>Book New Trip</Button>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Latest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{filteredBookings.length} bookings</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({filteredBookings.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeBookings.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <BookingsList
              bookings={filteredBookings}
              onCancelBooking={handleCancelBooking}
              onDownloadTicket={handleDownloadTicket}
              onViewDetails={handleViewDetails}
              canCancelBooking={canCancelBooking}
              formatTime={formatTime}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="active">
            <BookingsList
              bookings={activeBookings}
              onCancelBooking={handleCancelBooking}
              onDownloadTicket={handleDownloadTicket}
              onViewDetails={handleViewDetails}
              canCancelBooking={canCancelBooking}
              formatTime={formatTime}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="completed">
            <BookingsList
              bookings={completedBookings}
              onCancelBooking={handleCancelBooking}
              onDownloadTicket={handleDownloadTicket}
              onViewDetails={handleViewDetails}
              canCancelBooking={canCancelBooking}
              formatTime={formatTime}
              getStatusColor={getStatusColor}
            />
          </TabsContent>

          <TabsContent value="cancelled">
            <BookingsList
              bookings={cancelledBookings}
              onCancelBooking={handleCancelBooking}
              onDownloadTicket={handleDownloadTicket}
              onViewDetails={handleViewDetails}
              canCancelBooking={canCancelBooking}
              formatTime={formatTime}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CancellationModal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        onConfirm={handleCancellationConfirm}
        booking={selectedBooking}
      />
    </div>
  )
}

interface BookingsListProps {
  bookings: UserBooking[]
  onCancelBooking: (booking: UserBooking) => void
  onDownloadTicket: (booking: UserBooking) => void
  onViewDetails: (bookingId: string) => void
  canCancelBooking: (booking: UserBooking) => boolean
  formatTime: (time: string) => string
  getStatusColor: (status: string) => string
}

function BookingsList({
  bookings,
  onCancelBooking,
  onDownloadTicket,
  onViewDetails,
  canCancelBooking,
  formatTime,
  getStatusColor,
}: BookingsListProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
          <p className="text-muted-foreground">Your bookings will appear here</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">{booking.operator}</h3>
                <p className="text-sm text-muted-foreground">{booking.busName}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{booking.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-2xl font-bold text-primary">
                  <IndianRupee className="h-5 w-5" />
                  <span>{booking.totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-sm text-muted-foreground">Ref: {booking.bookingReference}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{formatTime(booking.departureTime)}</p>
                  <p className="text-sm text-muted-foreground">{booking.route.from}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {new Date(booking.journeyDate).toLocaleDateString("en-IN")}
                  </p>
                  <div className="w-16 h-px bg-border my-1"></div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{formatTime(booking.arrivalTime)}</p>
                  <p className="text-sm text-muted-foreground">{booking.route.to}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Seats: {booking.seats.join(", ")}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Booked: {new Date(booking.bookedAt).toLocaleDateString("en-IN")}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => onViewDetails(booking.id)}>
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDownloadTicket(booking)}>
                  <Download className="h-4 w-4 mr-1" />
                  Ticket
                </Button>
                {canCancelBooking(booking) && (
                  <Button variant="outline" size="sm" onClick={() => onCancelBooking(booking)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
