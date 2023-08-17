import { json } from "@sveltejs/kit"
import type { RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({
        "Cache-Control": "max-age=36000"
    })

    const toSkip = await request.json()

    const getGames = await prisma.game.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            game_cover: true,
            game_name: true,
            id: true
        },
        take: 12, skip: toSkip
    })

    return json({
        games: getGames
    })
}