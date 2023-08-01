import { type RequestHandler, json } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request, setHeaders }) => {
    setHeaders({
        "Cache-Control": "max-age=36000"
    })

    const gameId = Number(await request.json())

    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        },
        include: {
            authUser: {
                select: {
                    username: true
                }
            }
        }
    })

    return json({
        game
    })
}