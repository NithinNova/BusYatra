"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Bus, Clock, Shield, Zap, Award, History, MapPin } from "lucide-react"
import { toast } from "sonner"
import { AuthModal } from "@/components/auth-modal"
import { saveSearchHistory, getSearchHistory, getBookingStats } from "@/lib/localStorage"

const indianCities = [
  "Delhi",
  "Mumbai",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Patna",
  "Vadodara",
]

export default function HomePage() {
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1",
  })
  const [recentSearches, setRecentSearches] = useState<any[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Load search history and user stats on component mount
    const history = getSearchHistory()
    const stats = getBookingStats()
    setRecentSearches(history.slice(0, 3))
    setUserStats(stats)
    
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    setIsLoggedIn(loggedIn)
    
    // Set today's date as default
    if (!searchData.date) {
      setSearchData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }))
    }
  }, [])

  const handleSearch = () => {
    if (!searchData.from || !searchData.to || !searchData.date) {
      toast.error("Please fill all required fields")
      return
    }

    // Save search to history
    saveSearchHistory({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      passengers: searchData.passengers,
    })

    const queryParams = new URLSearchParams({
      from: searchData.from,
      to: searchData.to,
      date: searchData.date,
      passengers: searchData.passengers,
    })

    toast.success("Searching for available buses...")
    router.push(`/search?${queryParams.toString()}`)
  }

  const handleQuickSearch = (search: any) => {
    setSearchData({
      from: search.from,
      to: search.to,
      date: new Date().toISOString().split('T')[0], // Today's date for quick searches
      passengers: search.passengers || "1",
    })
  }

  const handleAuthSuccess = () => {
    setIsLoggedIn(true)
    setIsAuthModalOpen(false)
    localStorage.setItem('isLoggedIn', 'true')
    toast.success("Successfully logged in!")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
    toast.success("Successfully logged out!")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white/95 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-display text-teal-700">BusYatra</h1>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {userStats && userStats.totalBookings > 0 && (
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/my-bookings')}
                    className="text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                  >
                    My Bookings ({userStats.totalBookings})
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-teal-200 text-teal-700 hover:bg-teal-50"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setAuthMode("login")
                    setIsAuthModalOpen(true)
                  }}
                  className="text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                >
                  Login
                </Button>
                <Button
                  onClick={() => {
                    setAuthMode("signup")
                    setIsAuthModalOpen(true)
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white border-0"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 via-cyan-400/20 to-blue-500/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 drop-shadow-lg">
            Book Electric AC Bus Tickets Online
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
            Choose a bus, book a ticket and travel with the most intercity electric bus service with a network across
            India
          </p>

          <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="from" className="text-sm font-medium text-gray-700">
                    From
                  </Label>
                  <Select
                    value={searchData.from}
                    onValueChange={(value) => setSearchData({ ...searchData, from: value })}
                  >
                    <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                      <SelectValue placeholder="Select departure city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to" className="text-sm font-medium text-gray-700">
                    To
                  </Label>
                  <Select value={searchData.to} onValueChange={(value) => setSearchData({ ...searchData, to: value })}>
                    <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities
                        .filter((city) => city !== searchData.from)
                        .map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Journey Date
                  </Label>
                  <Input
                    type="date"
                    className="h-12 border-gray-200 rounded-xl"
                    value={searchData.date}
                    onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers" className="text-sm font-medium text-gray-700">
                    Passengers
                  </Label>
                  <Select
                    value={searchData.passengers}
                    onValueChange={(value) => setSearchData({ ...searchData, passengers: value })}
                  >
                    <SelectTrigger className="h-12 border-gray-200 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Passenger{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSearch}
                  className="h-12 px-8 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-lg shadow-lg"
                  disabled={!searchData.from || !searchData.to || !searchData.date}
                >
                  Search Buses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display text-gray-900 mb-4">Why BusYatra is the Smarter Way to Travel</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of intercity travel with our electric bus network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">On Time Departure</h3>
              <p className="text-gray-600">99% on-time performance with real-time tracking and updates</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Zero Tail - Pipe Emissions</h3>
              <p className="text-gray-600">100% electric buses with zero emissions for a greener future</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Noiseless Travel</h3>
              <p className="text-gray-600">Quiet, smooth rides for the ultimate comfort experience</p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Safe & Comfortable</h3>
              <p className="text-gray-600">Premium amenities and safety features for peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display text-gray-900 mb-6">Driving Towards a Greener Future</h2>
              <div className="text-6xl font-display text-teal-600 mb-4">200 Mn+</div>
              <p className="text-xl text-gray-600 mb-8">Kms of CO2 free travel completed</p>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-3">Know More</Button>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Prioritizing Women's Safety: Our Commitment</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Reserved Women Seats</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Live Bus Tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Dedicated Women Helpline</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-700">Driver Alcohol Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search History Section */}
      {recentSearches.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Search</h3>
              <p className="text-gray-600">Repeat your recent searches</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {recentSearches.map((search, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickSearch(search)}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-teal-600" />
                      <span className="font-medium">{search.from}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">{search.to}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                      <History className="h-3 w-3" />
                      <span>{new Date(search.timestamp).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
