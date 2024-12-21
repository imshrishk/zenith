import React from 'react';
import { Button } from '../common/Button';
import { signInWithGoogle } from '../../services/authService';

export const GoogleSignInButton = () => {
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <Button onClick={handleSignIn} className="w-full">
      Sign in with Google
    </Button>
  );
};