import { TextField } from "@mui/material";
import { useFormState } from "react-hook-form";

const FormDateField = ({ name, register, control, rules, ...rest }) => {
    const { errors } = useFormState({
        control,
    });

    const error = errors[name];

    return (
        <TextField
            {...register(name, rules)}
            {...rest}
            InputLabelProps={{ shrink: true }}
            type="date"
            error={!!error}
            helperText={error ? error.message : null}
        />
    );
};

export default FormDateField;