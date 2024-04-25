import * as React from 'react';
import FullScreenDialog from '../../UI/FullScreenDialog';
import { Container } from '@mui/material';
import { profileAPI } from '../../../API/profileAPI';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { showAlert } from '../../../Store/headerSlice';
import ProfileForm from './ProfileForm';

const ProfileUpdate = ({ isUpdateDialogOpen, setIsUpdateDialogOpen, setNeedRefetch }) => {
    const dispatch = useDispatch();
    const myProfileId = useSelector((store) => store.user.profileId);

    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const result = await profileAPI.profile(myProfileId);
        if (result.successfully === true) {
            setData(result.data);
        } else {
            dispatch(showAlert({ message: "Не вдалось отримати дані профіля: " + result.message, severity: 'error', hideTime: 10000 }));
        }
    };

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const fieldsSettings = {
        profileId: {
            defaultValue: data ? data.profileId : "",
            disabled: true
        },
        firstName: {
            defaultValue: data ? data.firstName : "",
            disabled: false
        },
        lastName: {
            defaultValue: data ? data.lastName : "",
            disabled: false
        }
    }

    const handleClick = async (data) => {
        try {
            const res = await profileAPI.updateProfile(data.profileId, data);

            if (res.successfully === true) {
                dispatch(showAlert({ message: "Зміни успішно збережено", severity: 'success', hideTime: 4000 }));
                setIsUpdateDialogOpen(false);
                setNeedRefetch(Date.now());
            } else {
                dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час редагування профіля:", error);
        }
    };

    return (
        <FullScreenDialog
            isDialogOpen={isUpdateDialogOpen}
            setIsDialogOpen={setIsUpdateDialogOpen}
            dialogTitle="Редагування профіля"
            buttonName="Зберегти"
            handleClick={handleSubmit(handleClick)}
            disabled={isSubmitting || !isDirty || !isValid}
            isSubmitting={isSubmitting}
        >
            {data &&
                <Container>
                    <ProfileForm control={control} fieldsSettings={fieldsSettings} />
                </Container>
            }
        </FullScreenDialog>
    );
}

export default ProfileUpdate;
