import { createSlice } from '@reduxjs/toolkit';

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        data: [],
        current: {},
        newContent: {},
        statusSearch: '',
    },
    reducers: {
        updateData: (state, action) => {
            state.data = action.payload;
        },
        updateCurrent: (state, action) => {
            state.current = action.payload;
        },
        updateCurrentStatus: (state, action) => {
            state.current.status = action.payload;
        },
        insertComment: (state, action) => {
            state.current.listComments.push(action.payload);
        },
        deleteComment: (state, action) => {
            state.current.listComments = state.current.listComments.filter((e) => e.id !== action.payload);
        },
        newContentChange: (state, action) => {
            state.newContent = action.payload;
        },
        updateStatusSearch: (state, action) => {
            state.statusSearch = action.payload;
        },
    },
});

export default reviewSlice;
