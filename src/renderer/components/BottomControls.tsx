/* eslint-disable no-alert */
/* eslint-disable no-console */
import IconButton from '@mui/material/IconButton';
import HeadsetIcon from '@mui/icons-material/Headset';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import useMute from '../hooks/useMute';

function BottomControls() {
  const { mute, toggleMute, deafen, toggleDeafen } = useMute();

  const MuteButton = () => {
    if (mute) {
      return (
        <Tooltip title="Unmute" placement="top" arrow>
          <IconButton
            color="primary"
            aria-label="unmute"
            component="span"
            onClick={toggleMute}
          >
            <MicOffIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Mute" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="mute"
          component="span"
          onClick={toggleMute}
        >
          <MicIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const DeafenButton = () => {
    if (deafen) {
      return (
        <Tooltip title="Undeafen" placement="top" arrow>
          <IconButton
            color="primary"
            aria-label="undeafen"
            component="span"
            onClick={toggleDeafen}
          >
            <HeadsetOffIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Deafen" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="deafen"
          component="span"
          onClick={toggleDeafen}
        >
          <HeadsetIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const MenuButton = () => {
    const handleClick = () => {
      alert('Not implemented yet.');
    };

    return (
      <Tooltip title="Settings" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="settings"
          component="span"
          onClick={handleClick}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const InfoButton = () => {
    const handleClick = () => {
      alert('Not implemented yet.');
    };

    return (
      <Tooltip title="Info" placement="top" arrow>
        <IconButton
          color="primary"
          aria-label="info"
          component="span"
          onClick={handleClick}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <Stack direction="row" alignItems="right" spacing={0}>
      <MuteButton />
      <DeafenButton />
      <MenuButton />
      <InfoButton />
    </Stack>
  );
}

export default BottomControls;
