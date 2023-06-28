import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ setHeaders, request }) => {
    setHeaders({
        "Cache-Control": "s-maxage=300"
    })

    const username = await request.json()

    const getUserProfile = await prisma.authUser.findUnique({
        where: {
            username: username
        }
    })

    return json({
        user: getUserProfile
    })
}