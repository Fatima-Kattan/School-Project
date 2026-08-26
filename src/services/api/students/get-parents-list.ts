// src/services/api/students/get-parents-list.ts

export interface ParentList {
    id: number;
    father_name: string;
    mother_name: string;
}

export const getParentsList = async (
    token: string
): Promise<{
    success: boolean;
    data: ParentList[];
}> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/v1/dashboard/students/parents-list',
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
        console.error('🔥 [getParentsList] Failed:', error);
        throw error;
    }
};