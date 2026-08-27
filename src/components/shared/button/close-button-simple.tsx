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
    size = 'lg',
}: CloseButtonSimpleProps) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
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
                hover:bg-red-50
                active:bg-red-100
                text-black
                hover:text-red-600
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeClasses[size]}
                ${className}
            `}
        >
            <X size={size === 'sm' ? 18 : size === 'md' ? 22 : 28} />
        </button>
    );
};