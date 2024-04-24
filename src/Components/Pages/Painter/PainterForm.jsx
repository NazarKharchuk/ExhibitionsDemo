import * as React from 'react';
import { painterDescriptionRules, painterPseudonymRules } from '../../../Helper/Validation/Painter/PainterValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';

const PainterForm = ({ control, fieldsSettings }) => {
    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="painterId"
                        control={control}
                        defaultValue={fieldsSettings.painterId.defaultValue}
                        label="Ідентифікатор художника"
                        fullWidth
                        disabled={fieldsSettings.painterId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="description"
                        control={control}
                        rules={painterDescriptionRules}
                        defaultValue={fieldsSettings.description.defaultValue}
                        label="Опис художника*"
                        fullWidth
                        multiline
                        disabled={fieldsSettings.description.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="pseudonym"
                        control={control}
                        rules={painterPseudonymRules}
                        defaultValue={fieldsSettings.pseudonym.defaultValue}
                        label="Псевдонім художника*"
                        fullWidth
                        disabled={fieldsSettings.pseudonym.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default PainterForm;
