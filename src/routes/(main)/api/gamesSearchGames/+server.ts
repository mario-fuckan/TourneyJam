import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"
import type { Tag } from "$lib/types/tags"

export const POST: RequestHandler = async ({ request }) => {
    const search = await request.json()

    let tags: Tag[] = []

    const getGames = await prisma.game.findMany({
        where: {
            game_name: {
                contains: search,
                mode: "insensitive"
            }
        }, select: {
            game_cover: true,
            game_name: true,
            game_tags: true,
            id: true
        }
    })

    if (search != "") {
        tags = await prisma.tag.findMany({
            where: {
                tag: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            select: {
                tag: true
            }
        })
    }

    const allGames = await Promise.all(getGames.map(async (game) => {
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
        tags
    })
}