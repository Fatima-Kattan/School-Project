// src/hooks/useExams.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

// ====== Interfaces ======
export interface Exam {
    id: number;
    student_id: number;
    subject_id: number;
    date: string;
    note: string | null;
    duration: number; // duration in minutes
    exam_type: string; // e.g., 'quiz', 'midterm', 'final'
    mark: number;
    created_at: string;
    updated_at: string;
    // Optional relations
    student?: {
        id: number;
        name: string;
    };
    subject?: {
        id: number;
        name: string;
    };
}

export interface ExamListResponse {
    success: boolean;
    data: Exam[];
    total: number;
    message?: string;
}

export interface ExamSingleResponse {
    success: boolean;
    data: Exam;
    message?: string;
}

// ====== Services ======

// جلب جميع الامتحانات
const getExams = async (token: string): Promise<ExamListResponse> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/exams',
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
        console.error('🔥 [getExams] Failed:', error);
        throw error;
    }
};

// جلب امتحان محدد
const getExam = async (id: number, token: string): Promise<ExamSingleResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/exams/${id}`,
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
        console.error('🔥 [getExam] Failed:', error);
        throw error;
    }
};

// إنشاء امتحان جديد
const createExam = async (
    data: {
        student_id: number;
        subject_id: number;
        date: string;
        note?: string;
        duration: number;
        exam_type: string;
        mark: number;
    },
    token: string
): Promise<{ success: boolean; data: Exam; message?: string }> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/exams',
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
        console.error('🔥 [createExam] Failed:', error);
        throw error;
    }
};

// تحديث امتحان
const updateExam = async (
    id: number,
    data: Partial<{
        student_id: number;
        subject_id: number;
        date: string;
        note: string;
        duration: number;
        exam_type: string;
        mark: number;
    }>,
    token: string
): Promise<{ success: boolean; data: Exam; message?: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/exams/${id}`,
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
        console.error('🔥 [updateExam] Failed:', error);
        throw error;
    }
};

// حذف امتحان
const deleteExam = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/exams/${id}`,
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
        console.error('🔥 [deleteExam] Failed:', error);
        throw error;
    }
};

// البحث في الامتحانات
const searchExams = async (keyword: string, token: string): Promise<ExamListResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/exams/search?q=${encodeURIComponent(keyword)}`,
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
        console.error('🔥 [searchExams] Failed:', error);
        throw error;
    }
};

// جلب امتحانات طالب محدد
const getExamsByStudent = async (studentId: number, token: string): Promise<ExamListResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/students/${studentId}/exams`,
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
        console.error('🔥 [getExamsByStudent] Failed:', error);
        throw error;
    }
};

// جلب امتحانات مادة محددة
const getExamsBySubject = async (subjectId: number, token: string): Promise<ExamListResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/subjects/${subjectId}/exams`,
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
        console.error('🔥 [getExamsBySubject] Failed:', error);
        throw error;
    }
};

// تصفية الامتحانات حسب النوع
const getExamsByType = async (examType: string, token: string): Promise<ExamListResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/exams/type/${encodeURIComponent(examType)}`,
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
        console.error('🔥 [getExamsByType] Failed:', error);
        throw error;
    }
};

// حساب متوسط العلامات
const getAverageMark = async (token: string): Promise<{ success: boolean; average: number; message?: string }> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/exams/average',
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
        console.error('🔥 [getAverageMark] Failed:', error);
        throw error;
    }
};

// ====== Hook ======
interface UseExamsOptions {
    initialExams?: Exam[];
    singleExamMode?: boolean;
    examId?: number;
    searchKeyword?: string;
    studentId?: number;
    subjectId?: number;
    examType?: string;
    autoFetch?: boolean;
}

interface UseExamsReturn {
    exams: Exam[];
    loading: boolean;
    error: string | null;
    averageMark: number | null;
    refreshExams: () => Promise<void>;
    searchExams: (keyword: string) => Promise<void>;
    createExam: (data: any) => Promise<any>;
    updateExam: (id: number, data: any) => Promise<any>;
    deleteExam: (id: number) => Promise<void>;
    getExamsByStudent: (studentId: number) => Promise<any>;
    getExamsBySubject: (subjectId: number) => Promise<any>;
    getExamsByType: (examType: string) => Promise<any>;
    getAverageMark: () => Promise<number | null>;
    setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
    filterExamsByType: (type: string) => Exam[];
    filterExamsByStudent: (studentId: number) => Exam[];
    filterExamsBySubject: (subjectId: number) => Exam[];
    getTotalExamsCount: () => number;
    getPassingExams: (passingMark?: number) => Exam[];
    getFailingExams: (passingMark?: number) => Exam[];
}

export const useExams = (options: UseExamsOptions = {}): UseExamsReturn => {
    const {
        initialExams = [],
        singleExamMode = false,
        examId,
        searchKeyword,
        studentId,
        subjectId,
        examType,
        autoFetch = true,
    } = options;

    const [exams, setExams] = useState<Exam[]>(initialExams);
    const [loading, setLoading] = useState(!initialExams.length);
    const [error, setError] = useState<string | null>(null);
    const [averageMark, setAverageMark] = useState<number | null>(null);

    const getToken = useCallback(() => {
        return localStorage.getItem('token') || '';
    }, []);

    const fetchExams = useCallback(async () => {
        const token = getToken();

        if (!token) {
            setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // جلب امتحان واحد
            if (singleExamMode && examId) {
                console.log('📤 [useExams] Fetching single exam:', examId);
                const response = await getExam(examId, token);
                
                if (response.success && response.data) {
                    setExams([response.data]);
                } else {
                    setError(response.message || 'Exam not found');
                    setExams([]);
                }
                return;
            }

            // جلب امتحانات طالب
            if (studentId) {
                console.log('📤 [useExams] Fetching exams for student:', studentId);
                const response = await getExamsByStudent(studentId, token);
                
                if (response.success && response.data) {
                    setExams(response.data);
                } else {
                    setError(response.message || 'Failed to fetch student exams');
                }
                return;
            }

            // جلب امتحانات مادة
            if (subjectId) {
                console.log('📤 [useExams] Fetching exams for subject:', subjectId);
                const response = await getExamsBySubject(subjectId, token);
                
                if (response.success && response.data) {
                    setExams(response.data);
                } else {
                    setError(response.message || 'Failed to fetch subject exams');
                }
                return;
            }

            // جلب امتحانات حسب النوع
            if (examType) {
                console.log('📤 [useExams] Fetching exams by type:', examType);
                const response = await getExamsByType(examType, token);
                
                if (response.success && response.data) {
                    setExams(response.data);
                } else {
                    setError(response.message || 'Failed to fetch exams by type');
                }
                return;
            }

            // البحث
            if (searchKeyword) {
                console.log('🔍 [useExams] Searching exams:', searchKeyword);
                const response = await searchExams(searchKeyword, token);
                
                if (response.success && response.data) {
                    setExams(response.data);
                } else {
                    setError(response.message || 'Search failed');
                }
                return;
            }

            // جلب الكل
            console.log('📤 [useExams] Fetching all exams');
            const response = await getExams(token);
            
            if (response.success && response.data) {
                setExams(response.data);
            } else {
                setError(response.message || 'Failed to fetch exams');
            }
            
        } catch (err: any) {
            console.error('🔥 [useExams] Error:', err);
            setError(err.message || 'A connection error occurred');
            setExams([]);
        } finally {
            setLoading(false);
        }
    }, [getToken, singleExamMode, examId, studentId, subjectId, examType, searchKeyword]);

    // جلب متوسط العلامات
    const fetchAverageMark = useCallback(async () => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await getAverageMark(token);
            if (response.success) {
                setAverageMark(response.average);
            }
        } catch (err: any) {
            console.error('🔥 [fetchAverageMark] Error:', err);
        }
    }, [getToken]);

    useEffect(() => {
        if (initialExams.length > 0 && !examId && !searchKeyword && !studentId && !subjectId && !examType) {
            setExams(initialExams);
            setLoading(false);
        } else if (autoFetch) {
            fetchExams();
        }
    }, [initialExams.length, examId, searchKeyword, studentId, subjectId, examType, fetchExams, autoFetch]);

    useEffect(() => {
        if (autoFetch && !singleExamMode && !studentId && !subjectId && !examType) {
            fetchAverageMark();
        }
    }, [autoFetch, singleExamMode, studentId, subjectId, examType, fetchAverageMark]);

    // ====== Handlers ======

    const refreshExams = async () => {
        await fetchExams();
        if (!singleExamMode && !studentId && !subjectId && !examType) {
            await fetchAverageMark();
        }
    };

    const handleSearchExams = async (keyword: string) => {
        await fetchExams();
    };

    const handleCreateExam = async (data: any) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await createExam(data, token);
            if (response.success) {
                setExams(prev => [response.data, ...prev]);
                await fetchAverageMark(); // تحديث المتوسط
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateExam = async (id: number, data: any) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await updateExam(id, data, token);
            if (response.success) {
                setExams(prev => prev.map(e => e.id === id ? response.data : e));
                await fetchAverageMark(); // تحديث المتوسط
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExam = async (id: number): Promise<void> => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await deleteExam(id, token);
            if (response.success) {
                setExams(prev => prev.filter(e => e.id !== id));
                await fetchAverageMark(); // تحديث المتوسط
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleGetExamsByStudent = async (id: number) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await getExamsByStudent(id, token);
            if (response.success) {
                setExams(response.data);
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleGetExamsBySubject = async (id: number) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await getExamsBySubject(id, token);
            if (response.success) {
                setExams(response.data);
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleGetExamsByType = async (type: string) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await getExamsByType(type, token);
            if (response.success) {
                setExams(response.data);
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleGetAverageMark = async () => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            const response = await getAverageMark(token);
            if (response.success) {
                setAverageMark(response.average);
                return response.average;
            }
            return null;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    // ====== Helper Functions (تصفية محلية) ======

    const filterExamsByType = (type: string): Exam[] => {
        return exams.filter(exam => exam.exam_type === type);
    };

    const filterExamsByStudent = (id: number): Exam[] => {
        return exams.filter(exam => exam.student_id === id);
    };

    const filterExamsBySubject = (id: number): Exam[] => {
        return exams.filter(exam => exam.subject_id === id);
    };

    const getTotalExamsCount = (): number => {
        return exams.length;
    };

    const getPassingExams = (passingMark: number = 50): Exam[] => {
        return exams.filter(exam => exam.mark >= passingMark);
    };

    const getFailingExams = (passingMark: number = 50): Exam[] => {
        return exams.filter(exam => exam.mark < passingMark);
    };

    return {
        exams,
        loading,
        error,
        averageMark,
        refreshExams,
        searchExams: handleSearchExams,
        createExam: handleCreateExam,
        updateExam: handleUpdateExam,
        deleteExam: handleDeleteExam,
        getExamsByStudent: handleGetExamsByStudent,
        getExamsBySubject: handleGetExamsBySubject,
        getExamsByType: handleGetExamsByType,
        getAverageMark: handleGetAverageMark,
        setExams,
        filterExamsByType,
        filterExamsByStudent,
        filterExamsBySubject,
        getTotalExamsCount,
        getPassingExams,
        getFailingExams,
    };
};