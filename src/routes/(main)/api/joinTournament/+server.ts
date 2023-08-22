import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    let success: boolean = false

    const { userId, tournamentId } = await request.json()

    const playerCount = await prisma.tournamentPlayers.count({
        where: {
            tournamentId: tournamentId
        }
    })

    const tournament = await prisma.tournament.findUnique({
        where: {
            id: tournamentId
        },
        select: {
            max_slots: true
        }
    })

    if (tournament) {
        if (playerCount < tournament.max_slots) {
            await prisma.tournamentPlayers.create({
                data: {
                    tournamentId: tournamentId,
                    authUserId: userId
                }
            })

            success = true
        } else {
            success = false
        }
    }

    return json({
        success
    })
}