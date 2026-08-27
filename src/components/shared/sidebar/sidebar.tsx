// components/shared/sidebar/sidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid,
    Users,
    UserCircle,
    UserCog,
    Megaphone,
    LogOut,
    School,
    User
} from 'lucide-react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export const Sidebar = () => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === href;
        return pathname.startsWith(href);
    };

    const navItems: NavItem[] = [
        {
            label: 'الصفوف والشعب',
            href: '/dashboard/classes',
            icon: <School size={20} />,
        },
        {
            label: 'الطالب',
            href: '/dashboard/students',
            icon: <User size={20} />,
        },
        {
            label: 'أولياء الأمور',
            href: '/dashboard/parents',
            icon: <UserCircle size={20} />,
        },
        {
            label: 'المدرسين',
            href: '/dashboard/teachers',
            icon: <UserCog size={20} />,
        },
        {
            label: 'الإعلانات',
            href: '/dashboard/announcements',
            icon: <Megaphone size={20} />,
        },
    ];

    const renderNavItem = (item: NavItem) => {
        const active = isActive(item.href);

        return (
            <Link
                key={item.label}
                href={item.href}
                className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm
                    ${active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
            >
                <span className={active ? 'text-blue-600' : 'text-gray-400'}>
                    {item.icon}
                </span>
                <span className="font-cairo">{item.label}</span>
            </Link>
        );
    };

    return (
        <aside className="fixed right-0 top-0 h-full w-[240px] bg-white border-l border-gray-100 flex flex-col overflow-y-auto shadow-lg shadow-gray-100/50 z-50 font-cairo">
            {/* Header - School Name */}
            <div className="flex flex-col items-center px-6 py-8 border-b border-gray-100">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 mb-3">
                    <span className="text-white font-bold text-2xl font-cairo">ث</span>
                </div>
                <h1 className="text-xl font-bold text-gray-800 font-cairo">ثانوية شرعية</h1>
                <span className="text-xs text-gray-400 font-cairo mt-0.5">نظام إدارة المدرسة</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(item => renderNavItem(item))}
            </nav>

            {/* Footer - Logout */}
            <div className="border-t border-gray-100 p-4">
                <button
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    onClick={() => console.log('تسجيل الخروج')}
                >
                    <LogOut size={20} className="text-gray-400" />‍
                    <span className="font-cairo">تسجيل الخروج</span>
                </button>
            </div>
        </aside>
    );
};