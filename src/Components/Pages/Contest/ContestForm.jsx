import * as React from 'react';
import { contestDescriptionRules, contestEndDateRules, contestNameRules, contestNeedConfirmationRules, contestPainterLimitRules, contestStartDateRules, contestVotesLimitnRules, contestWinnersCountRules } from '../../../Helper/Validation/Contest/ContestValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';
import FormDateField from '../../FormElements/FormDateField';
import FormSwitchField from '../../FormElements/FormSwitchField';

const ContestForm = ({ control, fieldsSettings }) => {
    const formKey = JSON.stringify(fieldsSettings);
    return (
        <form key={formKey}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="contestId"
                        control={control}
                        defaultValue={fieldsSettings.contestId.defaultValue}
                        label="Ідентифікатор конкурсу"
                        fullWidth
                        disabled={fieldsSettings.contestId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="name"
                        control={control}
                        rules={contestNameRules}
                        defaultValue={fieldsSettings.name.defaultValue}
                        label="Назва конкурсу*"
                        fullWidth
                        disabled={fieldsSettings.name.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="description"
                        control={control}
                        rules={contestDescriptionRules}
                        defaultValue={fieldsSettings.description.defaultValue}
                        label="Опис конкурсу*"
                        fullWidth
                        multiline
                        disabled={fieldsSettings.description.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormDateField
                        name="startDate"
                        register={fieldsSettings.startDate.register}
                        control={control}
                        rules={{
                            ...contestStartDateRules,
                            ...fieldsSettings.startDate.validation
                        }}
                        defaultValue={fieldsSettings.startDate.defaultValue}
                        label="Дата початку голосування*"
                        fullWidth
                        disabled={fieldsSettings.startDate.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormDateField
                        name="endDate"
                        register={fieldsSettings.endDate.register}
                        control={control}
                        rules={{
                            ...contestEndDateRules,
                            ...fieldsSettings.endDate.validation
                        }}
                        defaultValue={fieldsSettings.endDate.defaultValue}
                        label="Дата закінчення голосування*"
                        fullWidth
                        disabled={fieldsSettings.endDate.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormSwitchField
                        name="needConfirmation"
                        control={control}
                        rules={{
                            ...contestNeedConfirmationRules,
                            ...fieldsSettings.needConfirmation.validation
                        }}
                        defaultValue={fieldsSettings.needConfirmation.defaultValue}
                        label="Чи потребує конкурс підтвердження заявки?*"
                        disabled={fieldsSettings.needConfirmation.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="painterLimit"
                        control={control}
                        rules={{
                            ...contestPainterLimitRules,
                            ...fieldsSettings.painterLimit.validation
                        }}
                        defaultValue={fieldsSettings.painterLimit.defaultValue}
                        label="Ліміт кількості картин від одного художника"
                        fullWidth
                        type="number"
                        disabled={fieldsSettings.painterLimit.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="winnersCount"
                        control={control}
                        rules={{
                            ...contestWinnersCountRules,
                            ...fieldsSettings.winnersCount.validation
                        }}
                        defaultValue={fieldsSettings.winnersCount.defaultValue}
                        label="Кількість переможців конкурсу*"
                        fullWidth
                        type="number"
                        disabled={fieldsSettings.winnersCount.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="votesLimit"
                        control={control}
                        rules={{
                            ...contestVotesLimitnRules,
                            ...fieldsSettings.votesLimit.validation
                        }}
                        defaultValue={fieldsSettings.votesLimit.defaultValue}
                        label="Ліміт кількості голосів від одного користувача"
                        fullWidth
                        type="number"
                        disabled={fieldsSettings.votesLimit.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default ContestForm;
