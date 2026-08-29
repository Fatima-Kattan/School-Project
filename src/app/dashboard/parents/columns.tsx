// src/app/dashboard/parents/columns.tsx

import { Column } from '@/components/shared/table/table';
import { Parent } from '@/services/api/parents/parentService';
import { Eye, Edit, Trash2, Users } from 'lucide-react';

// ✅ دالة تنسيق التاريخ - شغالة 100% بدون مكتبات
const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch {
        return '-';
    }
};

// تعريف الأنواع
interface ParentColumnsProps {
    onView?: (parent: Parent) => void;
    onEdit?: (parent: Parent) => void;
    onDelete?: (parent: Parent) => void;
    onViewChildren?: (parent: Parent) => void;
}

// الأعمدة
export const getParentColumns = ({
    onView,
    onEdit,
    onDelete,
    onViewChildren,
}: ParentColumnsProps): Column<Parent>[] => {
    return [
        {
            key: 'full_name_father',
            header: 'اسم الأب',
            align: 'right',
            minWidth: 120,
            render: (row) => (
                <span className="font-medium text-gray-900">{row.full_name_father}</span>
            ),
        },
        {
            key: 'full_name_mother',
            header: 'اسم الأم',
            align: 'right',
            minWidth: 120,
            render: (row) => (
                <span className="text-gray-700">{row.full_name_mother}</span>
            ),
        },
        {
            key: 'job_father',
            header: 'وظيفة الأب',
            align: 'right',
            minWidth: 100,
            render: (row) => (
                <span className="text-gray-600 text-sm">{row.job_father || '-'}</span>
            ),
        },
        {
            key: 'job_mother',
            header: 'وظيفة الأم',
            align: 'right',
            minWidth: 100,
            render: (row) => (
                <span className="text-gray-600 text-sm">{row.job_mother || '-'}</span>
            ),
        },
        {
            key: 'phone_number_father',
            header: 'هاتف الأب',
            align: 'left',
            minWidth: 110,
            render: (row) => (
                <span className="text-sm text-gray-600">{row.phone_number_father}</span>
            ),
        },
        {
            key: 'phone_number_mother',
            header: 'هاتف الأم',
            align: 'left',
            minWidth: 110,
            render: (row) => (
                <span className="text-sm text-gray-600">{row.phone_number_mother}</span>
            ),
        },
        {
            key: 'email',
            header: 'البريد الإلكتروني',
            align: 'left',
            minWidth: 150,
            render: (row) => (
                <span className="text-sm text-gray-600">{row.email || '-'}</span>
            ),
        },
        {
            key: 'created_at',
            header: 'تاريخ الإضافة',
            align: 'center',
            minWidth: 100,
            render: (row) => (
                <span className="text-sm text-gray-500">
                    {formatDate(row.created_at)}
                </span>
            ),
        },
    ];
};

// أزرار الجدول
interface ParentActionsProps {
    onView?: (parent: Parent) => void;
    onEdit?: (parent: Parent) => void;
    onDelete?: (parent: Parent) => void;
    onViewChildren?: (parent: Parent) => void;
}

export const getParentTableActions = ({
    onView,
    onEdit,
    onDelete,
    onViewChildren,
}: ParentActionsProps) => {
    const actions = [];

    if (onViewChildren) {
        actions.push({
            label: 'عرض الأبناء',
            icon: <Users size={16} />,
            onClick: onViewChildren,
            variant: 'primary' as const,
        });
    }

    if (onView) {
        actions.push({
            label: 'عرض',
            icon: <Eye size={16} />,
            onClick: onView,
            variant: 'primary' as const,
        });
    }

    if (onEdit) {
        actions.push({
            label: 'تعديل',
            icon: <Edit size={16} />,
            onClick: onEdit,
            variant: 'warning' as const,
        });
    }

    if (onDelete) {
        actions.push({
            label: 'حذف',
            icon: <Trash2 size={16} />,
            onClick: onDelete,
            variant: 'danger' as const,
        });
    }

    return actions;
};