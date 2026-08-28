// src/services/api/students/get-classes-list.ts

export interface ClassList {
    id: number;
    class_name: string;
}

export const getClassesList = async (
    token: string
): Promise<{
    success: boolean;
    data: ClassList[];
}> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/students/classes-list',
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
        console.error('🔥 [getClassesList] Failed:', error);
        throw error;
    }
};