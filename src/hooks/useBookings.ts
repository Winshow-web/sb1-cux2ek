import { useStore } from '../store';
import { Booking, BookingStatus } from '../store';

export function useBookings() {
  const { bookings, addBooking, updateBookingStatus } = useStore();

  const createBooking = (bookingData: Omit<Booking, 'booing_id' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      booing_id: Math.random().toString(36).substring(7),
      status: BookingStatus.Pending,
      startDate: new Date(bookingData.startDate),
      endDate: new Date(bookingData.endDate),
    };
    addBooking(newBooking);
    return newBooking;
  };

  const updateStatus = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
  };

  const getBookingsByUser = (userUuid: string, isDriver: boolean) => {
    return bookings.filter((booking) => 
      isDriver 
        ? booking.driver_uuid === userUuid 
        : booking.client_uuid === userUuid
    );
  };

  return {
    bookings,
    createBooking,
    updateStatus,
    getBookingsByUser,
  };
}