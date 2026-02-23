import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

export const StudentCardSkeleton = () => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-16 h-3" />
            </div>
        </div>
        <div className="flex gap-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-8 h-8 rounded-lg" />
        </div>
    </div>
);

export const StatCardSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="w-12 h-3" />
        </div>
        <Skeleton className="w-16 h-8 mb-2" />
        <Skeleton className="w-20 h-3" />
    </div>
);

export const TableRowSkeleton = () => (
    <tr className="border-b border-slate-50">
        <td className="px-4 py-3">
            <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-2" />
                </div>
            </div>
        </td>
        <td className="px-4 py-3"><Skeleton className="w-16 h-6 rounded-lg" /></td>
        <td className="px-4 py-3"><Skeleton className="w-12 h-5" /></td>
        <td className="px-4 py-3 hidden md:table-cell">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-6 h-6 rounded" />)}
            </div>
        </td>
        <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="w-20 h-5" /></td>
        <td className="px-4 py-3"><Skeleton className="w-4 h-4 ml-auto" /></td>
    </tr>
);
