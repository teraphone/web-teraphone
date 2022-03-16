/* eslint-disable react/jsx-props-no-spreading */
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import * as models from '../models/models';

function GroupMenu(props: { groupinfo: models.GroupInfo }) {
  const { groupinfo } = props;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
      }}
    >
      <List
        component="nav"
        aria-label="group-menu"
        sx={{ height: '100%', p: 0 }}
      >
        <PopupState variant="popover" popupId="group-popup-menu">
          {(popupState) => (
            <>
              <ListItem
                button
                divider
                secondaryAction={
                  <KeyboardArrowDownIcon
                    sx={{
                      color: 'text.secondary',
                      fontSize: 20,
                      marginTop: 0.5,
                    }}
                  />
                }
                {...bindTrigger(popupState)}
              >
                <ListItemText disableTypography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {groupinfo.group.name}
                  </Typography>
                </ListItemText>
              </ListItem>

              <Menu
                {...bindMenu(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MenuItem onClick={popupState.close} sx={{ width: 280 }}>
                  <ListItemText>Invite People</ListItemText>
                  <PersonAddIcon sx={{ fontSize: 20 }} />
                </MenuItem>
                <MenuItem onClick={popupState.close} disabled>
                  <ListItemText>Edit Group Profile</ListItemText>
                  <EditIcon sx={{ fontSize: 20 }} />
                </MenuItem>
                <MenuItem onClick={popupState.close} disabled>
                  <ListItemText>Add a New Room</ListItemText>
                  <PlaylistAddIcon sx={{ fontSize: 20 }} />
                </MenuItem>
                <MenuItem onClick={popupState.close} disabled>
                  <ListItemText>Leave Group</ListItemText>
                  <DeleteForeverIcon sx={{ fontSize: 20 }} />
                </MenuItem>
              </Menu>
            </>
          )}
        </PopupState>
      </List>
    </Box>
  );
}

export default GroupMenu;
