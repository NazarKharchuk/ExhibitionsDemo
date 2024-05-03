import { Switch, FormControlLabel, FormHelperText } from "@mui/material";
import { useController } from "react-hook-form";

const FormSwitchField = ({ name, control, rules, defaultValue, label, ...rest }) => {
    const { field, fieldState: { error } } = useController({
        name,
        control,
        rules,
        defaultValue,
    });

    return (
        <>
            <FormControlLabel
                control={
                    <Switch
                        {...field}
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        {...rest}
                    />
                }
                label={label}
                labelPlacement="end"
            />
            {error && <FormHelperText error>{error.message}</FormHelperText>}
        </>
    );
};

export default FormSwitchField;
