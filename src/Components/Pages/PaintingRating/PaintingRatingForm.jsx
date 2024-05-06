import * as React from 'react';
import { paintingRatingCommentRules, paintingRatingRatingValueRules } from '../../../Helper/Validation/PaintingRating/PaintingRatingValidation';
import { Grid } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';
import FormRatingField from '../../FormElements/FormRatingField';

const PaintingRatingForm = ({ control, fieldsSettings }) => {
    return (
        <form>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="ratingId"
                        control={control}
                        defaultValue={fieldsSettings.ratingId.defaultValue}
                        label="Ідентифікатор оцінки"
                        fullWidth
                        disabled={fieldsSettings.ratingId.disabled}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormRatingField
                        name="ratingValue"
                        control={control}
                        rules={paintingRatingRatingValueRules}
                        defaultValue={fieldsSettings.ratingValue.defaultValue}
                        label="Розмір оцінки*"
                        disabled={fieldsSettings.ratingValue.disabled}
                        max={5}
                        precision={0.1}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="comment"
                        control={control}
                        rules={paintingRatingCommentRules}
                        defaultValue={fieldsSettings.comment.defaultValue}
                        label="Коментар"
                        fullWidth
                        multiline
                        disabled={fieldsSettings.comment.disabled}
                    />
                </Grid>
            </Grid>
        </form>
    );
}

export default PaintingRatingForm;
