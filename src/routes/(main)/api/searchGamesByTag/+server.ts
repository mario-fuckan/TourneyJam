import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const { tag, search } = await request.json()

    const searchGames = await prisma.game.findMany({
        where: {
            AND: [
                {
                    game_tags: {
                        has: tag
                    }
                },
                {
                    game_name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
        },
        select: {
            id: true,
            game_cover: true,
            game_name: true
        }
    })

    const allGames = await Promise.all(searchGames.map(async (game) => {
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