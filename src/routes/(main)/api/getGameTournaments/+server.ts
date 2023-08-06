import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const gameId = Number(await request.json())

    const getTournaments = await prisma.tournament.findMany({
        where: {
            gameId: gameId,
            status: "scheduled" || "active",
            startOn: {
                gte: new Date()
            }
        },
        include: {
            host: {
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