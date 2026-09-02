// components/notification/notification delete form/NotificationDelete.tsx

'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/shared/button/button';

interface NotificationDeleteProps {
    notification: {
        id: number;
        title: string;
        created_at: string; // ✅ إضافة التاريخ
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const NotificationDelete = ({
    notification,
    onSuccess,
    onCancel,
}: NotificationDeleteProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔑 دالة جلب التوكن
    const getToken = (): string => {
        try {
            const token = localStorage.getItem('token');
            if (token && token.length > 10) {
                return token;
            }
            return '';
        } catch (error) {
            console.error('Error getting token:', error);
            return '';
        }
    };

    // ✅ دالة تنسيق التاريخ
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = getToken();
            if (!token) {
                setError('لم يتم العثور على رمز المصادقة');
                setLoading(false);
                return;
            }

            const response = await fetch(
                `http://localhost:8000/api/notifications/${notification.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                throw new Error('جلسة غير صالحة - الرجاء تسجيل الدخول مرة أخرى');
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            if (result.status === 'success') {
                onSuccess?.();
            } else {
                throw new Error(result.message || 'فشل الحذف');
            }
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء حذف الإعلان');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
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
                    حذف إعلان
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
                    هل أنت متأكد من حذف إعلان: <span className="text-red-600 font-semibold">{notification.title}</span>
                </p>
               
               
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[12px] text-sm">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    variant="ghost-outline"
                    onClick={onCancel}
                    size="md"
                    className="h-[35px] rounded-[12px] min-w-[105px] px-3 py-2 text-sm"
                >
                    إلغاء
                </Button>
                <Button
                    variant="danger"
                    onClick={handleDelete}
                    isLoading={loading}
                    size="md"
                    className="h-[35px] rounded-[12px] min-w-[105px] px-3 py-2 text-sm"
                    leftIcon={<Trash size={16} />}
                >
                    {loading ? 'جاري الحذف...' : 'تأكيد الحذف'}
                </Button>
            </div>
        </div>
    );
};

export default NotificationDelete;