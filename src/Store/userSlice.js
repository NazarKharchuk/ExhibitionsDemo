import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    profileId: null,
    painterId: null,
    email: null,
    roles: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            const { profileId, painterId, email, roles } = action.payload;
            state.profileId = profileId;
            state.painterId = painterId;
            state.email = email;
            state.roles = roles;
            state.isAuth = true;
        },
        userLogout: (state) => {
            state.profileId = null;
            state.painterId = null;
            state.email = null;
            state.roles = null;
            state.isAuth = false;
        },
    },
})

export const { userLogin, userLogout } = userSlice.actions

export default userSlice.reducer
