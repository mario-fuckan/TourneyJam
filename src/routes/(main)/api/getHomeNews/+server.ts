import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ fetch, setHeaders }) => {
    setHeaders({
        "Cache-Control": "max-age=300"
    })

    const url = "http://www.gamespot.com/api/articles/?api_key="
    const api_key = "012e4412b2524db3c1d516b9d6b1aef1e051f155"
    const options = "&format=json&limit=5&field_list=title,image,id,categories&sort=id:desc&filter=categories:18"

    const res = await fetch(url + api_key + options)

    const data = await res.json()

    return json(data)
}