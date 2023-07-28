import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const tag = await request.json()

    let exists: boolean

    let checkTag = await prisma.tag.findFirst({
        where: {
            tag: {
                in: tag,
                mode: "insensitive"
            }
        }
    })

    if (checkTag) {
        exists = true
    } else {
        exists = false
    }

    return json({
        exists
    })
}