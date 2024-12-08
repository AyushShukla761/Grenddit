'use client'


import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { usePrevious } from "@mantine/hooks";
import { CommentVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommentVoteRequest, PostVoteRequest } from "@/lib/validators/vote";


interface  Commentvotesprops{
    commentId: string
    initamt: number
    initvotetype?: partialvote
}
type partialvote = Pick<CommentVote,'type'>

export default function Commentvotes({commentId,initamt,initvotetype} : Commentvotesprops) {

    const [votenum, changevotenum] =useState<number>(initamt)
    const [votetype,changevotetype] =useState(initvotetype)
    const prevvote= usePrevious(votetype)
    const {loginToast}= useCustomToasts();

    useEffect(()=>{
        changevotetype(initvotetype)
    },[initvotetype])


    const {mutate: vote} =useMutation({
        mutationFn: async (type: VoteType)=>{
            const payload: CommentVoteRequest={
                commentId: commentId,
                voteType: type
            }


            await axios.patch('/api/subgrenddit/post/comment/vote',payload)
        },
        

        onError(err,voteType){

            

            if (voteType === 'UP') changevotenum((prev) => prev - 1)
                else changevotenum((prev) => prev + 1)
          
                // reset current vote
                changevotetype(prevvote)
          
                if (err instanceof AxiosError) {

                  if (err.response?.status === 401) {
                    return loginToast()
                  }
                }
        },
        onMutate: (type: VoteType) => {
            if (votetype?.type === type) {
              // User is voting the same way again, so remove their vote
              changevotetype(undefined)
              if (type === 'UP') changevotenum((prev) => prev - 1)
              else if (type === 'DOWN') changevotenum((prev) => prev + 1)
            } else {
              // User is voting in the opposite direction, so subtract 2
              changevotetype({type})
              if (type === 'UP') changevotenum((prev) => prev + (votetype ? 2 : 1))
              else if (type === 'DOWN')
                changevotenum((prev) => prev - (votetype ? 2 : 1))
            }
          },

    })


    return (
        <div className='flex gap-1'>
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size='sm'
        variant='ghost'
        aria-label='upvote'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-emerald-500 fill-emerald-500': votetype?.type === 'UP',
          })}
        />
      </Button>

      {/* score */}
      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votenum}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size='sm'
        className={cn({
          'text-emerald-500': votetype?.type === 'DOWN',
        })}
        variant='ghost'
        aria-label='downvote'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-red-500 fill-red-500': votetype?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
    );
}