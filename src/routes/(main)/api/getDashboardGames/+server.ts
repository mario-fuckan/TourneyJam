import { json, type RequestHandler, type Config } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const config: Config = {
    runtime: "edge"
}

export const POST: RequestHandler = async ({ setHeaders }) => {
    setHeaders({
        "cache-control": "max-age=3600"
    })

    const getGames = await prisma.game.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            game_name: true,
            game_cover: true,
            id: true
        }
    })

    return json({
        games: getGames
    })
}