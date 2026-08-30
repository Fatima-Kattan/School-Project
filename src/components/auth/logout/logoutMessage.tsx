// components/auth/logout/LogoutMessage.tsx

'use client';

import React from 'react';
import { LogOut, X } from 'lucide-react'; // استخدام X بدلاً من ✕
import { Button } from '@/components/shared/button/button';
import { logoutAPI } from '@/services/api/auth/logout'; // استيراد دالة logout
import { useRouter } from 'next/navigation'; // للتوجيه

interface LogoutMessageProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void; // جعلها اختيارية
    isLoading?: boolean;
}

export const LogoutMessage = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: LogoutMessageProps) => {
    const router = useRouter();

    // دالة تأكيد تسجيل الخروج
    const handleConfirm = async () => {
        try {
            // إذا كان هناك onConfirm مخصص، استخدمه
            if (onConfirm) {
                await onConfirm();
            } else {
                // وإلا استخدم الدالة الافتراضية
                await logoutAPI();
                router.push('/login');
                router.refresh();
            }
            onClose(); // إغلاق النافذة بعد التنفيذ
        } catch (error) {
            console.error('Logout failed:', error);
            // يمكن إظهار رسالة خطأ هنا
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                padding: '20px',
                animation: 'fadeIn 0.2s ease-in-out',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '30px',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: 'auto',
                    overflow: 'visible',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    animation: 'slideUp 0.3s ease-in-out',
                }}
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                {/* زر الإغلاق - استخدام Lucide Icon */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        left: '20px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#999',
                        zIndex: 10,
                        padding: '4px',
                        borderRadius: '4px',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <X size={24} />
                </button>

                <div className="text-right">
                    <h3 
                        className="text-[#000F0B] mt-3"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 700,
                            fontSize: '24px',
                            lineHeight: '32px',
                            letterSpacing: '0px',
                            textAlign: 'right',
                        }}
                    >
                        تسجيل الخروج
                    </h3>
                    <p 
                        className="text-[#000F0B]"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '50px',
                            letterSpacing: '0px',
                            textAlign: 'right',
                        }}
                    >
                        هل أنت متأكد من أنك تريد تسجيل الخروج؟
                    </p>
                    <p 
                        className="text-[#000F0B]"
                        style={{
                            fontFamily: 'Cairo',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '30px',
                            letterSpacing: '0px',
                            textAlign: 'right',
                            color: '#6B7280',
                        }}
                    >
                        سيتوجب عليك إعادة إدخال اسم المستخدم وكلمة المرور لاحقاً للدخول للنظام
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        variant="ghost-outline"
                        onClick={onClose}
                        size="md"
                        className="h-[37px] rounded-[15px] min-w-[105px] px-3 py-2 text-sm"
                    >
                        إلغاء
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm} // استخدام الدالة المدمجة
                        isLoading={isLoading}
                        size="md"
                        className="h-[37px] rounded-[15px] min-w-[140px] px-3 py-2 text-sm bg-red-600 hover:bg-red-700"
                        
                    >
                        {isLoading ? 'جاري الخروج...' : 'تأكيد تسجيل الخروج'}
                    </Button>
                </div>
            </div>

            {/* إضافة CSS Animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default LogoutMessage;