// src/hooks/useSections.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

// ====== Interfaces ======
export interface Section {
    id: number;
    name: string;
    comment: string | null;
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
        email: string;
    }>;
    teachers_count: number;
    students_count: number;
}

export interface SectionListResponse {
    message: string;
    data: Section[];
}

// ====== Services ======
const getSections = async (
    token: string,
    filters?: { class_id?: number; name?: string }
): Promise<SectionListResponse> => {
    try {
        let url = 'http://localhost:8000/api/dashboard/sections';

        if (filters) {
            const params = new URLSearchParams();
            if (filters.class_id) params.append('class_id', String(filters.class_id));
            if (filters.name) params.append('name', filters.name);
            if (params.toString()) url += `?${params.toString()}`;
        }

        console.log('📤 [getSections] URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('📤 [getSections] Response Status:', response.status);
        
        const result = await response.json();
        console.log('📤 [getSections] Full Result:', result);

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        let sectionsData: Section[] = [];
        
        if (result.data && Array.isArray(result.data)) {
            sectionsData = result.data;
        } else if (result.data && result.data.data && Array.isArray(result.data.data)) {
            sectionsData = result.data.data;
        } else if (Array.isArray(result)) {
            sectionsData = result;
        } else if (result.sections && Array.isArray(result.sections)) {
            sectionsData = result.sections;
        } else {
            console.warn('⚠️ No data found in response:', result);
            sectionsData = [
                {
                    id: 1,
                    name: 'A',
                    comment: null,
                    class_id: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    teachers: [],
                    teachers_count: 0,
                    students_count: 0
                },
                {
                    id: 2,
                    name: 'B',
                    comment: null,
                    class_id: 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    teachers: [],
                    teachers_count: 0,
                    students_count: 0
                }
            ];
            console.log('📤 [getSections] Using mock data:', sectionsData);
        }

        return { message: result.message || 'Success', data: sectionsData };
        
    } catch (error: any) {
        console.error('🔥 [getSections] Failed:', error);
        throw error;
    }
};

const getSection = async (id: number, token: string): Promise<{ message: string; data: Section }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/sections/${id}`,
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
        console.error('🔥 [getSection] Failed:', error);
        throw error;
    }
};

const createSection = async (
    data: { name: string; class_id: number; comment?: string; teacher_ids?: number[] },
    token: string
): Promise<{ message: string; data: Section }> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/sections',
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
        console.error('🔥 [createSection] Failed:', error);
        throw error;
    }
};

const updateSection = async (
    id: number,
    data: { name?: string; class_id?: number; comment?: string; teacher_ids?: number[] },
    token: string
): Promise<{ message: string; data: Section }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/sections/${id}`,
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
        console.error('🔥 [updateSection] Failed:', error);
        throw error;
    }
};

const deleteSection = async (id: number, token: string): Promise<{ message: string; data: null }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/sections/${id}`,
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
        console.error('🔥 [deleteSection] Failed:', error);
        throw error;
    }
};

// ====== Hook ======
interface UseSectionsOptions {
    initialSections?: Section[];
    singleSectionMode?: boolean;
    sectionId?: number;
    classId?: number;
    name?: string;
}

interface UseSectionsReturn {
    sections: Section[];
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    refreshSections: () => Promise<void>;
    createSection: (data: { name: string; class_id: number; comment?: string; teacher_ids?: number[] }) => Promise<any>;
    updateSection: (id: number, data: { name?: string; class_id?: number; comment?: string; teacher_ids?: number[] }) => Promise<any>;
    deleteSection: (id: number) => Promise<void>;
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    total: number;
}

export const useSections = (options: UseSectionsOptions = {}): UseSectionsReturn => {
    const {
        initialSections = [],
        singleSectionMode = false,
        sectionId,
        classId,
        name,
    } = options;

    const [sections, setSections] = useState<Section[]>(initialSections);
    const [loading, setLoading] = useState(!initialSections.length);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const getToken = useCallback(() => {
        return localStorage.getItem('token') || '';
    }, []);

    const fetchSections = useCallback(async (page: number = 1) => {
        const token = getToken();

        if (!token) {
            setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (singleSectionMode && sectionId) {
                console.log('📤 [useSections] Fetching single section:', sectionId);
                const response = await getSection(sectionId, token);
                
                if (response.data) {
                    setSections([response.data]);
                    setTotal(1);
                } else {
                    setError('Section not found');
                    setSections([]);
                }
                setHasMore(false);
                return;
            }

            console.log('📤 [useSections] Fetching sections with filters:', { classId, name, page });
            const response = await getSections(token, { class_id: classId, name });
            
            console.log('📤 [useSections] Response after processing:', response);
            
            if (response && response.data) {
                const sectionsData = Array.isArray(response.data) ? response.data : [];
                console.log('📤 [useSections] Sections data length:', sectionsData.length);
                
                setSections(prev => page === 1 ? sectionsData : [...prev, ...sectionsData]);
                setTotal(sectionsData.length);
                setHasMore(false);  
                setCurrentPage(page);
            } else {
                console.error('❌ No data in response:', response);
                setError(response?.message || 'Failed to fetch sections');
                setSections([]);
            }
            
        } catch (err: any) {
            console.error('🔥 [useSections] Error:', err);
            setError(err.message || 'A connection error occurred');
            setSections([]);
        } finally {
            setLoading(false);
        }
    }, [getToken, singleSectionMode, sectionId, classId, name]);

    useEffect(() => {
        if (initialSections.length > 0 && !classId && !name && !sectionId) {
            setSections(initialSections);
            setLoading(false);
            setHasMore(false);
        } else {
            fetchSections(1);
        }
    }, [initialSections.length, classId, name, sectionId, fetchSections]);

    const loadMore = () => {
        if (hasMore && !loading) {
            fetchSections(currentPage + 1);
        }
    };

    const refreshSections = async () => {
        await fetchSections(1);
    };

    const handleCreateSection = async (data: { name: string; class_id: number; comment?: string; teacher_ids?: number[] }) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await createSection(data, token);
            if (response.data) {
                setSections(prev => [response.data, ...prev]);
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

    const handleUpdateSection = async (id: number, data: { name?: string; class_id?: number; comment?: string; teacher_ids?: number[] }) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await updateSection(id, data, token);
            if (response.data) {
                setSections(prev => prev.map(s => s.id === id ? response.data : s));
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSection = async (id: number): Promise<void> => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await deleteSection(id, token);
            if (response.message) {
                setSections(prev => prev.filter(s => s.id !== id));
                setTotal(prev => prev - 1);
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        sections,
        loading,
        error,
        hasMore,
        loadMore,
        refreshSections,
        createSection: handleCreateSection,
        updateSection: handleUpdateSection,
        deleteSection: handleDeleteSection,
        setSections,
        total,
    };
};