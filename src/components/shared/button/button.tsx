// components/shared/button/button.tsx

'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'outline'
    | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    type = 'button',
    onClick,
    ...props
}: ButtonProps) => {

    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow',
        secondary: 'bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800',
        danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm hover:shadow',
        success: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm hover:shadow',
        warning: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white shadow-sm hover:shadow',
        outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
        ghost: 'bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2.5',
        xl: 'px-8 py-4 text-lg gap-3',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const isDisabled = disabled || isLoading;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                inline-flex items-center justify-center font-medium
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2
                ${variant === 'primary' ? 'focus:ring-blue-500' : ''}
                ${variant === 'danger' ? 'focus:ring-red-500' : ''}
                ${variant === 'success' ? 'focus:ring-green-500' : ''}
                ${variant === 'warning' ? 'focus:ring-yellow-500' : ''}
                ${variant === 'outline' ? 'focus:ring-blue-400' : ''}
                ${variant === 'ghost' ? 'focus:ring-gray-400' : ''}
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${widthClass}
                ${isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
                ${className}
            `}
            {...props}
        >
            {isLoading && (
                <Loader2
                    size={size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 20 : 24}
                    className="animate-spin mr-2"
                />
            )}

            {!isLoading && leftIcon && (
                <span className="flex-shrink-0">{leftIcon}</span>
            )}

            <span className="whitespace-nowrap">{children}</span>

            {!isLoading && rightIcon && (
                <span className="flex-shrink-0">{rightIcon}</span>
            )}
        </button>
    );
};