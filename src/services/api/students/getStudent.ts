// src/services/api/students/getStudent.ts

export interface Student {
    id: number;
    user_name: string;
    email: string;
    full_name: string;
    birth_date: string;
    gender: 'ذكر' | 'أنثى';
    residential_address: string;
    city: string;
    comment: string | null;
    class: {
        id: number;
        name: string;
    } | null;
    section: {
        id: number;
        name: string;
    } | null;
    parent: {
        father_name: string;
        mother_name: string;
        father_phone: string;
        mother_phone: string;
    } | null;
    subjects: Array<{
        id: number;
        name: string;
        mark: number | null;
        exam_type: 'نصفي' | 'نهائي';
        date: string;
        note: string | null;
        duration?: string;
    }>;
    created_at: string;
    updated_at: string;
}

export interface StudentResponse {
    success: boolean;
    data: Student;
    message?: string;
}

export const getStudent = async (
    id: number,
    token: string
): Promise<StudentResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/students/${id}`,
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

        return result;
    } catch (error: any) {
        console.error('🔥 [getStudent] Failed:', error);
        throw error;
    }
};