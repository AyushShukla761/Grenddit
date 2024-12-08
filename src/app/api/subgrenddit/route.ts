import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubgrendditValidator } from '@/lib/validators/subgrenddit'
import { z } from 'zod'

export async function POST(req:Request) {
    try{
        const session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorized', { status: 401 })
        }

        const body =await req.json()
        const {name} =SubgrendditValidator.parse(body)

        const subgrenexist= await db.subgrenddit.findFirst({
            where :{
                name,
            },
        })

        if (subgrenexist) {
            return new Response('Subreddit already exists', { status: 409 })
          }


        const subgrenddit = await db.subgrenddit.create({
            data:{
                name,
                creatorId: session.user.id,
            },
        })

        await db.subscription.create({
            data: {
                userId: session.user.id,
                subgrendditid: subgrenddit.id,
            },

        })
        return new Response(subgrenddit.name)
    }
    catch(err){
        if(err instanceof z.ZodError){
            return new Response(err.message, {status: 422})
        }
        return new Response('Could not create subgrenddit', {status: 500})
    }
}