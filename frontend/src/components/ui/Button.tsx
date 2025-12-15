import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = variant === 'primary' ? 'primary' : variant === 'danger' ? 'danger' : 'secondary';
    const widthClass = fullWidth ? 'w-full' : ''; // Note: We might need to add this utility class or inline style if we don't have utility classes

    // Using inline styles for specific overrides if utilities aren't present, 
    // but relying on the classes defined in index.css is better.
    // In index.css we have .auth-form button, which is specific. 
    // We need to generalize the button styles in index.css or mapping them here.

    return (
        <button
            className={`${baseClass} ${variantClass} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
