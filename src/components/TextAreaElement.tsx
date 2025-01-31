import { TextareaAutosize } from '@mui/material';
import React from 'react';

interface TextAreaElementProps {
    name: string;
    label: string;
    variant?: 'filled' | 'outlined' | 'standard';
    disabled?: boolean;
    placeholder?: string;
    minRows?: number;
    errors: Record<string, any>;
    register: any;
    validation?: Record<string, any>;
}

const TextAreaElement: React.FC<TextAreaElementProps> = ({
    name,
    label,
    variant = 'filled',
    disabled,
    placeholder,
    minRows,
    errors,
    register,
    validation = {}
}) => {
    return (
        <TextareaAutosize
            id={name}
            label={label}
            variant={variant}
            disabled={disabled}
            placeholder={placeholder}
            minRows={minRows}
            {...register(name, validation)}
            error={!!errors[name]}
            helperText={errors[name] && typeof errors[name].message === 'string' ? errors[name].message : ''}
        />
    );
};

export default TextAreaElement