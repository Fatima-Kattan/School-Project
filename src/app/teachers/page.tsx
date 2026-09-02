// app/dashboard/teachers/page.tsx

'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { teacherService, Teacher, TeacherClass, TeacherSubject } from '@/services/api/teachers/teacherService';
import {
    Plus,
    Loader2,
    Check,
    Copy,
    Trash2,
    AlertTriangle,
    User2,
    Trash
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import TeacherCard from '@/components/teacher/TeacherCard';
import CreateTeacherDialog from '@/components/teacher/CreateTeacherDialog';
import EditTeacherDialog from '@/components/teacher/EditTeacherDialog ';

// ====== Get token ======
const getToken = () => {
    return localStorage.getItem('token') || '';
};

export default function TeachersPage() {
    const router = useRouter();

    // ====== General states ======
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    // Expand states
    const [expandedTeacherId, setExpandedTeacherId] = useState<number | null>(null);
    const [teacherClasses, setTeacherClasses] = useState<Record<number, TeacherClass[]>>({});
    const [teacherSubjects, setTeacherSubjects] = useState<Record<number, TeacherSubject[]>>({});
    const [loadingDetails, setLoadingDetails] = useState<Record<number, boolean>>({});
    
    // Confirmation Dialog states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const token = getToken();

    // ====== Fetch teachers ======
    const fetchTeachers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await teacherService.getAll(token);
            if (response.data) {
                setTeachers(response.data);
            }
        } catch (error: any) {
            console.error('Error fetching teachers:', error);
            toast.error(error.message || 'حدث خطأ أثناء جلب البيانات');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    // ====== Toggle expand to fetch classes and subjects ======
    const toggleExpand = async (teacherId: number) => {
        if (expandedTeacherId === teacherId) {
            setExpandedTeacherId(null);
            return;
        }

        setExpandedTeacherId(teacherId);
        setLoadingDetails(prev => ({ ...prev, [teacherId]: true }));

        try {
            // Fetch classes and subjects in parallel
            const [classesResponse, subjectsResponse] = await Promise.all([
                teacherService.getClasses(teacherId, token),
                teacherService.getSubjects(teacherId, token)
            ]);

            if (classesResponse.data) {
                setTeacherClasses(prev => ({ ...prev, [teacherId]: classesResponse.data }));
            }

            if (subjectsResponse.data) {
                setTeacherSubjects(prev => ({ ...prev, [teacherId]: subjectsResponse.data }));
            }

        } catch (error: any) {
            console.error('Error fetching teacher details:', error);
            toast.error('حدث خطأ أثناء جلب تفاصيل المدرس');
        } finally {
            setLoadingDetails(prev => ({ ...prev, [teacherId]: false }));
        }
    };

    // ====== Open delete confirmation dialog ======
    const handleDeleteClick = (teacher: Teacher) => {
        setTeacherToDelete(teacher);
        setIsDeleteDialogOpen(true);
    };

    // ====== Execute delete ======
    const handleConfirmDelete = async () => {
        if (!teacherToDelete) return;

        setIsDeleting(true);
        try {
            await teacherService.delete(teacherToDelete.id, token);
            toast.success(`Teacher "${teacherToDelete.full_name}" deleted successfully`);
            setIsDeleteDialogOpen(false);
            setTeacherToDelete(null);
            fetchTeachers();
        } catch (error: any) {
            console.error('Error deleting teacher:', error);
            toast.error(error.message || 'حدث خطأ أثناء الحذف');
        } finally {
            setIsDeleting(false);
        }
    };

    // ====== General copy function ======
    const handleCopy = (e: React.MouseEvent, teacherId: number, field: string, text: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedField(`${teacherId}-${field}`);
            toast.success('تم النسخ بنجاح!');
            setTimeout(() => setCopiedField(null), 2000);
        }).catch(() => {
            toast.error('تعذر النسخ');
        });
    };

    // ====== Render copy icon ======
    const renderCopyIcon = (teacherId: number, field: string, size: number, color: string, value: string) => {
        if (copiedField === `${teacherId}-${field}`) {
            return <Check size={size} className="text-green-600" />;
        }
        return (
            <Copy
                size={size}
                className={`${color} cursor-pointer hover:opacity-70`}
                onClick={(e) => handleCopy(e, teacherId, field, value)}
            />
        );
    };

    return (
        <div className="min-h-screen bg-[#f4f6f9] p-6" dir="rtl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">المدرسين</h1>

                <Button
                    variant="primary"
                    onClick={() => setIsDialogOpen(true)}
                    leftIcon={<Plus size={16} />}
                    size="md"
                    className="px-5 py-2.5"
                >
                    إضافة مدرس
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-sm">
                        <thead>
                            <tr className="bg-[#f8f9fa] text-gray-600 font-bold border-b border-gray-200 text-xs">
                                <th className="px-3 py-3 text-right">اسم الأستاذ</th>
                                <th className="px-3 py-3 text-right">الجنس</th>
                                <th className="px-3 py-3 text-right">البريد الإلكتروني</th>
                                <th className="px-3 py-3 text-right">اسم المستخدم</th>
                                <th className="px-3 py-3 text-right">رقم الهاتف</th>
                                <th className="px-3 py-3 text-right">تاريخ التسجيل</th>
                                <th className="px-3 py-3 text-right">ملاحظات</th>
                                <th className="px-3 py-3 text-right">خيارات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-10">
                                        <Loader2 className="animate-spin mx-auto text-gray-400" size={32} />
                                    </td>
                                </tr>
                            ) : teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-10 text-gray-500">
                                        لا يوجد مدرسين
                                    </td>
                                </tr>
                            ) : (
                                teachers.map((teacher) => {
                                    const isExpanded = expandedTeacherId === teacher.id;
                                    const classes = teacherClasses[teacher.id] || [];
                                    const subjects = teacherSubjects[teacher.id] || [];
                                    const isLoadingDetails = loadingDetails[teacher.id] || false;

                                    return (
                                        <TeacherCard
                                            key={teacher.id}
                                            teacher={teacher}
                                            onDelete={() => handleDeleteClick(teacher)}
                                            onEdit={() => {
                                                setSelectedTeacher(teacher);
                                                setIsEditDialogOpen(true);
                                            }}
                                            renderCopyIcon={renderCopyIcon}
                                            isExpanded={isExpanded}
                                            onToggle={() => toggleExpand(teacher.id)}
                                            teacherClasses={classes}
                                            teacherSubjects={subjects}
                                            loadingDetails={isLoadingDetails}
                                        />
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Components */}
            <CreateTeacherDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchTeachers}
                token={token}
            />
            <EditTeacherDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                onSuccess={fetchTeachers}
                token={token}
                teacher={selectedTeacher}
            />
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setTeacherToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="حذف مدرس"
                description={
                    <div className="py-3">
                        <p className="text-gray-800 text-base mb-3">
                            هل أنت متأكد من حذف المدرس:
                        </p>
                        <p className="text-red-600 font-bold text-base mb-4">
                            {teacherToDelete?.full_name}
                        </p>
                        <p className="text-amber-700 text-sm font-medium">
                            سيؤدي ذلك إلى حذف حساب المستخدم المرتبط به أيضاً.
                        </p>
                    </div>
                }
                confirmText="تأكيد الحذف"
                cancelText="إلغاء"
                confirmVariant="danger"
                isLoading={isDeleting}
                leftIcon={<Trash size={16} />}
                maxWidth="md"
                closeOnOverlayClick={false}
            />
        </div>
    );
}