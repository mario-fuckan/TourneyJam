import { json, type RequestHandler } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const POST: RequestHandler = async ({ request }) => {
    const search = await request.json()

    const searchUsers = await prisma.authUser.findMany({
        where: {
            username: {
                contains: search
            }
        }, select: {
            username: true,
            profile_picture: true,
            badges: true
        }, take: 3
    })

    const searchGames = await prisma.game.findMany({
        where: {
            game_name: {
                contains: search
            }
        }, select: {
            game_name: true,
            game_cover: true,
            id: true
        }, take: 3
    })

    const searchTournaments = await prisma.tournament.findMany({
        where: {
            title: {
                contains: search
            }
        },
        select: {
            title: true,
            cover_image: true,
            id: true
        }, take: 3
    })

    const searchTags = await prisma.tag.findMany({
        where: {
            tag: {
                contains: search
            }
        },
        select: {
            tag: true,
            slug: true
        }, take: 3
    })

    return json({
        searchUsers: searchUsers,
        searchGames: searchGames,
        searchTournaments: searchTournaments,
        searchTags: searchTags
    })
}