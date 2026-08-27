// components/shared/button/button.tsx

'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
    | 'primary'      
    | 'danger'       
    | 'warning'      
    | 'ghost'        
    | 'ghost-outline'; 

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

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
        primary: 'bg-bg-brand-primary hover:bg-bg-brand-primary/90 active:bg-bg-brand-primary/80 text-content-primary-inverted shadow-sm hover:shadow',
        danger: 'bg-bg-critical hover:bg-bg-critical/90 active:bg-bg-critical/80 text-content-primary-inverted shadow-sm hover:shadow',
        warning: 'bg-bg-warning hover:bg-bg-warning/90 active:bg-bg-warning/80 text-content-primary-inverted shadow-sm hover:shadow',
        ghost: 'bg-transparent hover:bg-bg-secondary/50 active:bg-bg-secondary/70',
        'ghost-outline': 'bg-transparent border border-border-secondary-soft hover:bg-bg-secondary/30 active:bg-bg-secondary/50 text-content-secondary',
    };

    
    const sizeClasses = {
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
            return size === 'sm' ? 18 : size === 'md' ? 22 : size === 'lg' ? 26 : 30;
        }
        return size === 'sm' ? 14 : size === 'md' ? 16 : size === 'lg' ? 20 : 24;
    };

    
    const focusRingClasses = {
        primary: 'focus:ring-content-brand-primary',
        danger: 'focus:ring-content-critical',
        warning: 'focus:ring-content-warning',
        ghost: 'focus:ring-content-secondary',
        'ghost-outline': 'focus:ring-content-secondary',
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
                ...(typeof minWidth === 'number' ? { minWidth: `${minWidth}px` } : {}),
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