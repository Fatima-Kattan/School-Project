// src/services/api/classes/showClass.ts

// ============================================
// تعريف الـ Types
// ============================================
export interface Section {
    id: number;
    name: string;
    comment: string | null;
    class_id: number;
    created_at: string;
    updated_at: string;
    teachers_count: number;
}

export interface Subject {
    id: number;
    name: string;
    comment: string | null;
    full_mark: string;
    class_id: number;
    created_at: string;
    updated_at: string;
}

export interface StudentUser {
    id: number;
    full_name: string;
    email: string;
}

export interface StudentSection {
    id: number;
    name: string;
}

export interface Student {
    id: number;
    birth_date: string;
    comment: string | null;
    gender: string;
    residential_address: string;
    city: string;
    parent_id: number;
    section_id: number;
    class_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: StudentUser;
    section: StudentSection;
}

export interface ClassData {
    id: number;
    name: string;
    comment: string | null;
    created_at: string;
    updated_at: string;
    students_count: number;
    subjects_count: number;
    sections_count: number;
    sections: Section[];
    subjects: Subject[];
    students: Student[];
}

export interface Statistics {
    total_students: number;
    total_sections: number;
    total_subjects: number;
    total_teachers: number;
}

export interface ShowClassResponse {
    success: boolean;
    data: {
        class: ClassData;
        statistics: Statistics;
    };
    message: string;
}

// ============================================
// الدالة الرئيسية - جلب بيانات الصف
// ============================================
export const showClass = async (
    classId: number,
    token: string
): Promise<ShowClassResponse> => {
    const response = await fetch(
        `http://localhost:8000/api/dashboard/classes/${classId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Unauthorized: Please login again');
        }
        if (response.status === 404) {
            throw new Error('Class not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ShowClassResponse = await response.json();
    if (!data.success) {
        throw new Error(data.message || 'Failed to fetch class');
    }

    return data;
};

export default showClass;