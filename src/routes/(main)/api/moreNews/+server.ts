import { json } from "@sveltejs/kit"

export async function GET({ fetch, url, setHeaders }) {
    const newsToSkip: string | null = url.searchParams.get("newsToSkip")

    setHeaders({
        "Cache-Control": "public, max-age=36000"
    })

    const urlPath = "http://www.gamespot.com/api/articles/?api_key="
    const api_key = "012e4412b2524db3c1d516b9d6b1aef1e051f155"
    const options = "&format=json&limit=8&offset=" + newsToSkip + "&field_list=title,image,id,categories,deck&sort=id:desc&filter=categories:18"

    const res = await fetch(urlPath + api_key + options)
    const { results } = await res.json()

    return json(results)
}