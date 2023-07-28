import type { PageServerLoad, Actions } from "./$types"
import { redirect, fail } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"
import type { Role } from "$lib/types/roles"

export const load: PageServerLoad = async ({ params, locals }) => {
    const { session, user } = await locals.auth.validateUser()

    const paramUsername = params.username

    if (!session || paramUsername != user.username && user.role != "admin") {
        throw redirect(302, "/")
    }
}

export const actions: Actions = {
    default: async ({ request, fetch, params }) => {
        const user = params.username

        const { username, profilepicture, socialmedia, role, verified } = Object.fromEntries(await request.formData()) as {
            username: string,
            profilepicture: string,
            socialmedia: string,
            role: keyof typeof Role,
            verified: string
        }

        if (user != username) {
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

        let badges: string[] = []

        if (role != "user") {
            badges.push(role)
        }

        if (verified == "on") {
            badges.push("verified")
        }

        await prisma.authUser.update({
            where: {
                username: user
            },
            data: {
                username: username.toLowerCase(),
                profile_picture: profilepicture,
                socials: socialJSON,
                role,
                //@ts-ignore
                badges
            }
        })

        return {
            updateFinished: true
        }
    }
}