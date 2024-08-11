'use client';

import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { signIn } from 'next-auth/react';


export default function SignIn() {
    const handleSignIn = () => {
        signIn('google', { callbackUrl: '/dashboard' });
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f4f8', padding: 4, borderRadius: 2, boxShadow: 1 }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Login
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    Please use your Google account to login to the dashboard.
                </Typography>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSignIn}
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign in with Google
                </Button>
                <Button
                    component="a"
                    href="/auth/signup"
                    variant="text"
                    sx={{ mt: 2 }}
                >
                    Register
                </Button>
            </Box>
        </Container>
    );
}
