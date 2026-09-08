'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { useClasses } from '@/hooks/useClasses';

interface ClassDeleteFormProps {
    classData: {
        id: number;
        name: string;
    };
    onSuccess: () => void;
    onCancel: () => void;
}

export const ClassDeleteForm = ({
    classData,
    onSuccess,
    onCancel,
}: ClassDeleteFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { deleteClass } = useClasses({});

    const handleDelete = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token') || '';
            if (!token) {
                setError('لم يتم العثور على رمز المصادقة');
                setLoading(false);
                return;
            }

            await deleteClass(classData.id);
            
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء حذف الصف');
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
                    حذف صف
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
                    هل أنت متأكد من حذف الصف: <span className="text-red-600">{classData.name}</span>
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
                    className="h-[32px] rounded-[12px] min-w-[105px] px-3 py-2 text-sm"
                >
                    إلغاء
                </Button>
                <Button
                    variant="danger"
                    onClick={handleDelete}
                    isLoading={loading}
                    size="md"
                    className="h-[32px] rounded-[12px] min-w-[105px] px-3 py-2 text-sm"
                    leftIcon={<Trash size={16} />}
                >
                    {loading ? 'جاري الحذف...' : 'تأكيد الحذف'}
                </Button>
            </div>
        </div>
    );
};