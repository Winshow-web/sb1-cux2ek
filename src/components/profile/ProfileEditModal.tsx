import { useState } from 'react';
import { X, Save, Mail, Phone, MapPin, Award, Star, Calendar } from 'lucide-react';
import type { Driver } from '../../store';

interface ProfileEditModalProps {
  driver: Driver;
  onSave: (updatedDriver: Driver) => void;
  onClose: () => void;
}

export default function ProfileEditModal({ driver, onSave, onClose }: ProfileEditModalProps) {
  const [editedDriver, setEditedDriver] = useState(driver);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedDriver);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex items-center space-x-6">
            <img
              src={editedDriver.photo}
              alt={editedDriver.name}
              className="h-24 w-24 rounded-xl object-cover"
            />
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
            >
              Change Photo
            </button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={editedDriver.name}
                onChange={(e) => setEditedDriver({ ...editedDriver, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4 inline-block mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={editedDriver.email}
                onChange={(e) => setEditedDriver({ ...editedDriver, email: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4 inline-block mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={editedDriver.phone}
                onChange={(e) => setEditedDriver({ ...editedDriver, phone: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 inline-block mr-2" />
                Service Area
              </label>
              <input
                type="text"
                value={editedDriver.serviceArea}
                onChange={(e) => setEditedDriver({ ...editedDriver, serviceArea: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Award className="h-4 w-4 inline-block mr-2" />
                License Type
              </label>
              <select
                value={editedDriver.licenseType}
                onChange={(e) => setEditedDriver({ ...editedDriver, licenseType: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="Commercial Driver License (CDL) - Class A">CDL - Class A</option>
                <option value="Commercial Driver License (CDL) - Class B">CDL - Class B</option>
                <option value="Commercial Driver License (CDL) - Class C">CDL - Class C</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 inline-block mr-2" />
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={editedDriver.experience}
                  onChange={(e) => setEditedDriver({ ...editedDriver, experience: parseInt(e.target.value) })}
                  min="0"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Star className="h-4 w-4 inline-block mr-2" />
                  Rating
                </label>
                <input
                  type="number"
                  value={editedDriver.rating}
                  disabled
                  className="mt-1 block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Rating is calculated automatically</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Specializations</label>
              <div className="mt-2 space-y-2">
                {['Long Distance', 'Tourist Groups', 'Mountain Routes', 'City Tours', 'School Transport', 'Event Transportation', 'Interstate Travel', 'Luxury Tours', 'Night Routes'].map((spec) => (
                  <label key={spec} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={editedDriver.specializations.includes(spec)}
                      onChange={(e) => {
                        const updatedSpecs = e.target.checked
                          ? [...editedDriver.specializations, spec]
                          : editedDriver.specializations.filter(s => s !== spec);
                        setEditedDriver({ ...editedDriver, specializations: updatedSpecs });
                      }}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <Save className="h-4 w-4 inline-block mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}