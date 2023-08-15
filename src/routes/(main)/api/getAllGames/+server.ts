import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async () => {
    const getAllGames = await prisma.game.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            id: true,
            game_cover: true,
            game_name: true,
            game_tags: true,
        },
        take: 18
    })

    const gamesCount = await prisma.game.count()

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
        games: allGames,
        gamesCount: gamesCount
    })
}