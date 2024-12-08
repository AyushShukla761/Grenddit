

import { db } from "@/lib/db"
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config"
import { notFound } from "next/navigation"
import MiniCreatePost from "@/components/MiniCreatePost"
import { getAuthSession } from "@/lib/auth"
import PostFeed from "@/components/PostFeed"

interface PageProps {
    params: {
      subgrend: string
    }
  }

export default async function Page({params} : PageProps){
    const {subgrend}= params
    const session =await getAuthSession()
    const subgrenddit= await db.subgrenddit.findFirst({
        where: { name: subgrend },
        include: {
          posts: {
            include: {
              author: true,
              votes: true,
              comments: true,
              subgrenddit: true,
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: INFINITE_SCROLL_PAGINATION_RESULTS,
          },
        },
      })
      
      if (!subgrenddit) return notFound()
    return(
        <>
      <h1 className='font-bold text-3xl md:text-4xl h-14'>
        g/{subgrenddit.name}
      </h1>
      <MiniCreatePost session={session} />

      <PostFeed initialPosts={subgrenddit.posts} subgrendditName={subgrenddit.name} />
    </>
    )
}