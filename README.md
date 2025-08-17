# 🚌 BusYatra - Modern Bus Booking System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radix-ui&logoColor=white)

BusYatra is a modern, user-friendly bus booking platform designed to revolutionize intercity travel with electric buses. Experience a seamless booking journey with our intuitive interface and robust features.

## ✨ Features

- 🔍 **Smart Search Engine** - Find buses between any major Indian cities
- 🪑 **Interactive Seat Selection** - Choose your seats with a visual seat layout
- 💳 **Seamless Booking** - Book tickets without mandatory login
- 🔄 **Booking Management** - View, manage and cancel your bookings
- 📱 **Responsive Design** - Perfect experience on any device
- 🌙 **Dark Mode Support** - Easy on the eyes in low-light conditions
- 🔒 **User Authentication** - Optional accounts for faster checkout

## 📸 Screenshots

*[Add screenshots of your application here]*

## 🏗️ Project Structure

```
bus-booking-system/
├── app/                      # Next.js app directory
│   ├── booking/              # Booking confirmation flow
│   ├── dashboard/            # User dashboard
│   ├── my-bookings/          # Booking management
│   ├── search/               # Search results
│   ├── seat-selection/       # Seat selection interface
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage
├── components/               # Reusable UI components
│   ├── ui/                   # Base UI components from shadcn/ui
│   ├── auth-modal.tsx        # Authentication modal
│   ├── booking-confirmation-modal.tsx
│   ├── bus-list-skeleton.tsx # Loading skeletons
│   ├── cancellation-modal.tsx
│   ├── seat-layout.tsx       # Interactive seat map
│   └── theme-provider.tsx    # Theme context provider
├── hooks/                    # Custom React hooks
│   ├── use-mobile.ts         # Mobile detection
│   └── use-toast.ts          # Toast notifications
├── lib/                      # Utility functions and types
│   ├── localStorage.ts       # Client-side storage helpers
│   ├── mock-data.ts          # Demo data
│   ├── mock-user-data.ts     # Demo user data
│   ├── types.ts              # TypeScript interfaces
│   └── utils.ts              # General utilities
└── public/                   # Static assets
```

## 🚀 Key Features Explained

### Search & Booking Flow

1. **Homepage Search** - Select departure, destination, date and passenger count
2. **Bus Selection** - View available buses with filtering options
3. **Seat Selection** - Interactive seat map with real-time availability
4. **Passenger Details** - Enter traveler information
5. **Booking Confirmation** - Review and confirm with booking reference

### User Management

- **Optional Authentication** - Create an account to speed up future bookings
- **Booking History** - Access all your past and upcoming journeys
- **Quick Cancellation** - Cancel bookings with refund estimates

## 💻 Technology Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Components**: 
  - Radix UI (Headless components)
  - shadcn/ui (Component collection)
  - Tailwind CSS (Styling)
- **State Management**: React Hooks and Context API
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)

## 🌱 Environmental Benefits

BusYatra promotes eco-friendly travel through:

- 🔋 **100% Electric Buses** - Zero tail-pipe emissions
- 🌿 **Carbon Footprint Reduction** - Over 200 million km of CO₂-free travel
- 🌳 **Sustainable Tourism** - Supporting environmentally responsible travel

## 👩‍💼 Safety Features

- 🛡️ **Reserved Women Seats** - Dedicated seating for women travelers
- 📍 **Live Bus Tracking** - Real-time location updates
- 📞 **Dedicated Helpline** - 24/7 customer support
- 🔍 **Driver Monitoring** - Regular safety checks including alcohol monitoring

## 🛠️ Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bus-booking-system.git
   cd bus-booking-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## 🌟 Application Advantages

### User Experience
- **No Forced Registration** - Book tickets without creating an account
- **Quick Search** - Repeat searches from history
- **Real-time Updates** - Live seat availability and booking status
- **Mobile Optimized** - Responsive design for all devices

### Performance
- **Fast Loading** - Optimized with Next.js App Router
- **Skeleton Loading** - Smooth loading states
- **Efficient Bundling** - Tree-shaking and code splitting

### Scalability
- **Component-Based Architecture** - Reusable UI components
- **TypeScript Safety** - Type-safe development
- **Modern Stack** - Built with latest technologies

## 🔧 Configuration

The project uses several configuration files:

- `components.json` - shadcn/ui component configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions or feedback, please reach out at [nithinkumarka786@gmail.com](mailto:nithinkumarka786@gmail.com).

---

Made with ❤️ by [Nithin Nova]
