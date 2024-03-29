import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

const config = {
  apiKey: 'AIzaSyDPFJHANvIyx-7OHZl-8UEI7vFOgaShaPI',
  authDomain: 'livekit-demo.firebaseapp.com',
  databaseURL: 'https://dally-arty.firebaseio.com/',
  projectId: 'livekit-demo',
  storageBucket: 'livekit-demo.appspot.com',
  messagingSenderId: '543196966940',
  appId: '1:543196966940:web:673abeab10b5b92903efd9',
};
const app = initializeApp(config);
const auth = getAuth(app);
export const database = getDatabase(app);

export const signIn = async (token: string) => {
  const userCredential = await signInWithCustomToken(auth, token);
  return userCredential;
};
