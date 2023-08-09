import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const { game, initial } = await request.json()

    let exists: boolean

    if (game == initial) {
        exists = false
    } else {
        let checkGame = await prisma.game.findFirst({
            where: {
                game_name: {
                    in: game,
                    mode: "insensitive"
                }
            }
        })

        if (checkGame) {
            exists = true
        } else {
            exists = false
        }
    }

    return json({
        exists
    })
}