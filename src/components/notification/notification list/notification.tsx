// app/notification/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '@/components/shared/breadcrumb/breadcrumb';
import { Empty } from '@/components/shared/empty/empty';
import { Plus, SquarePen, User, Users, Clock, Calendar, Trash, X } from 'lucide-react';
import { Button } from '@/components/shared/button/button';
import { NotificationForm } from '@/components/notification/notification form/notificationForm';
import { NotificationDelete } from '@/components/notification/notifiction delete/notificationDelete'; // ✅ استيراد مكون الحذف

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
    const [deletingNotification, setDeletingNotification] = useState<Notification | null>(null); // ✅ للحذف

    const breadcrumbItems = [{ label: 'الإعلانات' }];

    // 🔑 دالة جلب التوكن
    const getToken = (): string => {
        try {
            const token = localStorage.getItem('token');

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
                setError('❌ لم يتم العثور على التوكن. الرجاء تسجيل الدخول');
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

    // ✅ فتح مودال الإضافة
    const handleAddClick = () => {
        console.log('➕ [NotificationPage] Opening form dialog');
        setEditingNotification(null);
        setIsModalOpen(true);
    };

    // ✅ فتح مودال التعديل
    const handleEditClick = (notification: Notification) => {
        console.log('✏️ [NotificationPage] Opening edit dialog for:', notification.title);
        setEditingNotification(notification);
        setIsModalOpen(true);
    };

    // ✅ فتح مودال الحذف
    const handleDeleteClick = (notification: Notification) => {
        console.log('🗑️ [NotificationPage] Opening delete dialog for:', notification.title);
        setDeletingNotification(notification);
    };

    // ✅ إغلاق المودال
    const handleCloseModal = () => {
        console.log('🔴 [NotificationPage] Closing form dialog');
        setIsModalOpen(false);
        setEditingNotification(null);
        setDeletingNotification(null);
    };

    // ✅ حذف إعلان
    const handleDelete = async (id: number) => {
        if (!confirm('🗑️ هل أنت متأكد من حذف هذا الإعلان؟')) return;

        try {
            const token = getToken();
            if (!token) {
                alert('❌ لم يتم العثور على التوكن. الرجاء تسجيل الدخول');
                return;
            }

            const response = await fetch(
                `http://localhost:8000/api/notifications/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                throw new Error('جلسة غير صالحة - الرجاء تسجيل الدخول مرة أخرى');
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP ${response.status}`);
            }

            if (result.status === 'success') {
                alert('✅ تم حذف الإعلان بنجاح');
                loadNotifications(); // تحديث القائمة
            } else {
                throw new Error(result.message || 'فشل الحذف');
            }
        } catch (err: any) {
            console.error('❌ Delete error:', err);
            alert(`❌ فشل الحذف: ${err.message}`);
        }
    };

    // ✅ عند نجاح الحفظ
    const handleFormSuccess = () => {
        console.log('✅ [NotificationPage] Notification saved successfully!');
        setIsModalOpen(false);
        setEditingNotification(null);
        loadNotifications(); // تحديث القائمة
    };

    // ✅ عند نجاح الحذف
    const handleDeleteSuccess = () => {
        console.log('✅ [NotificationPage] Notification deleted successfully!');
        setDeletingNotification(null);
        loadNotifications(); // تحديث القائمة
    };

    // ✅ عند إلغاء النموذج
    const handleFormCancel = () => {
        handleCloseModal();
    };

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
            return date.toLocaleDateString('en-SA', {
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
            return date.toLocaleTimeString('en-SA', {
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
                                description="أضف إعلانات الآن وانشغلها الآن أو لاحقاً لمن تريد من طلب أو مدرسين ..."
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
                                                بواسطة الادارة العامة
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
                                        {/* ✅ أزرار التعديل والحذف */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDeleteClick(notification)} // ✅ فتح مودال الحذف
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
                                                onClick={() => handleEditClick(notification)}
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

            {/* ✅ مودال الإضافة والتعديل */}
            {isModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999999,
                        padding: '20px',
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '25px',
                            padding: '30px',
                            maxWidth: '600px',
                            width: '100%',
                            maxHeight: 'auto',
                            overflow: 'visible',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* زر الإغلاق */}
                        <button
                            onClick={handleCloseModal}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                left: '20px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#999',
                                zIndex: 10,
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{
                            fontSize: '22px',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            color: '#1a1a1a',
                            textAlign: 'right',
                        }}>
                            {editingNotification ? 'تعديل إعلان' : 'إضافة إعلان '}
                        </h2>

                        <div style={{
                            overflow: 'visible',
                        }}>
                            <NotificationForm
                                mode={editingNotification ? "edit" : "create"}
                                initialData={editingNotification || undefined}
                                onSuccess={handleFormSuccess}
                                onCancel={handleFormCancel}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ مودال حذف الإعلان */}
            {deletingNotification && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999999,
                        padding: '25px',
                    }}
                    onClick={() => setDeletingNotification(null)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            maxWidth: '500px',
                            width: '100%',
                            maxHeight: 'auto',
                            overflow: 'visible',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* زر الإغلاق */}
                        <button
                            onClick={() => setDeletingNotification(null)}
                            style={{
                                position: 'absolute',
                                top: '15px',
                                left: '20px',
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#999',
                                zIndex: 10,
                            }}
                        >
                            ✕
                        </button>

                        <NotificationDelete
                            notification={deletingNotification}
                            onSuccess={handleDeleteSuccess}
                            onCancel={() => setDeletingNotification(null)}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}

export default NotificationPage;