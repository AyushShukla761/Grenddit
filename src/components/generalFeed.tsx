import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";



async function GeneralFeed() {


        const post= await db.post.findMany({
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

export default GeneralFeed;