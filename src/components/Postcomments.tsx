import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVote, User } from "@prisma/client";
import Singlecomment from "./singlecomment";
import Createcomment from "./createcomment";

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
    replies: ReplyComment[]
}

type ReplyComment = Comment & {
    votes: CommentVote[]
    author: User
}

interface PostCommentsProps{
    PostId: string
    comments: ExtendedComment
}

export default async function Postcomments({PostId} : PostCommentsProps) {

    const session =await getAuthSession()

    const comments = await db.comment.findMany({
        where:{
            postId:PostId,
            replyId: null,
        }, 
        include:{
            author:true,
            votes: true,
            replies: {
                include: {
                    author:true,
                    votes: true,
                }
            }

        }
    })

    return (
        <div className='flex flex-col gap-y-4 mt-4'>
      <hr className='w-full h-px my-6' />

      <Createcomment postId={PostId} />

      <div className='flex flex-col gap-y-6 mt-4'>
        {comments
          .filter((comment) => !comment.replyId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
              },
              0
            )

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            )

            return (
              <div key={topLevelComment.id} className='flex flex-col'>
                <div className='mb-2'>
                  <Singlecomment
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                    postId={PostId}
                  />
                </div>

                {/* Render replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length) // Sort replies by most liked
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === 'UP') return acc + 1
                      if (vote.type === 'DOWN') return acc - 1
                      return acc
                    }, 0)

                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    )

                    return (
                      <div
                        key={reply.id}
                        className='ml-2 py-2 pl-4 border-l-2 border-zinc-200'>
                        <Singlecomment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={PostId}
                        />
                      </div>
                    )
                  })}
              </div>
            )
          })}
      </div>
    </div>
    );
}