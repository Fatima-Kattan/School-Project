// src/services/api/students/get-students-by-class.ts

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
    created_at: string;
}

export interface StudentsListResponse {
    success: boolean;
    data: Student[];
    total: number;
}

export const getStudentsByClass = async (
    classId: number,
    token: string
): Promise<StudentsListResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/v1/dashboard/students/class/${classId}`,
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
        console.error('🔥 [getStudentsByClass] Failed:', error);
        throw error;
    }
};