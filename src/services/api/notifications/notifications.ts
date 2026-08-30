// src/services/api/notifications/get-notifications.ts

export interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
    updated_at: string;
}

export interface NotificationsResponse {
    status: string;
    data: Notification[];
}

export const getNotifications = async (
    token: string
): Promise<NotificationsResponse> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/notifications',
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
        console.error(' [getNotifications] Failed:', error);
        throw error;
    }
};