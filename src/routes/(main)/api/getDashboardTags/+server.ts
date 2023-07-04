import { json, type RequestHandler, type Config } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const config: Config = {
    runtime: "edge"
}

export const POST: RequestHandler = async ({ setHeaders }) => {
    setHeaders({
        "cache-control": "max-age=3600"
    })

    const getTags = await prisma.tag.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            tag: true,
            slug: true
        }
    })

    return json({
        tags: getTags
    })
}