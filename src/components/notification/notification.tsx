// app/notification/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/shared/breadcrumb/breadcrumb';
import { Empty } from '@/components/shared/empty/empty';
import { Plus, SquarePen, User, Users, Clock, Calendar, Trash } from 'lucide-react';
import { Button } from '@/components/shared/button/button';

interface Notification {
    id: number;
    title: string;
    message: string;
    created_at: string;
    updated_at: string;
}

function NotificationPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const breadcrumbItems = [{ label: 'الإعلانات' }];

    // 🔑 دالة جلب التوكن - استخدم access_token (الشغال في Postman)

    const getToken = (): string => {
        try {
            // ✅ استخدم auth_token (نفس الاسم من login)
            const token = localStorage.getItem('auth_token');

            if (token && token.length > 10) {
                console.log('✅ Token found:', token.substring(0, 20) + '...');
                return token;
            }

            console.warn('⚠️ No token found in localStorage');
            console.log('📦 Available keys:', Object.keys(localStorage));
            return '';
        } catch (error) {
            console.error('Error getting token:', error);
            return '';
        }
    };

    // دالة جلب البيانات
    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getToken();

            if (!token) {
                setError('❌ لم يتم العثور على access_token. الرجاء تسجيل الدخول');
                setLoading(false);
                return;
            }

            console.log('📤 Sending request to API...');
            console.log('🔑 Using token:', token.substring(0, 30) + '...');

            const response = await fetch(
                'http://localhost:8000/api/notifications',
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log('📥 Response Status:', response.status);

            if (response.status === 401) {
                const errorText = await response.text();
                console.log('❌ 401 Error:', errorText);
                throw new Error('جلسة غير صالحة - الرجاء تسجيل الدخول مرة أخرى');
            }

            const result = await response.json();
            console.log('📦 Response Data:', result);

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            if (result.status === 'success' && Array.isArray(result.data)) {
                console.log(`✅ Loaded ${result.data.length} notifications`);
                setNotifications(result.data);
            } else {
                throw new Error('البيانات غير صحيحة');
            }
        } catch (err: any) {
            console.error('❌ Error:', err);
            setError(err.message || 'حدث خطأ أثناء جلب الإعلانات');
        } finally {
            setLoading(false);
        }
    };

    // تحميل البيانات
    useEffect(() => {
        loadNotifications();
    }, []);

    const handleAddClick = () => console.log('إضافة إعلان جديد');
    const handleEdit = (id: number) => console.log('تعديل:', id);
    const handleDelete = (id: number) => console.log('حذف:', id);

    const actionButton = (
        <Button
            variant="primary"
            size="md"
            onClick={handleAddClick}
            leftIcon={<Plus size={16} />}
        >
            إضافة إعلان
        </Button>
    );

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('ar-SA', {
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
                <Breadcrumb items={breadcrumbItems} className="bg-white" showBackButton={false} actionButton={actionButton} />
                <div className="p-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex justify-center items-center h-40">
                            <div className="text-gray-500">جاري تحميل الإعلانات...</div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
                <Breadcrumb items={breadcrumbItems} className="bg-white" showBackButton={false} actionButton={actionButton} />
                <div className="p-6">
                    <div className="bg-white rounded-xl border border-red-200 p-6">
                        <div className="text-red-500 text-center">{error}</div>
                        <div className="text-center mt-4 flex gap-2 justify-center flex-wrap">
                            <Button variant="secondary" onClick={loadNotifications}>
                                إعادة المحاولة
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen" style={{ backgroundColor: '#F7F7F7' }}>
            <Breadcrumb items={breadcrumbItems} className="bg-white" showBackButton={false} actionButton={actionButton} />
            <div className="p-6">
                <div className="space-y-6">
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <Empty
                                title="لا إعلانات مضافة بعد"
                                description="أضف إعلانات الآن"
                                buttonText="إضافة إعلان"
                                onButtonClick={handleAddClick}
                                buttonVariant="primary"
                                buttonIcon={<Plus size={16} />}
                                className="border-0 shadow-none p-0"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="bg-white rounded-[25px] border border-[#007353] p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
                                    dir="rtl"
                                >
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {notification.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                        {notification.message}
                                    </p>
                                    <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1.5 text-[#007353]">
                                                <User size={14} className="text-[#007353]" />
                                                النظام
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Users size={14} className="text-gray-400" />
                                                جميع المستخدمين
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-400" />
                                                {formatDate(notification.created_at)}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-gray-400" />
                                                {formatTime(notification.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200"
                                                style={{
                                                    backgroundColor: '#F7F7F7',
                                                    border: '1px solid #E0E0E0',
                                                    color: '#EF4444',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                                                    e.currentTarget.style.borderColor = '#FCA5A5';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#F7F7F7';
                                                    e.currentTarget.style.borderColor = '#E0E0E0';
                                                }}
                                            >
                                                <Trash size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(notification.id)}
                                                className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-200"
                                                style={{
                                                    backgroundColor: '#F7F7F7',
                                                    border: '1px solid #E0E0E0',
                                                    color: '#D97706',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#FEF3C7';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#F7F7F7';
                                                }}
                                            >
                                                <SquarePen size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default NotificationPage;