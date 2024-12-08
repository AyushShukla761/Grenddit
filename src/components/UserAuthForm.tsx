'use client'

import { Button } from "./ui/Button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { FC } from "react"
import { signIn } from 'next-auth/react'
import { Icons } from "./Icons"
import { useToast } from "@/hooks/use-toast"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) =>{
    const {toast} = useToast();

    const [isLoading,setLoading]= useState<boolean>(false)

    const logingoogle=async() =>{
        setLoading(true)

        try{
            await signIn('google')
        }
        catch(e){
            toast({
                title: 'Error',
                description: 'There was an error logging in with Google',
                variant: 'destructive',
              })
        }
        finally{
            setLoading(false)
        }
    }

    return (
        <div className={cn('flex justify-center',className)} {...props}>
            <Button onClick={logingoogle} isLoading={isLoading} size='sm' className="w-full">
                {isLoading ? null : <Icons.google className='h-4 w-4 mr-2'/>}
            </Button>
        </div>

    )
}

export default UserAuthForm