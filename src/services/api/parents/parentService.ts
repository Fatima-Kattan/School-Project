// services/api/parents/parentService.ts

'use client';

const API_BASE_URL = 'http://localhost:8000/api/dashboard';

// ====== Types ======
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

// ====== API Functions ======
export const parentService = {
    // GET: جلب كل أولياء الأمور
    getAll: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },

    // GET: جلب ولي أمر واحد
    getOne: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },

    // POST: إنشاء ولي أمر
    create: async (data: any, token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    // PUT: تحديث ولي أمر
    update: async (id: number, data: any, token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    // DELETE: حذف ولي أمر
    delete: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },

    // GET: البحث
    search: async (keyword: string, token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents/search?q=${encodeURIComponent(keyword)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },

    // GET: أبناء ولي الأمر
    getChildren: async (parentId: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents/${parentId}/children`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },

    // GET: إحصائيات
    getStatistics: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents/statistics`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },
};

// ====== Helper ======
const handleResponse = async (response: Response) => {
    const result = await response.json();
    
    if (!response.ok) {
        if (result.errors) {
            const errorMessages = Object.values(result.errors).flat().join(', ');
            throw new Error(errorMessages);
        }
        throw new Error(result.message || `HTTP ${response.status}`);
    }
    
    return result;
};