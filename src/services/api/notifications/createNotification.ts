// src/services/api/notifications/store-notification.ts

export interface StoreNotificationData {
    title: string;
    message: string;
}

export interface StoreNotificationResponse {
    status: string;
    message: string;
    data: {
        notification: {
            id: number;
            title: string;
            message: string;
            created_at: string;
            updated_at: string;
        };
        total_users: number;
        firebase_sent: boolean;
        firebase_error: string | null;
    };
}

export const storeNotification = async (
    token: string,
    data: StoreNotificationData
): Promise<StoreNotificationResponse> => {
    try {
        const response = await fetch(
            'http://localhost:8000/api/notifications',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
        console.error(' [storeNotification] Failed:', error);
        throw error;
    }
};