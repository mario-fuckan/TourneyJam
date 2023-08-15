import { json } from "@sveltejs/kit"
import type { RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ setHeaders }) => {
    setHeaders({
        "Cache-Control": "max-age=36000"
    })

    const getAllGames = await prisma.game.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            id: true,
            game_name: true,
            game_cover: true
        },
        take: 16
    })

    return json({
        games: getAllGames
    })
}