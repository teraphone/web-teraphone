import * as React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import validator from 'validator';

const theme = createTheme();

function SignUp() {
  const [nameError, setNameError] = React.useState(false);
  const [nameHelperText, setNameHelperText] = React.useState('');
  const [nameValid, setNameValid] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [emailHelperText, setEmailHelperText] = React.useState('');
  const [emailValid, setEmailValid] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordHelperText, setPasswordHelperText] = React.useState('');
  const [passwordValid, setPasswordValid] = React.useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length < 3) {
      setNameError(true);
      setNameHelperText('Must be 3 or more characters');
      setNameValid(false);
    } else {
      setNameError(false);
      setNameHelperText('');
      setNameValid(true);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (!validator.isEmail(value)) {
      setEmailError(true);
      setEmailHelperText('Invalid email address');
      setEmailValid(false);
    } else {
      setEmailError(false);
      setEmailHelperText('');
      setEmailValid(true);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length < 8) {
      setPasswordError(true);
      setPasswordHelperText('Must be 8 or more characters');
      setPasswordValid(false);
    } else {
      setPasswordError(false);
      setPasswordHelperText('');
      setPasswordValid(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={nameError}
                  helperText={nameHelperText}
                  onChange={handleNameChange}
                  autoFocus
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={emailError}
                  helperText={emailHelperText}
                  onChange={handleEmailChange}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={passwordError}
                  helperText={passwordHelperText}
                  onChange={handlePasswordChange}
                  required
                  fullWidth
                  type="password"
                  id="password"
                  label="Password"
                  name="password"
                />
              </Grid>
            </Grid>
            <Button
              disabled={!(nameValid && emailValid && passwordValid)}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/signin">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
