// components/shared/input/textarea.tsx

'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
    required?: boolean;
    containerClassName?: string;
    labelClassName?: string;
    rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            hint,
            required = false,
            containerClassName = '',
            labelClassName = '',
            className = '',
            rows = 4,
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        className={`
              block text-sm font-medium text-gray-700 mb-1.5
              ${required ? 'after:content-["*"] after:text-red-500 after:ml-0.5' : ''}
              ${labelClassName}
            `}
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    rows={rows}
                    disabled={disabled}
                    className={`
            w-full px-4 py-2.5 rounded-lg border
            bg-white text-gray-900 placeholder-gray-400
            transition-all duration-200
            outline-none resize-y
            ${error ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-300' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'hover:border-gray-400'}
            ${className}
          `}
                    aria-invalid={!!error}
                    {...props}
                />

                {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}

                {hint && !error && (
                    <p className="mt-1.5 text-sm text-gray-500">{hint}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';