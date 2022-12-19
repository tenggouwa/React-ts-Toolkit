import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apis from '@/fetch/index';
import { RootState } from '@/redux/store';

interface UmbrellaFirst {
  account: string,
  lmTradeVol: string,
  mtradeVol: string,
  ttradeVol: string,
  wtradeVol: string,
  ytradeVol: string,
  userId: number | string,
}

export interface UmbrellaState {
  data: Array<UmbrellaFirst>,
  loading: boolean,
}

const initialState:UmbrellaState = {
  data: [],
  loading: false,
}

export const fetchUmbrellaNetPosition = createAsyncThunk('fetchUmbrellaNetPosition', async ({}, { rejectWithValue }) => {
  try {
    const res = await apis.fetchUmbrellaNetPosition();
    return res
  } catch (error) {
    return rejectWithValue(error)
  }
});


export const umbrellaContractNetPosition = createSlice({
  name: 'umbrellaContractNetPosition',
  initialState,
  reducers: {
    clearStore: (state: UmbrellaState) => {
      state.data = []
    }
  },
  extraReducers: {
    // 查询伞下用户净头寸
    [fetchUmbrellaNetPosition.pending.type]: (state, action) => {
      state.loading = true;
    },
    [fetchUmbrellaNetPosition.fulfilled.type]: (state, action) => {
      state.loading = false;
      const { data, success } = action.payload;
      if (success) {
        state.data = data;
      } else {
        state.loading = false;
        state.data = [];
      }
    },
  }
})

export const app = (state: RootState) => state.umbrellaContractNetPosition;
export const { clearStore } = umbrellaContractNetPosition.actions;
export default umbrellaContractNetPosition.reducer
