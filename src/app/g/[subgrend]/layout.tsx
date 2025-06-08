import SubcribeToggle from '@/components/SubcribeToggle'
import ToFeedButton from '@/components/ToFeedButton'
import { buttonVariants } from '@/components/ui/Button'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'


export const metadata: Metadata={
    title: 'Grenddit',
    description: 'A Reddit clone built with Next.js and TypeScript.',
}


const Layout = async ({
    children,
    params: { subgrend },
  }: {
    children: ReactNode
    params: { subgrend: string }
  }) => {
    const session = await getAuthSession()
  
    const subgrenddit = await db.subgrenddit.findFirst({
      where: { name: subgrend },
      include: {
        posts: {
          include: {
            author: true,
            votes: true,
          },
        },
      },
    })
  
    const subscription = !session?.user
      ? undefined
      : await db.subscription.findFirst({
          where: {
            subgrenddit: {
              name: subgrend,
            },
            user: {
              id: session.user.id,
            },
          },
        })
  
    const isSubscribed = !!subscription
  
    if (!subgrenddit) return notFound()
  
    const memberCount = await db.subscription.count({
      where: {
        subgrenddit: {
          name: subgrend,
        },
      },
    })
  
    return (
      <div className='sm:container max-w-7xl mx-auto h-full pt-12'>
        <div>
          <ToFeedButton />
  
          <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
            <ul className='flex flex-col col-span-2 space-y-6'>{children}</ul>
  
            <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
              <div className='px-6 py-4'>
                <p className='font-semibold py-3'>About g/{subgrenddit.name}</p>
              </div>
              <dl className='divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white'>
                <div className='flex justify-between gap-x-4 py-3'>
                  <dt className='text-gray-500'>Created</dt>
                  <dd className='text-gray-700'>
                    <time dateTime={subgrenddit.createdAt.toDateString()}>
                      {format(subgrenddit.createdAt, 'MMMM d, yyyy')}
                    </time>
                  </dd>
                </div>
                <div className='flex justify-between gap-x-4 py-3'>
                  <dt className='text-gray-500'>Members</dt>
                  <dd className='flex items-start gap-x-2'>
                    <div className='text-gray-900'>{memberCount}</div>
                  </dd>
                </div>
                {subgrenddit.creatorId === session?.user?.id ? (
                  <div className='flex justify-between gap-x-4 py-3'>
                    <dt className='text-gray-500'>You created this community</dt>
                  </div>
                ) : (
                    <SubcribeToggle
                      isSubscribed={isSubscribed}
                      subredditId={subgrenddit.id}
                      subredditName={subgrenddit.name}
                    />
                  )}
  
                {/* {subgrenddit.creatorId !== session?.user?.id ? (
                  <SubscribeToggle
                    isSubscribed={isSubscribed}
                    subredditId={subgrenddit.id}
                    subredditName={subgrenddit.name}
                  />
                ) : null} */}
                <Link
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'w-full mb-6',
                  })}
                  href={`g/${subgrenddit.name}/submit`}>
                  Create Post
                </Link>
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Layout