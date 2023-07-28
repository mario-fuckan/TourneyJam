import type { Actions, PageServerLoad } from "./$types"
import { auth } from "$lib/server/lucia"
import { Prisma } from '@prisma/client';
import { fail, redirect } from "@sveltejs/kit"
import { LuciaError } from "lucia-auth"

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth.validate()

    if (session) {
        throw redirect(302, "/")
    }
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        const { username, email, password, profile_picture } = Object.fromEntries(await request.formData()) as {
            username: string,
            email: string,
            password: string,
            profile_picture: string
        }

        if (!username || !email || !password) {
            let missing: string[] = []

            if (!username) {
                missing.push("Username")
            }

            if (!email) {
                missing.push("Email")
            }

            if (!password) {
                missing.push("Password")
            }

            return fail(400, {
                missing
            })
        }

        try {
            await auth.createUser({
                primaryKey: {
                    providerId: "username",
                    providerUserId: username.toLowerCase(),
                    password
                },
                attributes: {
                    username,
                    email,
                    profile_picture: "/profile_pictures/" + profile_picture + ".png",
                    role: "user",
                    xp: 0,
                    level: 0
                }
            })

            const key = await auth.useKey("username", username.toLowerCase(), password)
            const session = await auth.createSession(key.userId)
            locals.auth.setSession(session)
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002' && err.message?.includes('username')) {
                return fail(400, {
                    message: "User already exists."
                })
            }

            if (err instanceof LuciaError && err.message === 'AUTH_DUPLICATE_KEY_ID') {
                return fail(400, {
                    message: "User already exists."
                })
            }

            return fail(500, {
                message: "Unknown error occurred."
            })
        }
    }
}