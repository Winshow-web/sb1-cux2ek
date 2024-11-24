import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClientDashboard from './components/ClientDashboard';
import DriverDashboard from './components/DriverDashboard';
import BookingForm from './components/BookingForm';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import AnimatedBackground from './components/AnimatedBackground';
import { AccountType, Booking, BookingStatus, Driver, BasicUser, Message } from './types';

function App() {
  const [user, setUser] = useState<BasicUser | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [setMessages] = useState<Message[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [allUsers, setAllUsers] = useState<BasicUser[]>([]);

  const baseUrl = 'http://localhost:5000';

  // Handle booking initiation
  const handleBook = async (driverId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedDriver(driverId);
    setShowBookingForm(true);
  };

  // Handle booking submission
  const handleBookingSubmit = async (data: {
    startDate: string;
    endDate: string;
    route: string;
    requirements: string;
  }) => {
    if (selectedDriver && user) {
      try {
        const response = await fetch('http://localhost:3000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            driver_uuid: selectedDriver,
            client_uuid: user.uuid,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            route: data.route,
            requirements: data.requirements,
            status: BookingStatus.Pending
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create booking');
        }

        const newBooking = await response.json();
        setBookings([...bookings, newBooking]);
        setShowBookingForm(false);
        setSelectedDriver(null);
      } catch (error) {
        console.error('Error creating booking:', error);
      }
    }
  };

  // Handle user login
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {

        const data = await response.json();

        setUser(data.user);
        setShowAuthModal(false);

        const user_id = data.user.id;
        const accountType = data.user.account_type;

        if (accountType === AccountType.basic_disabled) {
          // Handle case for disabled basic account
        } else if (accountType === AccountType.basic_suspended) {
          // Handle case for suspended basic account
        } else if (accountType === AccountType.basic) {
          // Handle case for active basic account
        } else if (accountType === AccountType.client_disabled) {
          // Handle case for disabled client account
        } else if (accountType === AccountType.client_suspended) {
          // Handle case for suspended client account
        } else if (accountType === AccountType.client_pending) {
          // Handle case for client account awaiting approval
        } else if (accountType === AccountType.client_rejected) {
          // Handle case for rejected client account
        } else if (accountType === AccountType.client) {
          // Handle case for active client account
        } else if (accountType === AccountType.driver_disabled) {
          // Handle case for disabled driver account
        } else if (accountType === AccountType.driver_suspended) {
          // Handle case for suspended driver account
        } else if (accountType === AccountType.driver_pending) {
          // Handle case for driver account awaiting approval
        } else if (accountType === AccountType.driver_rejected) {
          // Handle case for rejected driver account
        } else if (accountType === AccountType.driver) {

          await fetchDriverData(user_id);
          await fetchUserBookings(user_id);

        } else if (accountType === AccountType.administrator_disabled) {
          // Handle case for disabled administrator account
        } else if (accountType === AccountType.administrator_suspended) {
          // Handle case for suspended administrator account
        } else if (accountType === AccountType.administrator) {
          // Handle case for active administrator account
        } else {
          // Handle case for unknown or unrecognized account type
        }


      } else {
        throw new Error('Login failed');
      }


    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Handle user registration
  const handleSignup = async (name: string, email: string, password: string, accountType: AccountType) => {
    try {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        throw new Error('Registration failed');
      }


    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleNewDriver = async (driver: Driver  ) => {
    try {
      const response = await fetch(`${baseUrl}/new/driver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver }),
      });

      if (response.ok) {
        //const data = await response.json();
      } else {
        throw new Error('Registration failed');
      }

    } catch (error) {
      console.error('New driver error:', error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      // Clear local state
      setUser(null);
      setBookings([]);
      setMessages([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch driver data
  const fetchDriverData = async (driverId: string) => {
    try {

      const response = await fetch(`${baseUrl}/get/driver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch driver data');
      }

      const data = await response.json();

      setDrivers(prevDrivers => {
        const driverExists = prevDrivers.some(d => d.uuid === driverId);
        if (!driverExists) {
          return [...prevDrivers, data];
        }
        return prevDrivers.map(d => d.uuid === driverId ? data : d);
      });
    } catch (error) {
      console.error('Error fetching driver data:', error);
    }
  };

  // Fetch user bookings
  const fetchUserBookings = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Handle driver availability update
  const handleUpdateAvailability = async (driverId: string, available: boolean) => {
    try {
      const response = await fetch(`http://localhost:3000/api/drivers/${driverId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability: available }),
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      setDrivers(drivers.map(driver =>
          driver.uuid === driverId
              ? { ...driver, availability: available }
              : driver
      ));
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  // Handle booking status update
  const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      setBookings(bookings.map(booking =>
          booking.booing_id === bookingId
              ? { ...booking, status }
              : booking
      ));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Filter bookings based on user type
  const userDriver = user?.accountType.includes('driver')
      ? drivers.find(d => d.uuid === user.uuid)
      : null;

  const driverBookings = userDriver
      ? bookings.filter(b => b.driver_uuid === userDriver.uuid)
      : [];

  const clientBookings = user?.accountType.includes('client')
      ? bookings.filter(b => b.client_uuid === user.uuid)
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
          {user?.accountType === AccountType.client && (
              <ClientDashboard
                  user={user}
                  drivers={drivers}
                  bookings={clientBookings}
                  onBook={handleBook}
              />
          )}

          {user?.accountType === AccountType.driver && userDriver && (
              <DriverDashboard
                  user={user}
                  driver={userDriver}
                  bookings={driverBookings}
                  onUpdateAvailability={(available) => handleUpdateAvailability(userDriver.uuid, available)}
                  onUpdateBookingStatus={handleUpdateBookingStatus}
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