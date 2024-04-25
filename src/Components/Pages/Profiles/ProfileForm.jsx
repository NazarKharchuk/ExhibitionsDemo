import * as React from 'react';
import { profileFirstNameRules, profileLastNameRules } from '../../../Helper/Validation/Profile/ProfileValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';

const ProfileForm = ({ control, fieldsSettings }) => {
    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="profileId"
                        control={control}
                        defaultValue={fieldsSettings.profileId.defaultValue}
                        label="Ідентифікатор жанру"
                        fullWidth
                        disabled={fieldsSettings.profileId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="firstName"
                        control={control}
                        rules={profileFirstNameRules}
                        defaultValue={fieldsSettings.firstName.defaultValue}
                        label="Ім'я*"
                        fullWidth
                        disabled={fieldsSettings.firstName.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="lastName"
                        control={control}
                        rules={profileLastNameRules}
                        defaultValue={fieldsSettings.lastName.defaultValue}
                        label="Прізвище"
                        fullWidth
                        disabled={fieldsSettings.lastName.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default ProfileForm;
