'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash, ArrowRight, User, Calendar, Home, FileText, Users } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { Empty } from '@/components/shared/empty/empty';
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

    const { students, loading: studentsLoading, refreshStudents } = useStudents({
        sectionId: sectionId || undefined,
    });

    useEffect(() => {
        if (sectionId) {
            refreshStudents();
        }
    }, [sectionId]);

    if (!sectionId) {
        return (
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                <Empty
                    title="اختر شعبة أولاً"
                    description="قم باختيار شعبة من تبويب الشعب لعرض الطلاب"
                    buttonText="العودة إلى الشعب"
                    onButtonClick={onBack}
                    icon={<ArrowRight size={32} />}
                    buttonIcon={<ArrowRight size={16} />}
                />
            </div>
        );
    }

    
    if (studentsLoading) {
        return (
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    
    if (students.length === 0) {
        return (
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0]">
                <Empty
                    title="لا طالب في هذه الشعبة"
                    description="قم بإضافة طالب لهذه الشعبة الآن"
                    buttonText="إضافة طالب"
                    onButtonClick={() => router.push(`/classes/${classId}/sections/${sectionId}/students/create`)}
                    icon={<Users size={32} />}
                />
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
            header: 'الطالب/ة',
            align: 'center',
            width: 150,
            render: (row) => (
                <div className="flex items-center gap-2 justify-center">
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
            width: 160,
            render: (row) => (
                <div className="flex flex-col items-center text-sm">
                    <span>أب: {row.father_name || '-'}</span>
                    <span className="text-sm text-gray-500">أم: {row.mother_name || '-'}</span>
                </div>
            )
        },
        { key: 'birth_date', header: 'تاريخ الميلاد', align: 'center', width: 110 },
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