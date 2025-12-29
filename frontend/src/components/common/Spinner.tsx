import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex justify-center items-center">
            <Loader2 className={cn('animate-spin text-primary-600', sizeClasses[size], className)} />
        </div>
    );
};

export default Spinner;
