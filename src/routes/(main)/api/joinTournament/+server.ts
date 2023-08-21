import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const { userId, tournamentId } = await request.json()

    await prisma.tournamentPlayers.create({
        data: {
            tournamentId: tournamentId,
            authUserId: userId
        }
    })

    return json({
        success: true
    })
}