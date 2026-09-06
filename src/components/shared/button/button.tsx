// components/shared/button/button.tsx

'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
    | 'primary'      
    | 'danger'       
    | 'warning'      
    | 'ghost'        
    | 'ghost-outline'
    | 'secondary'
    | 'destructive'
    ; 

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    className?: string;
    minWidth?: string | number;
    iconColor?: string; 
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
    minWidth = '64px',
    iconColor,
    ...props
}: ButtonProps) => {

    const isIconOnly = !children && (leftIcon || rightIcon);

const variantClasses = {
    primary: 'bg-[#007353] hover:bg-[#007353]/90 active:bg-[#007353]/80 text-white shadow-sm hover:shadow',
    danger: 'bg-[#DC2626] hover:bg-[#DC2626]/90 active:bg-[#DC2626]/80 text-white shadow-sm hover:shadow',
    warning: 'bg-[#D97706] hover:bg-[#D97706]/90 active:bg-[#D97706]/80 text-white shadow-sm hover:shadow',
    ghost: 'bg-transparent hover:bg-gray-100/50 active:bg-gray-100/70 text-[#000F0B]',
    'ghost-outline': 'bg-transparent border border-[#E0E0E0] hover:bg-gray-100/30 active:bg-gray-100/50 text-[#000F0B]',
    secondary: 'bg-[#E5E5E5] hover:bg-[#E5E5E5]/90 active:bg-[#E5E5E5]/80 text-[#000F0B] shadow-sm hover:shadow',
    destructive: 'bg-[#DC2626] hover:bg-[#DC2626]/90 active:bg-[#DC2626]/80 text-white shadow-sm hover:shadow',
};

    const sizeClasses = {
        xs: isIconOnly ? 'p-2' : 'px-2 py-1 text-[10px] gap-1',
        sm: isIconOnly ? 'p-2' : 'px-3 py-1.5 text-xs gap-1.5',
        md: isIconOnly ? 'p-2.5' : 'px-4 py-2.5 text-sm gap-2',
        lg: isIconOnly ? 'p-3' : 'px-6 py-3 text-base gap-2.5',
        xl: isIconOnly ? 'p-4' : 'px-8 py-4 text-lg gap-3',
    };

    const getMinWidthClass = () => {
        if (typeof minWidth === 'number') {
            return `min-w-[${minWidth}px]`;
        }
        return `min-w-[${minWidth}]`;
    };

    const widthClass = fullWidth ? 'w-full' : getMinWidthClass();
    const isDisabled = disabled || isLoading;


    const getIconSize = () => {
        if (isIconOnly) {
            return size === 'xs' ? 14 : size === 'sm' ? 18 : size === 'md' ? 22 : size === 'lg' ? 26 : 30;
        }
        return size === 'xs' ? 10 : size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 20 : 24;
    };

    
    const focusRingClasses = {
        primary: 'focus:ring-content-brand-primary',
        danger: 'focus:ring-content-critical',
        warning: 'focus:ring-content-warning',
        ghost: 'focus:ring-content-secondary',
        secondary: 'focus:ring-content-secondary',
        'ghost-outline': 'focus:ring-content-secondary',
        destructive: 'focus:ring-content-critical',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                inline-flex items-center justify-center font-medium
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2
                rounded-[12px]
                ${focusRingClasses[variant]}
                ${variantClasses[variant]}
                ${sizeClasses[size]}
                ${widthClass}
                ${isDisabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
                ${isIconOnly ? 'aspect-square' : ''}
                ${className}
            `}
            style={{
                ...(iconColor ? { color: iconColor } : {}),
            }}
            {...props}
        >
            {isLoading && (
                <Loader2
                    size={getIconSize()}
                    className="animate-spin"
                />
            )}

            {!isLoading && leftIcon && (
                <span className="flex-shrink-0">{leftIcon}</span>
            )}

            {children && <span className="whitespace-nowrap">{children}</span>}

            {!isLoading && rightIcon && (
                <span className="flex-shrink-0">{rightIcon}</span>
            )}
        </button>
    );
};