import { json } from "@sveltejs/kit"
import type { RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({
        "Cache-Control": "max-age=36000"
    })

    const query = await request.json()

    const getGames = await prisma.game.findMany({
        where: {
            game_name: {
                contains: query,
                mode: "insensitive"
            }
        }, take: 16
    })

    return json({
        games: getGames
    })
}