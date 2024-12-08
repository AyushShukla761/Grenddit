import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PostFeed from "./PostFeed";



async function CustumFeed() {

    const session =await getAuthSession()
    if(!session) return notFound()


        const followedsub= await db.subscription.findMany({
            where: {
                userId: session?.user.id
            },
            include:{
                subgrenddit: true
            }
        })

        const post= await db.post.findMany({
            where: {
                subgrenddit: {
                    name: {
                        in: followedsub.map((x)=> x.subgrenddit.name)
                    }
                }
            },
            take: INFINITE_SCROLL_PAGINATION_RESULTS,
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

        


    return <PostFeed initialPosts={post}/>
}

export default CustumFeed;