// src/services/api/subjects/addSubjectToClass.ts

export interface AddSubjectData {
    name: string;
    comment?: string | null;
    full_mark: number;
    class_id: number;
    teacher_ids?: number[];
}

export interface SubjectResponse {
    success: boolean;
    data: {
        id: number;
        name: string;
        comment: string | null;
        full_mark: number;
        class_id: number;
        created_at: string;
        updated_at: string;
    };
    message: string;
}

export const addSubjectToClass = async (
    token: string,
    data: AddSubjectData
): Promise<SubjectResponse> => {
    try {
        const response = await fetch(
            `http://localhost:8000/api/dashboard/subjects`,
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
            if (result.errors) {
                const errorMessages = Object.values(result.errors).flat().join(', ');
                throw new Error(errorMessages);
            }
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        return result;
    } catch (error: any) {
        console.error('🔥 [addSubjectToClass] Failed:', error);
        throw error;
    }
};