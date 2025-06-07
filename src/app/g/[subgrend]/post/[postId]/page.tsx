import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import redis from "@/lib/redis";
import { CachedPost } from "@/types/redid";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Postvoteserver from "@/components/postvoteserver";
import { formatTimeToNow } from "@/lib/utils";
import EditorOutput from "@/components/ui/EditorOutput";
import Postcomments from "@/components/Postcomments";

interface PageProps{
    params: {
        postId: string
    }
}
 export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Page({params}: PageProps) {

    

    const cachedpost= (await redis.hgetall(`post:${params.postId}`)) as unknown as CachedPost
    
    let post: (Post & { votes: Vote[]; author: User }) | null = null
    
    if(cachedpost===null || cachedpost===undefined || Object.keys(cachedpost).length === 0){
        
        post= await db.post.findFirst({
            where: {
                id: params.postId
            },
            include:{ 
                votes: true,
                author: true
            }
        })
    }


    if(post){
        cachedpost.id=post?.id
        cachedpost.authorUsername= post?.author.name || ''
        cachedpost.content=JSON.stringify(post?.content)
        cachedpost.createdAt=post.createdAt
        cachedpost.title=post.title
        cachedpost.currentVote=post.votes[0].type

        await redis.hset(`post:${params.postId}`,cachedpost)
    }



    


    if(!post && !cachedpost) return notFound()




        return (
            <>
                <div>
                <div className='h-full flex flex-col sm:flex-row items-center sm:items-start justify-between'>
                    <Suspense fallback={<PostVoteShell />}>
                        {/* @ts-expect-error server component */}
                        <Postvoteserver 
                            postId={post?.id ?? cachedpost?.id}
                            getData={async () => {
                                return await db.post.findUnique({
                                    where: {
                                        id: params.postId
                                    },
                                    include: {
                                        votes: true
                                    }
                                });
                            }}
                        />
                    </Suspense>
                    <div className='sm:w-0 w-full flex-1 bg-white p-4 rounded-sm'>
                        <h1 className='max-h-40 mt-1 truncate text-xs text-gray-500'>
                            Posted by u/{post?.author.name ?? cachedpost.authorUsername}{' '}
                            {formatTimeToNow(new Date(post?.createdAt ?? cachedpost.createdAt))}

                        </h1>
                        <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
                            {post?.title ?? cachedpost.title}
                        </h1>
                        <EditorOutput content={post?.content ?? JSON.parse(cachedpost?.content)} />
                        <Suspense>
                        {/* @ts-expect-error server component */}
                        <Postcomments PostId={post?.id ?? cachedpost?.id} />
                        </Suspense>
                    </div>
                    </div>
                </div>
            </>
        );
        
}



function PostVoteShell() {
    return (
      <div className='flex items-center flex-col pr-6 w-20'>
        {/* upvote */}
        <div className={buttonVariants({ variant: 'ghost' })}>
          <ArrowBigUp className='h-5 w-5 text-zinc-700' />
        </div>
  
        {/* score */}
        <div className='text-center py-2 font-medium text-sm text-zinc-900'>
          <Loader2 className='h-3 w-3 animate-spin' />
        </div>
  
        {/* downvote */}
        <div className={buttonVariants({ variant: 'ghost' })}>
          <ArrowBigDown className='h-5 w-5 text-zinc-700' />
        </div>
      </div>
    )
  }