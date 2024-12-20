import axios from "axios"


export async function GET(req: Request) {
    const url= new URL(req.url)
    const href= url.searchParams.get('url')

    if (!href) {
        return new Response('Invalid href', { status: 400 })
      }

    const res =await axios.get(href)
    const titlematch=res.data.match(/<title>(.*?)<\/title>/)
    const title =titlematch? titlematch[1] : ''

    const descmatch= res.data.match(/<meta name="description" content="(.*?)"/)
    const desc = descmatch ? descmatch[1]: '' 

    const imageMatch = res.data.match(/<meta property="og:image" content="(.*?)"/)
    const imageUrl = imageMatch ? imageMatch[1] : ''


    return new Response(
        JSON.stringify({
            success: 1,
            meta: {
                title,
                desc,
                image: {
                    url :imageUrl
                }
            }
        })
    )

}