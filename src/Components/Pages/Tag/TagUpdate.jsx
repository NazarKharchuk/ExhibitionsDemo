import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Container } from '@mui/material';
import { tagAPI } from '../../../API/tagAPI';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import TagForm from './TagForm';

const TagUpdate = ({ isUpdateDialogOpen, setIsUpdateDialogOpen, defaultValues, setNeedRefetch }) => {
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        tagId: {
            defaultValue: defaultValues.tagId,
            disabled: true
        },
        tagName: {
            defaultValue: defaultValues.tagName,
            disabled: false
        }
    }

    const handleClick = async (data) => {
        try {
            const res = await tagAPI.updateTag(data.tagId, data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Зміни успішно збережено", severity: 'success', hideTime: 4000 }));
                setIsUpdateDialogOpen(false);
                setNeedRefetch(Date.now());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час редагування тега:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isUpdateDialogOpen}
            setIsDialogOpen={setIsUpdateDialogOpen}
            dialogTitle="Редагування інформації про тег"
            buttonName="Зберегти"
            handleClick={handleSubmit(handleClick)}
            disabled={isSubmitting || !isDirty || !isValid}
            isSubmitting={isSubmitting}
        >
            <Container>
                <TagForm control={control} fieldsSettings={fieldsSettings} />
            </Container>
        </FullScreenDialog>
    );
}

export default TagUpdate;
