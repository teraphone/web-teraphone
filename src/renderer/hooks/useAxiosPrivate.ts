import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { axiosPrivate } from '../api/axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setAuth, selectAuth } from '../redux/AuthSlice';

const useAxiosPrivate = () => {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector(selectAuth);
  const navigate = useNavigate();

  const updateAuthHeader = () => {
    const refreshAuth = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };
      const response = await axios.get('/v1/private/auth', config);
      const { token, expiration } = response.data;
      dispatch(setAuth({ token, expiration }));
    };

    const isExpired = auth.expiration - Math.floor(Date.now() / 1000) < 0;
    const expiresSoon =
      auth.expiration - Math.floor(Date.now() / 1000) < 3600 && !isExpired;

    if (isExpired) {
      // eslint-disable-next-line no-console
      console.log('WARNING: AUTH TOKEN EXPIRED!!!');
      navigate('/');
    }
    if (expiresSoon) {
      // eslint-disable-next-line no-console
      console.log('WARNING: AUTH TOKEN EXPIRING SOON. REFRESHING...');
      refreshAuth();
    }

    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers) {
          config.headers = {};
        }
        // eslint-disable-next-line no-console
        console.log(`updateAuthHeader, time: ${Math.floor(Date.now() / 1000)}`);
        config.headers.Authorization = `Bearer ${auth.token}`;

        return config;
      },
      // eslint-disable-next-line promise/no-promise-in-callback
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  };

  React.useEffect(updateAuthHeader, [auth, dispatch, navigate]);

  return axiosPrivate;
};

export default useAxiosPrivate;
