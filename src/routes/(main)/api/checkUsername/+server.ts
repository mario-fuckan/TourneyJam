import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request, locals }) => {
    const { user } = await locals.auth.validateUser()

    const username = await request.json()
    let exists: boolean

    const getUserProfile = await prisma.authUser.findUnique({
        where: {
            username: username
        }
    })

    if (!getUserProfile) {
        exists = false
    } else {
        if (user?.username == username) {
            exists = false
        } else {
            exists = true
        }
    }

    return json({
        exists
    })
}