// components/student/student delete form/StudentDeleteForm.tsx

'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { deleteStudent } from '@/services/api/students/deleteStudent';

interface StudentDeleteFormProps {
    student: {
        id: number;
        full_name: string;
        user_name?: string;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const StudentDeleteForm = ({
    student,
    onSuccess,
    onCancel,
}: StudentDeleteFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

            await deleteStudent(student.id, token);
            
            onSuccess?.();
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء حذف الطالب');
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
                    حذف طالب
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
                    هل أنت متأكد من حذف الطالب: <span className="text-red-600">{student.full_name}</span>
                </p>
                <p 
                    className="text-[#000F0B]"
                    style={{
                        fontFamily: 'Cairo',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '30px',
                        letterSpacing: '0px',
                        textAlign: 'right',
                    }}
                >
                    سيتم حذف كل ما هو مرتبط به ولن تتمكن من استرداد البيانات لاحقاً
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