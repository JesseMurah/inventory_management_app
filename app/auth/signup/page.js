'use client';

import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { signIn } from 'next-auth/react';



export default function SignUp() {
    const handleSignUp = () => {
        signIn('google', { callbackUrl: '/dashboard', signup: true });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f4f8', padding: 4, borderRadius: 2, boxShadow: 1 }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Sign up
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Create a new account using your Google account.
                </Typography>
                <Button fullWidth variant="contained" onClick={handleSignUp} sx={{ mt: 3, mb: 2 }}>
                    Sign up with Google
                </Button>
                <Button component="a" href="/auth/signin" variant="text" sx={{ mt: 2 }}>
                    Already have an account? Sign in
                </Button>
            </Box>
        </Container>
    );
}
