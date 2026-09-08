// src/components/class/class subjects/ClassSubjects.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Trash, Square, SquarePen } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import SubjectDeleteForm from './SubjectDeleteForm';

interface ClassSubjectsProps {
    classId: string;
    subjects: Array<{
        id: number;
        name: string;
        comment: string | null;
        full_mark: string;
        semester?: string;
        total_students?: number;
        teachers_count?: number;
    }>;
    onSubjectClick?: (subjectId: number) => void;
    onSubjectChanged?: (type: 'add' | 'edit' | 'delete', data?: any) => void;
    onAddSubject?: () => void;
}

export default function ClassSubjects({
    classId,
    subjects,
    onSubjectClick,
    onSubjectChanged,
    onAddSubject
}: ClassSubjectsProps) {
    const router = useRouter();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);

    const handleAddSubject = () => {
        if (onAddSubject) {
            onAddSubject();
        } else {
            router.push(`/classes/${classId}/subjects/create`);
        }
    };

    const handleEditSubject = (row: any) => {
        if (onSubjectChanged) {
            onSubjectChanged('edit', row);
        } else {
            router.push(`/classes/${classId}/subjects/${row.id}/edit`);
        }
    };

    const handleDeleteSubject = (row: any) => {
        setSelectedSubject(row);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedSubject && onSubjectChanged) {
            onSubjectChanged('delete', selectedSubject.id);
        }
        setShowDeleteDialog(false);
        setSelectedSubject(null);
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setSelectedSubject(null);
    };

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

    const columns: Column<any>[] = [
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

    const actions: TableAction<any>[] = [
        {
            label: 'تعديل',
            icon: <SquarePen size={16} />,
            variant: 'warning',
            onClick: (row) => {
                handleEditSubject(row);
            },
        },
        {
            label: 'حذف',
            icon: <Trash size={16} />,
            variant: 'danger',
            onClick: (row) => {
                handleDeleteSubject(row);
            },
        },
    ];

    return (
        <>
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
                <Table
                    columns={columns}
                    data={subjects}
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

            <SubjectDeleteForm
                isOpen={showDeleteDialog}
                subjectData={selectedSubject}
                onClose={closeDeleteDialog}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}