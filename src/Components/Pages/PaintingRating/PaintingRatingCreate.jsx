import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Container } from '@mui/material';
import { paintingRatingAPI } from '../../../API/paintingRatingAPI';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import PaintingRatingForm from './PaintingRatingForm';

const PaintingRatingCreate = ({ isCreateDialogOpen, setIsCreateDialogOpen, setNeedRefetch, profileId, paintingId }) => {
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        ratingId: {
            defaultValue: "",
            disabled: true
        },
        ratingValue: {
            defaultValue: null,
            disabled: false
        },
        comment: {
            defaultValue: "",
            disabled: false
        }
    }

    const handleClick = async (data) => {
        try {
            data.profileId = profileId;
            data.paintingId = paintingId;
            const res = await paintingRatingAPI.createPaintingRating(data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Відгук додано", severity: 'success', hideTime: 4000 }));
                setIsCreateDialogOpen(false);
                setNeedRefetch(Date.now());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час додавання відгуку:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isCreateDialogOpen}
            setIsDialogOpen={setIsCreateDialogOpen}
            dialogTitle="Додавання відгуку"
            buttonName="Додати"
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

export default PaintingRatingCreate;
