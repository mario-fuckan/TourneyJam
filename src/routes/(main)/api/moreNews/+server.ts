import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request, fetch }) => {
    const userData = await request.json()

    const urlPath = "http://www.gamespot.com/api/articles/?api_key="
    const api_key = "012e4412b2524db3c1d516b9d6b1aef1e051f155"
    const options = "&format=json&limit=8&offset=" + userData + "&field_list=title,image,id,categories,deck&sort=id:desc&filter=categories:18"

    const res = await fetch(urlPath + api_key + options)
    const { results } = await res.json()

    return json(results)
}