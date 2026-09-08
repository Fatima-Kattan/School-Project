// components/exams/ExamForm.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/button/button';
import { storeExam, validateStoreExamData, StoreExamData, StoreExamResponse } from '@/services/api/exams/addExams';

// واجهات البيانات
interface Subject {
    id: number;
    name: string;
    full_mark: number;
}

interface Section {
    id: number;
    name: string;
}

interface ExamFormProps {
    token: string;
    subjects: Subject[];
    sections: Section[];
    onSuccess?: (data: StoreExamResponse) => void;
    onError?: (error: string) => void;
    onCancel?: () => void;
}

// دالة مساعدة للحصول على تاريخ اليوم بصيغة YYYY-MM-DD
const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ExamForm({ 
    token, 
    subjects, 
    sections, 
    onSuccess, 
    onError,
    onCancel 
}: ExamFormProps) {
    // حالات النموذج
    const [formData, setFormData] = useState<StoreExamData>({
        subject_id: 0,
        section_id: 0,
        exam_type: 'نصفي',
        date: getTodayDate(),
        duration: '01:00:00',
        note: '',
        mark: 100,
    });

    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [responseData, setResponseData] = useState<StoreExamResponse | null>(null);

    // دالة جلب التوكن
    const getToken = (): string => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken && storedToken.length > 10) {
                return storedToken;
            }
            return token || '';
        } catch (error) {
            console.error('Error getting token:', error);
            return '';
        }
    };

    // التحقق من صحة الحقول
    const validateField = (name: string, value: any): string => {
        const tempData = { ...formData, [name]: value };
        const validationErrors = validateStoreExamData(tempData);

        const fieldErrors = validationErrors.filter(err => {
            if (name === 'subject_id') return err.includes('المادة');
            if (name === 'section_id') return err.includes('القسم');
            if (name === 'exam_type') return err.includes('نوع الامتحان');
            if (name === 'date') return err.includes('التاريخ');
            if (name === 'duration') return err.includes('المدة');
            if (name === 'mark') return err.includes('العلامة');
            return false;
        });

        return fieldErrors.length > 0 ? fieldErrors[0] : '';
    };

    // معالجة تغيير الحقول
    const handleChange = (field: keyof StoreExamData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        const error = validateField(field, value);
        setErrors(prev => ({
            ...prev,
            [field]: error
        }));

        setErrorMessage('');
    };

    // التحقق من وجود طلاب في القسم
    const checkSectionStudents = async (sectionId: number): Promise<boolean> => {
        try {
            const authToken = getToken();
            if (!authToken) return false;

            const response = await fetch(
                `http://localhost:8000/api/sections/${sectionId}/students-count`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                }
            );

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            return result.data?.count > 0;
        } catch (error) {
            console.error('[checkSectionStudents] Failed:', error);
            return false;
        }
    };

    // معالجة إرسال النموذج
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        setResponseData(null);

        try {
            const authToken = getToken();
            if (!authToken) {
                throw new Error('لم يتم العثور على رمز المصادقة');
            }

            const validationErrors = validateStoreExamData(formData);
            if (validationErrors.length > 0) {
                const fieldErrors: Record<string, string> = {};
                validationErrors.forEach(err => {
                    if (err.includes('المادة')) fieldErrors.subject_id = err;
                    else if (err.includes('القسم')) fieldErrors.section_id = err;
                    else if (err.includes('نوع الامتحان')) fieldErrors.exam_type = err;
                    else if (err.includes('التاريخ')) fieldErrors.date = err;
                    else if (err.includes('المدة')) fieldErrors.duration = err;
                    else if (err.includes('العلامة')) fieldErrors.mark = err;
                });
                setErrors(fieldErrors);
                throw new Error('يرجى تصحيح الأخطاء في النموذج');
            }

            const hasStudents = await checkSectionStudents(formData.section_id);
            if (!hasStudents) {
                throw new Error('القسم المحدد لا يحتوي على طلاب');
            }

            const response = await storeExam(authToken, formData);

            if (response.data?.fail_count > 0) {
                setErrorMessage(`⚠️ تمت الإضافة مع أخطاء! (نجاح: ${response.data.success_count || 0}، فشل: ${response.data.fail_count || 0})`);
            } else {
                setErrorMessage(`✅ تم إضافة الامتحان بنجاح! (تم تسجيل ${response.data?.success_count || 0} طالب)`);
            }

            setResponseData(response);

            if (onSuccess) onSuccess(response);

        } catch (error: any) {
            console.error('[handleSubmit] Error:', error);
            const errorMsg = error.message || 'حدث خطأ أثناء إضافة الامتحان';
            setErrorMessage(`❌ ${errorMsg}`);
            if (onError) onError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const selectedSubject = subjects.find(s => s.id === formData.subject_id);
    const fullMark = selectedSubject?.full_mark || 100;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
            {/* Header */}
            <div className="text-right mb-6">
                <h3 
                    className="text-[#1A1A1A]"
                    style={{
                        fontFamily: 'Cairo',
                        fontWeight: 700,
                        fontSize: '24px',
                        lineHeight: '32px',
                    }}
                >
                    📝 جدولة اختبار
                </h3>
                <p 
                    className="text-[#666666] mt-1"
                    style={{
                        fontFamily: 'Cairo',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '24px',
                    }}
                >
                    أضف اختبار جديد للشعبة
                </p>
            </div>

            {/* Error/Success Message */}
            {errorMessage && (
                <div className={`p-4 border rounded-xl text-sm mb-6 ${
                    errorMessage.includes('✅') || errorMessage.includes('تمت الإضافة')
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* الصف الأول: المادة + الشعبة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2 text-right"
                            style={{ fontFamily: 'Cairo' }}
                        >
                            المادة <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.subject_id || ''}
                            onChange={(e) => handleChange('subject_id', Number(e.target.value))}
                            disabled={loading}
                            className={`w-full px-4 py-3 border rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent transition-all ${
                                errors.subject_id ? 'border-red-500' : 'border-[#E5E7EB]'
                            }`}
                            style={{ fontFamily: 'Cairo' }}
                        >
                            <option value="" disabled>اختر المادة</option>
                            {subjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name} (العلامة: {subject.full_mark})
                                </option>
                            ))}
                        </select>
                        {errors.subject_id && (
                            <p className="text-red-500 text-xs mt-1 text-right">{errors.subject_id}</p>
                        )}
                    </div>

                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2 text-right"
                            style={{ fontFamily: 'Cairo' }}
                        >
                            الشعبة <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.section_id || ''}
                            onChange={(e) => handleChange('section_id', Number(e.target.value))}
                            disabled={loading}
                            className={`w-full px-4 py-3 border rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent transition-all ${
                                errors.section_id ? 'border-red-500' : 'border-[#E5E7EB]'
                            }`}
                            style={{ fontFamily: 'Cairo' }}
                        >
                            <option value="" disabled>اختر الشعبة</option>
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                        {errors.section_id && (
                            <p className="text-red-500 text-xs mt-1 text-right">{errors.section_id}</p>
                        )}
                    </div>
                </div>

                {/* الصف الثاني: نوع الامتحان + العلامة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2 text-right"
                            style={{ fontFamily: 'Cairo' }}
                        >
                            نوع الاختبار <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.exam_type}
                            onChange={(e) => handleChange('exam_type', e.target.value)}
                            disabled={loading}
                            className={`w-full px-4 py-3 border rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent transition-all ${
                                errors.exam_type ? 'border-red-500' : 'border-[#E5E7EB]'
                            }`}
                            style={{ fontFamily: 'Cairo' }}
                        >
                            <option value="نصفي">امتحان نصفي</option>
                            <option value="نهائي">امتحان نهائي</option>
                        </select>
                        {errors.exam_type && (
                            <p className="text-red-500 text-xs mt-1 text-right">{errors.exam_type}</p>
                        )}
                    </div>

                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2 text-right"
                            style={{ fontFamily: 'Cairo' }}
                        >
                            العلامة الكاملة
                        </label>
                        <input
                            type="number"
                            value={formData.mark || ''}
                            onChange={(e) => handleChange('mark', Number(e.target.value))}
                            disabled={loading}
                            min={0}
                            max={fullMark}
                            className={`w-full px-4 py-3 border rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent transition-all ${
                                errors.mark ? 'border-red-500' : 'border-[#E5E7EB]'
                            }`}
                            style={{ fontFamily: 'Cairo' }}
                        />
                        {errors.mark && (
                            <p className="text-red-500 text-xs mt-1 text-right">{errors.mark}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-1 text-right">الحد الأقصى: {fullMark}</p>
                    </div>
                </div>

                {/* الصف الثالث: التاريخ + المدة */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2 text-right"
                            style={{ fontFamily: 'Cairo' }}
                        >
                            تاريخ الاختبار <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            disabled={loading}
                            min={getTodayDate()}
                            className={`w-full px-4 py-3 border rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent transition-all ${
                                errors.date ? 'border-red-500' : 'border-[#E5E7EB]'
                            }`}
                            style={{ fontFamily: 'Cairo' }}
                        />
                        {errors.date && (
                            <p className="text-red-500 text-xs mt-1 text-right">{errors.date}</p>
                        )}
                    </div>

                    <div>
                        <label 
                            className="block text-sm font-medium text-gray-700 mb-2 text-right"
                            style={{ fontFamily: 'Cairo' }}
                        >
                            مدة الاختبار <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            value={formData.duration || '01:00:00'}
                            onChange={(e) => handleChange('duration', e.target.value)}
                            disabled={loading}
                            step="1"
                            className={`w-full px-4 py-3 border rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent transition-all ${
                                errors.duration ? 'border-red-500' : 'border-[#E5E7EB]'
                            }`}
                            style={{ fontFamily: 'Cairo' }}
                        />
                        {errors.duration && (
                            <p className="text-red-500 text-xs mt-1 text-right">{errors.duration}</p>
                        )}
                        <p className="text-gray-400 text-xs mt-1 text-right">مثال: 01:30:00 (ساعة ونصف)</p>
                    </div>
                </div>

                {/* حقل الملاحظات - عرض كامل */}
                <div className="mb-6">
                    <label 
                        className="block text-sm font-medium text-gray-700 mb-2 text-right"
                        style={{ fontFamily: 'Cairo' }}
                    >
                        ملاحظات
                    </label>
                    <textarea
                        value={formData.note || ''}
                        onChange={(e) => handleChange('note', e.target.value)}
                        disabled={loading}
                        rows={3}
                        placeholder="أضف أي ملاحظات إضافية هنا..."
                        className="w-full px-4 py-3 border border-[#E5E7EB] rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-[#007353] focus:border-transparent transition-all resize-none"
                        style={{ fontFamily: 'Cairo' }}
                    />
                </div>

                {/* عرض النتائج التفصيلية */}
                {responseData?.data && responseData.data.failed_records?.length > 0 && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6">
                        <p className="text-sm font-semibold text-gray-700 text-right mb-2">
                            📊 الطلاب الذين فشل تسجيلهم:
                        </p>
                        <div className="max-h-24 overflow-auto">
                            {responseData.data.failed_records.map((record, idx) => (
                                <p key={idx} className="text-sm text-red-600 text-right">
                                    • {record.student_name}: {record.message}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* أزرار التحكم */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E7EB]">
                    <Button
                        variant="ghost-outline"
                        onClick={onCancel}
                        size="md"
                        className="h-[42px] rounded-xl min-w-[120px] px-4 py-2 text-sm font-medium"
                        type="button"
                    >
                        إلغاء
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        isLoading={loading}
                        size="md"
                        className="h-[42px] rounded-xl min-w-[120px] px-4 py-2 text-sm font-medium bg-[#007353] hover:bg-[#005a42] text-white"
                        disabled={loading || Object.keys(errors).some(key => errors[key])}
                    >
                        {loading ? 'جاري الإضافة...' : 'تأكيد الجدولة'}
                    </Button>
                </div>
            </form>
        </div>
    );
} 