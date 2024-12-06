import { useStore } from '../store';
import { Driver, AccountType } from '../store';

export function useDrivers() {
  const { drivers, setDrivers, updateDriverAvailability } = useStore();

  const loadInitialDrivers = () => {
    // Simulate API call with mock data
    const mockDrivers: Driver[] = [
      {
        uuid: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        password: 'encrypted_password',
        accountType: AccountType.driver,
        phone: '+1 (555) 123-4567',
        experience: 12,
        rating: 4.8,
        licenseType: 'Commercial Driver License (CDL) - Class A',
        availability: true,
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
        specializations: ['Long Distance', 'Tourist Groups', 'Mountain Routes'],
        serviceArea: 'Metropolitan Area',
      },
      {
        uuid: '2',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        password: 'encrypted_password',
        accountType: AccountType.driver,
        phone: '+1 (555) 234-5678',
        experience: 8,
        rating: 4.9,
        licenseType: 'Commercial Driver License (CDL) - Class B',
        availability: true,
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
        specializations: ['City Tours', 'School Transport', 'Event Transportation'],
        serviceArea: 'Downtown Area',
      },
      {
        uuid: '3',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        password: 'encrypted_password',
        accountType: AccountType.driver,
        phone: '+1 (555) 345-6789',
        experience: 15,
        rating: 4.7,
        licenseType: 'Commercial Driver License (CDL) - Class A',
        availability: false,
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
        specializations: ['Interstate Travel', 'Luxury Tours', 'Night Routes'],
        serviceArea: 'Statewide',
      },
    ];
    
    setDrivers(mockDrivers);
  };

  const updateAvailability = (driverUuid: string, availability: boolean) => {
    updateDriverAvailability(driverUuid, availability);
  };

  const getAvailableDrivers = () => {
    return drivers.filter((driver) => driver.availability);
  };

  return {
    drivers,
    loadInitialDrivers,
    updateAvailability,
    getAvailableDrivers,
  };
}