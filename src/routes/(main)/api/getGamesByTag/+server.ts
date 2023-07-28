import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const tag = await request.json()

    const getAllGames = await prisma.game.findMany({
        where: {
            game_tags: {
                has: tag,
            }
        },
        select: {
            id: true,
            game_cover: true,
            game_name: true
        }
    })

    const allGames = await Promise.all(getAllGames.map(async (game) => {
        const getGameTournamentCount = await prisma.tournament.count({
            where: {
                gameId: game.id,
                OR: [
                    { status: "scheduled" }, { status: "active" }
                ]
            }
        })

        return {
            ...game,
            activeTournaments: getGameTournamentCount
        }
    }))

    return json({
        games: allGames
    })
}