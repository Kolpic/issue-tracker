'use client'

import { SessionProvider } from 'next-auth/react'
import React, { PropsWithChildren } from 'react'

export const AuthProvider = ({ children }: PropsWithChildren) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default AuthProvider