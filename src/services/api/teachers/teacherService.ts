// services/api/teachers/teacherService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL_2 = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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

export interface Section {
    id: number;
    name: string;
    class_id: number;
    class_name?: string;
}

export interface Subject {
    id: number;
    name: string;
    code?: string;
}

export interface TeacherWithDetails {
    id: number;
    full_name: string;
    user_name: string;
    email: string;
    gender: 'ذكر' | 'أنثى';
    phone_number: string;
    comment: string | null;
    created_at: string;
    updated_at: string;
    classes: {
        class_id: number;
        class_name: string;
        sections: {
            section_id: number;
            section_name: string;
        }[];
        subjects?: {
            name: string;
        }[];
    }[];
    subjects: string[];
    total_sections: number;
    total_subjects: number;
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

    // ✅ دالة إنشاء الأستاذ
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

    // ✅ دالة تحديث الشعب والمواد
    async updateTeacherSectionsAndSubjects(teacherId: number, data: { sections: number[], subjects: number[] }, token: string): Promise<any> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${teacherId}/assign-sections-subjects`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update teacher sections and subjects');
        }

        return response.json();
    },

    async getSectionsAndSubjects(token: string): Promise<{
        sections: Section[];
        subjects: Subject[];
        classes: any[];
    }> {
        try {
            console.log('🔄 Fetching sections and subjects...');

            const [sectionsRes, subjectsRes, classesRes] = await Promise.all([
                fetch(`${API_URL}/dashboard/sections/for-dialog`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(`${API_URL}/dashboard/subjects`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }),
                fetch(`${API_URL}/dashboard/classes`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }),
            ]);

            if (!sectionsRes.ok) {
                const error = await sectionsRes.text();
                console.error('❌ Sections API Error:', error);
                throw new Error(`Sections API error: ${sectionsRes.status}`);
            }

            if (!subjectsRes.ok) {
                const error = await subjectsRes.text();
                console.error('❌ Subjects API Error:', error);
                throw new Error(`Subjects API error: ${subjectsRes.status}`);
            }

            if (!classesRes.ok) {
                const error = await classesRes.text();
                console.error('❌ Classes API Error:', error);
                throw new Error(`Classes API error: ${classesRes.status}`);
            }

            const sectionsData = await sectionsRes.json();
            const subjectsData = await subjectsRes.json();
            const classesData = await classesRes.json();

            console.log('✅ Sections Response:', sectionsData);
            console.log('✅ Subjects Response:', subjectsData);
            console.log('✅ Classes Response:', classesData);

            // ✅ استخراج البيانات من Sections
            let sections = [];
            if (sectionsData.data && Array.isArray(sectionsData.data)) {
                sections = sectionsData.data;
            } else if (sectionsData.data && sectionsData.data.data) {
                sections = sectionsData.data.data;
            } else if (Array.isArray(sectionsData)) {
                sections = sectionsData;
            } else {
                sections = [];
            }

            // ✅ استخراج البيانات من Subjects مع class_id من الكائن
            let subjects = [];
            if (subjectsData.data && Array.isArray(subjectsData.data)) {
                subjects = subjectsData.data.map((subject: any) => ({
                    id: subject.id,
                    name: subject.name,
                    code: subject.code || '',
                    comment: subject.comment || '',
                    full_mark: subject.full_mark || null,
                    // ✅ استخراج class_id من الكائن class
                    class_id: subject.class?.id || null,
                    class_name: subject.class?.name || null,
                }));
            } else if (subjectsData.data && subjectsData.data.data) {
                subjects = subjectsData.data.data.map((subject: any) => ({
                    id: subject.id,
                    name: subject.name,
                    code: subject.code || '',
                    comment: subject.comment || '',
                    full_mark: subject.full_mark || null,
                    class_id: subject.class?.id || null,
                    class_name: subject.class?.name || null,
                }));
            } else if (Array.isArray(subjectsData)) {
                subjects = subjectsData.map((subject: any) => ({
                    id: subject.id,
                    name: subject.name,
                    code: subject.code || '',
                    comment: subject.comment || '',
                    full_mark: subject.full_mark || null,
                    class_id: subject.class?.id || null,
                    class_name: subject.class?.name || null,
                }));
            } else {
                subjects = [];
            }

            // ✅ استخراج البيانات من Classes
            let classes = [];
            if (classesData.data && Array.isArray(classesData.data)) {
                classes = classesData.data;
            } else if (classesData.data && classesData.data.data) {
                classes = classesData.data.data;
            } else if (Array.isArray(classesData)) {
                classes = classesData;
            } else {
                classes = [];
            }

            console.log('📦 Extracted Sections:', sections);
            console.log('📦 Extracted Subjects with class_id:', subjects);
            console.log('📦 Extracted Classes:', classes);

            return {
                sections: sections,
                subjects: subjects,
                classes: classes,
            };
        } catch (error) {
            console.error('❌ Error in getSectionsAndSubjects:', error);
            throw error;
        }
    },

    // Update teacher
    async getTeacherForEdit(id: number, token: string): Promise<any> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${id}/edit`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teacher details');
        }

        return response.json();
    },

    // ✅ دالة جلب بيانات أستاذ مع التفاصيل (للعرض)
    async getTeacherWithDetails(id: number, token: string): Promise<any> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${id}/details`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teacher details');
        }

        return response.json();
    },

    // ✅ دالة تحديث الأستاذ
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

    // Get teacher's classes
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

    // Get teacher's subjects
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

    // Get all teachers with their full details
    async getAllWithDetails(token: string): Promise<{
        success: boolean;
        data: TeacherWithDetails[];
        total: number
    }> {
        const response = await fetch(`${API_URL}/dashboard/teachers/all-with-details`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teachers with details');
        }

        return response.json();
    },

    // Get single teacher with full details
    async getWithDetails(id: number, token: string): Promise<{
        success: boolean;
        data: TeacherWithDetails
    }> {
        const response = await fetch(`${API_URL}/dashboard/teachers/${id}/details`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch teacher details');
        }

        return response.json();
    }
};