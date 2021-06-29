import { createSlice } from '@reduxjs/toolkit';
import axios from '../lib/axios';
import objFromArray from '../utils/objFromArray';

const initialState = {
  name: "",
  tags: [],
  startDate: null,
  endDate: null,
  description: "",
  openCreateProjectDrawer: false
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    updateProjectDetails(state, action) {
      const { name, tags, startDate, endDate } = action.payload;
      state.name = name;
      state.tags = tags;
      state.startDate = startDate;
      state.endDate = endDate;
    },

    updateProjectDescription(state, action) {
      const { description } = action.payload;
      state.description = description;
    },

    updateOpenCreateProjectDrawer(state, action) {
      const { openCreateProjectDrawer } = action.payload;
      state.openCreateProjectDrawer = openCreateProjectDrawer;
    }
  }
});

export const { reducer } = slice;

export const updateProjectDetails = (name, tags, startDate, endDate) => (dispatch) => {
  dispatch(slice.actions.updateProjectDetails({name, tags, startDate, endDate}));
};

export const updateProjectDescription = (description) => (dispatch) => {
  dispatch(slice.actions.updateProjectDescription({description}));
};

export const updateOpenCreateProjectDrawer = (openCreateProjectDrawer) => (dispatch) => {
  dispatch(slice.actions.updateOpenCreateProjectDrawer({openCreateProjectDrawer}));
};

export default slice;
