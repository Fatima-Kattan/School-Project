// services/api/teachers/teacherService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Teacher {
    id: number;
    user_name: string;
    email: string;
    full_name: string;
    gender: 'ذكر' | 'أنثى';
    birth_date: string | null;
    phone_number: string;
    comment: string | null;
    created_at: string;
    updated_at: string;
    decrypted_password?: string;
}

// ✅ إضافة واجهات للصفوف والمواد
export interface TeacherClass {
    id: number;
    class_name: string;
    sections: string[];
}

export interface TeacherSubject {
    id: number;
    subject_name: string;
    class_name: string;
    section_name: string;
}

export const teacherService = {
    // Get all teachers
    async getAll(token: string): Promise<{ data: Teacher[]; total: number }> {
        const response = await fetch(`${API_URL}/dashboard/teachers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teachers');
        }

        return response.json();
    },

    // Get single teacher
    async getById(id: number, token: string): Promise<{ data: Teacher }> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teacher');
        }

        return response.json();
    },

    // Create teacher
    async create(data: any, token: string): Promise<any> {
        const response = await fetch(`${API_URL}/dashboard/teachers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create teacher');
        }

        return response.json();
    },

    // Update teacher
    async update(id: number, data: any, token: string): Promise<any> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update teacher');
        }

        return response.json();
    },

    // Delete teacher
    async delete(id: number, token: string): Promise<any> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete teacher');
        }

        return response.json();
    },

    // Search teachers
    async search(query: string, token: string): Promise<{ data: Teacher[] }> {
        const response = await fetch(`${API_URL}/dashboard/teachers/search?q=${encodeURIComponent(query)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to search teachers');
        }

        return response.json();
    },

    // Reset password
    async resetPassword(id: number, token: string): Promise<any> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${id}/reset-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reset password');
        }

        return response.json();
    },

    // ✅ Get teacher's classes
    async getClasses(teacherId: number, token: string): Promise<{ data: TeacherClass[] }> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${teacherId}/classes`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teacher classes');
        }

        return response.json();
    },

    // ✅ Get teacher's subjects
    async getSubjects(teacherId: number, token: string): Promise<{ data: TeacherSubject[] }> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${teacherId}/subjects`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teacher subjects');
        }

        return response.json();
    },
};