import React from 'react';

export default function AdSenseLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto px-4">
      {children}
    </div>
  );
}