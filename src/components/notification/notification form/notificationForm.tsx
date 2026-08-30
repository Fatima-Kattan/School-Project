// components/notification/NotificationForm.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Input } from '@/components/shared/input/inpute';
import { Textarea } from '@/components/shared/input/Textarea';
import { Button } from '@/components/shared/button/button';
import { storeNotification } from '@/services/api/notifications/createNotification';
import { updateNotification } from '@/services/api/notifications/updateNotification';

interface NotificationFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        id: number;
        title: string;
        message: string;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const NotificationForm = ({
    mode,
    initialData,
    onSuccess,
    onCancel,
}: NotificationFormProps) => {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({
                title: initialData.title || '',
                message: initialData.message || '',
            });
        }
    }, [mode, initialData]);

    const getToken = (): string => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('access_token');
            return token || '';
        } catch {
            return '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const token = getToken();
            
            if (!token) {
                setErrors({ general: 'الرجاء تسجيل الدخول' });
                setLoading(false);
                return;
            }

            const newErrors: Record<string, string> = {};
            
            if (!formData.title.trim()) {
                newErrors.title = 'العنوان مطلوب';
            }
            
            if (!formData.message.trim()) {
                newErrors.message = 'نص الإعلان مطلوب';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            if (mode === 'create') {
                await storeNotification(token, {
                    title: formData.title,
                    message: formData.message,
                });
            } else if (mode === 'edit' && initialData) {
                await updateNotification(token, initialData.id, {
                    title: formData.title,
                    message: formData.message,
                });
            }
            
            onSuccess?.();
        } catch (err: any) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setErrors({ general: err.message || 'حدث خطأ أثناء حفظ البيانات' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* ✅ العنوان - إزالة required وإضافة "مطلوب" يدوياً */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">
                        العنوان
                    </label>
                    <span className="text-red-500 text-sm">(مطلوب)</span>
                </div>
                <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="أدخل عنوان الإعلان"
                    error={errors.title}
                    inputClassName="h-[40px] rounded-[12px] text-right border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    style={{ direction: 'rtl' }}
                />
            </div>

            {/* ✅ نص الإعلان - إزالة required وإضافة "مطلوب" يدوياً */}
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">
                        نص الإعلان
                    </label>
                    <span className="text-red-500 text-sm">(مطلوب)</span>
                </div>
                <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="أدخل نص الإعلان"
                    error={errors.message}
                    className="rounded-[12px] text-right resize-none border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    containerClassName="w-full"
                    style={{ direction: 'rtl' }}
                />
            </div>

            {/* أزرار التحكم */}
            <div className="flex justify-end gap-3 pt-2">
                <Button
                    variant="ghost-outline"
                    onClick={onCancel}
                    size="md"
                    className="h-[40px] rounded-[12px]"
                    minWidth="80px"
                >
                    إلغاء
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    isLoading={loading}
                    size="md"
                    className="h-[40px] rounded-[12px]"
                    minWidth="160px"
                    leftIcon={<Save size={18} />}
                >
                    {mode === 'create' ? 'نشر الإعلان' : 'تحديث الإعلان'}
                </Button>
            </div>

            {/* رسالة الخطأ العامة */}
            {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[12px]">
                    ⚠️ {errors.general}
                </div>
            )}
        </form>
    );
};

export default NotificationForm;