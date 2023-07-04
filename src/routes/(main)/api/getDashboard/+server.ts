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
        }, take: 5
    })

    const getGames = await prisma.game.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            game_name: true,
            game_cover: true,
            id: true
        }, take: 5
    })

    const getTournaments = await prisma.tournament.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            cover_image: true,
            title: true,
            id: true
        }, take: 5
    })

    const getTags = await prisma.tag.findMany({
        orderBy: {
            id: "desc"
        },
        select: {
            tag: true,
            slug: true
        }, take: 5
    })

    return json({
        users: getUsers,
        games: getGames,
        tournaments: getTournaments,
        tags: getTags
    })
}