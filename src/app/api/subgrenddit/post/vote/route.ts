import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import redis from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redid";
import { ZodError } from "zod";


export async function PATCH(req: Request) {
    try{
        const data =await req.json();
        const {postId, voteType}= PostVoteValidator.parse(data);
    
        const CACHE_AFTER_UPVOTES=1;
        
        const session =await getAuthSession()
        
        if(!session?.user){
            return new Response('Unauthorised', {status: 401})
        }
        
        const vote =await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId
            }
        })
    
        const post= await db.post.findUnique({
            where: {
                id: postId,
            },
            include:{
                author: true,
                votes: true,
            }
        })
    
        if (!post) {
            return new Response('Post not found', { status: 404 })
          }
    
        if(vote){
            if(vote.type===voteType){
                await db.vote.delete({
                    where:{
                        userId_postId: {
                            postId,
                            userId: session.user.id,
                        }
                    }
                })
                const votcount= post.votes.reduce( (c,v)=>{
                    if(v.type==="UP"){ return c+1}
                    else if(v.type="DOWN") return c-1
                    return c
                },0)
        
                if (votcount >= CACHE_AFTER_UPVOTES) {
                    const cachePayload: CachedPost = {
                      authorUsername: post.author.name ?? '',
                      content: JSON.stringify(post.content),
                      id: post.id,
                      title: post.title,
                      currentVote: null,
                      createdAt: post.createdAt,
                    }
          
                    await redis.hset(`post:${postId}`, cachePayload) // Store the post data as a hash
                }
          
                  return new Response('OK')
            }
            await db.vote.update({
                where:{
                    userId_postId: {
                        postId,
                        userId: session.user.id,
                    }
                },
                data: {
                    type:voteType
                }
            })
        
        
        const votcount= post.votes.reduce( (c,v)=>{
            if(v.type==="UP"){ return c+1}
            else if(v.type="DOWN") return c-1
            return c
        },0)
        
        if (votcount >= CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
              authorUsername: post.author.username ?? '',
              content: JSON.stringify(post.content),
              id: post.id,
              title: post.title,
              currentVote: null,
              createdAt: post.createdAt,
            }
        
            await redis.hset(`post:${postId}`, cachePayload) // Store the post data as a hash
          }
        
          return new Response('OK')
            
            }
            await db.vote.create({
                data: {
                    userId: session?.user.id,
                    postId,
                    type: voteType
                }
            })
        
        
        const votcount= post.votes.reduce( (c,v)=>{
            if(v.type==="UP"){ return c+1}
            else if(v.type="DOWN") return c-1
            return c
        },0)
    
        if (votcount >= CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
              authorUsername: post.author.username ?? '',
              content: JSON.stringify(post.content),
              id: post.id,
              title: post.title,
              currentVote: null,
              createdAt: post.createdAt,
            }
    
            await redis.hset(`post:${postId}`, cachePayload) // Store the post data as a hash
          }
    
          return new Response('OK')

    }catch(err){
        if(err instanceof ZodError){
            return new Response(err.message,{status: 400})

        }
        return new Response("Could not vote now,try again later",{status: 500})
    }


}