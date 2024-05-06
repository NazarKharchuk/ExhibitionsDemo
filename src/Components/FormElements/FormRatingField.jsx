import { Rating, FormHelperText, Typography } from "@mui/material";
import { useController } from "react-hook-form";

const FormRatingField = ({ name, control, rules, defaultValue, label, ...rest }) => {
    const { field, fieldState: { error } } = useController({
        name,
        control,
        rules,
        defaultValue,
    });

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {label && (
                <Typography variant="body1" component="label" htmlFor={name} style={{ marginRight: '16px' }}>
                    {label}
                </Typography>
            )}
            <Rating
                {...field}
                value={field.value}
                onChange={(event, newValue) => field.onChange(newValue)}
                {...rest}
            />
            <Typography variant="body1" style={{ marginLeft: '8px' }}>
                {field.value}
            </Typography>
            {error && <FormHelperText error>{error.message}</FormHelperText>}
        </div>
    );
};

export default FormRatingField;
