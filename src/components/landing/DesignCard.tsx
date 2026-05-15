import React from 'react';

// Design System Explanation Cards
const DesignCard = ({ title, subtitle, children, className }: { title: string, subtitle: string, children: React.ReactNode, className?: string }) => (
    <div className={`p-8 border border-gray-100 bg-gray-50/50 rounded-3xl ${className}`}>
        <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">{subtitle}</p>
        {children}
    </div>
);

export default DesignCard;
