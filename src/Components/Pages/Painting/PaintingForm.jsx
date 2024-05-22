import * as React from 'react';
import { paintingBuyingStatusRules, paintingCretionDateRules, paintingDescriptionRules, paintingHeightRules, paintingLocationRules, paintingNameRules, paintingPriceRules, paintingWidthRules } from '../../../Helper/Validation/Painting/PaintingValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';
import FormFileField from '../../FormElements/FormFileField';
import FormDateField from '../../FormElements/FormDateField';
import FormRadioGroup from '../../FormElements/FormRadioGroup';

const PaintingForm = ({ control, fieldsSettings }) => {
    const formKey = JSON.stringify(fieldsSettings);
    return (
        <form key={formKey}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="paintingId"
                        control={control}
                        defaultValue={fieldsSettings.paintingId.defaultValue}
                        label="Ідентифікатор картини"
                        fullWidth
                        disabled={fieldsSettings.paintingId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="name"
                        control={control}
                        rules={paintingNameRules}
                        defaultValue={fieldsSettings.name.defaultValue}
                        label="Назва картини*"
                        fullWidth
                        disabled={fieldsSettings.name.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="description"
                        control={control}
                        rules={paintingDescriptionRules}
                        defaultValue={fieldsSettings.description.defaultValue}
                        label="Опис картини*"
                        fullWidth
                        multiline
                        disabled={fieldsSettings.description.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormDateField
                        name="cretionDate"
                        register={fieldsSettings.image.register}
                        control={control}
                        rules={paintingCretionDateRules}
                        defaultValue={fieldsSettings.cretionDate.defaultValue}
                        label="Дата створення картини*"
                        fullWidth
                        disabled={fieldsSettings.cretionDate.disabled}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        name="width"
                        control={control}
                        rules={paintingWidthRules}
                        defaultValue={fieldsSettings.width.defaultValue}
                        label="Ширина картини*"
                        fullWidth
                        type="number"
                        disabled={fieldsSettings.width.disabled}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        name="height"
                        control={control}
                        rules={paintingHeightRules}
                        defaultValue={fieldsSettings.height.defaultValue}
                        label="Висота картини*"
                        fullWidth
                        type="number"
                        disabled={fieldsSettings.height.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="location"
                        control={control}
                        rules={paintingLocationRules}
                        defaultValue={fieldsSettings.location.defaultValue}
                        label="Місце знаходження картини"
                        fullWidth
                        multiline
                        disabled={fieldsSettings.location.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormRadioGroup
                        name="status"
                        control={control}
                        rules={paintingBuyingStatusRules}
                        defaultValue={fieldsSettings.status.defaultValue}
                        options={[
                            { value: 'notSale', label: 'Не продається' },
                            { value: 'sale', label: 'Продається' },
                            { value: 'sold', label: 'Продано' },
                        ]}
                        row
                        label="Статус продажу картини"
                        disabled={fieldsSettings.status.disabled}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        name="price"
                        control={control}
                        rules={{
                            ...paintingPriceRules,
                            ...fieldsSettings.price.validation
                        }}
                        defaultValue={fieldsSettings.price.defaultValue}
                        label="Ціна картини (USD)"
                        fullWidth
                        type="number"
                        disabled={fieldsSettings.price.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormFileField
                        name="image"
                        register={fieldsSettings.image.register}
                        control={control}
                        rules={fieldsSettings.image.rules}
                        defaultValue={fieldsSettings.image.defaultValue}
                        label="Зображення картини"
                        fullWidth
                        disabled={fieldsSettings.image.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default PaintingForm;
