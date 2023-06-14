import { error } from "@sveltejs/kit"

export async function load({ fetch, params, setHeaders }) {

    setHeaders({
        "Cache-Control": "max-age=300"
    })

    const { id } = params

    const url = "http://www.gamespot.com/api/articles/?api_key="
    const api_key = "012e4412b2524db3c1d516b9d6b1aef1e051f155"
    const options = "&format=json&limit=5&filter=id:" + id

    const res = await fetch(url + api_key + options)
    const data = await res.json()

    if (data.results == "") {
        throw error(404, {
            message: "This page does not exist."
        })
    }

    return {
        article: data
    }
}