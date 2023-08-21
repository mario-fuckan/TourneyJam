import type { RequestHandler } from "./$types"
import { prisma } from "$lib/server/prisma"
import { json } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request }) => {
    const id = await request.json()

    const getMembers = await prisma.tournamentPlayers.findMany({
        where: {
            tournamentId: Number(id)
        },
        select: {
            AuthUser: {
                select: {
                    username: true,
                    id: true,
                    profile_picture: true,
                    badges: true
                }
            }
        }
    })

    return json({
        members: getMembers
    })
}