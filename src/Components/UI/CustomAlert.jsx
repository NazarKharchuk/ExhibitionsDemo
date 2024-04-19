import { Alert, Snackbar } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeAlert } from '../../Store/headerSlice';

const CustomAlert = () => {
    const dispatch = useDispatch();
    const alertState = useSelector((state) => state.header.alert)

    const handleClose = (_, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(closeAlert());
    };

    return (
        <Snackbar open={alertState.isOpenAlert} autoHideDuration={alertState.hideTime} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={alertState.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertState.message}
            </Alert>
        </Snackbar>
    );
}

export default CustomAlert;
