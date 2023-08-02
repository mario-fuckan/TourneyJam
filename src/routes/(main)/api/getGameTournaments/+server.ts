import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const gameId = Number(await request.json())

    const getTournaments = await prisma.tournament.findMany({
        where: {
            gameId: gameId
        }
    })

    return json({
        tournaments: getTournaments
    })
}