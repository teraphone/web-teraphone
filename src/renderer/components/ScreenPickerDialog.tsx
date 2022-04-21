/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-console */
import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Stack, Tab, Typography } from '@mui/material';
import { TabContext, TabList, useTabContext } from '@mui/lab';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setScreens,
  setWindows,
  setPickerVisible,
  selectScreens,
  selectWindows,
  selectPickerVisible,
  ScreenSource,
} from '../redux/ScreenShareSlice';
import useRoom from '../hooks/useRoom';
import { SerializedDesktopCapturerSource } from '../global';

function validDataURL(dataURL: string | null) {
  if (dataURL === null) {
    return false;
  }
  return dataURL.split(',')[1].length > 0;
}

function ScreenPickerItem(props: {
  source: SerializedDesktopCapturerSource;
  startChecked: boolean;
  changeCallback: (checked: boolean) => void;
}) {
  const { source, startChecked, changeCallback } = props;
  const {
    id,
    name,
    thumbnailDataURL,
    display_id: displayId,
    appIconDataURL,
  } = source;
  const [checked, setChecked] = React.useState(startChecked);
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      overflow="hidden"
      onClick={() => {
        changeCallback(!checked);
        setChecked(!checked);
        console.log('clicked source:', source);
      }}
    >
      <Box>
        <Checkbox
          checked={checked}
          onChange={(event) => {
            changeCallback(event.target.checked);
            setChecked(event.target.checked);
          }}
        />
      </Box>

      <Box
        sx={{
          boxShadow: 2,
          border: 1,
          borderColor: '#ccc',
        }}
      >
        <img src={thumbnailDataURL} alt={name} width="150px" />
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        {appIconDataURL && validDataURL(appIconDataURL) && (
          <Box ml={1}>
            <img src={appIconDataURL} alt="" height="32" width="32" />
          </Box>
        )}
        <Typography ml={1} variant="caption">
          {name}
        </Typography>
      </Box>
    </Box>
  );
}

function ScreenPickerTabPanel(props: {
  children: React.ReactNode;
  value: string;
}) {
  const { children, value: id } = props;
  const context = useTabContext();
  if (context === null) {
    throw new TypeError('No TabContext provided');
  }
  const tabId = context.value;
  return <div hidden={tabId !== id}>{children}</div>;
}

function ScreenPickerDialog() {
  const dispatch = useAppDispatch();
  const { room } = useRoom();
  const [screenSources, setScreenSources] = React.useState<
    SerializedDesktopCapturerSource[]
  >([]);
  const [windowSources, setwindowSources] = React.useState<
    SerializedDesktopCapturerSource[]
  >([]);
  const activeScreens = useAppSelector(selectScreens);
  const activeWindows = useAppSelector(selectWindows);

  // initialize the selected screens/windows from global state
  const [selectedScreenSources, setSelectedScreenSources] =
    React.useState<ScreenSource>(activeScreens);
  const [selectedWindowSources, setSelectedWindowSources] =
    React.useState<ScreenSource>(activeWindows);
  const pickerVisible = useAppSelector(selectPickerVisible);

  const [tabId, setTabId] = React.useState('tab1');

  const handleDialogClose = () => {
    dispatch(setPickerVisible(false));
  };

  const handleSubmit = () => {
    console.log('handleSubmit');
    console.log('selectedScreenSources:', selectedScreenSources);
    console.log('selectedWindowSources:', selectedWindowSources);
    dispatch(setScreens(selectedScreenSources));
    dispatch(setWindows(selectedWindowSources));
    dispatch(setPickerVisible(false));
  };

  const handleTabChange = (_event: React.SyntheticEvent, id: string) => {
    setTabId(id);
  };

  React.useEffect(() => {
    console.log('ScreenPickerDialog Mounted');
    return () => console.log('ScreenPickerDialog Unmounted');
  }, []);

  React.useEffect(() => {
    const asyncEffect = async () => {
      const thumbWidth = 300;
      const thumbHeight = 300;
      if (screenSources && pickerVisible) {
        const screens = await window.electron.ipcRenderer.queryScreens({
          thumbnailSize: {
            width: thumbWidth,
            height: thumbHeight,
          },
          types: ['screen'],
        });
        setScreenSources(screens);
      }
      if (windowSources && pickerVisible) {
        const windows = await window.electron.ipcRenderer.queryScreens({
          thumbnailSize: {
            width: thumbWidth,
            height: thumbHeight,
          },
          types: ['window'],
          fetchWindowIcons: true,
        });
        setwindowSources(windows);
      }
    };
    asyncEffect();
    // array-valued dependencies cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickerVisible]);

  const setSelectedWindowsCallback = (id: string) => (checked: boolean) => {
    console.log('setSelectedWindowsCallback', id, checked);
    if (checked) {
      setSelectedWindowSources({ ...selectedWindowSources, [id]: true });
    } else {
      const { [id]: _, ...remaining } = selectedWindowSources;
      setSelectedWindowSources(remaining);
    }
  };

  const setSelectedScreensCallback = (id: string) => (checked: boolean) => {
    console.log('setSelectedScreensCallback', id, checked);
    if (checked) {
      setSelectedScreenSources({ ...selectedScreenSources, [id]: true });
    } else {
      const { [id]: _, ...remaining } = selectedScreenSources;
      setSelectedScreenSources(remaining);
    }
  };

  let windowThumbs: React.ReactNode[] = [];
  if (windowSources.length > 0) {
    windowThumbs = windowSources
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
      .map((source) => {
        if (validDataURL(source.thumbnailDataURL)) {
          return (
            <ScreenPickerItem
              source={source}
              key={source.id}
              startChecked={!!activeWindows[source.id]}
              changeCallback={setSelectedWindowsCallback(source.id)}
            />
          );
        }
        return null;
      });
  }

  let screenThumbs: React.ReactNode[] = [];
  if (screenSources.length > 0) {
    screenThumbs = screenSources
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
      .map((source) => {
        if (validDataURL(source.thumbnailDataURL)) {
          return (
            <ScreenPickerItem
              source={source}
              key={source.id}
              startChecked={!!activeScreens[source.id]}
              changeCallback={setSelectedScreensCallback(source.id)}
            />
          );
        }
        return null;
      });
  }

  return (
    <TabContext value={tabId}>
      <Dialog
        fullScreen
        open={pickerVisible}
        onClose={handleDialogClose}
        scroll="paper"
      >
        <DialogTitle sx={{ alignSelf: 'center' }}>Screen Share</DialogTitle>
        <Typography variant="body1" align="center" sx={{ px: 2 }}>
          Select the Applications and Screens that you would like to share with
          the room!
        </Typography>
        <TabList value={tabId} variant="standard" onChange={handleTabChange}>
          <Tab value="tab1" label="Applications" />
          <Tab value="tab2" label="Screens" />
        </TabList>

        <DialogContent dividers sx={{ px: 0.5 }}>
          <ScreenPickerTabPanel value="tab1">
            <Stack spacing={2} divider={<Divider />}>
              {windowThumbs}
            </Stack>
          </ScreenPickerTabPanel>
          <ScreenPickerTabPanel value="tab2">
            <Stack spacing={2} divider={<Divider />}>
              {screenThumbs}
            </Stack>
          </ScreenPickerTabPanel>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="inherit" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button autoFocus color="inherit" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </TabContext>
  );
}

export default ScreenPickerDialog;
