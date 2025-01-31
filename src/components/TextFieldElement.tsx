import React from 'react';
import { TextField } from "@mui/material";
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface TextFieldElementProps {
    name: string;
    label: string;
    variant?: 'filled' | 'outlined' | 'standard';
    type?: string;
    disabled?: boolean;
    errors: FieldErrors;
    multiline?: boolean;
    register: UseFormRegister<any>;
    validation?: Record<string, any>;
    endAdornment?: React.ReactNode;
    value?: string;
    defaultValue?: string; 
}

const TextFieldElement: React.FC<TextFieldElementProps> = ({
    name,
    label,
    variant = 'filled',
    type = 'text',
    disabled,
    errors,
    multiline,
    register,
    validation = {},
    endAdornment,
    value,
    defaultValue,
}) => {
    const { ref, onBlur, ...rest } = register(name, validation);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur(event);
    };

    return (
        <TextField
            id={name}
            label={label}
            variant={variant}
            type={type}
            disabled={disabled}
            minRows={3}
            multiline={multiline}
            inputRef={ref}
            onBlur={handleBlur}
            {...rest}
            error={!!errors[name]}
            helperText={errors[name] && typeof errors[name].message === 'string' ? errors[name].message : ''}
            slotProps={{
                inputLabel: {
                    shrink: !!value || !!defaultValue || undefined, 
                },
            }}
            value={value}
            defaultValue={defaultValue}
        />
    );
};

export default TextFieldElement;
