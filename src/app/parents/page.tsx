// app/dashboard/parents/page.tsx

'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { parentService, Parent } from '@/services/api/parents/parentService';
import {
    Plus,
    Loader2,
    Check,
    Copy
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import ParentCard from '@/components/parent/ParentCard';
import CreateParentDialog from '@/components/parent/CreateParentDialog';
import EditParentDialog from '@/components/parent/EditParentDialog';

interface Child {
    id: number;
    student_name: string;
    class_name: string;
}

// ====== الحصول على التوكن ======
const getToken = () => {
    return localStorage.getItem('token') || '';
};

export default function ParentsPage() {
    const router = useRouter();

    // ====== الحالات العامة ======
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [parents, setParents] = useState<Parent[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedParentId, setExpandedParentId] = useState<number | null>(null);
    const [childrenData, setChildrenData] = useState<Record<number, Child[]>>({});
    const [childrenLoading, setChildrenLoading] = useState<Record<number, boolean>>({});
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const token = getToken();

    // ====== جلب أولياء الأمور ======
    const fetchParents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await parentService.getAll(token);
            if (response.data) {
                setParents(response.data);
            }
        } catch (error: any) {
            console.error('Error fetching parents:', error);
            toast.error(error.message || 'حدث خطأ أثناء جلب البيانات');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchParents();
    }, [fetchParents]);

    // ====== توسيع الصف لجلب الأبناء ======
    const toggleExpand = async (parentId: number) => {
        if (expandedParentId === parentId) {
            setExpandedParentId(null);
            return;
        }

        setExpandedParentId(parentId);
        setChildrenLoading(prev => ({ ...prev, [parentId]: true }));

        try {
            const response = await parentService.getChildren(parentId, token);
            let fetchedChildren: Child[] = [];

            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    fetchedChildren = response.data;
                } else if (typeof response.data === 'object') {
                    if (Array.isArray(response.data.children)) {
                        fetchedChildren = response.data.children;
                    } else if (Array.isArray(response.data.students)) {
                        fetchedChildren = response.data.students;
                    } else if (response.data.id) {
                        fetchedChildren = [response.data];
                    }
                }
            }

            const normalizedChildren = fetchedChildren.map((child: any) => ({
                id: child.id,
                student_name: child.student_name || child.name || child.full_name || 'طالب',
                class_name: child.class_name || child.grade || child.classroom || child.section || 'بدون صف'
            }));

            setChildrenData(prev => ({ ...prev, [parentId]: normalizedChildren }));

            if (normalizedChildren.length === 0) {
                console.warn(`لا يوجد أبناء مرسلين من السيرفر لولي الأمر رقم ${parentId}. تأكد من الـ API.`);
            }

        } catch (error: any) {
            console.error('Error fetching children:', error);
            setChildrenData(prev => ({ ...prev, [parentId]: [] }));
        } finally {
            setChildrenLoading(prev => ({ ...prev, [parentId]: false }));
        }
    };

    // ====== حذف ولي الأمر ======
    const handleDelete = async (parent: Parent) => {
        if (!confirm(`هل أنت متأكد من حذف ولي الأمر "${parent.full_name_father}"؟`)) return;

        try {
            await parentService.delete(parent.id, token);
            toast.success('تم الحذف بنجاح');
            fetchParents();
        } catch (error: any) {
            console.error('Error deleting parent:', error);
            toast.error(error.message || 'حدث خطأ أثناء الحذف');
        }
    };

    // ====== دالة النسخ العامة ======
    const handleCopy = (e: React.MouseEvent, parentId: number, field: string, text: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(`${parentId}-${field}`);
            toast.success('تم النسخ بنجاح!');
            setTimeout(() => setCopiedField(null), 2000);
        }).catch(() => {
            toast.error('تعذر النسخ');
        });
    };

    // ====== دالة عرض أيقونة النسخ ======
    const renderCopyIcon = (parentId: number, field: string, size: number, color: string, value: string) => {
        if (copiedField === `${parentId}-${field}`) {
            return <Check size={size} className="text-green-600" />;
        }
        return (
            <Copy
                size={size}
                className={`${color} cursor-pointer hover:opacity-70`}
                onClick={(e) => handleCopy(e, parentId, field, value)}
            />
        );
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] p-6" dir="rtl">
            {/* الهيدر العلوي */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">أولياء الأمور</h1>

                <Button
                    variant="primary"
                    onClick={() => setIsDialogOpen(true)}
                    leftIcon={<Plus size={16} />}
                    size="md"
                    className="px-5 py-2.5"
                >
                    إضافة ولي أمر
                </Button>
            </div>

            {/* الجدول */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#f8f9fa] text-gray-600 font-bold border-b border-gray-200 text-xs">
                                <th className="px-3 py-3">الأب</th>
                                <th className="px-3 py-3">هاتف الأب</th>
                                <th className="px-3 py-3">مهنة الأب</th>
                                <th className="px-3 py-3">الأم</th>
                                <th className="px-3 py-3">هاتف الأم</th>
                                <th className="px-3 py-3">مهنة الأم</th>
                                <th className="px-3 py-3">البريد الإلكتروني</th>
                                <th className="px-3 py-3">اسم المستخدم</th>
                                <th className="px-3 py-3">تاريخ التسجيل</th>
                                <th className="px-3 py-3">الملاحظات</th>
                                <th className="px-3 py-3">خيارات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-10">
                                        <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
                                    </td>
                                </tr>
                            ) : parents.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-10 text-gray-500">
                                        لا يوجد أولياء أمور
                                    </td>
                                </tr>
                            ) : (
                                parents.map((parent) => {
                                    const isExpanded = expandedParentId === parent.id;
                                    const children = childrenData[parent.id] || [];
                                    const isChildrenLoading = childrenLoading[parent.id];

                                    return (
                                        <ParentCard
                                            key={parent.id}
                                            parent={parent}
                                            isExpanded={isExpanded}
                                            children={children}
                                            childrenLoading={isChildrenLoading}
                                            onToggle={() => toggleExpand(parent.id)}
                                            onDelete={() => handleDelete(parent)}
                                            onEdit={() => {
                                                setSelectedParent(parent);
                                                setIsEditDialogOpen(true);
                                            }}
                                            renderCopyIcon={renderCopyIcon}
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ====== استدعاء المكون الجديد للديالوغ ====== */}
            <CreateParentDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchParents} // عند الإضافة، يعيد تحميل الجدول
                token={token}
            />
            <EditParentDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSuccess={fetchParents}
                token={token}
                parent={selectedParent}
            />
        </div>
    );
}