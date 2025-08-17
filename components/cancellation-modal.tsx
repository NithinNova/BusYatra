"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, IndianRupee, MapPin, Clock } from "lucide-react"
import type { UserBooking } from "@/lib/types"

interface CancellationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  booking: UserBooking | null
}

const cancellationReasons = [
  "Change in travel plans",
  "Medical emergency",
  "Work commitment",
  "Family emergency",
  "Weather conditions",
  "Found better alternative",
  "Personal reasons",
  "Other",
]

export function CancellationModal({ isOpen, onClose, onConfirm, booking }: CancellationModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleConfirm = () => {
    const reason = selectedReason === "Other" ? customReason : selectedReason
    if (!reason.trim()) return

    setIsProcessing(true)
    setTimeout(() => {
      onConfirm(reason)
      setIsProcessing(false)
      // Reset form
      setSelectedReason("")
      setCustomReason("")
    }, 2000)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const calculateRefund = (amount: number) => {
    // Simple refund calculation - in real app this would be more complex
    const journeyDate = new Date(booking?.journeyDate || "")
    const now = new Date()
    const timeDiff = journeyDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)

    if (hoursDiff > 24) {
      return Math.round(amount * 0.9) // 90% refund if cancelled 24+ hours before
    } else if (hoursDiff > 12) {
      return Math.round(amount * 0.75) // 75% refund if cancelled 12-24 hours before
    } else if (hoursDiff > 2) {
      return Math.round(amount * 0.5) // 50% refund if cancelled 2-12 hours before
    } else {
      return 0 // No refund if cancelled less than 2 hours before
    }
  }

  if (!booking) return null

  const refundAmount = calculateRefund(booking.totalAmount)
  const cancellationFee = booking.totalAmount - refundAmount

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Cancel Booking</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Details */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{booking.operator}</h3>
                  <p className="text-muted-foreground">{booking.busName}</p>
                  <Badge variant="outline" className="mt-1">
                    {booking.bookingReference}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-xl font-bold">
                    <IndianRupee className="h-4 w-4" />
                    <span>{booking.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.route.from} → {booking.route.to}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(booking.journeyDate).toLocaleDateString("en-IN")} at {formatTime(booking.departureTime)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">Seats: {booking.seats.join(", ")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Refund Information */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-orange-800 mb-3">Refund Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Original Amount:</span>
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="h-3 w-3" />
                    <span>{booking.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Cancellation Fee:</span>
                  <div className="flex items-center space-x-1 text-red-600">
                    <IndianRupee className="h-3 w-3" />
                    <span>{cancellationFee.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-green-700 pt-2 border-t border-orange-200">
                  <span>Refund Amount:</span>
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="h-4 w-4" />
                    <span>{refundAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-orange-700 mt-3">
                Refund will be processed within 5-7 business days to your original payment method.
              </p>
            </CardContent>
          </Card>

          {/* Cancellation Reason */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for Cancellation *</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {cancellationReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedReason === "Other" && (
              <div>
                <Label htmlFor="custom-reason">Please specify</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Please provide details..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Terms */}
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-red-800 mb-2">Cancellation Terms</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Cancellation charges apply as per the refund policy</li>
                <li>• Refund processing may take 5-7 business days</li>
                <li>• No refund for cancellations made less than 2 hours before departure</li>
                <li>• Service charges and convenience fees are non-refundable</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Keep Booking
            </Button>
            <Button
              onClick={handleConfirm}
              variant="destructive"
              className="flex-1"
              disabled={!selectedReason || (selectedReason === "Other" && !customReason.trim()) || isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Cancellation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
