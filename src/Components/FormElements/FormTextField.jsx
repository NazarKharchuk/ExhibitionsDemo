import { TextField } from "@mui/material";
import { useController } from "react-hook-form";

const FormTextField = ({ name, control, rules, defaultValue, ...rest }) => {
    const { field, fieldState } = useController({
        name,
        control,
        rules,
        defaultValue,
    });

    const { error } = fieldState;

    return (
        <TextField
            {...field}
            {...rest}
            error={!!error}
            helperText={error ? error.message : null}
        />
    );
};

export default FormTextField;