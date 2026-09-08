// src/components/class/class subjects/ClassSubjects.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash2, Trash, Square, SquarePen } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';

// ✅ التغيير 1: إضافة onSubjectChanged و onAddSubject إلى interface
interface ClassSubjectsProps {
    classId: string;
    subjects: Array<{
        id: number;
        name: string;
        comment: string | null;
        full_mark: string;
        semester?: string;
    }>;
    onSubjectClick?: (subjectId: number) => void;
    onSubjectChanged?: (type: 'add' | 'edit' | 'delete', data?: any) => void; // ✅ جديد
    onAddSubject?: () => void; // ✅ جديد
}

// ✅ التغيير 2: استقبال الـ props الجديدة
export default function ClassSubjects({
    classId,
    subjects,
    onSubjectClick,
    onSubjectChanged, // ✅ جديد
    onAddSubject // ✅ جديد
}: ClassSubjectsProps) {
    const router = useRouter();

    // ✅ التغيير 3: تعديل دالة إضافة مادة لاستخدام onAddSubject إذا كان موجوداً
    const handleAddSubject = () => {
        if (onAddSubject) {
            onAddSubject(); // ✅ استخدام الـ prop إذا كان موجود
        } else {
            router.push(`/classes/${classId}/subjects/create`); // ✅ fallback للطريقة القديمة
        }
    };

    // ✅ التغيير 4: تعديل دالة التعديل لاستخدام onSubjectChanged
    const handleEditSubject = (row: any) => {
        if (onSubjectChanged) {
            onSubjectChanged('edit', row); // ✅ إعلام المكون الأب بعملية التعديل
        } else {
            router.push(`/classes/${classId}/subjects/${row.id}/edit`); // ✅ fallback
        }
    };

    // ✅ التغيير 5: تعديل دالة الحذف لاستخدام onSubjectChanged
    const handleDeleteSubject = (row: any) => {
        if (onSubjectChanged) {
            onSubjectChanged('delete', row.id); // ✅ إعلام المكون الأب بعملية الحذف
        } else {
            console.log('🗑️ Delete subject:', row.id); // ✅ fallback
        }
    };

    // ✅ إذا لم توجد مواد → عرض رسالة "لا مواد مضافين بعد"
    if (!subjects || subjects.length === 0) {
        return (
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                <div className="flex flex-col items-center justify-center py-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        لا مواد مضافين بعد
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        قم بإضافة مواد الصف الآن  
                    </p>
                    <Button
                        variant="primary"
                        onClick={handleAddSubject}
                        leftIcon={<Plus size={16} />}
                        size="md"
                        className="px-5 py-2.5 shadow-sm"
                    >
                        إضافة مادة
                    </Button>
                </div>
            </div>
        );
    }

    // ✅ إضافة الرقم التسلسلي للبيانات
    const dataWithIndex = subjects.map((item, index) => ({
        ...item,
        _index: index + 1, // ✅ الرقم التسلسلي يبدأ من 1
    }));

    // ✅ تعريف الأعمدة
    const columns: Column<any>[] = [
        {
            key: '_index',
            header: 'الرقم',
            align: 'center',
            width: 70,
            render: (row) => {
                // ✅ الرقم التسلسلي (01, 02, 03, ...)
                const num = row._index.toString().padStart(2, '0');
                return <span className="font-medium">{num}</span>;
            },
        },
        {
            key: 'name',
            header: 'اسم المادة',
            align: 'center',
            width: 180,
            render: (row) => (
                <span className="font-medium">{row.name}</span>
            ),
        },
        {
            key: 'semester',
            header: 'الفصل',
            align: 'center',
            width: 100,
            render: (row) => row.semester || '-',
        },
        {
            key: 'full_mark',
            header: 'العلامة الكاملة',
            align: 'center',
            width: 130,
            render: (row) => (
                <span className="font-medium">{row.full_mark || 0}</span>
            ),
        },
        {
            key: 'comment',
            header: 'الملاحظات',
            align: 'center',
            width: 'auto',
            minWidth: 200,
            render: (row) => row.comment || '-',
        },
    ];

    // ✅ التغيير 6: تعديل تعريف الأزرار (Actions) لاستخدام الدوال الجديدة
    const actions: TableAction<any>[] = [
        {
            label: 'تعديل',
            icon: <SquarePen size={16} />,
            variant: 'warning',
            onClick: (row) => {
                handleEditSubject(row); // ✅ استخدام الدالة الجديدة
            },
        },
        {
            label: 'حذف',
            icon: <Trash size={16} />,
            variant: 'danger',
            onClick: (row) => {
                handleDeleteSubject(row); // ✅ استخدام الدالة الجديدة
            },
        },
    ];

    return (
        <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
            <Table
                columns={columns}
                data={dataWithIndex} // ✅ نمرر البيانات مع الرقم التسلسلي
                keyExtractor={(row) => row.id}
                actions={actions}
                headerBgColor="#F9FCFB"
                rowBgColor="#FFFFFF"
                borderColor="#E0E0E0"
                radius={10}
                hoverable={true}
                className="w-full"
                headerTextColor="#47524F"
                headerFontWeight={600}
            />
        </div>
    );
}