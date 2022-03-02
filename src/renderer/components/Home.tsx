/* eslint-disable no-console */
import Button from '@mui/material/Button';
import * as React from 'react';
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import * as requests from '../requests/requests';
import * as models from '../models/models';
import GroupTabs from './GroupTabs';

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const auth = useAuth();
  const [groupsInfo, setGroupsInfo] = React.useState([] as models.GroupsInfo);

  const setAuthExpire = () => {
    const { token } = auth.state;
    auth.setState({ token, expiration: 0 });
  };

  const setAuthExpireSoon = () => {
    const { token } = auth.state;
    auth.setState({ token, expiration: Math.floor(Date.now() / 1000) + 1000 });
  };

  const pingPrivateWelcome = () => {
    axiosPrivate
      .get('/v1/private')
      .then((response) => {
        console.log(response);
        return true;
      })
      .catch((error) => {
        console.log(error);

        return false;
      });
  };

  const getRoomsInfo = async (groupId: number) => {
    const rreq = await requests.GetRooms(axiosPrivate, groupId);
    const { rooms } = rreq.data as requests.GetRoomsResponse;

    const handleRoom = async (room: models.Room) => {
      const rureq = await requests.GetRoomUsers(axiosPrivate, groupId, room.id);
      const { room_users: users } = rureq.data as requests.GetRoomUsersResponse;
      return { users, room } as models.RoomInfo;
    };

    const roomsInfo = await Promise.all(rooms.map(handleRoom));
    return roomsInfo;
  };

  const getGroupsInfo = async () => {
    const greq = await requests.GetGroups(axiosPrivate);
    const { groups } = greq.data as requests.GetGroupsResponse;

    const handleGroup = async (group: models.Group) => {
      const ureq = await requests.GetGroupUsers(axiosPrivate, group.id);
      const { group_users: users } =
        ureq.data as requests.GetGroupUsersResponse;
      const rooms = await getRoomsInfo(group.id);
      return { group, users, rooms } as models.GroupInfo;
    };

    setGroupsInfo(await Promise.all(groups.map(handleGroup)));
  };

  React.useEffect(() => {
    console.log('useEffect -> getGroupsInfo');
    getGroupsInfo(); // this will run just once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logGroups = () => {
    console.log(groupsInfo);
  };

  return (
    <div>
      <h1>Home</h1>
      <p>Unix time: {Math.floor(Date.now() / 1000)}</p>
      <p>Expiration: {auth.state.expiration}</p>
      <p>Token: {auth.state.token}</p>
      {/* <p>{groups}</p> */}
      <Button variant="contained" onClick={setAuthExpire}>
        Set Auth Expire
      </Button>
      <Button variant="contained" onClick={setAuthExpireSoon}>
        Set Auth Expire Soon
      </Button>
      <Button variant="contained" onClick={pingPrivateWelcome}>
        Ping Private Welcome
      </Button>
      <Button variant="contained" onClick={getGroupsInfo}>
        Get Groups
      </Button>
      <Button variant="contained" onClick={logGroups}>
        Log Groups
      </Button>
      <GroupTabs groupsInfo={groupsInfo} />
    </div>
  );
};

export default Home;