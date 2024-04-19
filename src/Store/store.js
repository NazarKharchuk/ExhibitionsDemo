import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import headerReducer from './headerSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        header: headerReducer,
    },
})
