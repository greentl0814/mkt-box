import React from 'react';

export default function AdSenseLayout({ children }) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}