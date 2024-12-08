'use client'

import {Icons} from './Icons'
import Link from 'next/link' 
import UserAuthForm from './UserAuthForm'

export default function SignUp(){
    return(
        <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-6 w-6' />
        <h1 className='text-2xl font-semibold tracking-tight'>Create a new Account</h1>
        <p className='text-sm max-w-xs mx-auto'>
          By continuing, you are setting up a Grenddit account and agree to our
          User Agreement and Privacy Policy.
        </p>
      </div>
      <UserAuthForm />
      <p className='px-8 text-center text-sm text-muted-foreground'>
        Already a Grendditer?{' '}
        <Link
          href='/sign-in'
          className='hover:text-brand text-sm underline underline-offset-4'>
          Sign In
        </Link>
      </p>
    </div>
    )
}