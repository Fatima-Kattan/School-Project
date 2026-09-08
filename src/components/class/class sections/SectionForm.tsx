// src/components/class/class sections/SectionForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Input } from '@/components/shared/input/inpute';
import { Textarea } from '@/components/shared/input/Textarea';
import { Button } from '@/components/shared/button/button';
import { addSectionToClass } from '@/services/api/sections/addSectionToClass';
import { updateSectionToClass } from '@/services/api/sections/updateSectionToClass';

interface SectionFormProps {
    mode: 'create' | 'edit';
    classId: number;
    initialData?: {
        id: number;
        name: string;
        comment: string | null;
    } | null;
    onSuccess: (data?: any) => void;
    onCancel: () => void;
}

export const SectionForm = ({
    mode,
    classId,
    initialData,
    onSuccess,
    onCancel,
}: SectionFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        comment: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    const isEdit = mode === 'edit';

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                name: initialData.name || '',
                comment: initialData.comment || '',
            });
        }
    }, [isEdit, initialData]);

    const getToken = (): string => {
        try {
            const token = localStorage.getItem('token') || 
                        localStorage.getItem('access_token') ||
                        localStorage.getItem('auth_token');
            return token || '';
        } catch {
            return '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneralError(null);

        try {
            const token = getToken();

            if (!token) {
                setGeneralError('الرجاء تسجيل الدخول');
                setLoading(false);
                return;
            }

            const newErrors: Record<string, string> = {};

            if (!formData.name.trim()) {
                newErrors.name = 'اسم الشعبة مطلوب';
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            const payload = {
                name: formData.name.trim(),
                comment: formData.comment.trim() || null,
                class_id: classId,
            };

            let response;

            if (isEdit && initialData) {
                // ✅ تعديل شعبة
                console.log('📝 [SectionForm] Updating section:', initialData.id, payload);
                response = await updateSectionToClass(token, initialData.id, payload);
                console.log('📝 [SectionForm] Update response:', response);
                
                // ✅ تمرير البيانات المعدلة مع الحفاظ على الـ ID
                onSuccess({
                    id: initialData.id,
                    name: payload.name,
                    comment: payload.comment,
                    class_id: classId,
                });
            } else {
                // ✅ إضافة شعبة
                console.log('📝 [SectionForm] Adding section:', payload);
                response = await addSectionToClass(token, payload);
                console.log('📝 [SectionForm] Add response:', response);
                
                // ✅ تمرير البيانات الجديدة
                const newSection = response?.data || {
                    id: response?.id || Date.now(),
                    ...payload,
                };
                onSuccess(newSection);
            }

        } catch (err: any) {
            console.error('❌ [SectionForm] Error:', err);
            
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setGeneralError(err.message || `حدث خطأ أثناء ${isEdit ? 'تعديل' : 'إضافة'} الشعبة`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* ✅ العنوان */}
            <div className="text-right">
                <h3 
                    className="text-[#000F0B] mt-3"
                    style={{
                        fontFamily: 'Cairo',
                        fontWeight: 700,
                        fontSize: '24px',
                        lineHeight: '32px',
                        textAlign: 'right',
                    }}
                >
                    {isEdit ? 'تعديل شعبة' : 'إضافة شعبة'}
                </h3>
            </div>

            {/* ✅ رسالة الخطأ العامة */}
            {generalError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[12px] text-sm text-right">
                    ⚠️ {generalError}
                </div>
            )}

            {/* ✅ اسم الشعبة */}
            <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">
                        اسم الشعبة
                    </label>
                    <span className="text-red-500 text-sm">(مطلوب)</span>
                </div>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أدخل اسم الشعبة"
                    error={errors.name}
                    inputClassName="h-[40px] rounded-[12px] text-right border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    style={{ direction: 'rtl' }}
                />
            </div>

            {/* ✅ الملاحظات */}
            <div className="text-right">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                    الملاحظات
                </label>
                <Textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={3}
                    placeholder="أدخل ملاحظات (اختياري)"
                    error={errors.comment}
                    className="rounded-[12px] text-right resize-none border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    containerClassName="w-full"
                    style={{ direction: 'rtl' }}
                />
            </div>

            {/* ✅ أزرار التحكم */}
            <div className="flex justify-end gap-3 pt-2">
                <Button
                    variant="ghost-outline"
                    onClick={onCancel}
                    size="md"
                    className="h-[40px] rounded-[12px]"
                    minWidth="80px"
                    type="button"
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
                    {loading ? 'جاري الحفظ...' : (isEdit ? 'تحديث' : 'إضافة')}
                </Button>
            </div>
        </form>
    );
};

export default SectionForm;