// components/shared/empty/empty.tsx

'use client';

import { ReactNode } from 'react';
import { Button, ButtonVariant } from '../button/button';  
import { Plus } from 'lucide-react';

interface EmptyProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
    icon?: ReactNode;
    image?: ReactNode;
    className?: string;
    buttonVariant?: ButtonVariant;  
    buttonIcon?: ReactNode;
    showButton?: boolean;
}

export const Empty = ({
    title = 'لا توجد بيانات',
    description = 'قم بإضافة بيانات جديدة الآن',
    buttonText = 'إضافة',
    onButtonClick,
    icon,
    image,
    className = '',
    buttonVariant = 'primary',  
    buttonIcon,
    showButton = true,
}: EmptyProps) => {
    return (
        <div className={`
            flex flex-col items-center justify-center
            p-8 py-12
            text-center
            bg-white rounded-xl border border-gray-200
            ${className}
        `}>
            
            {image && (
                <div className="mb-4">
                    {image}
                </div>
            )}

            {icon && !image && (
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-gray-400">{icon}</span>
                </div>
            )}

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {title}
            </h3>

            <p className="text-sm text-gray-500 max-w-sm mb-6">
                {description}
            </p>

            {showButton && buttonText && onButtonClick && (
                <Button
                    variant={buttonVariant}
                    size="md"
                    onClick={onButtonClick}
                    leftIcon={buttonIcon || <Plus size={16} />}
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
};