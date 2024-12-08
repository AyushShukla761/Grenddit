import type { Post, Subreddit, User, Vote, Comment } from '@prisma/client'

export type ExtendedPost = Post & {
  subgrenddit: Subgrenddit
  votes: Vote[]
  author: User
  comments: Comment[]
}
