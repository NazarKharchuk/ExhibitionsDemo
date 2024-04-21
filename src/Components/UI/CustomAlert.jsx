import { Alert, Portal, Snackbar } from '@mui/material';
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
        <Portal>
            <Snackbar open={alertState.isOpenAlert} autoHideDuration={alertState.hideTime} onClose={handleClose} style={{ zIndex: 1600 }}>
                <Alert
                    onClose={handleClose}
                    severity={alertState.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertState.message}
                </Alert>
            </Snackbar>
        </Portal>
    );
}

export default CustomAlert;
