'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash, ArrowRight, User, Calendar, Home, FileText, Users } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { useStudents } from '@/hooks/useStudents';

interface ClassStudentsProps {
    classId: string;
    sectionId: number | null;
    sectionName: string;
    onBack: () => void;
}

export default function ClassStudents({
    classId,
    sectionId,
    sectionName,
    onBack,
}: ClassStudentsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { students, loading: studentsLoading, refreshStudents } = useStudents({
        sectionId: sectionId || undefined,
    });

    useEffect(() => {
        if (sectionId) {
            refreshStudents();
        }
    }, [sectionId]);

    // إذا لم توجد شعبة محددة
    if (!sectionId) {
        return (
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                <div className="flex flex-col items-center justify-center py-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        اختر شعبة أولاً
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        قم باختيار شعبة من تبويب الشعب لعرض الطلاب
                    </p>
                    <Button
                        variant="primary"
                        onClick={onBack}
                        leftIcon={<ArrowRight size={16} />}
                        size="md"
                        className="px-5 py-2.5 shadow-sm"
                    >
                        العودة إلى الشعب
                    </Button>
                </div>
            </div>
        );
    }

    // إذا لم يوجد طلاب
    if (!studentsLoading && students.length === 0) {
        return (
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        لا طالب في هذه الشعبة
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        قم بإضافة طالب لهذه الشعبة الآن
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push(`/classes/${classId}/sections/${sectionId}/students/create`)}
                        leftIcon={<Plus size={16} />}
                        size="md"
                        className="px-5 py-2.5 shadow-sm"
                    >
                        إضافة طالب
                    </Button>
                </div>
            </div>
        );
    }

    const columns: Column<any>[] = [
        {
            key: 'id',
            header: 'الرقم',
            align: 'center',
            width: 80,
        },
        {
            key: 'full_name',
            header: 'الطالب',
            align: 'center',
            width: 150,
            render: (row) => (
                <div className="flex items-center gap-2 justify-center">
                    <User size={16} className="text-[#007353]" />
                    <span className="font-medium">{row.full_name}</span>
                </div>
            ),
        },
        {
            key: 'gender',
            header: 'الجنس',
            align: 'center',
            width: 80,
            render: (row) => (
                <span className={row.gender === 'ذكر' ? 'text-blue-600' : 'text-pink-500'}>
                    {row.gender}
                </span>
            ),
        },
        {
            key: 'parents',
            header: 'أولياء الأمر',
            align: 'center',
            width: 200,
            render: (row) => (
                <div className="flex flex-col items-center text-sm">
                    <span>أب: {row.father_name || '-'}</span>
                    <span className="text-xs text-gray-500">أم: {row.mother_name || '-'}</span>
                </div>
            ),
        },
        {
            key: 'birth_date',
            header: 'تاريخ الميلاد',
            align: 'center',
            width: 120,
            render: (row) => {
                if (!row.birth_date) return '-';
                const date = new Date(row.birth_date);
                return date.toLocaleDateString('ar-EG');
            },
        },
        {
            key: 'residential_address',
            header: 'عنوان السكن',
            align: 'center',
            width: 150,
            render: (row) => row.residential_address || '-',
        },
        {
            key: 'comment',
            header: 'الملاحظات',
            align: 'center',
            width: 150,
            render: (row) => row.comment || '-',
        },
    ];

    const actions: TableAction<any>[] = [
        {
            label: 'عرض',
            icon: <Eye size={16} />,
            variant: 'primary',
            onClick: (row) => {
                router.push(`/students/${row.id}`);
            },
        },
        {
            label: 'تعديل',
            icon: <Edit size={16} />,
            variant: 'warning',
            onClick: (row) => {
                router.push(`/students/${row.id}/edit`);
            },
        },
        {
            label: 'حذف',
            icon: <Trash size={16} />,
            variant: 'danger',
            onClick: (row) => {
                console.log('🗑️ Delete student:', row.id);
            },
        },
    ];

    return (
        <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
            <Table
                columns={columns}
                data={students}
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