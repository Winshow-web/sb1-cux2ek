import { Route, Shield, Star, Clock, Users, MapPin } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Route,
      title: 'Flexible Routes',
      description: 'Choose from city tours, airport transfers, or custom routes tailored to your needs.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'All our drivers undergo rigorous background checks and safety training.'
    },
    {
      icon: Star,
      title: 'Top Rated Drivers',
      description: 'Access a network of highly rated and experienced professional drivers.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Book drivers any time of day or night for your transportation needs.'
    },
    {
      icon: Users,
      title: 'Group Transport',
      description: 'Perfect for events, tours, and large group transportation.'
    },
    {
      icon: MapPin,
      title: 'Wide Coverage',
      description: 'Operating in multiple cities with extensive route networks.'
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose Our Platform
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to find and book professional drivers
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}