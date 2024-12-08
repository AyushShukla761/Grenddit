'use client'

import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { CommentRequest, CommentValidator } from "@/lib/validators/comments";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/TextArea";
import { Button } from "./ui/Button";

interface CreateCommentprops{
    postId: string
    replyId?: string
}

export default function Createcomment({postId,replyId}: CreateCommentprops) {

    const [com, setcom]= useState('')
    const router =useRouter()
    const {loginToast}= useCustomToasts()



    const {mutate: comment,isLoading}= useMutation({
        mutationFn:async ({postId,text,replyToId}: CommentRequest)=>{
            const payload : CommentRequest ={postId,text,replyToId}

            const {data}= await axios.patch('/api/subgrenddit/post/comment/',payload)
            return data
            
        },
        onError: (err)=>{
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                  return loginToast()
                }
              }
            return toast({
                title: 'Something went wrong.',
                description: "Comment wasn't created successfully. Please try again.",
                variant: 'destructive',
            })},

        onSuccess : ()=> {
            router.refresh()
            setcom('')
            
        }
        
    })
    return (
        <div className='grid w-full gap-1.5'>
      <div className='mt-2'>
        <Textarea
          id='comment'
          value={com}
          onChange={(e) => setcom(e.target.value)}
          rows={1}
          placeholder='Add a Comment'
        />

        <div className='mt-2 flex justify-end'>
          <Button
            isLoading={isLoading}
            disabled={com.length === 0}
            onClick={() => comment({ postId, text: com, replyToId: replyId})}>
            Post
          </Button>
        </div>
      </div>
    </div>
    );
}