import {useState} from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClientDashboard from './components/ClientDashboard';
import DriverDashboard from './components/DriverDashboard';
import BookingForm from './components/BookingForm';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import {Booking,/* BookingFormData,*/ BookingStatus, Driver, User, UserType} from './types';

const MOCK_DRIVERS: Driver[] = [
  {
    id: '1',
    email: "JohnSmith@gmail.com",
    name: 'John Smith',
    experience: 12,
    rating: 4.8,
    licenseType: 'Commercial Driver License (CDL) - Class A',
    availability: true,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
    specializations: ['Long Distance', 'Tourist Groups', 'Mountain Routes'],
    phone: "",
    serviceArea: ""
  },
  {
    id: '2',
    email: "SarahJohnson@gmail.com",
    name: 'Sarah Johnson',
    experience: 8,
    rating: 4.9,
    licenseType: 'Commercial Driver License (CDL) - Class B',
    availability: true,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
    specializations: ['City Tours', 'School Transport', 'Event Transportation'],
    phone: "",
    serviceArea: ""
  },
  {
    id: '3',
    email: "MichaelChen@gmail.com",
    name: 'Michael Chen',
    experience: 15,
    rating: 4.7,
    licenseType: 'Commercial Driver License (CDL) - Class A',
    availability: false,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
    specializations: ['Interstate Travel', 'Luxury Tours', 'Night Routes'],
    phone: "",
    serviceArea: ""
  },
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>(MOCK_DRIVERS);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const handleBook = (driverId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedDriver(driverId);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (data: {
    startDate: string;
    endDate: string;
    route: string;
    requirements: string;
  }) => {
    if (selectedDriver && user) {
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        driverId: selectedDriver,
        clientId: user.id,
        startDate: new Date(data.startDate), // Convert string to Date
        endDate: new Date(data.endDate),     // Convert string to Date
        route: data.route,
        requirements: data.requirements,
        status: BookingStatus.Pending,
      };
      setBookings([...bookings, newBooking]);
      setShowBookingForm(false);
      setSelectedDriver(null);
    }
  };

  const handleLogin = (email: string, _password: string, type: UserType) => {
    const userId = Math.random().toString(36).substr(2, 9);
    const newUser = {
      id: userId,
      email,
      name: email.split('@')[0],
      type,
    };
    setUser(newUser);
    setAllUsers([...allUsers, newUser]);
    setShowAuthModal(false);
    
    // If logging in as a driver, create a driver profile
    if (type === 'driver') {
      const newDriver: Driver = {
        id: userId,
        email: email,
        name: email.split('@')[0],
        experience: 5,
        rating: 4.5,
        licenseType: 'Commercial Driver License (CDL) - Class A',
        availability: true,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
        specializations: ['City Tours', 'Airport Transfers'],
        phone: "",
        serviceArea: ""
      };
      setDrivers([...drivers, newDriver]);
    }
  };

  const handleSignup = (name: string, email: string, _password: string, type: UserType) => {
    const userId = Math.random().toString(36).substr(2, 9);
    const newUser = {
      id: userId,
      email,
      name,
      type,
    };
    setUser(newUser);
    setAllUsers([...allUsers, newUser]);
    setShowAuthModal(false);
    
    // If signing up as a driver, create a driver profile
    if (type === 'driver') {
      const newDriver: Driver = {
        id: userId,
        email: email,
        name,
        experience: 0,
        rating: 5.0,
        licenseType: 'Commercial Driver License (CDL) - Class A',
        availability: true,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
        specializations: ['City Tours'],
        phone: "",
        serviceArea: ""
      };
      setDrivers([...drivers, newDriver]);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setBookings([]);
  };

  const handleUpdateAvailability = (driverId: string, available: boolean) => {
    setDrivers(drivers.map(driver =>
      driver.id === driverId
        ? { ...driver, availability: available }
        : driver
    ));
  };

  const handleUpdateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId
        ? { ...booking, status }
        : booking
    ));
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setDrivers(drivers.map(driver =>
      driver.id === updatedDriver.id ? updatedDriver : driver
    ));
  };

  const userDriver = user?.type === 'driver'
    ? drivers.find(d => d.id === user.id)
    : null;

  const driverBookings = userDriver
    ? bookings.filter(b => b.driverId === userDriver.id)
    : [];

  const clientBookings = user?.type === 'client'
    ? bookings.filter(b => b.clientId === user.id)
    : [];

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative">
      <AnimatedBackground />
      <Navbar
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      {!user && <Hero />}
      
      <main className="flex-grow">
        {user?.type === 'client' && (
          <ClientDashboard
            user={user}
            drivers={drivers}
            bookings={clientBookings}
            onBook={handleBook}
          />
        )}

        {user?.type === 'driver' && userDriver && (
          <DriverDashboard
            user={user}
            driver={userDriver}
            bookings={driverBookings}
            onUpdateAvailability={(available) => handleUpdateAvailability(userDriver.id, available)}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onUpdateDriver={handleUpdateDriver}
            allUsers={allUsers}
          />
        )}

        {showBookingForm && selectedDriver && (
          <BookingForm
            onSubmit={handleBookingSubmit}
            onClose={() => setShowBookingForm(false)}
          />
        )}
      </main>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;