// src/services/api/students/getStudents.ts

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
    class_name?: string;
    section_name?: string;
    father_name?: string;
    mother_name?: string;
    father_phone?: string;
    mother_phone?: string;
    subjects?: Array<{
        subject_name: string;
        mark: number | null;
        exam_type: 'نصفي' | 'نهائي';
        date: string;
        note: string | null;
    }>;
    created_at: string;
}

export interface StudentsListResponse {
    success: boolean;
    data: Student[];
    total: number;
}

export const getStudents = async (
    token: string,
    filters?: { class_id?: number; section_id?: number }
): Promise<StudentsListResponse> => {
    try {
        let url = 'http://localhost:8000/api/v1/dashboard/students';

        if (filters) {
            const params = new URLSearchParams();
            if (filters.class_id) params.append('class_id', String(filters.class_id));
            if (filters.section_id) params.append('section_id', String(filters.section_id));
            if (params.toString()) url += `?${params.toString()}`;
        }

        console.log('📤 [getStudents] Fetching from:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [getStudents] Failed:', error);
        throw error;
    }
};