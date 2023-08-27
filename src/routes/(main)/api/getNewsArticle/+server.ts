import { json } from "@sveltejs/kit"

export async function GET({ fetch, setHeaders, url }) {
    const id: string | null = url.searchParams.get("id")

    setHeaders({
        "Cache-Control": "max-age=36000"
    })

    const api_url = "http://www.gamespot.com/api/articles/?api_key="
    const api_key = "012e4412b2524db3c1d516b9d6b1aef1e051f155"
    const options = "&format=json&limit=5&field_list=title,image,authors,body&filter=id:" + id

    const res = await fetch(api_url + api_key + options)

    const data = await res.json()

    if (data.results == "") {
        return json("FAIL")
    }

    return json(data)
}