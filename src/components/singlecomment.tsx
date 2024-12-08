'use client'

import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comments";
import { Comment, CommentVote, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from '../hooks/use-toast';
import Commentvotes from "./Commentsvotes";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/TextArea";
import { UserAvatar } from "./UserAvatar";


type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}

interface SinglecommentProps{
    comment: ExtendedComment
    currentVote: CommentVote | undefined,
    votesAmt: number
    postId: string
}

export default function Singlecomment({comment,currentVote,votesAmt,postId}: SinglecommentProps) {

    const { data: session } = useSession()
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const commentRef = useRef<HTMLDivElement>(null)
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    useOnClickOutside(commentRef, () => {setIsReplying(false)})

    const {mutate: replycomment,isLoading} = useMutation({
        mutationFn: async ({postId, replyToId,text}:CommentRequest)=> {

            const payload: CommentRequest= {postId,replyToId,text}

            const {data}=await axios.patch('/api/subgrenddit/post/comment/',payload)

            return data
        },

        onError: ()=>{
            return toast({
                title: 'Something went wrong.',
                description: "Comment wasn't created successfully. Please try again.",
                variant: 'destructive',
            })},

        onSuccess : ()=> {
            router.refresh()
            setInput('')
            setIsReplying(false)
        }
        
    })

    return (
        <div ref={commentRef} className='flex flex-col'>
      <div className='flex items-center'>
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className='h-6 w-6'
        />
        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium text-gray-900'>u/{comment.author.name}</p>

          <p className='max-h-40 truncate text-xs text-zinc-500'>
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className='text-sm text-zinc-900 mt-2'>{comment.text}</p>

      <div className='flex gap-2 items-center'>
        <Commentvotes
          commentId={comment.id}
          initamt={votesAmt}
          initvotetype={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) return router.push('/sign-in')
            setIsReplying(true)
          }}
          variant='ghost'
          size='xs'>
          <MessageSquare className='h-4 w-4 mr-1.5' />
          Reply
        </Button>
      </div>

      {isReplying ? (
        <div className='grid w-full gap-1.5'>
          <div className='mt-2'>
            <Textarea
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length
                )
              }
              autoFocus
              id='comment'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder='What are your thoughts?'
            />

            <div className='mt-2 flex justify-end gap-2'>
              <Button
                tabIndex={-1}
                variant='subtle'
                onClick={() => setIsReplying(false)}>
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                onClick={() => {
                  if (!input) return
                  replycomment({
                    postId,
                    replyToId: comment.replyId ?? comment.id, // default to top-level comment
                    text: input,
                  })
                }}>
                Post
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    );
}