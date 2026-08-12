import React from "react";

interface PageHeaderProps {
    title: string;
    description: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">{title}</h1>
                <p className="text-slate-500 text-[15px] mt-1">{description}</p>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
