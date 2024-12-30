import { Search, Shield, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-indigo-800">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80"
          alt="Bus driver"
        />
        <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" />
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Professional Bus Drivers On Demand
        </h1>
        <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
          Connect with experienced, verified bus drivers for your transportation needs.
          Whether it's for a single trip or long-term engagement, we've got you covered.
        </p>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Feature 
              icon={Search} 
              title="Easy Search" 
              description="Find the perfect driver based on experience, ratings, and availability."
            />
            <Feature 
              icon={Shield} 
              title="Verified Drivers" 
              description="All drivers are thoroughly vetted and licensed professionals."
            />
            <Feature 
              icon={Clock} 
              title="Quick Booking" 
              description="Book a driver in minutes with our streamlined process."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <Icon className="h-6 w-6 text-indigo-400" />
      </div>
      <div className="ml-3">
        <h2 className="text-lg font-medium text-white">{title}</h2>
        <p className="mt-2 text-base text-indigo-200">{description}</p>
      </div>
    </div>
  );
}