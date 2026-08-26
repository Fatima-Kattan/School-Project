// src/hooks/useStudents.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

// ==================== تعريف الأنواع ====================

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
    updated_at?: string;
}

// تعريف استجابة الـ API العامة
interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    total?: number;
}

// ==================== دوال API ====================

const getStudents = async (
    token: string,
    filters?: { class_id?: number; section_id?: number }
): Promise<ApiResponse<Student[]>> => {
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

const getStudent = async (
    id: number,
    token: string
): Promise<ApiResponse<Student>> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/v1/dashboard/students/${id}`,
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

const getStudentsByClass = async (
    classId: number,
    token: string
): Promise<ApiResponse<Student[]>> => {
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

const getStudentsBySection = async (
    sectionId: number,
    token: string
): Promise<ApiResponse<Student[]>> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/v1/dashboard/students/section/${sectionId}`,
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
        console.error('🔥 [getStudentsBySection] Failed:', error);
        throw error;
    }
};

const searchStudents = async (
    keyword: string,
    token: string
): Promise<ApiResponse<Student[]>> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/v1/dashboard/students/search?q=${encodeURIComponent(
                keyword
            )}`,
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
        console.error('🔥 [searchStudents] Failed:', error);
        throw error;
    }
};

// ==================== Hook ====================

interface UseStudentsOptions {
    initialPage?: number;
    limit?: number;
    initialStudents?: Student[];
    singleStudentMode?: boolean;
    studentId?: number;
    classId?: number;
    sectionId?: number;
    searchKeyword?: string;
    hideInfiniteScroll?: boolean;
    filters?: {
        class_id?: number;
        section_id?: number;
    };
}

interface UseStudentsReturn {
    students: Student[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    refreshStudents: () => void;
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export const useStudents = (options: UseStudentsOptions = {}): UseStudentsReturn => {
    const {
        initialPage = 1,
        limit = 10,
        initialStudents = [],
        singleStudentMode = false,
        studentId,
        classId,
        sectionId,
        searchKeyword,
        hideInfiniteScroll = false,
        filters = {},
    } = options;

    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [loading, setLoading] = useState(!initialStudents.length);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(false);

    const getToken = useCallback(() => {
        return localStorage.getItem('token') || '';
    }, []);

    const fetchStudents = useCallback(async (page: number, isLoadMore = false) => {
        const token = getToken();

        if (!token) {
            setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // حالة جلب طالب واحد
            if (singleStudentMode && studentId) {
                console.log('📤 [useStudents] Fetching single student:', studentId);
                
                const response = await getStudent(studentId, token);
                
                if (response.success && response.data) {
                    console.log('✅ [useStudents] Single student loaded');
                    setStudents([response.data]);
                } else {
                    setError(response.message || 'Student not found');
                    setStudents([]);
                }
                setHasMore(false);
                return;
            }

            // حالة جلب الطلاب حسب الصف
            if (classId) {
                console.log('📤 [useStudents] Fetching students by class:', classId);
                
                const response = await getStudentsByClass(classId, token);
                
                if (response.success && response.data) {
                    console.log('✅ [useStudents] Students by class loaded:', response.data.length);
                    
                    if (isLoadMore) {
                        setStudents(prev => [...prev, ...response.data]);
                    } else {
                        setStudents(response.data);
                    }
                    
                    setHasMore(false);
                } else {
                    setError(response.message || 'Failed to fetch students by class');
                }
                return;
            }

            // حالة جلب الطلاب حسب الشعبة
            if (sectionId) {
                console.log('📤 [useStudents] Fetching students by section:', sectionId);
                
                const response = await getStudentsBySection(sectionId, token);
                
                if (response.success && response.data) {
                    console.log('✅ [useStudents] Students by section loaded:', response.data.length);
                    
                    if (isLoadMore) {
                        setStudents(prev => [...prev, ...response.data]);
                    } else {
                        setStudents(response.data);
                    }
                    
                    setHasMore(false);
                } else {
                    setError(response.message || 'Failed to fetch students by section');
                }
                return;
            }

            // حالة البحث
            if (searchKeyword) {
                console.log('🔍 [useStudents] Searching students:', searchKeyword);
                
                const response = await searchStudents(searchKeyword, token);
                
                if (response.success && response.data) {
                    console.log('✅ [useStudents] Search results loaded:', response.data.length);
                    
                    if (isLoadMore) {
                        setStudents(prev => [...prev, ...response.data]);
                    } else {
                        setStudents(response.data);
                    }
                    
                    setHasMore(false);
                } else {
                    setError(response.message || 'Search failed');
                }
                return;
            }

            // الحالة الافتراضية: جلب جميع الطلاب مع الفلاتر
            console.log('📤 [useStudents] Fetching all students with filters:', filters);
            
            const response = await getStudents(token, filters);
            
            if (response.success && response.data) {
                const studentsData = response.data || [];
                
                console.log('✅ [useStudents] Students loaded:', studentsData.length);
                
                if (isLoadMore) {
                    setStudents(prev => [...prev, ...studentsData]);
                } else {
                    setStudents(studentsData);
                }
                
                setHasMore(false);
            } else {
                setError(response.message || 'Failed to fetch students');
            }
            
        } catch (err: any) {
            console.error('🔥 [useStudents] Error in fetchStudents:', err);
            setError(err.message || 'A connection error occurred');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }, [
        getToken,
        singleStudentMode,
        studentId,
        classId,
        sectionId,
        searchKeyword,
        filters,
    ]);

    useEffect(() => {
        if (initialStudents.length > 0 && !classId && !sectionId && !searchKeyword && !studentId) {
            console.log('📦 [useStudents] Using initial students:', initialStudents.length);
            setStudents(initialStudents);
            setLoading(false);
            setHasMore(false);
        } else {
            fetchStudents(1, false);
        }
    }, [
        initialStudents.length,
        classId,
        sectionId,
        searchKeyword,
        studentId,
        fetchStudents,
    ]);

    const loadMore = () => {
        if (hasMore && !loading && !hideInfiniteScroll) {
            console.log('⬇️ [useStudents] Loading more students...');
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchStudents(nextPage, true);
        }
    };

    const refreshStudents = () => {
        console.log('🔄 [useStudents] Refreshing students...');
        setCurrentPage(1);
        fetchStudents(1, false);
    };

    return {
        students,
        loading,
        error,
        hasMore,
        loadMore,
        refreshStudents,
        setStudents,
    };
};