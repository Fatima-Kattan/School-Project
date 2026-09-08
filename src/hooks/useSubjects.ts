// src/hooks/useSubjects.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

// ====== Interfaces ======
export interface Subject {
    id: number;
    name: string;
    comment: string | null;
    full_mark: number;
    class_id: number;
    created_at: string;
    updated_at: string;
    class?: {
        id: number;
        name: string;
    };
    teachers: Array<{
        id: number;
        full_name: string;
        phone_number?: string;
    }>;
    files_count?: number;
    files?: Array<{
        id: number;
        name: string;
        path: string;
    }>;
    students?: Array<{
        id: number;
        full_name: string;
        mark?: number;
        exam_type?: string;
        date?: string;
        note?: string;
        duration?: string;
    }>;
    teachers_count?: number;
}

export interface SubjectListResponse {
    success: boolean;
    data: Subject[];
    total: number;
    message?: string;
}

export interface SubjectSingleResponse {
    success: boolean;
    data: Subject;
    message?: string;
}

// ====== Services ======

/**
 * جلب قائمة المواد مع إمكانية التصفية
 */
const getSubjects = async (
    token: string,
    filters?: { 
        name?: string; 
        class_id?: number; 
        full_mark?: number;
        q?: string; // للبحث
    }
): Promise<SubjectListResponse> => {
    try {
        let url = 'http://localhost:8000/api/dashboard/subjects';

        if (filters) {
            const params = new URLSearchParams();
            if (filters.name) params.append('name', filters.name);
            if (filters.class_id) params.append('class_id', String(filters.class_id));
            if (filters.full_mark) params.append('full_mark', String(filters.full_mark));
            if (filters.q) params.append('q', filters.q);
            if (params.toString()) url += `?${params.toString()}`;
        }

        console.log('📤 [getSubjects] URL:', url);

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

        // التحقق من هيكل البيانات
        let subjectsData: Subject[] = [];
        
        if (result.data && Array.isArray(result.data)) {
            subjectsData = result.data;
        } else if (result.data && result.data.data && Array.isArray(result.data.data)) {
            subjectsData = result.data.data;
        } else if (Array.isArray(result)) {
            subjectsData = result;
        } else {
            console.warn('⚠️ No data found in response:', result);
            // بيانات وهمية للاختبار
            subjectsData = [
                {
                    id: 1,
                    name: 'الرياضيات',
                    comment: 'المادة الأساسية',
                    full_mark: 100,
                    class_id: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    class: { id: 1, name: 'الصف الأول' },
                    teachers: [],
                    files_count: 0
                },
                {
                    id: 2,
                    name: 'العلوم',
                    comment: null,
                    full_mark: 100,
                    class_id: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    class: { id: 1, name: 'الصف الأول' },
                    teachers: [],
                    files_count: 0
                }
            ];
        }

        return { 
            success: true, 
            data: subjectsData, 
            total: subjectsData.length 
        };
        
    } catch (error: any) {
        console.error('🔥 [getSubjects] Failed:', error);
        throw error;
    }
};

/**
 * جلب مادة محددة بواسطة ID
 */
const getSubject = async (
    id: number, 
    token: string
): Promise<SubjectSingleResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/subjects/${id}`,
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
        console.error('🔥 [getSubject] Failed:', error);
        throw error;
    }
};

/**
 * إنشاء مادة جديدة
 */
const createSubject = async (
    data: { 
        name: string; 
        class_id: number; 
        full_mark: number; 
        comment?: string; 
        teacher_ids?: number[];
    },
    token: string
): Promise<SubjectSingleResponse> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/subjects',
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
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [createSubject] Failed:', error);
        throw error;
    }
};

/**
 * تحديث مادة موجودة
 */
const updateSubject = async (
    id: number,
    data: { 
        name?: string; 
        class_id?: number; 
        full_mark?: number; 
        comment?: string; 
        teacher_ids?: number[];
    },
    token: string
): Promise<SubjectSingleResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/subjects/${id}`,
            {
                method: 'PUT',
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
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [updateSubject] Failed:', error);
        throw error;
    }
};

/**
 * حذف مادة
 */
const deleteSubject = async (
    id: number, 
    token: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/subjects/${id}`,
            {
                method: 'DELETE',
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
        console.error('🔥 [deleteSubject] Failed:', error);
        throw error;
    }
};

/**
 * تعيين مدرس لمادة
 */
const assignTeacherToSubject = async (
    data: { subject_id: number; teacher_id: number },
    token: string
): Promise<any> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/subjects/assign-teacher',
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
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [assignTeacherToSubject] Failed:', error);
        throw error;
    }
};

/**
 * إلغاء تعيين مدرس من مادة
 */
const removeTeacherFromSubject = async (
    data: { subject_id: number; teacher_id: number },
    token: string
): Promise<any> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/subjects/remove-teacher',
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
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [removeTeacherFromSubject] Failed:', error);
        throw error;
    }
};

/**
 * جلب المواد حسب الصف والشعبة
 */
const getSubjectsByClassAndSection = async (
    classId: number,
    sectionId: number,
    token: string
): Promise<SubjectListResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/subjects/class/${classId}/section/${sectionId}`,
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
        console.error('🔥 [getSubjectsByClassAndSection] Failed:', error);
        throw error;
    }
};

// ====== Hook ======

interface UseSubjectsOptions {
    initialSubjects?: Subject[];
    singleSubjectMode?: boolean;
    subjectId?: number;
    classId?: number;
    name?: string;
    fullMark?: number;
    searchQuery?: string;
}

interface UseSubjectsReturn {
    subjects: Subject[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    refreshSubjects: () => Promise<void>;
    createSubject: (data: { 
        name: string; 
        class_id: number; 
        full_mark: number; 
        comment?: string; 
        teacher_ids?: number[];
    }) => Promise<any>;
    updateSubject: (id: number, data: { 
        name?: string; 
        class_id?: number; 
        full_mark?: number; 
        comment?: string; 
        teacher_ids?: number[];
    }) => Promise<any>;
    deleteSubject: (id: number) => Promise<void>;
    assignTeacher: (subjectId: number, teacherId: number) => Promise<any>;
    removeTeacher: (subjectId: number, teacherId: number) => Promise<any>;
    getSubjectsByClassAndSection: (classId: number, sectionId: number) => Promise<Subject[]>;
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
    total: number;
    searchSubjects: (query: string) => Promise<void>;
}

export const useSubjects = (options: UseSubjectsOptions = {}): UseSubjectsReturn => {
    const {
        initialSubjects = [],
        singleSubjectMode = false,
        subjectId,
        classId,
        name,
        fullMark,
        searchQuery,
    } = options;

    const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
    const [loading, setLoading] = useState(!initialSubjects.length);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');

    const getToken = useCallback(() => {
        return localStorage.getItem('token') || '';
    }, []);

    /**
     * جلب المواد مع التصفية
     */
    const fetchSubjects = useCallback(async (page: number = 1) => {
        const token = getToken();

        if (!token) {
            setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // وضع عرض مادة واحدة
            if (singleSubjectMode && subjectId) {
                console.log('📤 [useSubjects] Fetching single subject:', subjectId);
                const response = await getSubject(subjectId, token);
                
                if (response.data) {
                    setSubjects([response.data]);
                    setTotal(1);
                } else {
                    setError('Subject not found');
                    setSubjects([]);
                }
                setHasMore(false);
                return;
            }

            // بناء الفلاتر
            const filters: any = {};
            if (classId) filters.class_id = classId;
            if (name) filters.name = name;
            if (fullMark) filters.full_mark = fullMark;
            if (currentSearchQuery) filters.q = currentSearchQuery;

            console.log('📤 [useSubjects] Fetching subjects with filters:', filters);
            const response = await getSubjects(token, filters);
            
            if (response && response.data) {
                const subjectsData = Array.isArray(response.data) ? response.data : [];
                setSubjects(prev => page === 1 ? subjectsData : [...prev, ...subjectsData]);
                setTotal(response.total || subjectsData.length);
                setHasMore(false);
                setCurrentPage(page);
            } else {
                setError(response.message || 'Failed to fetch subjects');
                setSubjects([]);
            }
            
        } catch (err: any) {
            console.error('🔥 [useSubjects] Error:', err);
            setError(err.message || 'حدث خطأ في الاتصال');
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    }, [getToken, singleSubjectMode, subjectId, classId, name, fullMark, currentSearchQuery]);

    /**
     * البحث في المواد
     */
    const searchSubjects = useCallback(async (query: string) => {
        setCurrentSearchQuery(query);
        if (query.trim()) {
            await fetchSubjects(1);
        } else {
            // إذا كان البحث فارغاً، جلب كل المواد
            setCurrentSearchQuery('');
            await fetchSubjects(1);
        }
    }, [fetchSubjects]);

    // تأثير التحميل الأولي
    useEffect(() => {
        if (initialSubjects.length > 0 && !classId && !name && !subjectId && !searchQuery) {
            setSubjects(initialSubjects);
            setLoading(false);
            setHasMore(false);
        } else {
            fetchSubjects(1);
        }
    }, [initialSubjects.length, classId, name, subjectId, searchQuery, fetchSubjects]);

    // تحميل المزيد (للترقيم)
    const loadMore = () => {
        if (hasMore && !loading) {
            fetchSubjects(currentPage + 1);
        }
    };

    // تحديث القائمة
    const refreshSubjects = async () => {
        await fetchSubjects(1);
    };

    // إنشاء مادة جديدة
    const handleCreateSubject = async (data: { 
        name: string; 
        class_id: number; 
        full_mark: number; 
        comment?: string; 
        teacher_ids?: number[];
    }) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await createSubject(data, token);
            if (response.data) {
                setSubjects(prev => [response.data, ...prev]);
                setTotal(prev => prev + 1);
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // تحديث مادة
    const handleUpdateSubject = async (id: number, data: { 
        name?: string; 
        class_id?: number; 
        full_mark?: number; 
        comment?: string; 
        teacher_ids?: number[];
    }) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await updateSubject(id, data, token);
            if (response.data) {
                setSubjects(prev => prev.map(s => s.id === id ? response.data : s));
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // حذف مادة
    const handleDeleteSubject = async (id: number): Promise<void> => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await deleteSubject(id, token);
            if (response.success) {
                setSubjects(prev => prev.filter(s => s.id !== id));
                setTotal(prev => prev - 1);
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // تعيين مدرس لمادة
    const handleAssignTeacher = async (subjectId: number, teacherId: number) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await assignTeacherToSubject({ subject_id: subjectId, teacher_id: teacherId }, token);
            
            // تحديث قائمة المواد لإضافة المدرس
            if (response.success) {
                await refreshSubjects();
            }
            
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // إلغاء تعيين مدرس من مادة
    const handleRemoveTeacher = async (subjectId: number, teacherId: number) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await removeTeacherFromSubject({ subject_id: subjectId, teacher_id: teacherId }, token);
            
            // تحديث قائمة المواد لإزالة المدرس
            if (response.success) {
                await refreshSubjects();
            }
            
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // جلب المواد حسب الصف والشعبة
    const handleGetSubjectsByClassAndSection = async (classId: number, sectionId: number) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await getSubjectsByClassAndSection(classId, sectionId, token);
            if (response.data) {
                setSubjects(response.data);
                setTotal(response.total || response.data.length);
                return response.data;
            }
            return [];
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        subjects,
        loading,
        error,
        hasMore,
        loadMore,
        refreshSubjects,
        createSubject: handleCreateSubject,
        updateSubject: handleUpdateSubject,
        deleteSubject: handleDeleteSubject,
        assignTeacher: handleAssignTeacher,
        removeTeacher: handleRemoveTeacher,
        getSubjectsByClassAndSection: handleGetSubjectsByClassAndSection,
        setSubjects,
        total,
        searchSubjects,
    };
};