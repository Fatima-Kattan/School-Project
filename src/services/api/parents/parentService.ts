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
    // إضافات من جدول المستخدم
    user_id?: number;
    decrypted_password?: string; // كلمة السر بعد فك التشفير
}

// ====== Helper: فك تشفير كلمة السر ======
const decryptPassword = (encryptedPassword: string): string => {
    try {
        // إذا كانت كلمة السر مشفرة بـ Base64
        return atob(encryptedPassword);
    } catch {
        // إذا كانت غير مشفرة ترجع كما هي
        return encryptedPassword;
    }
};

// ====== API Functions ======
export const parentService = {
    // GET: جلب كل أولياء الأمور مع فك تشفير كلمة السر
    getAll: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await handleResponse(response);


        // فك تشفير كلمة السر لكل ولي أمر
        if (result.data && Array.isArray(result.data)) {
            result.data = result.data.map((parent: any) => {
                // إذا كان فيه user مع password مشفر
                if (parent.user && parent.user.password) {
                    return {
                        ...parent,
                        decrypted_password: decryptPassword(parent.user.password),
                        user_name: parent.user.user_name || parent.user_name,
                        email: parent.user.email || parent.email,
                    };
                }
                return parent;
            });
        }

        return result;
    },

    // GET: جلب ولي أمر واحد مع فك تشفير كلمة السر
    getOne: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/parents/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const result = await handleResponse(response);

        // فك تشفير كلمة السر
        if (result.data && result.data.user && result.data.user.password) {
            result.data.decrypted_password = decryptPassword(result.data.user.password);
            result.data.user_name = result.data.user.user_name || result.data.user_name;
            result.data.email = result.data.user.email || result.data.email;
        }

        return result;
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
   // في services/api/parents/parentService.ts

async update(id: string, data: any, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/parents/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'فشل في تحديث ولي الأمر');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
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
        const result = await handleResponse(response);

        // فك تشفير كلمة السر للنتائج
        if (result.data && Array.isArray(result.data)) {
            result.data = result.data.map((parent: any) => {
                if (parent.user && parent.user.password) {
                    return {
                        ...parent,
                        decrypted_password: decryptPassword(parent.user.password),
                        user_name: parent.user.user_name || parent.user_name,
                        email: parent.user.email || parent.email,
                    };
                }
                return parent;
            });
        }

        return result;
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

    // GET: جلب كل الطلاب (لاختيار الأبناء)
    getAllStudents: async (token: string) => {
        const response = await fetch(`${API_BASE_URL}/students`, {
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

// ====== Export helper for external use ======
export { decryptPassword };