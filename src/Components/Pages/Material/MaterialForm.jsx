import * as React from 'react';
import { materialNameRules } from '../../../Helper/Validation/Material/MaterialValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';

const MaterialForm = ({ control, fieldsSettings }) => {
    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="materialId"
                        control={control}
                        defaultValue={fieldsSettings.materialId.defaultValue}
                        label="Ідентифікатор матеріалу"
                        fullWidth
                        disabled={fieldsSettings.materialId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="materialName"
                        control={control}
                        rules={materialNameRules}
                        defaultValue={fieldsSettings.materialName.defaultValue}
                        label="Назва матеріалу*"
                        fullWidth
                        disabled={fieldsSettings.materialName.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default MaterialForm;
