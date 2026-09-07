// components/student/student edit form/StudentEditForm.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Save } from 'lucide-react';
import { Input } from '@/components/shared/input/inpute';
import { Textarea } from '@/components/shared/input/Textarea';
import { Button } from '@/components/shared/button/button';
import { useClasses } from '@/hooks/useClasses';
import { useSections } from '@/hooks/useSections';
import { useParents } from '@/hooks/useParents';
import { updateStudent } from '@/services/api/students/updateStudent';

interface StudentEditFormProps {
    student: any;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export const StudentEditForm = ({
    student,
    onSuccess,
    onCancel,
}: StudentEditFormProps) => {
    const [formData, setFormData] = useState({
        full_name: '',
        birth_date: '',
        gender: 'ذكر' as 'ذكر' | 'أنثى',
        residential_address: '',
        class_id: 0,
        section_id: 0,
        parent_id: 0,
        comment: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { classes, loading: classesLoading } = useClasses();
    const { sections, loading: sectionsLoading, refreshSections } = useSections({});
    const { parents, loading: parentsLoading } = useParents();

    const filteredSections = useMemo(() => {
        if (!formData.class_id) return [];
        return sections.filter(section => section.class_id === formData.class_id);
    }, [sections, formData.class_id]);

    
    useEffect(() => {
        if (student) {
            console.log('📝 [StudentEditForm] Student data received:', student);

            
            let classId = 0;
            let sectionId = 0;
            let parentId = 0;

            // من student.class.id
            if (student.class?.id) {
                classId = student.class.id;
            }
            // من student.class_id
            else if (student.class_id) {
                classId = student.class_id;
            }

            if (student.section?.id) {
                sectionId = student.section.id;
            } else if (student.section_id) {
                sectionId = student.section_id;
            }

            if (student.parent?.id) {
                parentId = student.parent.id;
            } else if (student.parent_id) {
                parentId = student.parent_id;
            }

            console.log('📝 [StudentEditForm] Extracted IDs:', { classId, sectionId, parentId });

            setFormData({
                full_name: student.full_name || student.user?.full_name || '',
                birth_date: student.birth_date || '',
                gender: student.gender || 'ذكر',
                residential_address: student.residential_address || '',
                class_id: classId,
                section_id: sectionId,
                parent_id: parentId,
                comment: student.comment || '',
            });

            if (classId > 0) {
                refreshSections();
            }
        }
    }, [student]);

    useEffect(() => {
        refreshSections();
    }, []);

    useEffect(() => {
        if (formData.class_id) {
            refreshSections();
        }
    }, [formData.class_id]);

    const arrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem('token') || '';
            
            const requiredFields = [
                { field: 'full_name', label: 'اسم الطالب' },
                { field: 'class_id', label: 'الصف' },
                { field: 'section_id', label: 'الشعبة' },
                { field: 'parent_id', label: 'ولي الأمر' },
                { field: 'birth_date', label: 'تاريخ الميلاد' },
                { field: 'residential_address', label: 'عنوان السكن' },
            ];

            const newErrors: Record<string, string> = {};
            for (const { field, label } of requiredFields) {
                if (!formData[field as keyof typeof formData]) {
                    newErrors[field] = `${label} مطلوب`;
                }
            }

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setLoading(false);
                return;
            }

            await updateStudent(student.id, formData, token);
            
            onSuccess?.();
        } catch (err: any) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setErrors({ general: err.message || 'حدث خطأ أثناء حفظ البيانات' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <Input
                        label="اسم الطالب الكامل"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="محمد حسن"
                        error={errors.full_name}
                        inputClassName="h-[40px] rounded-[12px] text-right border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                        style={{ direction: 'rtl' }}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        الجنس <span className="text-red-500">(مطلوب)</span>
                    </label>
                    <div className="flex gap-3 p-1 bg-white rounded-[12px] border border-[#ACACAC]">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: 'ذكر' })}
                            className={`flex-1 h-[34px] rounded-[10px] transition-all text-sm font-medium ${
                                formData.gender === 'ذكر'
                                    ? 'bg-[#007353] text-white shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            ذكر
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: 'أنثى' })}
                            className={`flex-1 h-[34px] rounded-[10px] transition-all text-sm font-medium ${
                                formData.gender === 'أنثى'
                                    ? 'bg-[#007353] text-white shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            أنثى
                        </button>
                    </div>
                    {errors.gender && (
                        <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        الصف <span className="text-red-500">(مطلوب)</span>
                    </label>
                    <select
                        value={formData.class_id}
                        onChange={(e) => {
                            const classId = Number(e.target.value);
                            setFormData({ ...formData, class_id: classId, section_id: 0 });
                            refreshSections();
                        }}
                        className="w-full h-[40px] px-3 border border-[#ACACAC] rounded-[12px] focus:border-[#007353] focus:ring-0 bg-white text-sm outline-none transition-all appearance-none"
                        style={{
                            backgroundImage: arrowSvg,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'left 12px center',
                            backgroundSize: '14px',
                            paddingRight: '12px',
                            paddingLeft: '32px',
                        }}
                        disabled={classesLoading}
                    >
                        <option value={0}>اختر الصف</option>
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {errors.class_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.class_id}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        الشعبة <span className="text-red-500">(مطلوب)</span>
                    </label>
                    <select
                        value={formData.section_id}
                        onChange={(e) => setFormData({ ...formData, section_id: Number(e.target.value) })}
                        className="w-full h-[40px] px-3 border border-[#ACACAC] rounded-[12px] focus:border-[#007353] focus:ring-0 bg-white text-sm outline-none transition-all appearance-none"
                        style={{
                            backgroundImage: arrowSvg,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'left 12px center',
                            backgroundSize: '14px',
                            paddingRight: '12px',
                            paddingLeft: '32px',
                        }}
                        disabled={!formData.class_id || sectionsLoading}
                    >
                        <option value={0}>اختر الشعبة</option>
                        {filteredSections.length > 0 ? (
                            filteredSections.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))
                        ) : (
                            <option value="" disabled>
                                {sectionsLoading ? 'جاري التحميل...' : 'لا توجد شعب لهذا الصف'}
                            </option>
                        )}
                    </select>
                    {errors.section_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.section_id}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ولي الأمر <span className="text-red-500">(مطلوب)</span>
                    </label>
                    <select
                        value={formData.parent_id}
                        onChange={(e) => setFormData({ ...formData, parent_id: Number(e.target.value) })}
                        className="w-full h-[40px] px-3 border border-[#ACACAC] rounded-[12px] focus:border-[#007353] focus:ring-0 bg-white text-sm outline-none transition-all appearance-none"
                        style={{
                            backgroundImage: arrowSvg,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'left 12px center',
                            backgroundSize: '14px',
                            paddingRight: '12px',
                            paddingLeft: '32px',
                        }}
                        disabled={parentsLoading}
                    >
                        <option value={0}>اختر ولي الأمر</option>
                        {parents.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.full_name_father && p.full_name_mother 
                                    ? `${p.full_name_father}، ${p.full_name_mother}`
                                    : p.full_name_father || p.full_name_mother || `ولي أمر #${p.id}`
                                }
                            </option>
                        ))}
                    </select>
                    {errors.parent_id && (
                        <p className="text-red-500 text-xs mt-1">{errors.parent_id}</p>
                    )}
                </div>
                <div>
                    <Input
                        label="تاريخ الميلاد"
                        type="date"
                        required
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                        error={errors.birth_date}
                        inputClassName="h-[40px] rounded-[12px] border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    />
                </div>
            </div>

            <div>
                <Input
                    label="عنوان السكن"
                    required
                    value={formData.residential_address}
                    onChange={(e) => setFormData({ ...formData, residential_address: e.target.value })}
                    placeholder="المدخلات"
                    error={errors.residential_address}
                    inputClassName="h-[40px] rounded-[12px] text-right border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    style={{ direction: 'rtl' }}
                />
            </div>

            <div>
                <Textarea
                    label="الملاحظات"
                    value={formData.comment || ''}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={2}
                    placeholder="أي ملاحظات إضافية..."
                    className="rounded-[12px] text-right resize-none border-[#ACACAC] focus:border-[#007353] focus:ring-0"
                    containerClassName="w-full"
                    style={{ direction: 'rtl' }}
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    variant="ghost-outline"
                    onClick={onCancel}
                    size="md"
                    className="h-[40px] rounded-[12px]"
                    minWidth="80px"
                >
                    إلغاء
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    isLoading={loading}
                    size="md"
                    className="h-[40px] rounded-[12px]"
                    minWidth="160px"
                    leftIcon={<Save size={18} />}
                >
                    {loading ? 'جاري الحفظ...' : 'تحديث البيانات'}
                </Button>
            </div>

            {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[12px]">
                    ⚠️ {errors.general}
                </div>
            )}
        </form>
    );
};