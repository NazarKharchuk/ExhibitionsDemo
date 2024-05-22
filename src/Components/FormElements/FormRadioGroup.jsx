import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, FormHelperText } from '@mui/material';
import { useController } from 'react-hook-form';

const FormRadioGroup = ({ name, control, rules, defaultValue, options, label, ...rest }) => {
    const { field, fieldState: { error } } = useController({
        name,
        control,
        rules,
        defaultValue,
    });

    return (
        <FormControl component="fieldset" error={!!error}>
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup
                {...field}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                {...rest}
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        disabled={rest.disabled}
                    />
                ))}
            </RadioGroup>
            {error && <FormHelperText>{error.message}</FormHelperText>}
        </FormControl>
    );
};

export default FormRadioGroup;
