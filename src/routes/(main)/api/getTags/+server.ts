import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async () => {
    const getTags = await prisma.tag.findMany({
        select: {
            tag: true
        }
    })

    return json({
        tags: getTags
    })
}