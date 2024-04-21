import * as React from 'react';
import { styleNameRules } from '../../../Helper/Validation/Style/StyleValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';

const StyleForm = ({ control, fieldsSettings }) => {
    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="styleId"
                        control={control}
                        defaultValue={fieldsSettings.styleId.defaultValue}
                        label="Ідентифікатор стилю"
                        fullWidth
                        disabled={fieldsSettings.styleId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="styleName"
                        control={control}
                        rules={styleNameRules}
                        defaultValue={fieldsSettings.styleName.defaultValue}
                        label="Назва стилю*"
                        fullWidth
                        disabled={fieldsSettings.styleName.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default StyleForm;
