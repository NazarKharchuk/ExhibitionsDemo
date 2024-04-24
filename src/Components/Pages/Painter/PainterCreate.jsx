import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Container } from '@mui/material';
import { painterAPI } from '../../../API/painterAPI';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import PainterForm from './PainterForm';
import { RefreshTokens } from '../../../Helper/RefreshTokens';

const PainterCreate = ({ isCreateDialogOpen, setIsCreateDialogOpen, defaultValues, setNeedRefetch }) => {
    const dispatch = useDispatch();
    const profileId = useSelector((store) => store.user.profileId);

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        painterId: {
            defaultValue: defaultValues === null ? "" : defaultValues.painterId,
            disabled: true
        },
        description: {
            defaultValue: defaultValues === null ? "" : defaultValues.description,
            disabled: false
        },
        pseudonym: {
            defaultValue: defaultValues === null ? "" : defaultValues.pseudonym,
            disabled: false
        }
    }

    const handleClick = async (data) => {
        try {
            data.profileId = profileId;
            const res = await painterAPI.createPainter(data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Тепер ви маєте обліковий запис художника", severity: 'success', hideTime: 4000 }));
                setIsCreateDialogOpen(false);
                setNeedRefetch(Date.now());
                RefreshTokens();
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час створення облікового запису художника:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isCreateDialogOpen}
            setIsDialogOpen={setIsCreateDialogOpen}
            dialogTitle="Реєстрація облікового запису художника"
            buttonName="Створити"
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

export default PainterCreate;
