import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { ZodError } from "zod";


export async function PATCH(req: Request) {
    try {
        const data = await req.json();
        const { commentId, voteType } = CommentVoteValidator.parse(data);


        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorised', { status: 401 })
        }

        const vote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId
            }
        })

        if (vote) {
            if (vote.type === voteType) {
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            commentId,
                            userId: session.user.id,
                        }
                    }
                })

                return new Response('OK')
            }
            await db.commentVote.update({
                where: {
                    userId_commentId: {
                        commentId,
                        userId: session.user.id,
                    }
                },
                data: {
                    type: voteType
                }
            })

            return new Response('OK')

        }
        await db.commentVote.create({
            data: {
                userId: session?.user.id,
                commentId,
                type: voteType
            }
        })

        return new Response('OK')

    } catch (err) {
        if (err instanceof ZodError) {
            return new Response(err.message, { status: 400 })

        }
        return new Response("Could not vote now,try again later", { status: 500 })
    }


}