import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const gameName = await request.json()

    let exists: boolean

    let checkGame = await prisma.game.findFirst({
        where: {
            game_name: {
                in: gameName,
                mode: "insensitive"
            }
        }
    })

    if (checkGame) {
        exists = true
    } else {
        exists = false
    }

    return json({
        exists
    })
}