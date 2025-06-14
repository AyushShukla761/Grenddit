'use client'

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useMutation} from "@tanstack/react-query"
import axios, {AxiosError} from "axios"
import { CreateSubgrendditPayload } from "@/lib/validators/subgrenddit"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { useCustomToasts } from "@/hooks/use-custom-toasts"


export default function Page(){
    const router =useRouter()
    const [input, setInput] =useState('')
    const {toast}= useToast()
    const {loginToast}= useCustomToasts()
    const {mutate: createCommunity, isLoading} = useMutation({
        mutationFn: async () => {
            const payload: CreateSubgrendditPayload = {
              name: input,
            }
      
            const { data } = await axios.post('/api/subgrenddit', payload)
            return data as string
          },
          onError: (err) => {
            if (err instanceof AxiosError) {
              if (err.response?.status === 409) {
                return toast({
                  title: 'Subgrenddit already exists.',
                  description: 'Please choose a different name.',
                  variant: 'destructive',
                })
              }
      
              if (err.response?.status === 422) {
                return toast({
                  title: 'Invalid subgrenddit name.',
                  description: 'Please choose a name between 3 and 21 letters.',
                  variant: 'destructive',
                })
              }
      
              if (err.response?.status === 401) {
                return loginToast();
              }
            }
      
            return toast({
              title: 'There was an error.',
              description: 'Could not create subgrenddit.',
              variant: 'destructive',
            })
          },
          onSuccess: (data) => {
            router.push(`/g/${data}`)
            return toast({
              title: 'Successfully Created.',
              description: 'Start with your first post.',
              variant: 'default',
            })
          },
    })


    return (
        <div className='container flex items-center h-full max-w-3xl mx-auto'>
          <div className='relative bg-white w-full h-fit p-4 rounded-lg space-y-6'>
            <div className='flex justify-between items-center'>
              <h1 className='text-xl font-semibold'>Create a Community</h1>
            </div>
    
            <hr className='bg-red-500 h-px' />
    
            <div>
              <p className='text-lg font-medium'>Name</p>
              <p className='text-xs pb-2'>
                Community names including capitalization cannot be changed.
              </p>
              <div className='relative'>
                <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
                  g/
                </p>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className='pl-6'
                />
              </div>
            </div>
    
            <div className='flex justify-end gap-4'>
              <Button
                disabled={isLoading}
                variant='subtle'
                onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                disabled={input.length === 0}
                onClick={() => createCommunity()}>
                Create Community
              </Button>
            </div>
          </div>
        </div>
      )
}