import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps extends React.ComponentProps<"input"> {
    id: string;
    label: string;
    error?: string;
    required?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ id, label, error, required, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <Label htmlFor={id} className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </Label>
                <Input
                    id={id}
                    ref={ref}
                    aria-invalid={!!error}
                    className={`bg-white h-11 rounded-xl border-slate-200 focus-visible:ring-primary/20 shadow-sm ${className || ""}`}
                    {...props}
                />
                {error && (
                    <p className="text-[11px] font-medium text-[#FF6347]">{error}</p>
                )}
            </div>
        );
    }
);

FormInput.displayName = "FormInput";
