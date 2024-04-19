import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button, CircularProgress, Grid, Link } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';
import { emailRules, firstNameRules, lastNameRules, passwordRules } from '../../../Helper/Validation/Auth/AuthValidation';
import { instance } from '../../../API/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setTitle({ title: "Реєстрація" }))
    }, []);

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const onSubmit = async (data) => {
        dispatch(setLoading({ isLoading: true }))
        try {
            const res = await instance.post("register", { ...data });
            if (res.data.successfully === true) {
                dispatch(showAlert({ message: "Реєстрацію успішно виконано", severity: 'success', hideTime: 4000 }));
                navigate("/login", { replace: true });
            } else {
                dispatch(showAlert({ message: res.data.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час реєстрації:", error);
        } finally {
            dispatch(setLoading({ isLoading: false }))
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormTextField
                        name="email"
                        control={control}
                        rules={emailRules}
                        defaultValue="sample@gmail.com"
                        label="Пошта*"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        name="firstName"
                        control={control}
                        rules={firstNameRules}
                        defaultValue=""
                        label="Ім'я*"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormTextField
                        name="lastName"
                        control={control}
                        rules={lastNameRules}
                        defaultValue=""
                        label="Прізвище"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="password"
                        control={control}
                        rules={passwordRules}
                        defaultValue="Pass_123"
                        label="Пароль*"
                        type="password"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || !isDirty || !isValid}>
                        {!isSubmitting ? 'Зареєструватись' : <CircularProgress size={25} />}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    Маєте обліковий запис? {' '}
                    <Link href="/login">
                        Увійти
                    </Link>
                </Grid>
            </Grid>
        </form>
    );
}

export default Register;
