// src/services/api/exams/store-exam.ts

export interface StoreExamData {
    subject_id: number;
    section_id: number;
    exam_type: 'نصفي' | 'نهائي';
    date: string;
    duration?: string;
    note?: string;
    mark?: number;
}

export interface FailedRecord {
    student_id: number;
    student_name: string;
    message: string;
}

export interface SuccessfulRecord {
    id: number;
    student_id: number;
    subject_id: number;
    exam_type: string;
    date: string;
    mark: number | null;
    note: string | null;
    student: {
        id: number;
        name: string;
        email: string;
    };
    subject: {
        id: number;
        name: string;
        full_mark: number;
    };
}

export interface StoreExamResponse {
    status: string;
    message: string;
    data?: {
        section: {
            id: number;
            name: string;
        };
        subject: {
            id: number;
            name: string;
            full_mark: number;
        };
        exam_type: string;
        date: string;
        duration: string | null;
        note: string | null;
        mark: number | null;
        total_students: number;
        success_count: number;
        fail_count: number;
        successful_records: SuccessfulRecord[];
        failed_records: FailedRecord[];
    };
    errors?: Record<string, string[]>;
}

// 🆕 1. دالة للتحقق من صحة البيانات قبل الإرسال (Frontend Validation)
export const validateStoreExamData = (data: StoreExamData): string[] => {
    const errors: string[] = [];

    if (!data.subject_id || data.subject_id <= 0) {
        errors.push('معرف المادة مطلوب ويجب أن يكون رقمًا صحيحًا');
    }

    if (!data.section_id || data.section_id <= 0) {
        errors.push('معرف القسم مطلوب ويجب أن يكون رقمًا صحيحًا');
    }

    if (!data.exam_type || !['نصفي', 'نهائي'].includes(data.exam_type)) {
        errors.push('نوع الامتحان يجب أن يكون "نصفي" أو "نهائي"');
    }

    if (!data.date) {
        errors.push('تاريخ الامتحان مطلوب');
    } else {
        // التحقق من تنسيق التاريخ YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.date)) {
            errors.push('تنسيق التاريخ يجب أن يكون YYYY-MM-DD');
        }
        
        // التحقق من أن التاريخ ليس في الماضي (اختياري)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDate = new Date(data.date);
        if (examDate < today) {
            errors.push('لا يمكن تحديد تاريخ في الماضي');
        }
    }

    // التحقق من المدة (اختياري)
    if (data.duration) {
        const durationRegex = /^\d{2}:\d{2}:\d{2}$/;
        if (!durationRegex.test(data.duration)) {
            errors.push('تنسيق المدة يجب أن يكون HH:MM:SS (مثال: 01:30:00)');
        }
    }

    // التحقق من العلامة (اختياري)
    if (data.mark !== undefined && data.mark !== null) {
        if (data.mark < 0) {
            errors.push('العلامة لا يمكن أن تكون أقل من 0');
        }
        if (data.mark > 100) {
            errors.push('العلامة لا يمكن أن تتجاوز 100');
        }
    }

    return errors;
};

// 🆕 2. دالة للتحقق من وجود طلاب في القسم (اختياري - تستدعي API آخر)
// هذه الدالة تستخدم إذا كنت تريد التأكد من وجود طلاب قبل إرسال الطلب الرئيسي
export const checkSectionHasStudents = async (
    token: string,
    sectionId: number
): Promise<boolean> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/sections/${sectionId}/students-count`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result.data?.count > 0;
    } catch (error: any) {
        console.error(' [checkSectionHasStudents] Failed:', error);
        return false; // في حالة الخطأ، نفترض أنه لا يوجد طلاب
    }
};

// 🆕 3. نسخة محسنة من storeExam مع تحقق مسبق اختياري
export const storeExamWithValidation = async (
    token: string,
    data: StoreExamData
): Promise<StoreExamResponse> => {
    // التحقق من البيانات قبل الإرسال
    const validationErrors = validateStoreExamData(data);
    if (validationErrors.length > 0) {
        // إرجاع خطأ مخصص بدلاً من إرسال الطلب
        throw new Error(validationErrors.join('\n'));
    }

    // إرسال الطلب إذا نجح التحقق
    return storeExam(token, data);
};

// الدالة الأساسية
export const storeExam = async (
    token: string,
    data: StoreExamData
): Promise<StoreExamResponse> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/exams/store',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error(' [storeExam] Failed:', error);
        throw error;
    }
};