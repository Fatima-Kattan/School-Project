// src/components/class/class subjects/ClassSubjects.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash2, Trash, Square, SquarePen } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';

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
}

export default function ClassSubjects({
    classId,
    subjects,
    onSubjectClick
}: ClassSubjectsProps) {
    const router = useRouter();

    // ✅ دالة إضافة مادة
    const handleAddSubject = () => {
        router.push(`/classes/${classId}/subjects/create`);
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

    // ✅ تعريف الأزرار (Actions)
    const actions: TableAction<any>[] = [
        {
            label: 'تعديل',
            icon: <SquarePen size={16} />,
            variant: 'warning',
            onClick: (row) => {
                console.log('✏️ Edit subject:', row.id);
                router.push(`/classes/${classId}/subjects/${row.id}/edit`);
            },
        },
        {
            label: 'حذف',
            icon: <Trash size={16} />,
            variant: 'danger',
            onClick: (row) => {
                console.log('🗑️ Delete subject:', row.id);
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