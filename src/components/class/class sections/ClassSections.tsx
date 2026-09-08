// src/components/class/class sections/ClassSections.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Edit, Trash2, SquarePen, Trash, X } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { Table, Column, TableAction } from '@/components/shared/table/table';
import { SectionForm } from './SectionForm';
import { Dialog } from '@/components/shared/dialog/dialog';

interface ClassSectionsProps {
    classId: string;
    className?: string;
    sections: Array<{
        id: number;
        name: string;
        comment: string | null;
        teachers_count: number;
    }>;
    onSectionClick?: (sectionId: number) => void;
    onSectionChanged?: () => void;
    onAddSection?: () => void; // ✅ إضافة prop جديد
}

export default function ClassSections({
    classId,
    className,
    sections,
    onSectionClick,
    onSectionChanged,
    onAddSection, // ✅ استقبال الـ prop
}: ClassSectionsProps) {
    const router = useRouter();

    // ✅ حالات الديالوجات
    const [showFormDialog, setShowFormDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedSection, setSelectedSection] = useState<any>(null);
    const [mode, setMode] = useState<'create' | 'edit'>('create');

    // ✅ فتح نافذة إضافة شعبة
    const openAddDialog = () => {
        setMode('create');
        setSelectedSection(null);
        setShowFormDialog(true);
    };

    // ✅ فتح نافذة تعديل شعبة
    const openEditDialog = (section: any) => {
        setMode('edit');
        setSelectedSection(section);
        setShowFormDialog(true);
    };

    // ✅ فتح نافذة حذف شعبة
    const openDeleteDialog = (section: any) => {
        setSelectedSection(section);
        setShowDeleteDialog(true);
    };

    // ✅ إغلاق الديالوجات
    const closeFormDialog = () => {
        setShowFormDialog(false);
        setSelectedSection(null);
    };

    const closeDeleteDialog = () => {
        setShowDeleteDialog(false);
        setSelectedSection(null);
    };

    // ✅ معالج نجاح النموذج (إضافة/تعديل)
    const handleFormSuccess = () => {
        setShowFormDialog(false);
        setSelectedSection(null);
        if (onSectionChanged) {
            onSectionChanged();
        } else {
            window.location.reload();
        }
    };

    // ✅ معالج نجاح الحذف
    const handleDeleteSuccess = () => {
        setShowDeleteDialog(false);
        setSelectedSection(null);
        if (onSectionChanged) {
            onSectionChanged();
        } else {
            window.location.reload();
        }
    };

    // ✅ دالة إضافة شعبة (للزر)
    const handleAddSection = () => {
        if (onAddSection) {
            onAddSection(); // ✅ استدعاء الـ prop من الأب
        } else {
            openAddDialog(); // ✅ الفتح المحلي كاحتياطي
        }
    };

    // ✅ إذا لم توجد شعب → عرض رسالة "لا شعب مضافين بعد"
    if (!sections || sections.length === 0) {
        return (
            <>
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

                <Dialog
                    isOpen={showFormDialog}
                    onClose={closeFormDialog}
                    maxWidth="lg"
                    showCancel={false}
                    showConfirm={false}
                    hideCloseButton={false}
                >
                    <SectionForm
                        mode="create"
                        classId={parseInt(classId)}
                        initialData={null}
                        onSuccess={handleFormSuccess}
                        onCancel={closeFormDialog}
                    />
                </Dialog>
            </>
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
            onClick: (row) => router.push(`/sections/${row.id}`),
        },
        {
            label: 'تعديل',
            icon: <SquarePen size={16} />,
            variant: 'warning',
            onClick: (row) => openEditDialog(row),
        },
        {
            label: 'حذف',
            icon: <Trash size={16} />,
            variant: 'danger',
            onClick: (row) => openDeleteDialog(row),
        },
    ];

    return (
        <>
            <Dialog
                isOpen={showFormDialog}
                onClose={closeFormDialog}
                maxWidth="lg"
                showCancel={false}
                showConfirm={false}
                hideCloseButton={false}
            >
                <SectionForm
                    mode={mode}
                    classId={parseInt(classId)}
                    initialData={mode === 'edit' ? selectedSection : null}
                    onSuccess={handleFormSuccess}
                    onCancel={closeFormDialog}
                />
            </Dialog>

            {/* ✅ الجدول */}
            <div className="bg-white rounded-[15px] p-6 border border-[#E0E0E0] flex-1 min-h-[448px]">
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
        </>
    );
}