"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bus,
  MapPin,
  IndianRupee,
  User,
  Calendar,
  TrendingUp,
  Star,
  Plus,
  Eye,
  Settings,
  CreditCard,
  Bell,
  Shield,
  LogOut,
} from "lucide-react"
import { mockBookings, mockUserStats } from "@/lib/mock-user-data"
import type { UserBooking, UserStats } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [recentBookings, setRecentBookings] = useState<UserBooking[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock user data - in real app this would come from authentication
  const user = {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    memberSince: "2023",
    avatar: "/indian-man-avatar.png",
  }

  useEffect(() => {
    // Simulate API call to fetch user data
    setIsLoading(true)
    setTimeout(() => {
      setRecentBookings(mockBookings.slice(0, 3)) // Show only recent 3 bookings
      setUserStats(mockUserStats)
      setIsLoading(false)
    }, 1000)
  }, [])

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

  const handleNewBooking = () => {
    router.push("/")
  }

  const handleViewAllBookings = () => {
    router.push("/my-bookings")
  }

  const handleViewBooking = (bookingId: string) => {
    router.push(`/booking-details/${bookingId}`)
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h2>
              <p className="text-muted-foreground">Member since {user.memberSince}</p>
            </div>
          </div>
          <Button onClick={handleNewBooking} className="px-6">
            <Plus className="h-4 w-4 mr-2" />
            Book New Trip
          </Button>
        </div>

        {/* Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Bus className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.totalTrips}</p>
                    <p className="text-sm text-muted-foreground">Total Trips</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">₹{userStats.totalSpent.toLocaleString("en-IN")}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.citiesVisited}</p>
                    <p className="text-sm text-muted-foreground">Cities Visited</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-accent-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{userStats.savedAmount}</p>
                    <p className="text-sm text-muted-foreground">Savings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your travel and account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={handleNewBooking}
                    variant="outline"
                    className="h-20 flex-col space-y-2 bg-transparent"
                  >
                    <Plus className="h-6 w-6" />
                    <span>Book New Trip</span>
                  </Button>
                  <Button
                    onClick={handleViewAllBookings}
                    variant="outline"
                    className="h-20 flex-col space-y-2 bg-transparent"
                  >
                    <Eye className="h-6 w-6" />
                    <span>View All Bookings</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                    <CreditCard className="h-6 w-6" />
                    <span>Payment Methods</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest bookings and updates</CardDescription>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">Start your journey by booking your first trip</p>
                    <Button onClick={handleNewBooking}>Book Your First Trip</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Bus className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {booking.route.from} → {booking.route.to}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(booking.journeyDate).toLocaleDateString("en-IN")} • {booking.operator}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <div className="text-right">
                            <p className="font-medium">₹{booking.totalAmount.toLocaleString("en-IN")}</p>
                            <p className="text-sm text-muted-foreground">{booking.seats.join(", ")}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleViewBooking(booking.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline" onClick={handleViewAllBookings}>
                        View All Bookings
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest travel bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {recentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                    <p className="text-muted-foreground">Your booking history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <Card key={booking.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg">{booking.operator}</h3>
                              <p className="text-muted-foreground">{booking.busName}</p>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">
                                ₹{booking.totalAmount.toLocaleString("en-IN")}
                              </p>
                              <p className="text-sm text-muted-foreground">Booking: {booking.bookingReference}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">{formatTime(booking.departureTime)}</p>
                                <p className="text-sm text-muted-foreground">{booking.route.from}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                  {new Date(booking.journeyDate).toLocaleDateString("en-IN")}
                                </p>
                                <div className="w-16 h-px bg-border my-1"></div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">{formatTime(booking.arrivalTime)}</p>
                                <p className="text-sm text-muted-foreground">{booking.route.to}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-sm text-muted-foreground">Seats: {booking.seats.join(", ")}</div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{booking.rating}</span>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking.id)}>
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy & Security
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
