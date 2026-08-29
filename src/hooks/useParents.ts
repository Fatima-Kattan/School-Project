// src/hooks/useParents.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

// ====== Interfaces ======
export interface Parent {
    id: number;
    user_name: string | null;
    email: string | null;
    full_name_father: string;
    full_name_mother: string;
    job_father: string;
    job_mother: string;
    phone_number_father: string;
    phone_number_mother: string;
    created_at: string;
    updated_at: string;
}

export interface ParentListResponse {
    success: boolean;
    data: Parent[];
    total: number;
    message?: string;
}

// ====== Services ======
const getParents = async (token: string): Promise<ParentListResponse> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/parents',
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
        console.error('🔥 [getParents] Failed:', error);
        throw error;
    }
};

const getParent = async (id: number, token: string): Promise<{ success: boolean; data: Parent; message?: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/parents/${id}`,
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
        console.error('🔥 [getParent] Failed:', error);
        throw error;
    }
};

const createParent = async (
    data: {
        full_name_father: string;
        full_name_mother: string;
        job_father: string;
        job_mother: string;
        phone_number_father: string;
        phone_number_mother: string;
        email: string;
    },
    token: string
): Promise<{ success: boolean; data: any; message?: string }> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/parents',
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
        console.error('🔥 [createParent] Failed:', error);
        throw error;
    }
};

const updateParent = async (
    id: number,
    data: Partial<{
        full_name_father: string;
        full_name_mother: string;
        job_father: string;
        job_mother: string;
        phone_number_father: string;
        phone_number_mother: string;
    }>,
    token: string
): Promise<{ success: boolean; data: Parent; message?: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/parents/${id}`,
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
        console.error('🔥 [updateParent] Failed:', error);
        throw error;
    }
};

const deleteParent = async (id: number, token: string): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/parents/${id}`,
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
        console.error('🔥 [deleteParent] Failed:', error);
        throw error;
    }
};

const searchParents = async (keyword: string, token: string): Promise<ParentListResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/parents/search?q=${encodeURIComponent(keyword)}`,
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
        console.error('🔥 [searchParents] Failed:', error);
        throw error;
    }
};

const getParentChildren = async (parentId: number, token: string): Promise<any> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/parents/${parentId}/children`,
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
        console.error('🔥 [getParentChildren] Failed:', error);
        throw error;
    }
};

// ====== Hook ======
interface UseParentsOptions {
    initialParents?: Parent[];
    singleParentMode?: boolean;
    parentId?: number;
    searchKeyword?: string;
}

interface UseParentsReturn {
    parents: Parent[];
    loading: boolean;
    error: string | null;
    refreshParents: () => Promise<void>;
    searchParents: (keyword: string) => Promise<void>;
    createParent: (data: any) => Promise<any>;
    updateParent: (id: number, data: any) => Promise<any>;
    deleteParent: (id: number) => Promise<void>;
    getParentChildren: (parentId: number) => Promise<any>;
    setParents: React.Dispatch<React.SetStateAction<Parent[]>>;
}

export const useParents = (options: UseParentsOptions = {}): UseParentsReturn => {
    const {
        initialParents = [],
        singleParentMode = false,
        parentId,
        searchKeyword,
    } = options;

    const [parents, setParents] = useState<Parent[]>(initialParents);
    const [loading, setLoading] = useState(!initialParents.length);
    const [error, setError] = useState<string | null>(null);

    const getToken = useCallback(() => {
        return localStorage.getItem('token') || '';
    }, []);

    const fetchParents = useCallback(async () => {
        const token = getToken();

        if (!token) {
            setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (singleParentMode && parentId) {
                console.log('📤 [useParents] Fetching single parent:', parentId);
                const response = await getParent(parentId, token);
                
                if (response.success && response.data) {
                    setParents([response.data]);
                } else {
                    setError(response.message || 'Parent not found');
                    setParents([]);
                }
                return;
            }

            if (searchKeyword) {
                console.log('🔍 [useParents] Searching parents:', searchKeyword);
                const response = await searchParents(searchKeyword, token);
                
                if (response.success && response.data) {
                    setParents(response.data);
                } else {
                    setError(response.message || 'Search failed');
                }
                return;
            }

            console.log('📤 [useParents] Fetching all parents');
            const response = await getParents(token);
            
            if (response.success && response.data) {
                setParents(response.data);
            } else {
                setError(response.message || 'Failed to fetch parents');
            }
            
        } catch (err: any) {
            console.error('🔥 [useParents] Error:', err);
            setError(err.message || 'A connection error occurred');
            setParents([]);
        } finally {
            setLoading(false);
        }
    }, [getToken, singleParentMode, parentId, searchKeyword]);

    useEffect(() => {
        if (initialParents.length > 0 && !parentId && !searchKeyword) {
            setParents(initialParents);
            setLoading(false);
        } else {
            fetchParents();
        }
    }, [initialParents.length, parentId, searchKeyword, fetchParents]);

    const refreshParents = async () => {
        await fetchParents();
    };

    const handleSearchParents = async (keyword: string) => {
        await fetchParents();
    };

    const handleCreateParent = async (data: any) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await createParent(data, token);
            if (response.success) {
                setParents(prev => [response.data.parent, ...prev]);
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateParent = async (id: number, data: any) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await updateParent(id, data, token);
            if (response.success) {
                setParents(prev => prev.map(p => p.id === id ? response.data : p));
            }
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    
    const handleDeleteParent = async (id: number): Promise<void> => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            setLoading(true);
            const response = await deleteParent(id, token);
            if (response.success) {
                setParents(prev => prev.filter(p => p.id !== id));
            }
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleGetParentChildren = async (id: number) => {
        const token = getToken();
        if (!token) {
            setError('لم يتم العثور على رمز المصادقة');
            throw new Error('No token found');
        }

        try {
            const response = await getParentChildren(id, token);
            return response;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        parents,
        loading,
        error,
        refreshParents,
        searchParents: handleSearchParents,
        createParent: handleCreateParent,
        updateParent: handleUpdateParent,
        deleteParent: handleDeleteParent,
        getParentChildren: handleGetParentChildren,
        setParents,
    };
};