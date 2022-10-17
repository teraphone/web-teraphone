/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {
  Box,
  Avatar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import CloseIcon from '@mui/icons-material/Close';
import {
  removeScreen,
  removeWindow,
  selectScreens,
  selectWindows,
  validDataURL,
} from '../redux/ScreenShareSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

function ScreenShareBanner(props: {
  // source: SerializedDesktopCapturerSource;
  // todo: add back source prop
  removeSource: ActionCreatorWithPayload<string, string>;
}) {
  const { removeSource } = props;
  const { id, name, appIconDataURL } = {
    id: 'placeholder-id',
    name: 'placeholder-name',
    appIconDataURL: 'placeholder-appIconDataURL',
  };
  const dispatch = useAppDispatch();
  const isValidIcon = appIconDataURL ? validDataURL(appIconDataURL) : false;
  const avatarDim = '24px';

  const handleClose = React.useCallback(() => {
    dispatch(removeSource(id));
  }, [dispatch, id, removeSource]);

  return (
    <ListItem
      disableGutters
      disablePadding
      sx={{
        py: '2px',
        pr: '40px',
      }}
      secondaryAction={
        <Box
          sx={{
            pr: '8px',
          }}
        >
          <Tooltip title="Stop Sharing" placement="right" arrow>
            <IconButton
              size="small"
              aria-label="stop-sharing"
              component="span"
              onClick={handleClose}
            >
              <CloseIcon
                sx={{
                  color: 'black',
                }}
                fontSize="small"
              />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <ListItemAvatar sx={{ minWidth: 0, margin: '4px' }}>
        {isValidIcon ? (
          <Avatar
            sx={{ height: avatarDim, width: avatarDim }}
            variant="square"
            src={appIconDataURL as string}
          />
        ) : (
          <Avatar
            sx={{
              height: avatarDim,
              width: avatarDim,
              fontSize: '14',
            }}
            variant="square"
          >
            {name[0]}
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={name}
        primaryTypographyProps={{
          variant: 'body2',
          noWrap: true,
          sx: {
            fontSize: 12,
          },
        }}
      />
    </ListItem>
  );
}

function ScreenShareBanners() {
  const screens = useAppSelector(selectScreens);
  const windows = useAppSelector(selectWindows);

  const screenBanners = Object.entries(screens).map(([id, source]) => (
    // todo: add back source prop
    <ScreenShareBanner key={id} removeSource={removeScreen} />
  ));

  const windowBanners = Object.entries(windows).map(([id, source]) => (
    // todo: add back source prop
    <ScreenShareBanner key={id} removeSource={removeWindow} />
  ));

  return (
    <List dense sx={{ boxSizing: 'border-box', py: 0 }}>
      {screenBanners}
      {windowBanners}
    </List>
  );
}

export default ScreenShareBanners;
