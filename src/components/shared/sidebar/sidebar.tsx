// components/shared/sidebar/sidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Users,
    UserCircle,
    UserCog,
    Megaphone,
    LogOut,
    School,
    User,
    UserStar,
    PanelLeftOpen,
    PanelLeftClose
} from 'lucide-react';
import Image from 'next/image';
import { LogoutMessage } from '@/components/auth/logout/logoutMessage';
import { logoutAPI } from '@/services/api/auth/logout';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // دالة مساعدة لإرسال الحالة إلى الـ Layout
    const notifyLayout = (open: boolean) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('sidebarToggle', {
                detail: { isOpen: open }
            }));
        }
    };

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === href;
        return pathname.startsWith(href);
    };

    const navItems: NavItem[] = [
        {
            label: 'الصفوف والشعب',
            href: '/classes',
            icon: <School size={20} />,
        },
        {
            label: 'الطالب',
            href: '/students',
            icon: <User size={20} />,
        },
        {
            label: 'أولياء الأمور',
            href: '/parents',
            icon: <Users size={20} />,
        },
        {
            label: 'المدرسين',
            href: '/teachers',
            icon: <UserStar size={20} />,
        },
        {
            label: 'الإعلانات',
            href: '/notifications',
            icon: <Megaphone size={20} />,
        },
    ];

    // دالة معالجة تسجيل الخروج
    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await logoutAPI();
            // بعد نجاح تسجيل الخروج، سيتم إعادة التوجيه تلقائياً من الـ API
            // ولكن نضيف توجيه احتياطي
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
            // حتى في حالة الخطأ، نعيد التوجيه
            router.push('/login');
        } finally {
            setIsLoading(false);
            setShowLogoutModal(false);
        }
    };

    const renderNavItem = (item: NavItem) => {
        const active = isActive(item.href);

        return (
            <Link
                key={item.label}
                href={item.href}
                className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm
                    ${active ? 'bg-green-50 text-[#007353] font-semibold' : 'text-content-primary hover:bg-gray-50 hover:text-gray-900'}
                `}
            >
                <span className={active ? 'text-[#007353]' : 'text-content-primary'}>
                    {item.icon}
                </span>
                <span>{item.label}</span>
            </Link>
        );
    };

    return (
        <>
            {/* زر فتح الـ sidebar (يظهر فقط لما يكون مقفول) */}
            {!isOpen && (
                <button
                    onClick={() => {
                        setIsOpen(true);
                        notifyLayout(true);
                    }}
                    onMouseEnter={() => {
                        const btn = document.getElementById('sidebar-toggle-btn');
                        if (btn) {
                            btn.style.transform = 'translateX(0px)';
                            btn.style.opacity = '1';
                            btn.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.35), -4px 0 20px rgba(0, 0, 0, 0.2)';
                        }
                    }}
                    onMouseLeave={() => {
                        const btn = document.getElementById('sidebar-toggle-btn');
                        if (btn) {
                            btn.style.transform = 'translateX(calc(100% - 16px))';
                            btn.style.opacity = '0.4';
                            btn.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.35), -4px 0 20px rgba(0, 0, 0, 0.25)';
                        }
                    }}
                    id="sidebar-toggle-btn"
                    className="fixed right-0 top-10 z-[100] w-11 h-11 bg-[#F7F7F7] rounded-l-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 ease-in-out"
                    style={{
                        transform: 'translateX(calc(100% - 16px))',
                        opacity: '0.4',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35), -4px 0 20px rgba(0, 0, 0, 0.25)',
                        transition: 'all 0.3s ease-in-out',
                        cursor: 'pointer',
                    }}
                    aria-label="فتح القائمة"
                >
                    <PanelLeftClose color="#000f0b" size={22} />
                </button>
            )}

            {/* الـ Sidebar */}
            <aside
                className={`
                    fixed right-0 top-0 h-full w-[280px] bg-white border-l border-[#e0e0e0] 
                    shadow-lg shadow-gray-100/50 z-50 
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="h-full flex flex-col overflow-y-auto">
                    <div className="flex items-center px-6 py-8 border-b border-[#e0e0e0] gap-4 flex-shrink-0">
                        <div className="flex-shrink-0">
                            <Image src="/images/mianIcon.svg" alt="main icon" width={70} height={70} loading="eager"
                                className="w-auto h-auto" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-l font-bold text-content-primary whitespace-nowrap">ثانوية شرعية</h1>
                            <span className="text-xs text-content-secondary">الإدارة العامة</span>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                notifyLayout(false);
                            }}
                            className="mr-auto w-11 h-11 bg-[#F7F7F7] rounded-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
                            aria-label="إغلاق القائمة"
                        >
                            <PanelLeftOpen color="#000f0b" size={22} />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {navItems.map(item => renderNavItem(item))}
                    </nav>

                    {/* زر تسجيل الخروج المعدل */}
                    <div className="border-t border-[#e0e0e0] p-4 flex-shrink-0">
                        <button
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-content-critical hover:bg-red-50 transition-all duration-200"
                            onClick={() => setShowLogoutModal(true)}
                        >
                            <LogOut size={20} className="text-content-critical" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* نافذة تأكيد تسجيل الخروج */}
            <LogoutMessage
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                isLoading={isLoading}
            />
        </>
    );
};