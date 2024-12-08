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

        if (!isSubscribed) {
            return new Response("You're not subscribed to this subreddit", {
              status: 400,
            })
        }
        await db.subscription.delete({
            where: {
                userId_subgrendditid: {
                    subgrendditid: subredditId,
                    userId: session.user.id
                }
            }
        })
        return new Response(subredditId)

    }
    catch(err){
        if (err instanceof z.ZodError) {
            return new Response(err.message, { status: 400 })
        }
        return new Response(
            'Could not unsubscribe to subreddit at this time. Please try later',
            { status: 500 }
        )

    }
}