'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { deleteSubject } from '@/services/api/subjects/deleteSubject';

interface SubjectDeleteFormProps {
    isOpen: boolean;
    subjectData?: {
        id: number;
        name: string;
        total_students?: number;
        teachers_count?: number;
    };
    onClose: () => void;
    onConfirm?: () => void;  // ✅ تم إضافة onConfirm
    onSuccess?: () => void;
}

export const SubjectDeleteForm = ({
    isOpen,
    subjectData,
    onClose,
    onConfirm,  // ✅ تم إضافة onConfirm
    onSuccess,
}: SubjectDeleteFormProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = (): string => {
        try {
            const token = localStorage.getItem('token');
            return token && token.length > 10 ? token : '';
        } catch {
            return '';
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

            const result = await deleteSubject(token, subjectData?.id as number);

            if (result && (result.status === 'success' || result.message?.includes('تم حذف'))) {
                // ✅ استدعاء onConfirm أولاً (الموجود في ClassSubjects)
                if (onConfirm) {
                    onConfirm();
                }
                // ✅ ثم onSuccess (الموجود في ClassDetails)
                if (onSuccess) {
                    onSuccess();
                }
                onClose();
                return;
            } else {
                throw new Error(result?.message || 'فشل الحذف');
            }
        } catch (err: any) {
            setError(err.message || 'حدث خطأ أثناء حذف المادة');
        } finally {
            setLoading(false);
        }
    };

    const hasStudents = (subjectData?.total_students ?? 0) > 0;
    const hasTeachers = (subjectData?.teachers_count ?? 0) > 0;

    // حالة منع الحذف
    if (hasStudents || hasTeachers) {
        return (
            <Dialog
                isOpen={isOpen}
                onClose={onClose}
                title="لا يمكن حذف المادة"
                description={
                    <div className="py-3 text-center">
                        <p className="text-gray-800 text-base mb-3">
                            لا يمكن حذف المادة{' '}
                            <span className="text-red-600 font-bold">
                                "{subjectData?.name}"
                            </span>{' '}
                            لأنها تحتوي على:
                        </p>
                        <ul className="space-y-2 text-center">
                            {hasStudents && (
                                <li className="text-gray-700">
                                    <span className="font-bold text-red-500">
                                        {subjectData?.total_students}
                                    </span>{' '}
                                    طالب مسجلين في هذه المادة
                                </li>
                            )}
                            {hasTeachers && (
                                <li className="text-gray-700">
                                    <span className="font-bold text-red-500">
                                        {subjectData?.teachers_count}
                                    </span>{' '}
                                    مدرسين مرتبطين بهذه المادة
                                </li>
                            )}
                        </ul>
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-[12px] text-sm text-center">
                                {error}
                            </div>
                        )}
                    </div>
                }
                confirmText="فهمت"
                cancelText={null}
                confirmVariant="primary"
                onConfirm={onClose}
                maxWidth="lg"
                closeOnOverlayClick={false}
            />
        );
    }

    // مودال الحذف الأساسي
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="حذف مادة"
            description={
                <div className="py-3">
                    <p className="text-gray-800 text-base mb-3">
                        هل أنت متأكد من حذف مادة:{' '}
                        <span className="text-red-600 font-bold">
                            {subjectData?.name}
                        </span>
                    </p>
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[12px] text-sm text-center">
                            {error}
                        </div>
                    )}
                </div>
            }
            confirmText="تأكيد الحذف"
            cancelText="إلغاء"
            confirmVariant="danger"
            isLoading={loading}
            onConfirm={handleDelete}
            leftIcon={<Trash size={16} />}
            maxWidth="lg"
            closeOnOverlayClick={false}
        />
    );
};

export default SubjectDeleteForm;