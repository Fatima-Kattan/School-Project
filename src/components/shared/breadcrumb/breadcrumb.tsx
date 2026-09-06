// components/shared/breadcrumb/Breadcrumb.tsx

'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: ReactNode;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
    showBackButton?: boolean;
    onBack?: () => void;
    actionButton?: ReactNode;
}

export const Breadcrumb = ({
    items,
    className = '',
    showBackButton = false,
    onBack,
    actionButton,
}: BreadcrumbProps) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    
    const shouldShowBackButton = showBackButton && items.length > 1;

    return (
        <div className={`bg-white border-b border-gray-200 px-0 py-[34px] ${className}`}>
            <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    
                    {shouldShowBackButton && (
                        <button
                            onClick={handleBack}
                            className="p-2 border border-[#ACACAC] rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}

                    
                    <div className="flex items-center gap-2 text-sm">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                {index > 0 && (
                                    <span className="text-gray-400">/</span>
                                )}
                                
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className={`
                                            flex items-center gap-1.5
                                            text-gray-500 hover:text-blue-600 hover:underline transition-colors
                                            ${index === items.length - 1 ? 'text-[#000F0B] font-bold pointer-events-none text-base' : ''}
                                        `}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className={`
                                        flex items-center gap-1.5
                                        ${index === items.length - 1 ? 'text-[#000F0B] font-bold  text-lg' : 'text-gray-500 text-lg'}
                                    `}>
                                        {item.icon}
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                
                {actionButton && (
                    <div>
                        {actionButton}
                    </div>
                )}
            </div>
        </div>
    );
};