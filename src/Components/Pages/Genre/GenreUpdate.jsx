import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Container } from '@mui/material';
import { genreAPI } from '../../../API/genreAPI';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import GenreForm from './GenreForm';

const GenreUpdate = ({ isUpdateDialogOpen, setIsUpdateDialogOpen, defaultValues, setNeedRefetch }) => {
    //const {isLoading, setIsLoading} = React.useState(false);
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        genreId: {
            defaultValue: defaultValues.genreId,
            disabled: true
        },
        genreName: {
            defaultValue: defaultValues.genreName,
            disabled: false
        }
    }

    const handleClick = async (data) => {
        try {
            const res = await genreAPI.updateGenre(data.genreId, data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Зміни успішно збережено", severity: 'success', hideTime: 4000 }));
                setIsUpdateDialogOpen(false);
                setNeedRefetch(Date.now());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час редагування жанру:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isUpdateDialogOpen}
            setIsDialogOpen={setIsUpdateDialogOpen}
            dialogTitle="Редагування інформації про жанр"
            buttonName="Зберегти"
            handleClick={handleSubmit(handleClick)}
            disabled={isSubmitting || !isDirty || !isValid}
            isSubmitting={isSubmitting}
        >
            <Container>
                <GenreForm control={control} fieldsSettings={fieldsSettings} />
            </Container>
        </FullScreenDialog>
    );
}

export default GenreUpdate;
