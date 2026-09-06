'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Input } from '@/components/shared/input/inpute';
import { Textarea } from '@/components/shared/input/Textarea';
import { Button } from '@/components/shared/button/button';
import { useClasses } from '@/hooks/useClasses';

interface ClassFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const ClassForm = ({ onSuccess, onCancel }: ClassFormProps) => {
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { createClass } = useClasses({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (!name.trim()) {
            setErrors({ name: 'اسم الصف مطلوب' });
            setLoading(false);
            return;
        }

        try {
            await createClass({ name: name.trim(), comment: comment.trim() || undefined });
            onSuccess();
        } catch (err: any) {
            setErrors({ general: err.message || 'حدث خطأ أثناء إضافة الصف' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <Input
                    label="اسم الصف"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="التاسع"
                    error={errors.name}
                    inputClassName="h-[40px] rounded-[12px] text-right border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    style={{ direction: 'rtl' }}
                />
            </div>

            <div>
                <Textarea
                    label="الملاحظات"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    placeholder="أدخل ملاحظات (اختياري)"
                    className="rounded-[12px] text-right resize-none border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    containerClassName="w-full"
                    style={{ direction: 'rtl' }}
                />
            </div>

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
                    تأكيد إضافة الصف
                </Button>
            </div>

            {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[12px]">
                    ⚠️ {errors.general}
                </div>
            )}
        </form>
    );
};