import type { Actions } from "./$types"
import { prisma } from "$lib/server/prisma"
import { redirect, fail } from "@sveltejs/kit"

export async function load({ locals }) {
    const { session, user } = await locals.auth.validateUser()

    if (!session || (user.role != "admin" && user.role != "company")) {
        throw redirect(302, "/")
    }
}

export const actions: Actions = {
    default: async ({ request }) => {
        const { game_name, game_background, game_description, game_cover, game_showcase, game_tags, game_website, owner } = Object.fromEntries(await request.formData()) as {
            game_name: string,
            game_description: string,
            game_cover: string,
            game_background: string,
            game_showcase: string,
            game_tags: string,
            game_website: string,
            owner: string
        }

        if (!game_name || !game_description || !game_cover) {
            let missing: string[] = []

            if (!game_name) {
                missing.push("game_name")
            }

            if (!game_description) {
                missing.push("game_description")
            }

            if (!game_cover) {
                missing.push("game_cover")
            }

            return fail(400, {
                where: missing
            })
        }

        if (owner) {
            try {
                await prisma.game.create({
                    data: {
                        game_name,
                        game_description,
                        game_cover,
                        game_background,
                        game_showcase,
                        game_tags: game_tags.split(","),
                        game_website,
                        authUser: {
                            connect: {
                                id: owner
                            }
                        }
                    }
                })
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                await prisma.game.create({
                    data: {
                        game_name,
                        game_description,
                        game_cover,
                        game_background,
                        game_showcase,
                        game_tags: game_tags.split(","),
                        game_website
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }

        return {
            done: true
        }
    }
}