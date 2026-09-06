// components/shared/dialog/dialog.tsx

'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { CloseButtonSimple } from '../button/close-button-simple';
import { Button, ButtonVariant } from '../button/button';

export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title?: string;
    description?: string | ReactNode;
    children?: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    closeText?: string;
    confirmVariant?: ButtonVariant;
    cancelVariant?: ButtonVariant;
    showCancel?: boolean;
    showConfirm?: boolean;
    isLoading?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    closeOnOverlayClick?: boolean;
    className?: string;
    hideCloseButton?: boolean;
}

export const Dialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    children,
    leftIcon,
    rightIcon,
    confirmText = 'تأكيد',
    cancelText = 'إلغاء',
    closeText = 'إغلاق',
    confirmVariant = 'primary',
    cancelVariant = 'ghost-outline',
    showCancel = true,
    showConfirm = true,
    isLoading = false,
    maxWidth = 'lg',
    closeOnOverlayClick = true,
    className = '',
    hideCloseButton = false,
}: DialogProps) => {
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full',
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'dialog-title' : undefined}
            aria-describedby={description ? 'dialog-description' : undefined}
        >
            <div
                ref={dialogRef}
                className={`
                    relative w-full ${maxWidthClasses[maxWidth]}
                    bg-white
                    rounded-[24px]
                    shadow-2xl
                    p-6
                    animate-in fade-in zoom-in duration-200
                    ${className}
                `}
                style={{
                    padding: '24px',
                    gap: '10px',
                }}
            >
                {/* زر الإغلاق */}
                {!hideCloseButton && (
                    <CloseButtonSimple
                        onClick={onClose}
                        size="md"
                        className="absolute top-3 left-3"
                    />
                )}

                {/* المحتوى */}
                <div className="flex flex-col gap-3">
                    {/* العنوان */}
                    {title && (
                        <h2
                            id="dialog-title"
                            className="text-xl font-bold text-gray-900 text-right"
                        >
                            {title}
                        </h2>
                    )}

                    {/* الوصف - يدعم النصوص الملونة */}
                    {description && (
                        <div
                            id="dialog-description"
                            className="text-sm font-medium text-gray-900 text-right"
                        >
                            {description}
                        </div>
                    )}

                    {/* المحتوى المخصص */}
                    {children && (
                        <div className="text-right">
                            {children}
                        </div>
                    )}

                    {/* أزرار الإجراءات */}
                    {(showCancel || showConfirm) && (
                        <div className="flex flex-row-reverse gap-1">
                            {showConfirm && (
                                <Button
                                    variant={confirmVariant}
                                    onClick={handleConfirm}
                                    isLoading={isLoading}
                                    disabled={isLoading}
                                    className="min-w-[60px]"
                                    size='sm'
                                    leftIcon={leftIcon && (
                                        <span className="w-3 h-3">
                                            {leftIcon}
                                        </span>
                                    )}
                                    rightIcon={rightIcon && (
                                        <span className="w-3 h-3">
                                            {rightIcon}
                                        </span>
                                    )}
                                >
                                    {confirmText}
                                </Button>
                            )}
                            {showCancel && (
                                <Button
                                    variant={cancelVariant}
                                    onClick={onClose}
                                    disabled={isLoading}
                                    size='sm'
                                    className="min-w-[60px]"
                                >
                                    {cancelText}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};