import { json, type RequestHandler, type Config } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const config: Config = {
    runtime: "edge"
}

export const POST: RequestHandler = async ({ setHeaders }) => {
    setHeaders({
        "cache-control": "max-age=3600"
    })

    const getUsers = await prisma.authUser.findMany({
        orderBy: {
            join_date: "desc"
        },
        select: {
            username: true,
            profile_picture: true,
            badges: true
        }
    })

    return json({
        users: getUsers
    })
}