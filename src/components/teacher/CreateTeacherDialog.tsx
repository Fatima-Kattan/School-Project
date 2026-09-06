// components/teacher/CreateTeacherDialog.tsx

'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { teacherService } from '@/services/api/teachers/teacherService';
import {
    Save,
    Copy,
    Check,
    UserPen,
    User2,
    ChevronLeft
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

export default function CreateTeacherDialog({ isOpen, onClose, onSuccess, token }: CreateTeacherDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [step, setStep] = useState(1);

    // Form states - Step 1
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<'ذكر' | 'أنثى'>('ذكر');
    const [phoneNumber, setPhoneNumber] = useState('963');
    const [comment, setComment] = useState('');

    // Form states - Step 2 (for future API)
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedSections, setSelectedSections] = useState<string[]>([]);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const [selectedSupervisedSubjects, setSelectedSupervisedSubjects] = useState<string[]>([]);

    // Generated credentials
    const [generatedCredentials, setGeneratedCredentials] = useState<{ user_name: string, password: string } | null>(null);
    const [copiedCredential, setCopiedCredential] = useState<string | null>(null);

    // Mock data for step 2 (will be replaced with API data)
    const mockClasses = ['الصف السابع', 'الصف الثامن', 'الصف التاسع', 'الصف العاشر'];
    const mockSections = ['الأولى', 'الثانية', 'الثالثة', 'الرابعة'];
    const mockSubjects = ['الفقه', 'الشريعة', 'الرياضيات', 'العلوم', 'اللغة العربية'];

    const resetForm = () => {
        setFullName('');
        setEmail('');
        setGender('ذكر');
        setPhoneNumber('963');
        setComment('');
        setGeneratedCredentials(null);
        setSelectedClasses([]);
        setSelectedSections([]);
        setSelectedSubjects([]);
        setSelectedSupervisedSubjects([]);
        setStep(1);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleGenerateAccount = async () => {
        if (!fullName || !email || !phoneNumber) {
            toast.error('يرجى تعبئة جميع الحقول المطلوبة');
            return;
        }

        setIsGenerating(true);
        try {
            const dataToSend = {
                full_name: fullName,
                email: email,
                gender: gender,
                phone_number: `+${phoneNumber}`,
                comment: comment,
            };

            const response = await teacherService.create(dataToSend, token);

            if (response.data && response.data.teacher) {
                const { user_name, password } = response.data.teacher;
                setGeneratedCredentials({ user_name, password });
                toast.success('تم توليد الحساب بنجاح!');
            }
        } catch (error: any) {
            toast.error('تعذر توليد الحساب، يرجى التأكد من عدم تكرار البيانات');
        } finally {
            setIsGenerating(false);
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

    const handleNext = () => {
        if (!fullName || !email || !phoneNumber) {
            toast.error('يرجى تعبئة جميع الحقول المطلوبة');
            return;
        }
        if (!generatedCredentials) {
            toast.error('يرجى توليد الحساب أولاً');
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleConfirm = async () => {
        if (selectedClasses.length === 0) {
            toast.error('يرجى اختيار صف واحد على الأقل');
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
        if (selectedSupervisedSubjects.length === 0) {
            toast.error('يرجى اختيار مادة مشرف عليها واحدة على الأقل');
            return;
        }

        setIsSubmitting(true);
        try {
            const allData = {
                full_name: fullName,
                email: email,
                gender: gender,
                phone_number: `+${phoneNumber}`,
                comment: comment,
                user_name: generatedCredentials?.user_name,
                password: generatedCredentials?.password,
                classes: selectedClasses,
                sections: selectedSections,
                subjects: selectedSubjects,
                supervised_subjects: selectedSupervisedSubjects,
            };

            console.log('Teacher data to submit:', allData);

            toast.success('تم إضافة المدرس بنجاح!');
            resetForm();
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'حدث خطأ');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSelection = (item: string, selected: string[], setSelected: (value: string[]) => void) => {
        if (selected.includes(item)) {
            setSelected(selected.filter(i => i !== item));
        } else {
            setSelected([...selected, item]);
        }
    };

    return (
        <Dialog
            className='h-fit overflow-y-auto'
            isOpen={isOpen}
            onClose={handleClose}
            title="إضافة مدرس"
            confirmText={step === 2 ? "تأكيد الإضافة" : undefined}
            cancelText={step === 2 ? "رجوع" : "إلغاء"}
            confirmVariant={step === 2 ? "primary" : undefined}
            showCancel={false}
            showConfirm={false}
            maxWidth="2xl"
            onConfirm={step === 2 ? handleConfirm : undefined}
            isLoading={isSubmitting}
            leftIcon={step === 2 ? <Save size={16} /> : undefined}
        >
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${step === 1 ? 'text-[#007353]' : 'text-gray-400'}`}>
                    الصفحة الرئيسية
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {/* Full Name */}
                        <Input
                            className='h-[33px]'
                            label="الاسم الكامل"
                            required
                            placeholder="مثال: أحمد محمد"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                الجنس <span className="text-red-500">(مطلوب)</span>
                            </label>
                            <div className="flex gap-3 p-1 bg-white rounded-[12px] border border-[#ACACAC]">
                                <button
                                    type="button"
                                    onClick={() => setGender('ذكر')}
                                    className={`flex-1 h-[34px] rounded-[10px] transition-all text-sm font-medium ${
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
                                    className={`flex-1 h-[34px] rounded-[10px] transition-all text-sm font-medium ${
                                        gender === 'أنثى'
                                            ? 'bg-[#007353] text-white shadow-sm'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    أنثى
                                </button>
                            </div>
                        </div>

                        {/* Email */}
                        <Input
                            className='h-[33px]'
                            label="البريد الإلكتروني"
                            required
                            type="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-[#000f0b] mb-1.5 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                                رقم الهاتف
                            </label>
                            <PhoneInput
                                country={'sy'}
                                value={phoneNumber}
                                onChange={(phone) => setPhoneNumber(phone)}
                                inputStyle={{
                                    width: '100%', height: '33px', borderRadius: '8px', border: '1px solid #ACACAC',
                                    fontSize: '14px', fontFamily: 'Cairo, sans-serif', backgroundColor: '#fff',
                                    paddingLeft: '47px', color: '#000f0b', transition: 'all 0.2s', outline: 'none'
                                }}
                                buttonStyle={{
                                    border: 'none', background: 'transparent', borderLeft: '1px solid #e5e7eb',
                                    borderRadius: '0', height: '31px', padding: '0 10px', top: '1px', left: '1px'
                                }}
                                containerStyle={{ direction: 'ltr', width: '100%' }}
                                dropdownStyle={{ textAlign: 'right', fontFamily: 'Cairo, sans-serif' }}
                            />
                        </div>

                        {/* Comment - full width */}
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

                    {/* Generate Account Section */}
                    <div className='bg-[#F8FCFB] border border-gray-200 rounded-lg p-1 mt-2'>
                        <div className="mt-1.5 flex items-start justify-between gap-4 w-full">
                            {generatedCredentials ? (
                                <>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#000f0b] mb-1.5">اسم المستخدم</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                readOnly
                                                value={generatedCredentials.user_name}
                                                className="w-full h-[35px] px-3 rounded-lg border border-[#ACACAC] bg-white text-sm text-[#000f0b] focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => copyCredential('username', generatedCredentials.user_name)}
                                                className="shrink-0 h-[35px] w-[45px] bg-white border border-[#ACACAC] rounded-lg flex items-center justify-center hover:border-[#007353] hover:bg-gray-50 transition-all"
                                            >
                                                {copiedCredential === 'username' ? (
                                                    <Check size={16} className="text-green-600" />
                                                ) : (
                                                    <Copy size={16} className="text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#000f0b] mb-1.5">كلمة المرور</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                readOnly
                                                value={generatedCredentials.password}
                                                type="text"
                                                className="w-full h-[35px] px-3 rounded-lg border border-[#ACACAC] bg-white text-sm text-[#000f0b] focus:outline-none focus:border-[#007353] focus:ring-2 focus:ring-[#007353]/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => copyCredential('password', generatedCredentials.password)}
                                                className="shrink-0 h-[35px] w-[45px] bg-white border border-[#ACACAC] rounded-lg flex items-center justify-center hover:border-[#007353] hover:bg-gray-50 transition-all"
                                            >
                                                {copiedCredential === 'password' ? (
                                                    <Check size={16} className="text-green-600" />
                                                ) : (
                                                    <Copy size={16} className="text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="w-full text-sm text-gray-500 flex items-center justify-center py-3">
                                    قم بتوليد اسم المستخدم وكلمة المرور تلقائياً
                                </div>
                            )}
                        </div>

                        <div className="mt-2 flex justify-start">
                            <Button
                                variant="primary"
                                size="sm"
                                className="px-4 py-2"
                                leftIcon={<UserPen size={16} />}
                                onClick={handleGenerateAccount}
                                isLoading={isGenerating}
                            >
                                {generatedCredentials ? 'إعادة توليد الحساب' : 'توليد الحساب'}
                            </Button>
                        </div>
                    </div>

                    {/* الأزرار في الأسفل */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
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
                                leftIcon={<ChevronLeft size={16} />}
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
                    <div className="space-y-4">
                        {/* Classes */}
                        <div>
                            <h3 className="text-sm font-medium text-[#000f0b] mb-2 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                                الصفوف التي سيستلم تدريسها هذا المدرس
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mockClasses.map((cls) => (
                                    <label key={cls} className="flex items-center gap-2 text-sm text-[#000f0b] cursor-pointer bg-white border border-[#ACACAC] rounded-lg px-3 py-1.5 hover:border-[#007353] transition-all">
                                        <input
                                            type="checkbox"
                                            checked={selectedClasses.includes(cls)}
                                            onChange={() => toggleSelection(cls, selectedClasses, setSelectedClasses)}
                                            className="w-4 h-4 text-[#007353] focus:ring-[#007353] focus:ring-offset-0 rounded"
                                        />
                                        {cls}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Sections */}
                        <div>
                            <h3 className="text-sm font-medium text-[#000f0b] mb-2 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                                الشعب التي سيستلم تدريسها هذا المدرس
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mockSections.map((section) => (
                                    <label key={section} className="flex items-center gap-2 text-sm text-[#000f0b] cursor-pointer bg-white border border-[#ACACAC] rounded-lg px-3 py-1.5 hover:border-[#007353] transition-all">
                                        <input
                                            type="checkbox"
                                            checked={selectedSections.includes(section)}
                                            onChange={() => toggleSelection(section, selectedSections, setSelectedSections)}
                                            className="w-4 h-4 text-[#007353] focus:ring-[#007353] focus:ring-offset-0 rounded"
                                        />
                                        {section}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Subjects */}
                        <div>
                            <h3 className="text-sm font-medium text-[#000f0b] mb-2 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                                المواد التي سيستلم تدريسها هذا المدرس
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mockSubjects.map((subject) => (
                                    <label key={subject} className="flex items-center gap-2 text-sm text-[#000f0b] cursor-pointer bg-white border border-[#ACACAC] rounded-lg px-3 py-1.5 hover:border-[#007353] transition-all">
                                        <input
                                            type="checkbox"
                                            checked={selectedSubjects.includes(subject)}
                                            onChange={() => toggleSelection(subject, selectedSubjects, setSelectedSubjects)}
                                            className="w-4 h-4 text-[#007353] focus:ring-[#007353] focus:ring-offset-0 rounded"
                                        />
                                        {subject}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Supervised Subjects */}
                        <div>
                            <h3 className="text-sm font-medium text-[#000f0b] mb-2 after:content-['(مطلوب)'] after:text-red-500 after:mr-1">
                                المواد التي سيستلم إشرافها هذا المدرس
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mockSubjects.map((subject) => (
                                    <label key={subject} className="flex items-center gap-2 text-sm text-[#000f0b] cursor-pointer bg-white border border-[#ACACAC] rounded-lg px-3 py-1.5 hover:border-[#007353] transition-all">
                                        <input
                                            type="checkbox"
                                            checked={selectedSupervisedSubjects.includes(subject)}
                                            onChange={() => toggleSelection(subject, selectedSupervisedSubjects, setSelectedSupervisedSubjects)}
                                            className="w-4 h-4 text-[#007353] focus:ring-[#007353] focus:ring-offset-0 rounded"
                                        />
                                        {subject}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* الأزرار في الأسفل */}
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost-outline"
                                size="sm"
                                className="px-4 py-1.5"
                                onClick={handleBack}
                            >
                                رجوع
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                className="px-4 py-1.5"
                                leftIcon={<Save size={16} />}
                                onClick={handleConfirm}
                                isLoading={isSubmitting}
                            >
                                تأكيد الإضافة
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </Dialog>
    );
}