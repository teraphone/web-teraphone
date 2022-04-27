/* eslint-disable no-console */
import Box from '@mui/material/Box';
import * as React from 'react';
import { ref, remove } from 'firebase/database';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import GroupTabs from './GroupTabs';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getWorld } from '../redux/WorldSlice';
import useFirebase from '../hooks/useFirebase';
import { addParticipantRTListener } from '../redux/ArtySlice';
import * as models from '../models/models';
import useRoom from '../hooks/useRoom';
import {
  ConnectionStatus,
  selectConnectionStatus,
  setConnectionStatus,
} from '../redux/ConnectionStatusSlice';
import { selectCurrentRoom } from '../redux/CurrentRoomSlice';
import { selectAppUser } from '../redux/AppUserSlice';
import ScreenPickerDialog from './ScreenPickerDialog';
import WindowPortal from './WindowPortal';
import VideoView from './VideoView';
import { selectWindowOpen, setWindowOpen } from '../redux/VideoViewSlice';

const Home = () => {
  React.useEffect(() => {
    console.log('Home Mounted');
    return () => console.log('Home Unmounted');
  }, []);
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  const { database } = useFirebase();
  const { isConnecting, error, room } = useRoom();
  const { currentRoom } = useAppSelector(selectCurrentRoom);
  const { connectionStatus } = useAppSelector(selectConnectionStatus);
  const { appUser } = useAppSelector(selectAppUser);
  const videoViewWindowOpen = useAppSelector(selectWindowOpen);
  const userRTRef = ref(
    database,
    `participants/${currentRoom.groupId}/${currentRoom.roomId}/${appUser.id}`
  );

  React.useEffect(() => {
    console.log('useEffect -> dispatch getWorld');
    dispatch(getWorld(axiosPrivate))
      .then((response) => {
        console.log('dispatch getWorld -> then', response);
        return response.payload as models.GroupsInfo;
      })
      .then((groupsInfo) => {
        groupsInfo.forEach((groupInfo) => {
          const groupId = groupInfo.group.id.toString();
          console.log('addParticipantRTListener', groupId);
          dispatch(
            addParticipantRTListener({
              db: database,
              groupId,
            })
          );
        });
        return true;
      })
      .catch((err) => {
        console.log('dispatch getWorld -> error', err);
        return false;
      });
  }, [axiosPrivate, dispatch, database]);

  React.useEffect(() => {
    console.log('Home Mounted');
    return () => console.log('Home Unmounted');
  }, []);

  React.useEffect(() => {
    console.log('useEffect -> setConnectionStatus');
    if (error) {
      dispatch(setConnectionStatus(ConnectionStatus.Error));
    } else if (isConnecting) {
      dispatch(setConnectionStatus(ConnectionStatus.Connecting));
    } else if (room && room.state === 'connected') {
      dispatch(setConnectionStatus(ConnectionStatus.Connected));
    } else if (room && room.state === 'reconnecting') {
      dispatch(setConnectionStatus(ConnectionStatus.Reconnecting));
    } else {
      dispatch(setConnectionStatus(ConnectionStatus.Disconnected));
    }
  }, [dispatch, error, isConnecting, room]);

  React.useEffect(() => {
    window.addEventListener('beforeunload', () => {
      console.log('handling window unloaded event');
      if (connectionStatus !== ConnectionStatus.Disconnected) {
        room?.disconnect();
        remove(userRTRef);
      }
    });
  }, [connectionStatus, room, userRTRef]);

  const handleCloseVideoView = React.useCallback(() => {
    dispatch(setWindowOpen(false));
  }, [dispatch]);

  return (
    <div>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'background.paper',
          display: 'flex',
          height: '100vh',
        }}
      >
        <GroupTabs />
        <ScreenPickerDialog />
        {videoViewWindowOpen && (
          <WindowPortal
            title="Video - T E R A P H O N E"
            width={320}
            height={240}
            onClose={handleCloseVideoView}
          >
            <VideoView />
          </WindowPortal>
        )}
      </Box>
    </div>
  );
};

export default React.memo(Home);
// todo: how to refresh groupsInfo if...
// - a new user joins the group?
// - user joins a new group?
