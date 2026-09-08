// components/teacher/CreateTeacherDialog.tsx

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
    User,
    Mail,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/shared/button/button';
import { Dialog } from '@/components/shared/dialog/dialog';
import { Input } from '@/components/shared/input/inpute';

interface CreateTeacherDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    token: string;
}

interface ClassWithSections {
    id: number;
    name: string;
    sections: Section[];
}

interface SubjectWithClass extends Subject {
    class_id: number;
}

export default function CreateTeacherDialog({ isOpen, onClose, onSuccess, token }: CreateTeacherDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isCreated, setIsCreated] = useState(false);

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

    // Generated credentials
    const [generatedCredentials, setGeneratedCredentials] = useState<{ user_name: string, password: string } | null>(null);
    const [copiedCredential, setCopiedCredential] = useState<string | null>(null);

    // ====== جلب البيانات عند فتح الديالوغ ======
    useEffect(() => {
        if (isOpen && token && step === 2) {
            fetchData();
        }
    }, [isOpen, token, step]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await teacherService.getSectionsAndSubjects(token);

            let formattedClasses: ClassWithSections[] = [];

            if (data.classes && data.classes.length > 0) {
                formattedClasses = data.classes.map((cls: any) => ({
                    id: cls.id,
                    name: cls.name || `الصف ${cls.id}`,
                    sections: data.sections.filter((s: Section) => s.class_id === cls.id)
                }));
            } else if (data.sections && data.sections.length > 0) {
                const classMap = new Map<number, ClassWithSections>();
                data.sections.forEach((section: Section) => {
                    const classId = section.class_id;
                    if (!classMap.has(classId)) {
                        classMap.set(classId, {
                            id: classId,
                            name: section.class_name || `الصف ${classId}`,
                            sections: []
                        });
                    }
                    classMap.get(classId)!.sections.push(section);
                });
                formattedClasses = Array.from(classMap.values());
            }

            setClasses(formattedClasses);
            
            const subjectsWithClass = data.subjects.map((subject: any) => ({
                ...subject,
                class_id: subject.class_id || subject.classId || null
            }));
            setSubjects(subjectsWithClass);

            if (formattedClasses.length > 0) {
                setSelectedClassId(formattedClasses[0].id);
            }

            if (formattedClasses.length === 0) {
                toast.error('لا يوجد صفوف في النظام، يرجى إضافة صفوف أولاً');
            }
            if (data.subjects.length === 0) {
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
        setGeneratedCredentials(null);
        setSelectedSections([]);
        setSelectedSubjects([]);
        setSelectedClassId(null);
        setIsCreated(false);
        setStep(1);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleCreateTeacher = async () => {
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

            console.log('📤 Creating teacher with all data:', allData);

            const response = await teacherService.create(allData, token);
            console.log('✅ Teacher created:', response);

            if (response.success && response.data?.teacher) {
                const { user_name, password } = response.data.teacher;
                setGeneratedCredentials({ user_name, password });
                setIsCreated(true);
                toast.success('تم إضافة المدرس بنجاح!');
                onSuccess();
            } else {
                throw new Error(response.message || 'حدث خطأ أثناء إضافة المدرس');
            }
        } catch (error: any) {
            console.error('❌ Error:', error);
            if (error.message.includes('email')) {
                toast.error('البريد الإلكتروني مستخدم مسبقاً');
            } else if (error.message.includes('phone')) {
                toast.error('رقم الهاتف مستخدم مسبقاً');
            } else {
                toast.error(error.message || 'حدث خطأ أثناء إضافة المدرس');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyCredential = (type: string, text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopiedCredential(type);
            toast.success('تم النسخ بنجاح!');
            setTimeout(() => setCopiedCredential(null), 2000);
        }).catch(() => {
            toast.error('تعذر النسخ');
        });
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

    return (
        <Dialog
            className='h-fit overflow-y-auto max-h-[90vh]'
            isOpen={isOpen}
            onClose={handleClose}
            title="إضافة أستاذ"
            confirmText={step === 2 ? "تأكيد إضافة الأستاذ" : undefined}
            cancelText={step === 2 ? "إلغاء" : "إلغاء"}
            confirmVariant={step === 2 ? "primary" : undefined}
            showCancel={false}
            showConfirm={false}
            maxWidth="2xl"
            onConfirm={step === 2 ? handleCreateTeacher : undefined}
            isLoading={isSubmitting}
            leftIcon={step === 2 ? <Save size={16} /> : undefined}
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
                                    className={`flex-1 h-[36px] rounded-[10px] transition-all text-sm font-medium ${
                                        gender === 'ذكر'
                                            ? 'bg-[#007353] text-white shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    ذكر
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender('أنثى')}
                                    className={`flex-1 h-[36px] rounded-[10px] transition-all text-sm font-medium ${
                                        gender === 'أنثى'
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
                                        disabled={isCreated}
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
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${
                                                    selectedSections.includes(section.id)
                                                        ? 'border-[#2e7d32] bg-[#e8f5e9] shadow-sm'
                                                        : 'border-gray-200 bg-white hover:border-[#2e7d32] hover:bg-gray-50'
                                                } ${isCreated ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSections.includes(section.id)}
                                                    onChange={() => toggleSection(section.id)}
                                                    className="w-4 h-4 accent-[#2e7d32]"
                                                    disabled={isCreated}
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
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-all ${
                                                    selectedSubjects.includes(subject.id)
                                                        ? 'border-[#2e7d32] bg-[#e8f5e9] shadow-sm'
                                                        : 'border-gray-200 bg-white hover:border-[#2e7d32] hover:bg-gray-50'
                                                } ${isCreated ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubjects.includes(subject.id)}
                                                    onChange={() => toggleSubject(subject.id)}
                                                    className="w-4 h-4 accent-[#2e7d32]"
                                                    disabled={isCreated}
                                                />
                                                <span className="text-sm text-gray-700">{subject.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* ✅ عرض بيانات الحساب - نسخة بسيطة بدون ايقونات */}
                            {generatedCredentials && (
                                <div className="bg-[#F5F8F7] border border-[#D0D9D6] rounded-xl p-4 mt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-2 h-2 bg-[#2e7d32] rounded-full" />
                                        <h4 className="text-sm font-medium text-[#2e7d32]">
                                            تم إنشاء الحساب بنجاح
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-md text-gray-800 mb-1">اسم المستخدم (تم توليده تلقائياً)</p>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    readOnly
                                                    value={generatedCredentials.user_name}
                                                    className="flex-1 h-[38px] px-3 rounded-lg border border-[#D0D9D6] bg-white text-sm font-mono focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => copyCredential('username', generatedCredentials.user_name)}
                                                    className="shrink-0 h-[38px] w-[38px] bg-white border-none border-[#D0D9D6] rounded-lg flex items-center justify-center hover:border-[#2e7d32] transition-all hover:bg-gray-50"
                                                >
                                                    {copiedCredential === 'username' ? (
                                                        <Check size={16} className="text-green-600" />
                                                    ) : (
                                                        <Copy size={16} className="text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-md text-gray-800 mb-1">كلمة المرور (تم توليدها تلقائياً)</p>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    readOnly
                                                    value={generatedCredentials.password}
                                                    type="text"
                                                    className="flex-1 h-[38px] px-3 rounded-lg border border-[#D0D9D6] bg-white text-sm font-mono focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => copyCredential('password', generatedCredentials.password)}
                                                    className="shrink-0 h-[38px] w-[38px] bg-white border border-[#D0D9D6] rounded-lg flex items-center justify-center hover:border-[#2e7d32] transition-all hover:bg-gray-50"
                                                >
                                                    {copiedCredential === 'password' ? (
                                                        <Check size={16} className="text-green-600" />
                                                    ) : (
                                                        <Copy size={16} className="text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="px-5 py-1.5"
                                            onClick={handleClose}
                                        >
                                            إغلاق
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="animate-spin text-[#2e7d32]" size={40} />
                        </div>
                    )}

                    {/* الأزرار في الأسفل - فقط إذا لم يتم الإنشاء */}
                    {!isCreated && !generatedCredentials && (
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
                                    onClick={handleCreateTeacher}
                                    isLoading={isSubmitting}
                                    disabled={loading || isSubmitting}
                                >
                                    تأكيد إضافة الأستاذ
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Dialog>
    );
}