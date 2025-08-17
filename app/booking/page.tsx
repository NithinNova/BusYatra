"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bus, MapPin, Clock, IndianRupee, CreditCard, Smartphone, Wallet, ArrowLeft, CheckCircle } from "lucide-react"
import { BookingConfirmationModal } from "@/components/booking-confirmation-modal"
import { mockBuses } from "@/lib/mock-data"
import { saveBooking, generateBookingReference } from "@/lib/localStorage"
import type { Bus as BusType, BookingData } from "@/lib/types"
import { toast } from "sonner"

interface PassengerDetails {
  name: string
  age: string
  gender: string
  phone?: string
}

function BookingPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [bus, setBus] = useState<BusType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("upi")
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const bookingData = {
    busId: searchParams.get("busId") || "",
    selectedSeats: searchParams.get("selectedSeats")?.split(",") || [],
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || "",
    totalAmount: Number.parseInt(searchParams.get("totalAmount") || "0"),
  }

  const [passengerDetails, setPassengerDetails] = useState<PassengerDetails[]>(
    bookingData.selectedSeats.map(() => ({
      name: "",
      age: "",
      gender: "",
      phone: "",
    })),
  )

  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    walletProvider: "",
  })

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const foundBus = mockBuses.find((b) => b.id === bookingData.busId)
      setBus(foundBus || null)
      setIsLoading(false)
    }, 500)
  }, [bookingData.busId])

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const updatePassengerDetail = (index: number, field: keyof PassengerDetails, value: string) => {
    setPassengerDetails((prev) =>
      prev.map((passenger, i) => (i === index ? { ...passenger, [field]: value } : passenger)),
    )
  }

  const isFormValid = () => {
    const allPassengersValid = passengerDetails.every(
      (passenger) => passenger.name.trim() && passenger.age.trim() && passenger.gender,
    )

    let paymentValid = false
    switch (selectedPaymentMethod) {
      case "upi":
        paymentValid = paymentDetails.upiId.trim() !== ""
        break
      case "card":
        paymentValid =
          paymentDetails.cardNumber.trim() !== "" &&
          paymentDetails.cardExpiry.trim() !== "" &&
          paymentDetails.cardCvv.trim() !== "" &&
          paymentDetails.cardName.trim() !== ""
        break
      case "wallet":
        paymentValid = paymentDetails.walletProvider !== ""
        break
    }

    return allPassengersValid && paymentValid && acceptedTerms
  }

  const handleBooking = async () => {
    if (!isFormValid() || !bus) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      try {
        // Create booking data
        const bookingPayload: BookingData = {
          busId: bus.id,
          selectedSeats: bookingData.selectedSeats,
          passengerDetails: passengerDetails.map(p => ({
            name: p.name,
            age: parseInt(p.age),
            gender: p.gender,
            phone: p.phone || ""
          })),
          totalAmount: bookingData.totalAmount,
          journeyDate: bookingData.date,
          route: {
            from: bookingData.from,
            to: bookingData.to
          }
        }

        // Save booking to localStorage
        const savedBooking = saveBooking(bookingPayload)
        
        // Update saved booking with bus details
        const updatedBooking = {
          ...savedBooking,
          operator: bus.operator,
          busName: bus.name,
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime
        }

        // Update localStorage with complete booking info
        const existingBookings = JSON.parse(localStorage.getItem('busyatra_bookings') || '[]')
        const bookingIndex = existingBookings.findIndex((b: any) => b.id === savedBooking.id)
        if (bookingIndex !== -1) {
          existingBookings[bookingIndex] = updatedBooking
          localStorage.setItem('busyatra_bookings', JSON.stringify(existingBookings))
        }

        setBookingReference(savedBooking.bookingReference)
        setIsProcessing(false)
        setShowConfirmation(true)

        toast.success("Booking confirmed successfully!", {
          description: `Your booking reference is ${savedBooking.bookingReference}`
        })

        // Redirect to booking details after a short delay
        setTimeout(() => {
          router.push(`/booking-details/${savedBooking.id}`)
        }, 2000)

      } catch (error) {
        console.error('Booking error:', error)
        toast.error("Booking failed. Please try again.")
        setIsProcessing(false)
      }
    }, 2000)
  }

  const goBack = () => {
    const queryParams = new URLSearchParams({
      busId: bookingData.busId,
      from: bookingData.from,
      to: bookingData.to,
      date: bookingData.date,
      passengers: bookingData.selectedSeats.length.toString(),
    })
    router.push(`/seat-selection?${queryParams.toString()}`)
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

  if (!bus) {
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
          <h2 className="text-2xl font-bold mb-4">Booking details not found</h2>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
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
            Back to Seat Selection
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Booking Progress */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">Search</span>
            </div>
            <div className="w-8 h-px bg-green-500"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-600">Select Seats</span>
            </div>
            <div className="w-8 h-px bg-primary"></div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-primary font-medium">Book & Pay</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Passenger Details */}
            <Card>
              <CardHeader>
                <CardTitle>Passenger Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {passengerDetails.map((passenger, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">
                      Passenger {index + 1} - Seat {bookingData.selectedSeats[index]}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name-${index}`}>Full Name *</Label>
                        <Input
                          id={`name-${index}`}
                          placeholder="Enter full name"
                          value={passenger.name}
                          onChange={(e) => updatePassengerDetail(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`age-${index}`}>Age *</Label>
                        <Input
                          id={`age-${index}`}
                          type="number"
                          placeholder="Age"
                          min="1"
                          max="120"
                          value={passenger.age}
                          onChange={(e) => updatePassengerDetail(index, "age", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`gender-${index}`}>Gender *</Label>
                        <Select
                          value={passenger.gender}
                          onValueChange={(value) => updatePassengerDetail(index, "gender", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="space-y-2">
                        <Label htmlFor={`phone-${index}`}>Phone Number (Primary Contact)</Label>
                        <Input
                          id={`phone-${index}`}
                          type="tel"
                          placeholder="Enter phone number"
                          value={passenger.phone}
                          onChange={(e) => updatePassengerDetail(index, "phone", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="upi" className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4" />
                      <span>UPI</span>
                    </TabsTrigger>
                    <TabsTrigger value="card" className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Card</span>
                    </TabsTrigger>
                    <TabsTrigger value="wallet" className="flex items-center space-x-2">
                      <Wallet className="h-4 w-4" />
                      <span>Wallet</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upi" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@paytm"
                        value={paymentDetails.upiId}
                        onChange={(e) => setPaymentDetails((prev) => ({ ...prev, upiId: e.target.value }))}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="card" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardNumber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-expiry">Expiry Date</Label>
                        <Input
                          id="card-expiry"
                          placeholder="MM/YY"
                          value={paymentDetails.cardExpiry}
                          onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardExpiry: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-cvv">CVV</Label>
                        <Input
                          id="card-cvv"
                          placeholder="123"
                          value={paymentDetails.cardCvv}
                          onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardCvv: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="Name on card"
                          value={paymentDetails.cardName}
                          onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardName: e.target.value }))}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="wallet" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wallet-provider">Select Wallet</Label>
                      <Select
                        value={paymentDetails.walletProvider}
                        onValueChange={(value) => setPaymentDetails((prev) => ({ ...prev, walletProvider: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose wallet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="phonepe">PhonePe</SelectItem>
                          <SelectItem value="googlepay">Google Pay</SelectItem>
                          <SelectItem value="amazonpay">Amazon Pay</SelectItem>
                          <SelectItem value="mobikwik">MobiKwik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                      I agree to the <span className="text-primary underline">Terms and Conditions</span> and{" "}
                      <span className="text-primary underline">Privacy Policy</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      By proceeding, you agree to our cancellation and refund policies
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Journey Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{bookingData.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{bookingData.to}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(bookingData.date).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>

                <Separator />

                {/* Bus Details */}
                <div>
                  <h4 className="font-medium mb-2">{bus.operator}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{bus.name}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span>Departure: {formatTime(bus.departureTime)}</span>
                    <span>Arrival: {formatTime(bus.arrivalTime)}</span>
                  </div>
                </div>

                <Separator />

                {/* Selected Seats */}
                <div>
                  <h4 className="font-medium mb-2">Selected Seats</h4>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.selectedSeats.map((seat) => (
                      <Badge key={seat} variant="secondary">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Fare Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>
                      Base Fare ({bookingData.selectedSeats.length} seat
                      {bookingData.selectedSeats.length !== 1 ? "s" : ""})
                    </span>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4" />
                      <span>{bookingData.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Taxes & Service Fee</span>
                    <div className="flex items-center">
                      <IndianRupee className="h-3 w-3" />
                      <span>0</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <div className="flex items-center text-primary">
                    <IndianRupee className="h-5 w-5" />
                    <span>{bookingData.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button onClick={handleBooking} className="w-full" disabled={!isFormValid() || isProcessing}>
                  {isProcessing ? "Processing Payment..." : "Confirm Booking & Pay"}
                </Button>

                {!isFormValid() && (
                  <p className="text-sm text-muted-foreground text-center">
                    Please fill all required details and accept terms
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        bookingReference={bookingReference}
        bus={bus}
        bookingData={bookingData}
        passengerDetails={passengerDetails}
      />
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  )
}
