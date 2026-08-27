// components/shared/table/table.tsx

'use client';

import { ReactNode, useMemo } from 'react';
import { Button } from '../button/button';
import { Edit, Trash2, Eye, Plus, Inbox, ChevronDown, ChevronUp } from 'lucide-react';
import { Empty } from '../empty/empty';

// ====== Interfaces ======
export interface Column<T = any> {
    key: string;
    header: string;
    render?: (row: T) => ReactNode;
    align?: 'left' | 'center' | 'right';
    width?: string | number;
    sortable?: boolean;
    className?: string;
    minWidth?: string | number;
    maxWidth?: string | number;
}

export interface TableAction<T = any> {
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
    variant?: 'primary' | 'danger' | 'warning' | 'ghost' | 'ghost-outline';
    show?: (row: T) => boolean;
    className?: string;
}

export interface TableProps<T = any> {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string | number;
    actions?: TableAction<T>[];
    className?: string;
    headerClassName?: string;
    rowClassName?: string;
    cellClassName?: string;
    actionClassName?: string;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyButtonText?: string;
    onEmptyButtonClick?: () => void;
    emptyIcon?: ReactNode;
    emptyImage?: ReactNode;
    isLoading?: boolean;
    loadingRows?: number;
    striped?: boolean;
    hoverable?: boolean;
    compact?: boolean;
    headerHeight?: string | number;
    rowHeight?: string | number;
    minHeight?: string | number;
    fixedHeight?: boolean;
    totalCount?: number;
    onLoadMore?: () => void;
    hasMore?: boolean;
    headerBgColor?: string;
    rowBgColor?: string;
    borderColor?: string;
    radius?: number;
    headerTextColor?: string;
    headerFontWeight?: string | number;
}

// ====== Skeleton Component ======
const TableSkeleton = ({
    columns,
    actions,
    rows = 5,
    rowHeight = '40px',
    borderColor = '#E0E0E0',
}: {
    columns: Column[];
    actions?: TableAction[];
    rows?: number;
    rowHeight?: string | number;
    borderColor?: string;
}) => {
    const height = typeof rowHeight === 'number' ? `${rowHeight}px` : rowHeight;

    return (
        <div className="w-full overflow-x-auto rounded-[10px] border" style={{ borderColor }}>
            <table className="w-full border-collapse table-fixed">
                <thead>
                    <tr className="bg-bg-brand-very-soft border-b" style={{ borderColor }}>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`
                                    px-4 py-3 text-xs font-semibold text-content-primary uppercase tracking-wider
                                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                                `}
                                style={{
                                    height: '56px',
                                    borderColor,
                                    width: col.width ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : 'auto',
                                    minWidth: col.minWidth ? (typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth) : 'auto',
                                }}
                            >
                                {col.header}
                            </th>
                        ))}
                        {actions && actions.length > 0 && (
                            <th
                                className="px-4 py-3 text-xs font-semibold text-content-primary uppercase tracking-wider text-center"
                                style={{ height: '56px', borderColor, width: '80px' }}
                            >
                                خيارات
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rows }).map((_, index) => (
                        <tr key={index} className="border-b" style={{ borderColor }}>
                            {columns.map((col) => (
                                <td key={col.key} className="px-4 py-3" style={{ height }}>
                                    <div className="h-4 bg-bg-secondary rounded animate-pulse"></div>
                                </td>
                            ))}
                            {actions && actions.length > 0 && (
                                <td className="px-4 py-3" style={{ height }}>
                                    <div className="flex items-center justify-center gap-1.5">
                                        {actions.map((_, i) => (
                                            <div key={i} className="w-8 h-8 bg-bg-secondary rounded-full animate-pulse"></div>
                                        ))}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// ====== Main Table Component ======
export function Table<T = any>({
    columns,
    data,
    keyExtractor,
    actions,
    className = '',
    headerClassName = '',
    rowClassName = '',
    cellClassName = '',
    actionClassName = '',
    emptyTitle = 'لا توجد بيانات',
    emptyDescription = 'قم بإضافة بيانات جديدة',
    emptyButtonText = 'إضافة',
    onEmptyButtonClick,
    emptyIcon,
    emptyImage,
    isLoading = false,
    loadingRows = 5,
    striped = false,
    hoverable = true,
    compact = false,
    headerHeight = 56,
    rowHeight = 40,
    minHeight,
    fixedHeight = false,
    totalCount,
    onLoadMore,
    hasMore = false,
    headerBgColor = '#F9FCFB',
    rowBgColor = '#FFFFFF',
    borderColor = '#E0E0E0',
    radius = 10,
    headerTextColor = '#000000',
    headerFontWeight = 600,
}: TableProps<T>) {

    const getAlignClass = (align?: 'left' | 'center' | 'right') => {
        switch (align) {
            case 'center': return 'text-center';
            case 'right': return 'text-right';
            default: return 'text-left';
        }
    };

    const getHeight = (height: string | number) => {
        if (typeof height === 'number') {
            return `${height}px`;
        }
        return height;
    };

    const headerHeightStyle = getHeight(headerHeight);
    const rowHeightStyle = getHeight(rowHeight);

    const getMinHeight = () => {
        if (minHeight) return getHeight(minHeight);
        if (fixedHeight) {
            const totalRows = Math.max(data.length, 1);
            return `calc(${headerHeightStyle} + ${totalRows} * ${rowHeightStyle})`;
        }
        return undefined;
    };

    
    const getIconColor = (variant?: string) => {
        switch (variant) {
            case 'primary': return '#007353';
            case 'danger': return '#DC2626';
            case 'warning': return '#D97706';
            default: return '#6B7280';
        }
    };

    if (isLoading) {
        return (
            <TableSkeleton
                columns={columns}
                actions={actions}
                rows={loadingRows}
                rowHeight={rowHeight}
                borderColor={borderColor}
            />
        );
    }

    if (data.length === 0) {
        return (
            <Empty
                title={emptyTitle}
                description={emptyDescription}
                buttonText={emptyButtonText}
                onButtonClick={onEmptyButtonClick}
                icon={emptyIcon || <Inbox size={32} className="text-gray-400" />}
                image={emptyImage}
                showButton={!!emptyButtonText && !!onEmptyButtonClick}
                className="w-full"
            />
        );
    }

    const paddingClass = compact ? 'px-3 py-2' : 'px-4 py-3';

    return (
        <div
            className={`
                w-full overflow-x-auto 
                rounded-[${radius}px] border
                ${className}
            `}
            style={{ borderColor }}
        >
            <div className="w-full overflow-hidden rounded-[${radius}px]">
                <table className="w-full border-collapse table-fixed">
                    <thead>
                        <tr
                            className={`
                                border-b
                                ${headerClassName}
                            `}
                            style={{
                                backgroundColor: headerBgColor,
                                borderColor: borderColor
                            }}
                        >
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`
                                        ${paddingClass} 
                                        text-xs uppercase tracking-wider
                                        ${getAlignClass(col.align)}
                                        ${col.className || ''}
                                    `}
                                    style={{
                                        height: headerHeightStyle,
                                        borderColor: borderColor,
                                        color: headerTextColor,
                                        fontWeight: headerFontWeight,
                                        width: col.width ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : 'auto',
                                        minWidth: col.minWidth ? (typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth) : 'auto',
                                        maxWidth: col.maxWidth ? (typeof col.maxWidth === 'number' ? `${col.maxWidth}px` : col.maxWidth) : 'none',
                                        textAlign: col.align === 'center' ? 'center' : col.align === 'right' ? 'right' : 'left',
                                    }}
                                >
                                    <div
                                        className="flex items-center gap-2 whitespace-nowrap"
                                        style={{
                                            justifyContent: col.align === 'center' ? 'center' : col.align === 'right' ? 'flex-end' : 'flex-start',
                                        }}
                                    >
                                        {col.header}
                                        {col.sortable && (
                                            <span className="flex flex-col">
                                                <ChevronUp size={10} className="text-content-disabled" />
                                                <ChevronDown size={10} className="text-content-disabled -mt-1" />
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {actions && actions.length > 0 && (
                                <th
                                    className={`
                                        ${paddingClass} 
                                        text-xs uppercase tracking-wider text-center
                                    `}
                                    style={{
                                        height: headerHeightStyle,
                                        borderColor: borderColor,
                                        color: headerTextColor,
                                        fontWeight: headerFontWeight,
                                        width: '80px',
                                        minWidth: '80px',
                                        textAlign: 'center',
                                    }}
                                >
                                    خيارات
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <tr
                                    key={keyExtractor(row)}
                                    className={`
                                        border-b
                                        ${hoverable ? 'hover:bg-bg-brand-soft/30 transition-colors' : ''}
                                        ${rowClassName}
                                    `}
                                    style={{
                                        backgroundColor: isEven ? rowBgColor : '#FFFFFF',
                                        borderColor: borderColor,
                                        height: rowHeightStyle
                                    }}
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`
                                                ${paddingClass} 
                                                text-sm text-content-primary
                                                ${getAlignClass(col.align)}
                                                ${cellClassName}
                                                ${col.className || ''}
                                            `}
                                            style={{
                                                height: rowHeightStyle,
                                                borderColor: borderColor,
                                                width: col.width ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : 'auto',
                                                minWidth: col.minWidth ? (typeof col.minWidth === 'number' ? `${col.minWidth}px` : col.minWidth) : 'auto',
                                                maxWidth: col.maxWidth ? (typeof col.maxWidth === 'number' ? `${col.maxWidth}px` : col.maxWidth) : 'none',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                textAlign: col.align === 'center' ? 'center' : col.align === 'right' ? 'right' : 'left',
                                            }}
                                        >
                                            {col.render ? col.render(row) : (row as any)[col.key]}
                                        </td>
                                    ))}

                                    
                                    {actions && actions.length > 0 && (
                                        <td
                                            className={`
                                                ${paddingClass} 
                                                text-center
                                                ${actionClassName}
                                            `}
                                            style={{
                                                height: rowHeightStyle,
                                                borderColor: borderColor,
                                                width: '80px',
                                                minWidth: '80px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div className="flex items-center justify-center">
                                                {actions.map((action, index) => {
                                                    if (action.show && !action.show(row)) {
                                                        return null;
                                                    }

                                                    const iconColor = getIconColor(action.variant);

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => action.onClick(row)}
                                                            className={`
                                                                p-1
                                                                hover:bg-gray-100/50
                                                                rounded
                                                                cursor-pointer
                                                                transition-colors duration-200
                                                                ${action.className || ''}
                                                            `}
                                                            title={action.label}
                                                            style={{ color: iconColor }}
                                                        >
                                                            {action.icon || <Edit size={14} />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    )}
                                    

                                </tr>
                            );
                        })}

                        {fixedHeight && totalCount && data.length < totalCount && (
                            Array.from({ length: Math.max(0, Math.min(totalCount - data.length, 5)) }).map((_, index) => (
                                <tr
                                    key={`empty-${index}`}
                                    className="border-b"
                                    style={{
                                        backgroundColor: '#FFFFFF',
                                        borderColor: borderColor,
                                        height: rowHeightStyle
                                    }}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className={paddingClass} style={{ height: rowHeightStyle, borderColor }}>
                                            &nbsp;
                                        </td>
                                    ))}
                                    {actions && actions.length > 0 && (
                                        <td className={paddingClass} style={{ height: rowHeightStyle, borderColor }}>
                                            &nbsp;
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {hasMore && onLoadMore && (
                <div className="flex justify-center p-4 border-t" style={{ borderColor }}>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={onLoadMore}
                        leftIcon={<Plus size={16} />}
                    >
                        تحميل المزيد
                    </Button>
                </div>
            )}
        </div>
    );
}

export default Table;