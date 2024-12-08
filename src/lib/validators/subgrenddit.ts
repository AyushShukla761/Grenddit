import { z } from 'zod'

export const SubgrendditValidator = z.object({
  name: z.string().min(3).max(21),
})

export const SubgrendditSubscriptionValidator = z.object({
  subredditId: z.string(),
})

export type CreateSubgrendditPayload = z.infer<typeof SubgrendditValidator>
export type SubscribeToSubgrendditPayload = z.infer<
  typeof SubgrendditSubscriptionValidator
>
