import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Container } from '@mui/material';
import { painterAPI } from '../../../API/painterAPI';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import PainterForm from './PainterForm';

const PainterUpdate = ({ isUpdateDialogOpen, setIsUpdateDialogOpen, defaultValues, setNeedRefetch }) => {
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        painterId: {
            defaultValue: defaultValues.painterId,
            disabled: true
        },
        description: {
            defaultValue: defaultValues.description,
            disabled: false
        },
        pseudonym: {
            defaultValue: defaultValues.pseudonym,
            disabled: false
        }
    }

    const handleClick = async (data) => {
        try {
            const res = await painterAPI.updatePainter(data.painterId, data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Зміни успішно збережено", severity: 'success', hideTime: 4000 }));
                setIsUpdateDialogOpen(false);
                setNeedRefetch(Date.now());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час редагування профіля художника:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isUpdateDialogOpen}
            setIsDialogOpen={setIsUpdateDialogOpen}
            dialogTitle="Редагування профіля художника"
            buttonName="Зберегти"
            handleClick={handleSubmit(handleClick)}
            disabled={isSubmitting || !isDirty || !isValid}
            isSubmitting={isSubmitting}
        >
            <Container>
                <PainterForm control={control} fieldsSettings={fieldsSettings} />
            </Container>
        </FullScreenDialog>
    );
}

export default PainterUpdate;
