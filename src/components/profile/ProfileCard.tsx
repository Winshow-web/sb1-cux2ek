import { useState } from 'react';
import { Calendar, Briefcase, Phone, Mail, MapPin, Star, X, Edit2, Save } from 'lucide-react';
import type { Driver } from '../../types';

interface ProfileCardProps {
  driver: Driver;
  onViewSection: (section: 'schedule' | 'jobs') => void;
  activeSection: 'schedule' | 'jobs';
  onUpdateDriver?: (updatedDriver: Driver) => void;
}

const LICENSE_TYPES = [
  { id: 'DE', label: 'DE - Heavy Vehicle' },
  { id: 'C', label: 'C - Medium Rigid' },
  { id: 'CE', label: 'CE - Heavy Combination' },
];

export default function ProfileCard({ driver, onViewSection, activeSection, onUpdateDriver }: ProfileCardProps) {
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDriver, setEditedDriver] = useState(driver);
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [serviceArea, setServiceArea] = useState('Metropolitan Area');

  const handleSave = () => {
    if (onUpdateDriver) {
      onUpdateDriver(editedDriver);
    }
    setIsEditing(false);
  };

  const handleLicenseToggle = (licenseId: string) => {
    const currentLicenses = editedDriver.licenseType.split(', ');
    const updatedLicenses = currentLicenses.includes(licenseId)
      ? currentLicenses.filter(l => l !== licenseId)
      : [...currentLicenses, licenseId];
    
    setEditedDriver({
      ...editedDriver,
      licenseType: updatedLicenses.join(', '),
    });
  };

  const handleSpecializationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDriver({
      ...editedDriver,
      specializations: e.target.value.split(',').map(s => s.trim()),
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Profile Info */}
          <div className="w-full md:w-1/3 p-6 bg-gradient-to-b from-indigo-50 to-white">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={driver.photo}
                  alt={driver.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  driver.availability ? 'bg-green-400' : 'bg-gray-400'
                }`} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{driver.name}</h2>
              <p className="text-sm text-gray-500">Professional Driver</p>
              
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => setShowFullProfile(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowFullProfile(true);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm flex items-center"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Navigation */}
          <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200">
            <div className="h-full flex flex-col">
              <div className="grid grid-cols-2 divide-x border-b border-gray-200">
                <button
                  onClick={() => onViewSection('schedule')}
                  className={`flex items-center justify-center py-4 px-6 text-sm font-medium ${
                    activeSection === 'schedule'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </button>
                <button
                  onClick={() => onViewSection('jobs')}
                  className={`flex items-center justify-center py-4 px-6 text-sm font-medium ${
                    activeSection === 'jobs'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Available Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Profile Modal */}
      {showFullProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Profile' : 'Driver Profile'}
                </h2>
                <div className="flex items-center space-x-2">
                  {isEditing && (
                    <button
                      onClick={handleSave}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowFullProfile(false);
                      setIsEditing(false);
                      setEditedDriver(driver);
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center">
                    <img
                      src={editedDriver.photo}
                      alt={editedDriver.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="ml-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedDriver.name}
                          onChange={(e) => setEditedDriver({ ...editedDriver, name: e.target.value })}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                      ) : (
                        <h3 className="text-xl font-semibold text-gray-900">{editedDriver.name}</h3>
                      )}
                      <p className="text-sm text-gray-500">Professional Driver</p>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                        editedDriver.availability
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {editedDriver.availability ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Contact Number</p>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-500">{phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Address</p>
                        <p className="text-sm text-gray-500">{editedDriver.name.toLowerCase().replace(' ', '.')}@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Service Area</p>
                        {isEditing ? (
                          <input
                            type="text"
                            value={serviceArea}
                            onChange={(e) => setServiceArea(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-500">{serviceArea}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">License Types</h4>
                    <div className="space-y-2">
                      {LICENSE_TYPES.map((license) => (
                        <div
                          key={license.id}
                          onClick={() => isEditing && handleLicenseToggle(license.id)}
                          className={`px-3 py-2 rounded-md text-sm ${
                            editedDriver.licenseType.includes(license.id)
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-gray-100 text-gray-400'
                          } ${isEditing ? 'cursor-pointer hover:bg-indigo-50' : ''}`}
                        >
                          {license.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Experience & Rating</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Years of Experience</p>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editedDriver.experience}
                              onChange={(e) => setEditedDriver({ ...editedDriver, experience: parseInt(e.target.value) })}
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-500">{editedDriver.experience} years</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Driver Rating</p>
                          <p className="text-sm text-gray-500">{editedDriver.rating.toFixed(1)} / 5.0</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Specializations</h4>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedDriver.specializations.join(', ')}
                        onChange={handleSpecializationChange}
                        placeholder="Enter specializations, separated by commas"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {editedDriver.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}