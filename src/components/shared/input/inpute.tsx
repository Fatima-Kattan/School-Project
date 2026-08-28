// components/shared/input/input.tsx

'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

export type InputVariant = 'default' | 'error' | 'success';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    variant?: InputVariant;
    required?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            hint,
            icon,
            iconPosition = 'left',
            variant = 'default',
            required = false,
            containerClassName = '',
            labelClassName = '',
            inputClassName = '',
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        
        const getVariantClasses = () => {
            if (error) {
                return 'border-[#ACACAC] focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20';
            }
            if (variant === 'success') {
                return 'border-[#ACACAC] focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20';
            }
            return 'border-[#ACACAC] focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20';
        };

        const variantClasses = getVariantClasses();

        return (
            <div className={`w-full ${containerClassName}`}>
                {/* Label */}
                {label && (
                    <label
                        className={`
            block text-sm font-medium text-[#000f0b] mb-1.5
            ${required ? 'after:content-["(مطلوب)"] after:text-red-500 after:mr-0.5 after:mr-1' : ''}
            ${labelClassName}
            `}
                    >
                        {label}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative flex items-center">
                    {icon && iconPosition === 'left' && (
                        <span className="absolute left-3 text-[#000f0b] pointer-events-auto inline-flex items-center justify-center z-10">
                            {icon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        disabled={disabled}
                        className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-white text-[#000f0b] placeholder-gray-400
            transition-all duration-200
            outline-none
            ${variantClasses}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'hover:border-[#007353]'}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${error ? 'pr-10' : ''}
            ${inputClassName}
            ${className}
            `}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${props.id}-error` : undefined}
                        {...props}
                    />

                    {icon && iconPosition === 'right' && (
                        <span className="absolute right-3 text-[#000f0b] pointer-events-auto z-10">
                            {icon}
                        </span>
                    )}

                    {/* Error Icon */}
                    {error && (
                        <span className="absolute right-3 text-red-500 pointer-events-none z-10">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </span>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p id={`${props.id}-error`} className="mt-1.5 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Hint Message */}
                {hint && !error && (
                    <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';