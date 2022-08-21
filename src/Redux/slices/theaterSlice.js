import { createSlice } from '@reduxjs/toolkit';

const theaterSlice = createSlice({
    name: 'theater',
    initialState: {
        data: [],
        filter: {
            id: '',
        },
    },
    reducers: {
        updateAll: (state, action) => {
            state.data = action.payload;
        },
        add: (state, action) => {
            state.data.push(action.payload);
        },
        setFilter: (state, action) => {
            state.filter.text = action.payload;
        },
    },
});

export default theaterSlice;
