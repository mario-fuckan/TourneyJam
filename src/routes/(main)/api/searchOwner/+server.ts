import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const search = await request.json()

    const findUsers = await prisma.authUser.findMany({
        where: {
            username: {
                contains: search,
                mode: "insensitive"
            }
        }, select: {
            username: true,
            id: true
        }
    })

    return json({
        allUsers: findUsers
    })
}