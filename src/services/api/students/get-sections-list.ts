// src/services/api/students/get-sections-list.ts

export interface SectionList {
    id: number;
    section_name: string;
    class_id: number;
}

export const getSectionsList = async (
    token: string
): Promise<{
    success: boolean;
    data: SectionList[];
}> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/dashboard/students/sections-list',
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
        console.error('🔥 [getSectionsList] Failed:', error);
        throw error;
    }
};