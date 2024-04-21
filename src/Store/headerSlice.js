import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoading: false,
    title: "Exhibitions service",
    alert: {
        isOpenAlert: false,
        message: '',
        severity: 'info',
        hideTime: 6000,
    }
}

export const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload.isLoading;
        },
        setTitle: (state, action) => {
            state.title = action.payload.title;
        },
        showAlert: (state, action) => {
            const { message, severity, hideTime } = action.payload;
            state.alert.message = message;
            state.alert.severity = severity;
            state.alert.hideTime = hideTime;
            state.alert.isOpenAlert = true;
        },
        closeAlert: (state) => {
            state.alert.isOpenAlert = false;
            state.alert.message = '';
            state.alert.severity = 'info';
            state.alert.hideTime = 6000;
        },
    },
})

export const { setLoading, setTitle, showAlert, closeAlert } = headerSlice.actions

export default headerSlice.reducer
