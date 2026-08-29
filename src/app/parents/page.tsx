// src/app/dashboard/parents/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParents } from '@/hooks/useParents';
import { getParentColumns, getParentTableActions } from './columns';
import { Table } from '@/components/shared/table/table';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Plus, Search, Users } from 'lucide-react';
import { Parent } from '@/services/api/parents/parentService';

export default function ParentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        parents,
        loading,
        error,
        refreshParents,
        searchParents,
        deleteParent,
        createParent,
        updateParent,
    } = useParents();

    // تحميل البيانات عند أول تحميل
    useEffect(() => {
        refreshParents();
    }, []);

    // معالج البحث
    const handleSearch = async () => {
        if (searchTerm.trim()) {
            await searchParents(searchTerm);
        } else {
            await refreshParents();
        }
    };

    // معالج إضافة ولي أمر
    const handleAddParent = async (data: any) => {
        setIsLoading(true);
        try {
            await createParent(data);
            setIsAddModalOpen(false);
            await refreshParents();
        } catch (error) {
            console.error('Error adding parent:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // معالج تعديل ولي أمر
    const handleEditParent = async (data: any) => {
        if (!selectedParent) return;
        setIsLoading(true);
        try {
            await updateParent(selectedParent.id, data);
            setIsEditModalOpen(false);
            setSelectedParent(null);
            await refreshParents();
        } catch (error) {
            console.error('Error updating parent:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // معالج حذف ولي أمر
    const handleDeleteParent = async () => {
        if (!selectedParent) return;
        setIsLoading(true);
        try {
            await deleteParent(selectedParent.id);
            setIsDeleteDialogOpen(false);
            setSelectedParent(null);
            await refreshParents();
        } catch (error) {
            console.error('Error deleting parent:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // تعريف أعمدة الجدول مع الأكشنز
    const columns = getParentColumns({
        onView: (parent) => {
            // عرض تفاصيل ولي الأمر
            console.log('View parent:', parent);
        },
        onEdit: (parent) => {
            setSelectedParent(parent);
            setIsEditModalOpen(true);
        },
        onDelete: (parent) => {
            setSelectedParent(parent);
            setIsDeleteDialogOpen(true);
        },
        onViewChildren: (parent) => {
            // عرض أبناء ولي الأمر
            console.log('View children:', parent);
        },
    });

    const actions = getParentTableActions({
        onView: (parent) => {
            console.log('View parent:', parent);
        },
        onEdit: (parent) => {
            setSelectedParent(parent);
            setIsEditModalOpen(true);
        },
        onDelete: (parent) => {
            setSelectedParent(parent);
            setIsDeleteDialogOpen(true);
        },
        onViewChildren: (parent) => {
            console.log('View children:', parent);
        },
    });

    return (
        <div className="p-6" dir="rtl">
            {/* العنوان والأزرار */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">أولياء الأمور</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        إدارة أولياء الأمور وتنظيم بياناتهم
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsAddModalOpen(true)}
                    leftIcon={<Plus size={18} />}
                >
                    إضافة ولي أمر
                </Button>
            </div>

            {/* شريط البحث */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="ابحث عن ولي أمر بالاسم أو رقم الهاتف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007353]/20 focus:border-[#007353] transition-all"
                    />
                    <Search
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                </div>
                <Button
                    variant="primary"
                    onClick={handleSearch}
                    size="sm"
                    className="min-w-[80px]"
                >
                    بحث
                </Button>
                {searchTerm && (
                    <Button
                        variant="ghost-outline"
                        onClick={() => {
                            setSearchTerm('');
                            refreshParents();
                        }}
                        size="sm"
                    >
                        إلغاء
                    </Button>
                )}
            </div>

            {/* الجدول */}
            <Table
                columns={columns}
                data={parents}
                keyExtractor={(row) => row.id}
                actions={actions}
                isLoading={loading}
                emptyTitle="لا يوجد أولياء أمور"
                emptyDescription="قم بإضافة أولياء الأمور وتنظيم البيانات من هنا"
                emptyButtonText="إضافة ولي أمر"
                onEmptyButtonClick={() => setIsAddModalOpen(true)}
                emptyIcon={<Users size={32} className="text-gray-400" />}
                striped
                hoverable
                compact={false}
                headerBgColor="#F9FCFB"
                borderColor="#E0E0E0"
                radius={12}
            />

            {/* إحصائيات سريعة */}
            {!loading && parents.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                    إجمالي أولياء الأمور: <span className="font-bold text-gray-700">{parents.length}</span>
                </div>
            )}

            {/* ديالوغ حذف ولي أمر */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedParent(null);
                }}
                onConfirm={handleDeleteParent}
                title="حذف ولي أمر"
                description={
                    <>
                        هل أنت متأكد من حذف ولي الأمر: <span className="text-red-600 font-bold">{selectedParent?.full_name_father}</span>
                        {selectedParent?.full_name_mother && (
                            <> و <span className="text-red-600 font-bold">{selectedParent?.full_name_mother}</span></>
                        )}
                    </>
                }
                confirmText="تأكيد الحذف"
                cancelText="إلغاء"
                confirmVariant="danger"
                isLoading={isLoading}
            />

            {/* هنا راح نضيف المودالات حق الإضافة والتعديل لاحقاً */}
        </div>
    );
}