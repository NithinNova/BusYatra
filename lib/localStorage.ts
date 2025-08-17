import type { UserBooking, Bus, BookingData } from './types'

// Keys for localStorage
const STORAGE_KEYS = {
  BOOKINGS: 'busyatra_bookings',
  SEARCH_HISTORY: 'busyatra_search_history',
  USER_PREFERENCES: 'busyatra_preferences',
  PASSENGER_DATA: 'busyatra_passenger_data'
}

// Utility to safely access localStorage
const isClient = () => typeof window !== 'undefined'

// Generate unique booking reference
export const generateBookingReference = (): string => {
  const prefix = 'BY'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

// Generate unique booking ID
export const generateBookingId = (): string => {
  return `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Bookings management
export const saveBooking = (bookingData: BookingData): UserBooking => {
  if (!isClient()) return {} as UserBooking

  const bookingId = generateBookingId()
  const bookingReference = generateBookingReference()
  
  const userBooking: UserBooking = {
    id: bookingId,
    bookingReference,
    operator: '', // Will be filled from bus data
    busName: '', // Will be filled from bus data
    route: bookingData.route,
    journeyDate: bookingData.journeyDate,
    departureTime: '', // Will be filled from bus data
    arrivalTime: '', // Will be filled from bus data
    seats: bookingData.selectedSeats,
    totalAmount: bookingData.totalAmount,
    status: 'confirmed',
    rating: 0,
    bookedAt: new Date().toISOString()
  }

  const existingBookings = getBookings()
  const updatedBookings = [...existingBookings, userBooking]
  
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings))
  return userBooking
}

export const getBookings = (): UserBooking[] => {
  if (!isClient()) return []
  
  try {
    const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    return bookings ? JSON.parse(bookings) : []
  } catch (error) {
    console.error('Error reading bookings from localStorage:', error)
    return []
  }
}

export const updateBookingStatus = (bookingId: string, status: UserBooking['status']): boolean => {
  if (!isClient()) return false
  
  try {
    const bookings = getBookings()
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    )
    
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updatedBookings))
    return true
  } catch (error) {
    console.error('Error updating booking status:', error)
    return false
  }
}

export const cancelBooking = (bookingId: string): boolean => {
  return updateBookingStatus(bookingId, 'cancelled')
}

export const getBookingById = (bookingId: string): UserBooking | null => {
  const bookings = getBookings()
  return bookings.find(booking => booking.id === bookingId) || null
}

// Search history management
interface SearchHistory {
  from: string
  to: string
  date: string
  passengers: string
  timestamp: number
}

export const saveSearchHistory = (searchData: Omit<SearchHistory, 'timestamp'>): void => {
  if (!isClient()) return
  
  try {
    const history = getSearchHistory()
    const newSearch: SearchHistory = {
      ...searchData,
      timestamp: Date.now()
    }
    
    // Remove duplicates and limit to 10 recent searches
    const filteredHistory = history
      .filter(item => !(item.from === searchData.from && item.to === searchData.to))
      .slice(0, 9)
    
    const updatedHistory = [newSearch, ...filteredHistory]
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('Error saving search history:', error)
  }
}

export const getSearchHistory = (): SearchHistory[] => {
  if (!isClient()) return []
  
  try {
    const history = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error reading search history:', error)
    return []
  }
}

// Passenger data management
interface PassengerInfo {
  name: string
  age: number
  gender: string
  phone?: string
}

export const savePassengerData = (passengers: PassengerInfo[]): void => {
  if (!isClient()) return
  
  try {
    localStorage.setItem(STORAGE_KEYS.PASSENGER_DATA, JSON.stringify(passengers))
  } catch (error) {
    console.error('Error saving passenger data:', error)
  }
}

export const getPassengerData = (): PassengerInfo[] => {
  if (!isClient()) return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PASSENGER_DATA)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading passenger data:', error)
    return []
  }
}

// User preferences
interface UserPreferences {
  preferredCities: string[]
  preferredBusTypes: string[]
  theme: 'light' | 'dark'
  notifications: boolean
}

export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
  if (!isClient()) return
  
  try {
    const current = getUserPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving user preferences:', error)
  }
}

export const getUserPreferences = (): UserPreferences => {
  if (!isClient()) return {
    preferredCities: [],
    preferredBusTypes: [],
    theme: 'light',
    notifications: true
  }
  
  try {
    const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    return preferences ? JSON.parse(preferences) : {
      preferredCities: [],
      preferredBusTypes: [],
      theme: 'light',
      notifications: true
    }
  } catch (error) {
    console.error('Error reading user preferences:', error)
    return {
      preferredCities: [],
      preferredBusTypes: [],
      theme: 'light',
      notifications: true
    }
  }
}

// Clear all data (useful for testing)
export const clearAllData = (): void => {
  if (!isClient()) return
  
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

// Get booking statistics
export const getBookingStats = () => {
  const bookings = getBookings()
  
  return {
    totalBookings: bookings.length,
    totalSpent: bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
    upcomingTrips: bookings.filter(b => 
      b.status === 'confirmed' && 
      new Date(b.journeyDate).getTime() > Date.now()
    ).length,
    completedTrips: bookings.filter(b => b.status === 'completed').length,
    cancelledTrips: bookings.filter(b => b.status === 'cancelled').length,
    favoriteRoute: getMostFrequentRoute(bookings),
    averageAmount: bookings.length > 0 
      ? Math.round(bookings.reduce((sum, b) => sum + b.totalAmount, 0) / bookings.length)
      : 0
  }
}

const getMostFrequentRoute = (bookings: UserBooking[]): string => {
  const routeCounts: Record<string, number> = {}
  
  bookings.forEach(booking => {
    const route = `${booking.route.from} → ${booking.route.to}`
    routeCounts[route] = (routeCounts[route] || 0) + 1
  })
  
  const mostFrequent = Object.entries(routeCounts)
    .sort(([,a], [,b]) => b - a)[0]
  
  return mostFrequent ? mostFrequent[0] : 'No trips yet'
}
