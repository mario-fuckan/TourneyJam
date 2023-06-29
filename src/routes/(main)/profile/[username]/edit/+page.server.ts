import type { PageServerLoad, Actions } from "./$types"
import { redirect, fail } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"

export const load: PageServerLoad = async ({ params, locals }) => {
    const { session, user } = await locals.auth.validateUser()

    const paramUsername = params.username

    if (!session || paramUsername != user.username) {
        throw redirect(302, "/")
    }
}

export const actions: Actions = {
    default: async ({ request, locals, fetch }) => {
        const { user } = await locals.auth.validateUser()

        const { username, profilepicture, socialmedia } = Object.fromEntries(await request.formData()) as {
            username: string,
            profilepicture: string,
            socialmedia: string
        }

        if (user?.username != username) {
            const res = await fetch("/api/checkUsername", {
                method: "POST",
                body: JSON.stringify(username)
            })

            const { exists } = await res.json()

            if (exists) {
                return fail(400, {
                    error: exists
                })
            }
        }

        let socialJSON: any[] = []
        const socialmediaList: string[] = socialmedia.split(",")

        function platforms() {
            for (let i = 0; i < socialmediaList.length; i++) {
                const match = socialmediaList[i].match(/\/\/(?:www\.)?([^/?]+)/i)

                if (match) {
                    let domain: string = match[1]
                    let platform: string = domain.split(".")[0]

                    socialJSON.push({
                        "url": socialmediaList[i],
                        "social": platform
                    })
                }
            }
        }

        platforms()

        await prisma.authUser.update({
            where: {
                username: user?.username
            },
            data: {
                username: username,
                profile_picture: profilepicture,
                socials: socialJSON
            }
        })

        return {
            updateFinished: true
        }
    }
}