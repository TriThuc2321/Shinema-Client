import { createSlice } from '@reduxjs/toolkit';

const showTimeSlice = createSlice({
    name: 'showTime',
    initialState: {
        data: [],
        filter: {
            date: '',
        },
        currentShowTime: {},
    },
    reducers: {
        updateAll: (state, action) => {
            state.data = action.payload;
        },
        add: (state, action) => {
            state.data.push(action.payload);
        },
        setFilter: (state, action) => {
            state.filter.date = action.payload;
        },
        updateCurrentShowtime: (state, action) => {
            state.currentShowTime = state.data.find((e) => e._id === action.payload._id);
        },
    },
});

export default showTimeSlice.reducer;
