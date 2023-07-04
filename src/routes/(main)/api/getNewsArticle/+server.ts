import type { RequestHandler } from "./$types"
import { json, type Config } from "@sveltejs/kit"

export const config: Config = {
    runtime: "edge"
}

export const POST: RequestHandler = async ({ request, fetch, setHeaders }) => {
    setHeaders({
        "Cache-Control": "s-maxage=300"
    })

    const id = await request.json()

    const url = "http://www.gamespot.com/api/articles/?api_key="
    const api_key = "012e4412b2524db3c1d516b9d6b1aef1e051f155"
    const options = "&format=json&limit=5&field_list=title,image,authors,body&filter=id:" + id

    const res = await fetch(url + api_key + options)

    const data = await res.json()

    if (data.results == "") {
        return json("FAIL")
    }

    return json(data)
}