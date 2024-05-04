import * as React from 'react';
import { exhibitionDescriptionRules, exhibitionNameRules, exhibitionNeedConfirmationRules, exhibitionPainterLimitRules } from '../../../Helper/Validation/Exhibition/ExhibitionValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';
import FormSwitchField from '../../FormElements/FormSwitchField';

const ExhibitionForm = ({ control, fieldsSettings }) => {
    const formKey = JSON.stringify(fieldsSettings);
    return (
        <form key={formKey}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="exhibitionId"
                        control={control}
                        defaultValue={fieldsSettings.exhibitionId.defaultValue}
                        label="Ідентифікатор виставки"
                        fullWidth
                        disabled={fieldsSettings.exhibitionId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="name"
                        control={control}
                        rules={exhibitionNameRules}
                        defaultValue={fieldsSettings.name.defaultValue}
                        label="Назва виставки*"
                        fullWidth
                        disabled={fieldsSettings.name.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="description"
                        control={control}
                        rules={exhibitionDescriptionRules}
                        defaultValue={fieldsSettings.description.defaultValue}
                        label="Опис виставки*"
                        fullWidth
                        multiline
                        disabled={fieldsSettings.description.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormSwitchField
                        name="needConfirmation"
                        control={control}
                        rules={{
                            ...exhibitionNeedConfirmationRules,
                            ...fieldsSettings.needConfirmation.validation
                        }}
                        defaultValue={fieldsSettings.needConfirmation.defaultValue}
                        label="Чи потребує виставка підтвердження заявки?*"
                        disabled={fieldsSettings.needConfirmation.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="painterLimit"
                        control={control}
                        rules={{
                            ...exhibitionPainterLimitRules,
                            ...fieldsSettings.painterLimit.validation
                        }}
                        defaultValue={fieldsSettings.painterLimit.defaultValue}
                        label="Ліміт кількості картин від одного художника"
                        fullWidth
                        type="number"
                        disabled={fieldsSettings.painterLimit.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default ExhibitionForm;
