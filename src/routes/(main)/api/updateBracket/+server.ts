import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const { tournamentId, newBracket } = await request.json()

    await prisma.tournament.update({
        where: {
            id: tournamentId
        }, data: {
            bracket: newBracket
        }
    })

    return json({
        success: 200
    })
}