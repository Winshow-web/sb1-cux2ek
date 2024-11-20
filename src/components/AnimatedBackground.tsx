//import React from 'react';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          >
            <div
              className="h-12 w-12 rounded-full bg-indigo-100/30 backdrop-blur-sm"
              style={{
                transform: `scale(${0.5 + Math.random()})`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}