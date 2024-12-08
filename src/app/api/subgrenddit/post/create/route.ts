import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post"
import { z } from "zod";



export async function POST(req: Request) {
    try{
        const body = await req.json()
        const session =await getAuthSession();
        const {title, content, subgrendditId}=  PostValidator.parse(body)

        if(!session?.user){
            return new Response('Unauthorized', { status: 401 })
        }

        const subscribtion= await db.subscription.findFirst({
            where : {
                subgrendditid : subgrendditId,
                userId : session.user.id,
            },
        })

        if(!subscribtion){
            return new Response('Subscribe to post', { status: 403 })
        }


        await db.post.create({
            data: {
                title,
                content,
                authorId: session.user.id,
                subgrendditId,
            }
        })
        return new Response('Posted')

    }
    catch(error){
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 })
          }
      
          return new Response(
            'Could not post to subgrenddit at this time. Please try later',
            { status: 500 }
          )
    }
}