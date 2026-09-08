// components/teacher/EditTeacherDialog.tsx

'use client';

import { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { teacherService, Section, Subject } from '@/services/api/teachers/teacherService';
import {
    Save,
    Copy,
    Check,
    ChevronLeft,
    BookOpen,
    Users,
    Loader2,
    ChevronDown,
    X,
    GraduationCap,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Input } from '@/components/shared/input/inpute';

interface EditTeacherDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
    teacherId: number | null;
}

interface ClassWithSections {
    id: number;
    name: string;
    sections: Section[];
}

interface SubjectWithClass extends Subject {
    class_id: number;
}

export default function EditTeacherDialog({
    isOpen,
    onClose,
    onSuccess,
    token,
    teacherId
}: EditTeacherDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingTeacher, setLoadingTeacher] = useState(false);

    // Form states - Step 1
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');
    const [phoneNumber, setPhoneNumber] = useState('963');
    const [comment, setComment] = useState('');

    // Form states - Step 2
    const [classes, setClasses] = useState<ClassWithSections[]>([]);
    const [subjects, setSubjects] = useState<SubjectWithClass[]>([]);
    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

    // ====== جلب بيانات الأستاذ عند فتح الديالوغ ======
    useEffect(() => {
        if (isOpen && token && teacherId) {
            fetchTeacherData();
        }
    }, [isOpen, token, teacherId]);

    // ====== جلب الصفوف والمواد عند الخطوة 2 ======
    useEffect(() => {
        if (isOpen && token && step === 2) {
            fetchClassesAndSubjects();
        }
    }, [isOpen, token, step]);

    // ✅ الدالة المعدلة لجلب بيانات الأستاذ
    const fetchTeacherData = async () => {
        if (!teacherId) return;
        setLoadingTeacher(true);
        try {
            console.log('🔄 Fetching teacher data for ID:', teacherId);

            // ✅ استخدم الدالة الصحيحة من الـ service
            const response = await teacherService.getTeacherForEdit(teacherId, token);
            console.log('✅ Full API Response:', JSON.stringify(response, null, 2));

            // ✅ تحقق من وجود success و data
            if (response.success && response.data) {
                const data = response.data;
                console.log('📋 Data object:', data);
                console.log('📋 Sections from API:', data.sections);
                console.log('📋 Subjects from API:', data.subjects);

                // ✅ تعبئة البيانات الأساسية
                setFullName(data.full_name || data.user_name || '');
                setEmail(data.email || '');
                setGender(data.gender || 'ذكر');
                setPhoneNumber(data.phone_number?.replace('+', '') || '963');
                setComment(data.comment || '');

                // ✅ تعبئة الـ sections - تأكد من أنها مصفوفة أرقام
                if (data.sections && Array.isArray(data.sections)) {
                    // إذا كانت مصفوفة أرقام مباشرة
                    if (data.sections.length > 0 && typeof data.sections[0] === 'number') {
                        setSelectedSections(data.sections);
                    }
                    // إذا كانت مصفوفة كائنات
                    else if (data.sections.length > 0 && typeof data.sections[0] === 'object') {
                        const sectionIds = data.sections.map((s: any) => s.id || s.section_id);
                        setSelectedSections(sectionIds);
                    }
                } else {
                    // إذا كانت البيانات في مكان آخر (مثل teacher.sections)
                    console.warn('⚠️ Sections not found in data.sections, checking teacher.sections...');
                    if (data.teacher && data.teacher.sections) {
                        const sectionIds = data.teacher.sections.map((s: any) => s.id || s.section_id);
                        setSelectedSections(sectionIds);
                    }
                }

                // ✅ تعبئة الـ subjects - تأكد من أنها مصفوفة أرقام
                if (data.subjects && Array.isArray(data.subjects)) {
                    if (data.subjects.length > 0 && typeof data.subjects[0] === 'number') {
                        setSelectedSubjects(data.subjects);
                    } else if (data.subjects.length > 0 && typeof data.subjects[0] === 'object') {
                        const subjectIds = data.subjects.map((s: any) => s.id || s.subject_id);
                        setSelectedSubjects(subjectIds);
                    }
                } else {
                    console.warn('⚠️ Subjects not found in data.subjects, checking teacher.subjects...');
                    if (data.teacher && data.teacher.subjects) {
                        const subjectIds = data.teacher.subjects.map((s: any) => s.id || s.subject_id);
                        setSelectedSubjects(subjectIds);
                    }
                }

                console.log('✅ Final selected sections:', selectedSections);
                console.log('✅ Final selected subjects:', selectedSubjects);
            } else {
                console.error('❌ Invalid response structure:', response);
                toast.error('خطأ في بنية البيانات المستلمة');
            }
        } catch (error: any) {
            console.error('❌ Error fetching teacher:', error);
            toast.error(error.message || 'حدث خطأ أثناء جلب بيانات المدرس');
        } finally {
            setLoadingTeacher(false);
        }
    };

    const fetchClassesAndSubjects = async () => {
        setLoading(true);
        try {
            const data = await teacherService.getSectionsAndSubjects(token);
            console.log('📚 Classes and Subjects data:', data);

            let formattedClasses: ClassWithSections[] = [];

            if (data.classes && data.classes.length > 0) {
                formattedClasses = data.classes.map((cls: any) => ({
                    id: cls.id,
                    name: cls.name || `الصف ${cls.id}`,
                    sections: cls.sections || []
                }));
            }

            setClasses(formattedClasses);

            // ✅ تأكد من أن subjects فيها class_id
            const subjectsWithClass = (data.subjects || []).map((subject: any) => ({
                ...subject,
                class_id: subject.class_id || subject.class?.id || null
            }));
            setSubjects(subjectsWithClass);

            // ✅ اختيار أول صف بشكل افتراضي
            if (formattedClasses.length > 0) {
                setSelectedClassId(formattedClasses[0].id);
            }

            if (formattedClasses.length === 0) {
                toast.error('لا يوجد صفوف في النظام، يرجى إضافة صفوف أولاً');
            }
            if (data.subjects?.length === 0) {
                toast.error('لا يوجد مواد في النظام، يرجى إضافة مواد أولاً');
            }

        } catch (error: any) {
            console.error('❌ Error fetching data:', error);
            toast.error(error.message || 'حدث خطأ أثناء جلب البيانات');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setGender('ذكر');
        setPhoneNumber('963');
        setComment('');
        setSelectedSections([]);
        setSelectedSubjects([]);
        setSelectedClassId(null);
        setStep(1);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleUpdateTeacher = async () => {
        if (!fullName || !fullName.trim()) {
            toast.error('يرجى إدخال الاسم الكامل');
            return;
        }
        if (!email || !email.trim()) {
            toast.error('يرجى إدخال البريد الإلكتروني');
            return;
        }
        if (!phoneNumber || phoneNumber === '963') {
            toast.error('يرجى إدخال رقم الهاتف');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        if (selectedSections.length === 0) {
            toast.error('يرجى اختيار شعبة واحدة على الأقل');
            return;
        }
        if (selectedSubjects.length === 0) {
            toast.error('يرجى اختيار مادة واحدة على الأقل');
            return;
        }

        setIsSubmitting(true);
        try {
            const allData = {
                full_name: fullName.trim(),
                email: email.trim(),
                gender: gender,
                phone_number: `+${phoneNumber}`,
                comment: comment || '',
                sections: selectedSections,
                subjects: selectedSubjects,
            };

            console.log('📤 Updating teacher with data:', allData);

            const response = await teacherService.update(teacherId!, allData, token);
            console.log('✅ Teacher updated:', response);

            if (response.success) {
                toast.success('تم تحديث بيانات المدرس بنجاح!');
                onSuccess();
                handleClose();
            } else {
                throw new Error(response.message || 'حدث خطأ أثناء تحديث المدرس');
            }
        } catch (error: any) {
            console.error('❌ Error:', error);
            if (error.message.includes('email')) {
                toast.error('البريد الإلكتروني مستخدم مسبقاً');
            } else if (error.message.includes('phone')) {
                toast.error('رقم الهاتف مستخدم مسبقاً');
            } else {
                toast.error(error.message || 'حدث خطأ أثناء تحديث المدرس');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSection = (sectionId: number) => {
        setSelectedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const toggleSubject = (subjectId: number) => {
        setSelectedSubjects(prev =>
            prev.includes(subjectId)
                ? prev.filter(id => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    const handleNext = () => {
        if (!fullName || !fullName.trim()) {
            toast.error('يرجى إدخال الاسم الكامل');
            return;
        }
        if (!email || !email.trim()) {
            toast.error('يرجى إدخال البريد الإلكتروني');
            return;
        }
        if (!phoneNumber || phoneNumber === '963') {
            toast.error('يرجى إدخال رقم الهاتف');
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const getSectionsForSelectedClass = () => {
        const selectedClass = classes.find(c => c.id === selectedClassId);
        return selectedClass ? selectedClass.sections : [];
    };

    const getSubjectsForSelectedClass = () => {
        if (!selectedClassId) return [];
        return subjects.filter(subject => subject.class_id === selectedClassId);
    };

    if (loadingTeacher) {
        return (
            <Dialog
                isOpen={isOpen}
                onClose={handleClose}
                title="تعديل أستاذ"
                maxWidth="2xl"
                showCancel={false}
                showConfirm={false}
            >
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin text-[#2e7d32]" size={40} />
                </div>
            </Dialog>
        );
    }

    return (
        <Dialog
            className='h-fit overflow-y-auto max-h-[90vh]'
            isOpen={isOpen}
            onClose={handleClose}
            title="تعديل أستاذ"
            maxWidth="2xl"
            showCancel={false}
            showConfirm={false}
        >
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${step === 1 ? 'text-[#007353]' : 'text-gray-400'}`}>
                        المعلومات الشخصية
                    </span>
                    <span className="text-gray-300">|</span>
                    <span className={`text-sm font-medium ${step === 2 ? 'text-[#007353]' : 'text-gray-400'}`}>
                        الصفوف والمواد
                    </span>
                </div>
            </div>

            {step === 1 ? (
                /* Step 1: Main Data */
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                            className='h-[38px]'
                            label="الاسم الكامل"
                            required
                            placeholder="مثال: أحمد محمد"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                الجنس <span className="text-red-500">(مطلوب)</span>
                            </label>
                            <div className="flex gap-3 p-1 bg-white rounded-[12px] border border-[#ACACAC]">
                                <button
                                    type="button"
                                    onClick={() => setGender('ذكر')}
                                    className={`flex-1 h-[36px] rounded-[10px] transition-all text-sm font-medium ${gender === 'ذكر'
                                            ? 'bg-[#007353] text-white shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    ذكر
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender('أنثى')}
                                    className={`flex-1 h-[36px] rounded-[10px] transition-all text-sm font-medium ${gender === 'أنثى'
                                            ? 'bg-[#007353] text-white shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    أنثى
                                </button>
                            </div>
                        </div>

                        <Input
                            className='h-[38px]'
                            label="البريد الإلكتروني"
                            required
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div>
                            <label className="block text-sm font-medium text-[#000f0b] mb-1.5 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                                رقم الهاتف
                            </label>
                            <PhoneInput
                                country={'sy'}
                                value={phoneNumber}
                                onChange={(phone) => setPhoneNumber(phone)}
                                inputStyle={{
                                    width: '100%', height: '38px', borderRadius: '8px', border: '1px solid #ACACAC',
                                    fontSize: '14px', fontFamily: 'Cairo, sans-serif', backgroundColor: '#fff',
                                    paddingLeft: '47px', color: '#000f0b', transition: 'all 0.2s', outline: 'none'
                                }}
                                buttonStyle={{
                                    border: 'none', background: 'transparent', borderLeft: '1px solid #e5e7eb',
                                    borderRadius: '0', height: '36px', padding: '0 10px', top: '1px', left: '1px'
                                }}
                                containerStyle={{ direction: 'ltr', width: '100%' }}
                                dropdownStyle={{ textAlign: 'right', fontFamily: 'Cairo, sans-serif' }}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Input
                                label="ملاحظات"
                                inputClassName="h-20 resize-none"
                                placeholder="أي ملاحظات إضافية..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost-outline"
                                size="sm"
                                className="px-4 py-1.5"
                                onClick={handleClose}
                            >
                                إلغاء
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                className="px-4 py-1.5"
                                rightIcon={<ChevronLeft size={16} />}
                                onClick={handleNext}
                            >
                                الخطوة التالية
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                /* Step 2: Classes & Subjects */
                <>
                    {!loading ? (
                        <div className="space-y-5">
                            {/* Dropdown للصفوف */}
                            <div>
                                <label className="block text-sm font-medium text-[#000f0b] mb-2">
                                    <GraduationCap size={16} className="inline ml-1 text-[#2e7d32]" />
                                    اختر الصف <span className="text-red-500">(مطلوب)</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedClassId || ''}
                                        onChange={(e) => {
                                            setSelectedClassId(Number(e.target.value));
                                        }}
                                        className="w-full h-[44px] px-4 pr-10 rounded-xl border border-[#ACACAC] bg-white text-sm text-[#000f0b] appearance-none focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                    >
                                        <option value="" disabled>اختر الصف</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* الشعب */}
                            <div>
                                <h3 className="text-sm font-medium text-[#000f0b] mb-3">
                                    <Users size={16} className="inline ml-1 text-[#2e7d32]" />
                                    اختر الشعب <span className="text-red-500">(مطلوب)</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {getSectionsForSelectedClass().length === 0 ? (
                                        <p className="text-gray-500 text-sm">لا يوجد شعب لهذا الصف</p>
                                    ) : (
                                        getSectionsForSelectedClass().map((section) => (
                                            <label
                                                key={section.id}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${selectedSections.includes(section.id)
                                                        ? 'border-[#2e7d32] bg-[#e8f5e9] shadow-sm'
                                                        : 'border-gray-200 bg-white hover:border-[#2e7d32] hover:bg-gray-50'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSections.includes(section.id)}
                                                    onChange={() => toggleSection(section.id)}
                                                    className="w-4 h-4 accent-[#2e7d32]"
                                                />
                                                <span className="text-sm text-gray-700">{section.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* المواد */}
                            <div>
                                <h3 className="text-sm font-medium text-[#000f0b] mb-3">
                                    <BookOpen size={16} className="inline ml-1 text-[#2e7d32]" />
                                    اختر المواد <span className="text-red-500">(مطلوب)</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {getSubjectsForSelectedClass().length === 0 ? (
                                        <p className="text-gray-500 text-sm">لا يوجد مواد لهذا الصف</p>
                                    ) : (
                                        getSubjectsForSelectedClass().map((subject) => (
                                            <label
                                                key={subject.id}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${selectedSubjects.includes(subject.id)
                                                        ? 'border-[#2e7d32] bg-[#e8f5e9] shadow-sm'
                                                        : 'border-gray-200 bg-white hover:border-[#2e7d32] hover:bg-gray-50'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubjects.includes(subject.id)}
                                                    onChange={() => toggleSubject(subject.id)}
                                                    className="w-4 h-4 accent-[#2e7d32]"
                                                />
                                                <span className="text-sm text-gray-700">{subject.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="animate-spin text-[#2e7d32]" size={40} />
                        </div>
                    )}

                    {/* الأزرار في الأسفل */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost-outline"
                                size="sm"
                                className="px-4 py-1.5"
                                onClick={handleBack}
                                disabled={isSubmitting}
                            >
                                رجوع
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                className="px-4 py-1.5"
                                leftIcon={<Save size={16} />}
                                onClick={handleUpdateTeacher}
                                isLoading={isSubmitting}
                                disabled={loading || isSubmitting}
                            >
                                تحديث بيانات الأستاذ
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Dialog>
    );
}