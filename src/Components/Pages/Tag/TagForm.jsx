import * as React from 'react';
import { tagNameRules } from '../../../Helper/Validation/Tag/TagValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';

const TagForm = ({ control, fieldsSettings }) => {
    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="tagId"
                        control={control}
                        defaultValue={fieldsSettings.tagId.defaultValue}
                        label="Ідентифікатор тега"
                        fullWidth
                        disabled={fieldsSettings.tagId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="tagName"
                        control={control}
                        rules={tagNameRules}
                        defaultValue={fieldsSettings.tagName.defaultValue}
                        label="Назва тега*"
                        fullWidth
                        disabled={fieldsSettings.tagName.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default TagForm;
