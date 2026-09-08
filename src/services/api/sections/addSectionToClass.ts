// src/services/api/sections/addSectionToClass.ts

export interface AddSectionData {
    name: string;
    comment?: string | null;
    class_id: number;
}

export interface SectionResponse {
    success: boolean;
    data: {
        id: number;
        name: string;
        comment: string | null;
        class_id: number;
        created_at: string;
        updated_at: string;
    };
    message: string;
}

export const addSectionToClass = async (
    token: string,
    data: AddSectionData
): Promise<SectionResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/sections`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [addSectionToClass] Failed:', error);
        throw error;
    }
};