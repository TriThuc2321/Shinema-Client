import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        instance: '',
    },
    reducers: {
        update: (state, action) => {
            state.instance = action.payload;
        },
    },
});

export default userSlice;
