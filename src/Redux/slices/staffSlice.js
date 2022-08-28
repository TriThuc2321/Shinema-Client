import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import accountApi from '../../api/accountApi';

export const getAllStaff = createAsyncThunk('staff/getAll', async (data, { rejectWithValue }) => {
    const response = await accountApi.getAllStaff();
    if (response.status !== 200) {
        return rejectWithValue('Get All Failed');
    }
    return response.data;
});

export const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staffList: [],
        loading: false,
    },
    reducers: {
        staffListChange: (state, action) => {
            state.staffList = action.payload;
        },
        staffLoadingChange: (state, action) => {
            state.loading = action.payload;
        },
        addStaff: (state, action) => {
            state.staffList.push(action.payload);
        },
        deleteStaff: (state, action) => {
            state.staffList = state.staffList.filter((ite) => ite._id !== action.payload);
        },
    },
    extraReducers: {
        [getAllStaff.pending]: (state) => {
            state.loading = true;
        },
        [getAllStaff.fulfilled]: (state, action) => {
            state.staffList = action.payload;
            state.loading = false;
        },
        [getAllStaff.rejected]: (state) => {
            state.loading = false;
        },
    },
});
