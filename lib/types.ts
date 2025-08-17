export interface Bus {
  id: string
  operator: string
  name: string
  type: string
  route: {
    from: string
    to: string
  }
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  totalSeats: number
  rating: number
  amenities: string[]
  seatLayout: {
    rows: number
    seatsPerRow: number
    layout: string[] // 'available', 'booked', 'selected', 'unavailable'
  }
}

export interface BookingData {
  busId: string
  selectedSeats: string[]
  passengerDetails: {
    name: string
    age: number
    gender: string
    phone?: string
  }[]
  totalAmount: number
  journeyDate: string
  route: {
    from: string
    to: string
  }
}

export interface UserBooking {
  id: string
  bookingReference: string
  operator: string
  busName: string
  route: {
    from: string
    to: string
  }
  journeyDate: string
  departureTime: string
  arrivalTime: string
  seats: string[]
  totalAmount: number
  status: "confirmed" | "completed" | "cancelled"
  rating: number
  bookedAt: string
}

export interface UserStats {
  totalTrips: number
  totalSpent: number
  citiesVisited: number
  savedAmount: number
  favoriteRoute: string
  averageRating: number
  membershipLevel: string
}
