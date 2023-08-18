import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const search = await request.json()

    const getGames = await prisma.game.findMany({
        where: {
            game_name: {
                contains: search,
                mode: "insensitive"
            }
        },
        select: {
            game_name: true,
            id: true
        }
    })

    return json({
        games: getGames
    })
}