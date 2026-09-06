// src/components/class/class sections/ClassSections.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash2, SquarePen, Trash } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';

interface ClassSectionsProps {
    classId: string;
    sections: Array<{
        id: number;
        name: string;
        comment: string | null;
        teachers_count: number;
    }>;
    onSectionClick?: (sectionId: number) => void;
}

export default function ClassSections({
    classId,
    sections,
    onSectionClick
}: ClassSectionsProps) {
    const router = useRouter();

    // ✅ دالة إضافة شعبة
    const handleAddSection = () => {
        router.push(`/classes/${classId}/sections/create`);
    };

    // ✅ إذا لم توجد شعب → عرض رسالة "لا شعب مضافين بعد"
    if (!sections || sections.length === 0) {
        return (
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                <div className="flex flex-col items-center justify-center py-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        لا شعب مضافين بعد
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        قم بإضافة شعب وتابعهم الآن من هنا
                    </p>
                    <Button
                        variant="primary"
                        onClick={handleAddSection}
                        leftIcon={<Plus size={16} />}
                        size="md"
                        className="px-5 py-2.5 shadow-sm"
                    >
                        إضافة شعبة
                    </Button>
                </div>
            </div>
        );
    }

    // ✅ تعريف الأعمدة
    const columns: Column<any>[] = [
        {
            key: 'name',
            header: 'الشعبة',
            align: 'center',
            width: 150,
            render: (row) => (
                <span className="font-medium">{row.name}</span>
            ),
        },
        {
            key: 'teachers_count',
            header: 'عدد الطلاب',
            align: 'center',
            width: 130,
            render: (row) => (
                <span className="font-medium">{row.teachers_count || 0}</span>
            ),
        },
        {
            key: 'comment',
            header: 'الملاحظات',
            align: 'center',
            // ✅ جعل عمود الملاحظات عريض
            width: 'auto',
            minWidth: 300,
            render: (row) => row.comment || '-',
        },
    ];

    // ✅ تعريف الأزرار (Actions)
    const actions: TableAction<any>[] = [
        {
            label: 'عرض',
            icon: <Eye size={16} />,
            variant: 'primary',
            onClick: (row) => {
                console.log('📖 View section:', row.id);
                onSectionClick?.(row.id);
            },
        },
        {
            label: 'تعديل',
            icon: <SquarePen size={16} />,
            variant: 'warning',
            onClick: (row) => {
                console.log('✏️ Edit section:', row.id);
                router.push(`/classes/${classId}/sections/${row.id}/edit`);
            },
        },
        {
            label: 'حذف',
            icon: <Trash size={16} />,
            variant: 'danger',
            onClick: (row) => {
                console.log('🗑️ Delete section:', row.id);
            },
        },
    ];

    return (
        // ✅ جعل الحاوية تمتد لآخر الصفحة مع الحفاظ على كل شيء
        <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
            {/* ✅ استخدام مكون Table */}
            <Table
                columns={columns}
                data={sections}
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