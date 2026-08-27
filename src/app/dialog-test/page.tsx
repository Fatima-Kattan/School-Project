// app/dialog-test/page.tsx

'use client';

import { useState } from 'react';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Button } from '@/components/shared/button/button';
import { Trash } from 'lucide-react';

export default function DialogTestPage() {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isStudentOpen, setIsStudentOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // محاكاة عملية الحذف
    const handleDelete = async () => {
        setIsLoading(true);
        try {
            // محاكاة طلب API
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('تم الحذف بنجاح');
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('خطأ في الحذف', error);
        } finally {
            setIsLoading(false);
        }
    };

    // محاكاة عملية حذف الشعبة
    const handleDeleteClass = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('تم حذف الشعبة بنجاح');
            setIsClassOpen(false);
        } catch (error) {
            console.error('خطأ في حذف الشعبة', error);
        } finally {
            setIsLoading(false);
        }
    };

    // محاكاة إضافة طالب
    const handleAddStudent = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('تم إضافة الطالب بنجاح');
            setIsStudentOpen(false);
        } catch (error) {
            console.error('خطأ في إضافة الطالب', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-8 text-center">اختبار مكون Dialog</h1>

                <div className="space-y-4">
                    {/* زر فتح ديالوغ الحذف */}
                    <Button
                        variant="danger"
                        onClick={() => setIsDeleteOpen(true)}
                        fullWidth
                    >
                        فتح ديالوغ حذف إعلان
                    </Button>

                    {/* زر فتح ديالوغ حذف شعبة */}
                    <Button
                        variant="danger"
                        onClick={() => setIsClassOpen(true)}
                        fullWidth
                    >
                        فتح ديالوغ حذف شعبة
                    </Button>

                    {/* زر فتح ديالوغ إضافة طالب */}
                    <Button
                        variant="primary"
                        onClick={() => setIsStudentOpen(true)}
                        fullWidth
                    >
                        فتح ديالوغ إضافة طالب
                    </Button>
                </div>

                {/* ===== ديالوغ حذف إعلان ===== */}
                <Dialog
                    isOpen={isDeleteOpen}
                    onClose={() => !isLoading && setIsDeleteOpen(false)}
                    onConfirm={handleDelete}
                    title="حذف إعلان"
                    description={<>هل أنت متأكد من حذف إعلان:
                    <span className="text-red-600 font-bold"> حفل نهاية العام – 15 يونيو 2026</span></>}
                    confirmText="تأكيد الحذف"
                    cancelText="إلغاء"
                    confirmVariant="danger"
                    isLoading={isLoading}
                />

                {/* ===== ديالوغ حذف شعبة ===== */}
                <Dialog
                    isOpen={isClassOpen}
                    onClose={() => !isLoading && setIsClassOpen(false)}
                    onConfirm={handleDeleteClass}
                    title="حذف شعبة"
                    description={
                        <>
                            هل أنت متأكد من حذف الشعبة: <span className="text-red-600 font-bold">الأولى</span> للصف: <span className="text-red-600 font-bold">السابع</span>
                        </>
                    }
                    confirmText="تأكيد الحذف"
                    cancelText="إلغاء"
                    confirmVariant="danger"
                    cancelVariant="ghost-outline"
                    leftIcon={<Trash size="16" />}
                    isLoading={isLoading}
                />

                {/* ===== ديالوغ إضافة طالب ===== */}
                <Dialog
                    isOpen={isStudentOpen}
                    onClose={() => !isLoading && setIsStudentOpen(false)}
                    onConfirm={handleAddStudent}
                    title="إضافة طالب للشعبة"
                    description="حدد الطالب الذي تريد إضافته إلى الشعبة"
                    confirmText="إنشاء الحسنة"
                    cancelText="إلغاء"
                    confirmVariant="primary"
                    isLoading={isLoading}
                >
                    <div className="space-y-3">
                        <select
                            className="w-full p-3 border-2 border-border-secondary-soft rounded-xl bg-transparent text-content-primary text-right focus:outline-none focus:border-bg-brand-primary transition-colors"
                            defaultValue=""
                        >
                            <option value="" disabled>حدد الطالب</option>
                            <option value="1">أحمد محمد</option>
                            <option value="2">سارة خالد</option>
                            <option value="3">محمد علي</option>
                            <option value="4">نورة أحمد</option>
                        </select>
                        <p className="text-xs text-content-tertiary text-right">حدد الطالب (مطلوب)</p>
                    </div>
                </Dialog>
            </div>
        </div>
    );
}