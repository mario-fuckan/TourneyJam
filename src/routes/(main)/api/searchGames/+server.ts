import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const toSkip: number = await request.json()

    const getMoreGames = await prisma.game.findMany({
        select: {
            id: true,
            game_cover: true,
            game_name: true,
            game_tags: true,
        }, skip: toSkip, take: 16
    })

    const getMoreGamesTotal = await Promise.all(getMoreGames.map(async (game) => {
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
        moreGames: getMoreGamesTotal
    })
}