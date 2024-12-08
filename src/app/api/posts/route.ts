import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";
import { z } from "zod";


export async function GET(req: Request) {
    const url = new URL(req.url)

    const session = await getAuthSession();

    let followedsubIds: string[]=[]

    if(session){
        const followedsub= await db.subscription.findMany({
            where: {
                userId: session?.user.id
            },
            include:{
                subgrenddit: true
            }
        })
        followedsubIds= followedsub.map((x)=> {
            return x.subgrenddit.id
        })

    }

    try{

        const {limit, page, subgrendditName}= z.object({
            limit: z.string(),
            page: z.string(),
            subgrendditName: z.string().nullish().optional()
        }).parse({
            subgrendditName: url.searchParams.get('subgrendditName'),
            limit: url.searchParams.get('limit'),
            page: url.searchParams.get('page'),
        })

        let whereClause = {}

        if (subgrendditName) {
            whereClause = {
                subgrenddit: {
                    name: subgrendditName,
                },
            }
        } else if (session) {
            whereClause = {
                subgrenddit: {
                    id: {
                        in: followedsubIds,
                    },
                },
            }
        }

        const post= await db.post.findMany({
            where: whereClause,
            take: parseInt(limit),
            skip: (parseInt(page)-1)* parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                subgrenddit: true,
                votes: true,
                author: true,
                comments: true,
              },


              
            })
            return new Response(JSON.stringify(post))





    }catch(err){
        return new Response('Could not fetch posts', {status: 500})
    }
    
}