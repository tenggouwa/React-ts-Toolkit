import store from '../redux/store';

// Redux 应用的状态
export type RootState = ReturnType<typeof store.getState>