import { SvgIcon, useTheme } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { SxProps } from '@mui/system';

function MSSignInLoadingButton({
  children = 'Sign in with Microsoft',
  disableElevation = false,
  loading = false,
  onClick = () => {},
  sx = {},
}: {
  children?: React.ReactNode;
  disableElevation?: boolean;
  loading?: boolean;
  onClick?: () => void;
  sx?: SxProps;
}) {
  const theme = useTheme();

  return (
    <LoadingButton
      color="info"
      loading={loading}
      onClick={onClick}
      startIcon={
        <SvgIcon inheritViewBox>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 21 21"
          >
            <title>MS-SymbolLockup</title>
            <rect x="1" y="1" width="9" height="9" fill="#f25022" />
            <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
            <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
            <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
          </svg>
        </SvgIcon>
      }
      sx={{
        backgroundColor: '#fff',
        borderRadius: 0,
        boxShadow: !disableElevation ? theme.shadows[2] : theme.shadows[0],
        fontFamily: 'Segoe UI, system-ui, sans-serif',
        fontSize: '15px',
        px: 1.5,
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
          boxShadow: !disableElevation ? theme.shadows[4] : theme.shadows[0],
        },
        '&:active': {
          boxShadow: theme.shadows[0],
        },
        '& .MuiButton-startIcon': { my: 0, ml: 0, mr: 1.5 },
        ...sx,
      }}
      type="submit"
      variant="outlined"
    >
      {children}
    </LoadingButton>
  );
}

export default MSSignInLoadingButton;
