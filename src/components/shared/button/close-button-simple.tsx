// components/shared/button/close-button-simple.tsx

'use client';

import { X } from 'lucide-react';

interface CloseButtonSimpleProps {
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const CloseButtonSimple = ({
    onClick,
    className = '',
    disabled = false,
    size = 'md',
}: CloseButtonSimpleProps) => {
    const sizeClasses = {
        sm: 'w-6 h-6 text-sm',
        md: 'w-8 h-8 text-base',
        lg: 'w-10 h-10 text-lg',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                absolute top-3 left-3
                inline-flex items-center justify-center
                rounded-full
                bg-transparent
                hover:bg-gray-100
                active:bg-gray-200
                text-gray-500
                hover:text-gray-700
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeClasses[size]}
                ${className}
            `}
        >
            <X size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />
        </button>
    );
};