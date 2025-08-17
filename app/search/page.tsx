"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bus, Clock, IndianRupee, MapPin, Users, Filter, Star, Wifi, Snowflake, Tv } from "lucide-react"
import { BusListSkeleton } from "@/components/bus-list-skeleton"
import { mockBuses } from "@/lib/mock-data"
import { saveSearchHistory } from "@/lib/localStorage"
import { toast } from "sonner"
import type { Bus as BusType } from "@/lib/types"

function normalizeCityName(cityName: string): string {
  // Implement normalization logic here, e.g., removing spaces, special characters, etc.
  return cityName.replace(/\s+/g, "").toLowerCase()
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [buses, setBuses] = useState<BusType[]>([])
  const [filteredBuses, setFilteredBuses] = useState<BusType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    busType: "all",
    departureTime: "all",
    priceRange: "all",
    rating: "all",
  })

  const searchData = {
    from: searchParams.get("from") || "",
    to: searchParams.get("to") || "",
    date: searchParams.get("date") || "",
    passengers: searchParams.get("passengers") || "1",
  }

  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      const normalizedFrom = normalizeCityName(searchData.from)
      const normalizedTo = normalizeCityName(searchData.to)

      const results = mockBuses.filter((bus) => {
        const busFrom = bus.route.from.toLowerCase()
        const busTo = bus.route.to.toLowerCase()
        const searchFromLower = normalizedFrom.toLowerCase()
        const searchToLower = normalizedTo.toLowerCase()

        return (
          (busFrom.includes(searchFromLower) || searchFromLower.includes(busFrom)) &&
          (busTo.includes(searchToLower) || searchToLower.includes(busTo))
        )
      })

      // Save search history if we have valid search data and results
      if (searchData.from && searchData.to && searchData.date) {
        saveSearchHistory({
          from: searchData.from,
          to: searchData.to,
          date: searchData.date,
          passengers: parseInt(searchData.passengers) || 1,
        })
      }

      setBuses(results)
      setFilteredBuses(results)
      setIsLoading(false)
    }, 1500)
  }, [searchData.from, searchData.to, searchData.date, searchData.passengers])

  useEffect(() => {
    let filtered = [...buses]

    if (filters.busType !== "all") {
      filtered = filtered.filter((bus) => bus.type.toLowerCase().includes(filters.busType))
    }

    if (filters.departureTime !== "all") {
      const [start, end] = filters.departureTime.split("-").map(Number)
      filtered = filtered.filter((bus) => {
        const hour = Number.parseInt(bus.departureTime.split(":")[0])
        return hour >= start && hour < end
      })
    }

    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number)
      filtered = filtered.filter((bus) => bus.price >= min && bus.price <= max)
    }

    if (filters.rating !== "all") {
      const minRating = Number.parseFloat(filters.rating)
      filtered = filtered.filter((bus) => bus.rating >= minRating)
    }

    setFilteredBuses(filtered)
  }, [filters, buses])

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

  const handleBookNow = (busId: string) => {
    // Check if user is logged in (this would be a real auth check in production)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    
    if (!isLoggedIn) {
      toast.error('Please login to book tickets', {
        description: 'You need to login or signup to proceed with booking.',
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/'
        }
      })
      return
    }
    
    const queryParams = new URLSearchParams({
      busId,
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      passengers: searchData.passengers,
    })
    router.push(`/seat-selection?${queryParams.toString()}`)
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
          <Button variant="outline" onClick={() => router.push("/")}>
            New Search
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search Summary */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{searchData.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-semibold">{searchData.to}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(searchData.date).toLocaleDateString("en-IN")}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {searchData.passengers} Passenger{Number.parseInt(searchData.passengers) > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">{filteredBuses.length} buses found</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Bus Type</Label>
                  <Select value={filters.busType} onValueChange={(value) => setFilters({ ...filters, busType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="ac">AC</SelectItem>
                      <SelectItem value="non-ac">Non-AC</SelectItem>
                      <SelectItem value="sleeper">Sleeper</SelectItem>
                      <SelectItem value="volvo">Volvo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Departure Time</Label>
                  <Select
                    value={filters.departureTime}
                    onValueChange={(value) => setFilters({ ...filters, departureTime: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="0-6">12 AM - 6 AM</SelectItem>
                      <SelectItem value="6-12">6 AM - 12 PM</SelectItem>
                      <SelectItem value="12-18">12 PM - 6 PM</SelectItem>
                      <SelectItem value="18-24">6 PM - 12 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="0-500">₹0 - ₹500</SelectItem>
                      <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                      <SelectItem value="1000-1500">₹1,000 - ₹1,500</SelectItem>
                      <SelectItem value="1500-9999">₹1,500+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Rating</Label>
                  <Select value={filters.rating} onValueChange={(value) => setFilters({ ...filters, rating: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Rating</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.0">4.0+ Stars</SelectItem>
                      <SelectItem value="3.5">3.5+ Stars</SelectItem>
                      <SelectItem value="3.0">3.0+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bus Listings */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <BusListSkeleton />
            ) : filteredBuses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No buses found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredBuses.map((bus) => (
                  <Card key={bus.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{bus.operator}</h3>
                          <p className="text-sm text-muted-foreground">{bus.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{bus.type}</Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{bus.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-2xl font-bold text-primary">
                            <IndianRupee className="h-5 w-5" />
                            <span>{bus.price.toLocaleString("en-IN")}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">per person</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold">{formatTime(bus.departureTime)}</p>
                            <p className="text-sm text-muted-foreground">{bus.route.from}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                              {calculateDuration(bus.departureTime, bus.arrivalTime)}
                            </p>
                            <div className="w-16 h-px bg-border my-1"></div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">{formatTime(bus.arrivalTime)}</p>
                            <p className="text-sm text-muted-foreground">{bus.route.to}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{bus.availableSeats} seats left</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {bus.amenities.includes("WiFi") && <Wifi className="h-4 w-4 text-blue-500" />}
                            {bus.amenities.includes("AC") && <Snowflake className="h-4 w-4 text-blue-500" />}
                            {bus.amenities.includes("Entertainment") && <Tv className="h-4 w-4 text-blue-500" />}
                          </div>
                        </div>
                        <Button onClick={() => handleBookNow(bus.id)} className="px-8">
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<BusListSkeleton />}>
      <SearchPageContent />
    </Suspense>
  )
}
