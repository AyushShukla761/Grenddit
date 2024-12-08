import { getAuthSession } from "@/lib/auth";
import { SubgrendditSubscriptionValidator } from "@/lib/validators/subgrenddit";
import { db } from "@/lib/db";
import { z } from "zod";

export async function POST(req:Request) {
    try{
        const session =await getAuthSession();

        if(!session?.user){
            return new Response('Unauthorized', { status: 401 })
        }
        const body= await req.json()
        const {subredditId} = SubgrendditSubscriptionValidator.parse(body)

        const isSubscribed= await db.subscription.findFirst({
            where: {
                subgrendditid :subredditId,
                userId: session.user.id,
            }
        })

        if (isSubscribed) {
            return new Response("You've already subscribed to this subreddit", {
              status: 400,
            })
        }
        await db.subscription.create({
            data: {
                subgrendditid: subredditId,
                userId: session.user.id,
            }
        })
        return new Response(subredditId)

    }
    catch(err){
        if (err instanceof z.ZodError) {
            return new Response(err.message, { status: 400 })
        }
        return new Response(
            'Could not subscribe to subreddit at this time. Please try later',
            { status: 500 }
        )

    }
}