// src/services/api/students/createStudent.ts

export interface CreateStudentData {
    full_name: string;
    email: string;
    birth_date: string;
    gender: 'ذكر' | 'أنثى';
    residential_address: string;
    city: string;
    class_id: number;
    section_id: number;
    parent_id: number;
    comment?: string;
}

export interface StudentResponse {
    success: boolean;
    data: any;
    message?: string;
    total?: number;
}

export const createStudent = async (
    data: CreateStudentData,
    token: string
): Promise<StudentResponse> => {
    try {
        console.log('📤 [createStudent] Creating:', data);

        const response = await fetch(
            'http://localhost:8000/api/dashboard/students',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            if (result.errors) {
                const errorMessages = Object.values(result.errors)
                    .flat()
                    .join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [createStudent] Failed:', error);
        throw error;
    }
};