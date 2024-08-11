'use client';

import React from 'react';
import { SessionProvider } from "next-auth/react";

/**
 * @typedef {Object} Props
 * @property {React.ReactNode} children
 * @property {import('next-auth').Session | null} [session]
 */

/**
 * @param {Props} props
 */
export default function CustomSessionProvider({ children, session }) {
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}