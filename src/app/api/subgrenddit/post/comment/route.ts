import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentValidator } from "@/lib/validators/comments"
import { z } from "zod"


export async function PATCH(request: Request) {
    try{
    const session = await getAuthSession()
    const data= await request.json()

    const{postId,text,replyToId}= CommentValidator.parse(data)

    if (!session?.user) {
        return new Response('Unauthorized', { status: 401 })
      }
 

      await db.comment.create({
        data: {
          text,
          postId,
          authorId: session.user.id,
          replyId: replyToId,
        },
      })
  
      return new Response('OK')}
      catch(error){
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
          }
      
          return new Response(
            'Could not post to subreddit at this time. Please try later',
            { status: 500 }
          )
      }
}