import { MapPin, DollarSign, Clock } from 'lucide-react';
import type { Driver } from '../../types';

interface AvailableJobsProps {
  driver: Driver;
  onUpdateAvailability: (available: boolean) => void;
}

export default function AvailableJobs({ driver, onUpdateAvailability }: AvailableJobsProps) {
  // Mock available jobs data
  const availableJobs = [
    {
      id: 1,
      title: 'Airport Transfer Service',
      route: 'Downtown to International Airport',
      duration: '4 hours',
      pay: '$120',
      requirements: 'Luxury vehicle experience preferred',
    },
    {
      id: 2,
      title: 'Corporate Event Transportation',
      route: 'Convention Center Circuit',
      duration: '8 hours',
      pay: '$280',
      requirements: 'Professional attire required',
    },
    {
      id: 3,
      title: 'Wedding Party Service',
      route: 'Multiple venues - City Center',
      duration: '6 hours',
      pay: '$200',
      requirements: 'Formal event experience needed',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Available Jobs</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Available for new jobs</span>
            <button
              onClick={() => onUpdateAvailability(!driver.availability)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                driver.availability ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  driver.availability ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {availableJobs.map((job) => (
            <div key={job.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-base font-medium text-gray-900">{job.title}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  New
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  {job.route}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  {job.duration}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  {job.pay}
                </div>
                <p className="text-sm text-gray-500 mt-2">{job.requirements}</p>
              </div>
              <button
                disabled={!driver.availability}
                className={`mt-4 w-full px-4 py-2 rounded-md text-sm font-medium ${
                  driver.availability
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}