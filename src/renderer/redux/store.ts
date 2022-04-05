import { configureStore } from '@reduxjs/toolkit';
import listenerMiddleware from './Middleware';
import appUserReducer from './AppUserSlice';
import authReducer from './AuthSlice';
import muteReducer from './MuteSlice';
import currentRoomReducer from './CurrentRoomSlice';
import connectionStatusReducer from './ConnectionStatusSlice';
import worldReducer from './WorldSlice';
import artyReducer, { addParticipantRTListener } from './ArtySlice';

export const store = configureStore({
  reducer: {
    appUser: appUserReducer,
    auth: authReducer,
    mute: muteReducer,
    currentRoom: currentRoomReducer,
    connectionStatus: connectionStatusReducer,
    world: worldReducer,
    arty: artyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignoreActions: [addParticipantRTListener],
        ignoreActions: true,
      },
    }).prepend(listenerMiddleware.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
