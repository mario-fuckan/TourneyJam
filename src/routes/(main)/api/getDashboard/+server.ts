import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const search = await request.json()

    if (search == "All") {
        const getUsers = await prisma.authUser.findMany({
            orderBy: {
                join_date: "desc"
            },
            select: {
                username: true,
                profile_picture: true
            }, take: 5
        })

        const getGames = await prisma.game.findMany({
            orderBy: {
                id: "desc"
            },
            select: {
                game_name: true,
                game_cover: true
            }, take: 5
        })

        const getTournaments = await prisma.tournament.findMany({
            orderBy: {
                id: "desc"
            },
            select: {
                cover_image: true,
                title: true
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

    return json({})
}