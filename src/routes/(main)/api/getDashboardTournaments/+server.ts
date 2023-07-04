import { json, type RequestHandler, type Config } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const config: Config = {
    runtime: "edge"
}

export const POST: RequestHandler = async ({ setHeaders }) => {
    setHeaders({
        "cache-control": "max-age=3600"
    })

    const getTournaments = await prisma.tournament.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            title: true,
            cover_image: true,
            id: true
        }
    })

    return json({
        tournaments: getTournaments
    })
}