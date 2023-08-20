import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const gameId = Number(await request.json())

    const getTournaments = await prisma.tournament.findMany({
        where: {
            gameId: gameId,
            OR: [
                {
                    status: "active"
                },
                {
                    status: "scheduled"
                }
            ]
        },
        include: {
            authUser: {
                select: {
                    username: true,
                    profile_picture: true,
                    badges: true
                }
            }
        }
    })

    return json({
        tournaments: getTournaments
    })
}