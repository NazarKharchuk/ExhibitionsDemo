import * as React from 'react';
import { genreNameRules } from '../../../Helper/Validation/Genre/GenreValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';

const GenreForm = ({ control, fieldsSettings }) => {
    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="genreId"
                        control={control}
                        defaultValue={fieldsSettings.genreId.defaultValue}
                        label="Ідентифікатор жанру"
                        fullWidth
                        disabled={fieldsSettings.genreId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="genreName"
                        control={control}
                        rules={genreNameRules}
                        defaultValue={fieldsSettings.genreName.defaultValue}
                        label="Назва жанру*"
                        fullWidth
                        disabled={fieldsSettings.genreName.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default GenreForm;
