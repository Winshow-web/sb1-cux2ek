import { Search, CalendarCheck, Bus } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: 'Find a Driver',
      description: 'Search our database of verified professional drivers based on your requirements.'
    },
    {
      icon: CalendarCheck,
      title: 'Book Your Trip',
      description: 'Select your dates and route, then book instantly through our platform.'
    },
    {
      icon: Bus,
      title: 'Start Your Journey',
      description: 'Meet your driver and enjoy a safe, comfortable journey to your destination.'
    }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Three simple steps to get started
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center">
                  <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
                    <step.icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">{step.title}</h3>
                <p className="mt-2 text-base text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}