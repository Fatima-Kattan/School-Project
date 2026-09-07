'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/button/button';
import { useClasses } from '@/hooks/useClasses';
import { Save } from 'lucide-react';

interface ClassEditFormProps {
    classData: {
        id: number;
        name: string;
        comment: string | null;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

export const ClassEditForm = ({ classData, onSuccess, onCancel }: ClassEditFormProps) => {
    const [name, setName] = useState(classData.name);
    const [comment, setComment] = useState(classData.comment || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { updateClass } = useClasses({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('اسم الصف مطلوب');
            return;
        }

        try {
            setIsLoading(true);
            await updateClass(classData.id, {
                name: name.trim(),
                comment: comment.trim() || undefined,
            });
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء تحديث الصف');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
                    اسم الصف <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسم الصف"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent text-right"
                    dir="rtl"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 text-right">
                    الملاحظات
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="أدخل ملاحظات (اختياري)"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent text-right resize-none"
                    dir="rtl"
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="ghost-outline"
                    onClick={onCancel}
                    size="md"
                >
                    إلغاء
                </Button>
                <Button
                                    variant="primary"
                                    type="submit"
                                    
                                    size="md"
                                    className="h-[40px] rounded-[12px]"
                                    minWidth="160px"
                                    leftIcon={<Save size={18} />}
                                >
                                    تحديث البيانات
                                </Button>
            </div>
        </form>
    );
};