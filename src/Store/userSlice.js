import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuth: false,
    profileId: null,
    email: null,
    roles: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            const { profileId, email, roles } = action.payload;
            state.profileId = profileId;
            state.email = email;
            state.roles = roles;
            state.isAuth = true;
        },
        userLogout: (state) => {
            state.profileId = null;
            state.email = null;
            state.roles = null;
            state.isAuth = false;
        },
    },
})

export const { userLogin, userLogout } = userSlice.actions

export default userSlice.reducer
