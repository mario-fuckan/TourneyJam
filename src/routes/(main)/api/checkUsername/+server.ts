import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const { username, user } = await request.json()

    let exists: boolean

    const getUserProfile = await prisma.authUser.findUnique({
        where: {
            username: username
        }
    })

    if (!getUserProfile) {
        exists = false
    } else {
        if (user == username) {
            exists = false
        } else {
            exists = true
        }
    }

    return json({
        exists
    })
}