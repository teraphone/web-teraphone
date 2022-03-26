import * as React from 'react';
import List from '@mui/material/List';
import * as models from '../models/models';
import GroupRoom from './GroupRoom';

function GroupRooms(props: { groupinfo: models.GroupInfo }) {
  const { groupinfo } = props;
  const { rooms } = groupinfo;

  function handleRooms() {
    const roomItems = rooms.map((roominfo: models.RoomInfo) => {
      const groupId = roominfo.room.group_id;
      const roomId = roominfo.room.id;
      return (
        <GroupRoom
          groupinfo={groupinfo}
          roominfo={roominfo}
          key={`${groupId}/${roomId}`}
        />
      );
    });

    return roomItems;
  }

  return <List disablePadding>{handleRooms()}</List>;
}

export default GroupRooms;
