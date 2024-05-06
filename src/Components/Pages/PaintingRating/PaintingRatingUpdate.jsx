import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Container } from '@mui/material';
import { paintingRatingAPI } from '../../../API/paintingRatingAPI';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import PaintingRatingForm from './PaintingRatingForm';

const PaintingRatingUpdate = ({ isUpdateDialogOpen, setIsUpdateDialogOpen, defaultValues, setNeedRefetch }) => {
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        ratingId: {
            defaultValue: defaultValues.ratingId,
            disabled: true
        },
        ratingValue: {
            defaultValue: defaultValues.ratingValue,
            disabled: false
        },
        comment: {
            defaultValue: defaultValues.comment !== null ? defaultValues.comment : "",
            disabled: false
        }
    }

    const handleClick = async (data) => {
        try {
            console.log(data)
            const res = await paintingRatingAPI.updatePaintingRating(data.ratingId, data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Зміни успішно збережено", severity: 'success', hideTime: 4000 }));
                setIsUpdateDialogOpen(false);
                setNeedRefetch(Date.now());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час редагування відгуку:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isUpdateDialogOpen}
            setIsDialogOpen={setIsUpdateDialogOpen}
            dialogTitle="Редагування відгуку про картину"
            buttonName="Зберегти"
            handleClick={handleSubmit(handleClick)}
            disabled={isSubmitting || !isDirty || !isValid}
            isSubmitting={isSubmitting}
        >
            <Container>
                <PaintingRatingForm control={control} fieldsSettings={fieldsSettings} />
            </Container>
        </FullScreenDialog>
    );
}

export default PaintingRatingUpdate;
