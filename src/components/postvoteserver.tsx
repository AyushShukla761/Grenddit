import { getAuthSession } from "@/lib/auth"
import { Post, Vote } from "@prisma/client"
import { notFound } from "next/navigation"
import PostVoteClient from "./postvoteclient"

interface Props {
    postId: string
    initialVotesAmt?: number
    initialVote?: Vote['type'] | null
    getData?: () => Promise<(Post & { votes: Vote[] }) | null>
}

const Postvoteserver= async ({postId,initialVotesAmt,initialVote,getData}: Props) => {

    const session =await getAuthSession();
    let votesAmt: number = 0
    let currentVote: Vote['type'] | null | undefined = undefined

    if(getData){
        const post= await getData();

        if(!post) return notFound();

        votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
          }, 0)
      
          currentVote = post.votes.find(
            (vote) => vote.userId === session?.user?.id
          )?.type
    }
    else{
        votesAmt= initialVotesAmt!
        currentVote= initialVote
    }


  return (<div>
    
    <PostVoteClient postId={postId} initamt={votesAmt} initvotetype={currentVote}/>

  </div>
  )
}

export default Postvoteserver