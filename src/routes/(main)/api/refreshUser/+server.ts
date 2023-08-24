import { json } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export async function POST({ request }) {
    const id = await request.json()

    const getUser = await prisma.authUser.findUnique({
        where: {
            id
        },
        select: {
            xp: true,
            level: true
        }
    })

    return json({
        getUser
    })
}