import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button, CircularProgress, Grid, Link } from '@mui/material';
import FormTextField from '../../FormElements/FormTextField';
import { emailRules, passwordRules } from '../../../Helper/Validation/Auth/AuthValidation';
import { instance } from '../../../API/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../../../Store/userSlice';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { SetAccessToken, SetRefreshToken } from '../../../Helper/TokenFunctions';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setTitle({ title: "Вхід" }))
    }, []);

    const { control, handleSubmit, formState: { isSubmitting, isDirty, isValid } } = useForm({
        mode: 'onTouched'
    });

    const onSubmit = async (data) => {
        dispatch(setLoading({ isLoading: true }))
        try {
            const res = await instance.post("login", { ...data });

            if (res.data.successfully === true) {
                dispatch(showAlert({ message: "Вхід успішно виконано", severity: 'success', hideTime: 4000 }));
                dispatch(userLogin(res.data.data));
                SetAccessToken(res.data.data.accessToken)
                SetRefreshToken(res.data.data.refreshToken);
                instance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${res.data.data.accessToken}`;
                navigate("/home", { replace: true });
            } else {
                dispatch(showAlert({ message: res.data.message, severity: 'error', hideTime: 6000 }));
            }
        } catch (error) {
            console.error("Помилка під час входу:", error);
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
                        defaultValue="admin@gmail.com"
                        label="Пошта*"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormTextField
                        name="password"
                        control={control}
                        rules={passwordRules}
                        defaultValue="Admin_P@ssw0rd"
                        label="Пароль*"
                        type="password"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || !isDirty || !isValid}>
                        {!isSubmitting ? 'Увійти' : <CircularProgress size={25} />}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    Не маєте облікового запису? {' '}
                    <Link href="/register">
                        Зареєструватися
                    </Link>
                </Grid>
            </Grid>
        </form>
    );
}

export default Login;
