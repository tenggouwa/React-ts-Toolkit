import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appSlice from "./reducer";
import loginSlice from './reducer/login';
import umbrellaUserSlice from './reducer/umbrella/userList';
import umbrellaContractVolSlice from './reducer/umbrella/contractVol';
import umbrellaAccSummarySlice from './reducer/umbrella/accSummary';
import umbrellaContractNetPosition from './reducer/umbrella/contractNetPosition';
import permissionUserSlice from './reducer/permission/user';
import permissionRoleSlice from './reducer/permission/role';
import partnerTeamSlice from './reducer/partner/team';
import partnerCommissionSlice from './reducer/partner/commission';

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: combineReducers({
    appSlice,
    loginSlice,
    umbrellaUserSlice,
    umbrellaContractVolSlice,
    umbrellaAccSummarySlice,
    umbrellaContractNetPosition,
    permissionUserSlice,
    permissionRoleSlice,
    partnerTeamSlice,
    partnerCommissionSlice
  })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;