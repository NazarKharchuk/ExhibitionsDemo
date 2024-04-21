import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Container } from '@mui/material';
import { materialAPI } from '../../../API/materialAPI';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import MaterialForm from './MaterialForm';

const MaterialCreate = ({ isCreateDialogOpen, setIsCreateDialogOpen, defaultValues, setNeedRefetch }) => {
    const dispatch = useDispatch();

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        materialId: {
            defaultValue: defaultValues.materialId,
            disabled: true
        },
        materialName: {
            defaultValue: defaultValues.materialName,
            disabled: false
        }
    }

    const handleClick = async (data) => {
        try {
            const res = await materialAPI.createMaterial(data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Матеріал додано", severity: 'success', hideTime: 4000 }));
                setIsCreateDialogOpen(false);
                setNeedRefetch(Date.now());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час додавання матеріалу:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isCreateDialogOpen}
            setIsDialogOpen={setIsCreateDialogOpen}
            dialogTitle="Додавання матеріалу"
            buttonName="Додати"
            handleClick={handleSubmit(handleClick)}
            disabled={isSubmitting || !isDirty || !isValid}
            isSubmitting={isSubmitting}
        >
            <Container>
                <MaterialForm control={control} fieldsSettings={fieldsSettings} />
            </Container>
        </FullScreenDialog>
    );
}

export default MaterialCreate;
