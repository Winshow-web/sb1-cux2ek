import { useState } from 'react';
import { Calendar, Briefcase, Receipt, Phone, Mail, Award, MapPin, Star, X, Edit2, Save, History } from 'lucide-react';
import type { Driver } from '../../store';
import ProfileEditModal from './ProfileEditModal';

interface ProfileCardProps {
  driver: Driver;
  onViewSection: (section: 'schedule' | 'jobs' | 'expenses' | 'history') => void;
  activeSection: 'schedule' | 'jobs' | 'expenses' | 'history';
  onUpdateDriver?: (updatedDriver: Driver) => void;
}

export default function ProfileCard({ driver, onViewSection, activeSection, onUpdateDriver }: ProfileCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleSave = (updatedDriver: Driver) => {
    if (onUpdateDriver) {
      onUpdateDriver(updatedDriver);
    }
    setShowEditModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute -bottom-12 left-6">
            <div className="relative">
              <img
                src={driver.photo}
                alt={driver.name}
                className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-lg"
              />
              <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                driver.availability ? 'bg-green-400' : 'bg-gray-400'
              }`} />
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="pt-16 px-6 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{driver.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Professional Driver</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center text-sm">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{driver.phone}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{driver.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{driver.serviceArea}</span>
            </div>
            <div className="flex items-center text-sm">
              <Award className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{driver.licenseType}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{driver.experience}</div>
              <div className="text-xs text-gray-500 mt-1">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-900">{driver.rating.toFixed(1)}</div>
              <div className="text-xs text-gray-500 mt-1">Rating</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 grid grid-cols-4 gap-2 border-t border-gray-100 pt-6">
            <button
              onClick={() => onViewSection('schedule')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                activeSection === 'schedule'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs mt-1">Schedule</span>
            </button>
            <button
              onClick={() => onViewSection('jobs')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                activeSection === 'jobs'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-xs mt-1">Jobs</span>
            </button>
            <button
              onClick={() => onViewSection('expenses')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                activeSection === 'expenses'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Receipt className="h-5 w-5" />
              <span className="text-xs mt-1">Expenses</span>
            </button>
            <button
              onClick={() => onViewSection('history')}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                activeSection === 'history'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <History className="h-5 w-5" />
              <span className="text-xs mt-1">History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <ProfileEditModal
          driver={driver}
          onSave={handleSave}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}