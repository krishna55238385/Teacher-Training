import React from 'react';
import { AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    className?: string;
    children: React.ReactNode;
}

const Alert: React.FC<AlertProps> = ({ type = 'info', title, className, children }) => {
    const styles = {
        success: 'bg-green-50 text-green-900 border-green-200',
        error: 'bg-red-50 text-red-900 border-red-200',
        warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
        info: 'bg-blue-50 text-blue-900 border-blue-200',
    };

    const Icon = {
        success: CheckCircle2,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    }[type];

    return (
        <div className={cn('rounded-lg border p-4', styles[type], className)}>
            <div className="flex items-start">
                <Icon className={cn('h-5 w-5 mt-0.5', {
                    'text-green-600': type === 'success',
                    'text-red-600': type === 'error',
                    'text-yellow-600': type === 'warning',
                    'text-blue-600': type === 'info',
                })} />
                <div className="ml-3 text-sm">
                    {title && <h3 className="font-medium mb-1">{title}</h3>}
                    <div className="leading-relaxed opacity-90">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Alert;
