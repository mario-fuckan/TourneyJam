import { prisma } from "$lib/server/prisma"
import { redirect, fail } from "@sveltejs/kit"
import type { Actions } from "./$types"
import type { Type } from "@prisma/client"
import type { Player } from "$lib/types/player"
import levels from "$lib/json/levels.json"

export async function load({ params, locals }) {
    const { session, user } = await locals.auth.validateUser()
    const { id } = params

    if (!session) {
        throw redirect(302, `/tournaments/${id}`)
    }

    const checkIfTournamentExists = await prisma.tournament.findFirst({
        where: {
            id: Number(id),
            authUserId: user.userId
        }
    })

    if (!checkIfTournamentExists) {
        throw redirect(302, `/tournaments/${id}`)
    }
}

export const actions: Actions = {
    default: async ({ request, params }) => {
        const { id } = params

        const { title, description, cover_image, prize, startOn, type, password, tags, creatorString, status } = Object.fromEntries(await request.formData()) as {
            title: string,
            description: string,
            cover_image: string,
            prize: string,
            startOn: string,
            type: string,
            password: string,
            tags: string,
            creatorString: string,
            status: "active" | "scheduled" | "ended"
        }

        if (!title || !description || !cover_image || !prize || !startOn || !type) {
            let missing: string[] = []

            if (!title) {
                missing.push("title")
            }

            if (!description) {
                missing.push("description")
            }

            if (!cover_image) {
                missing.push("cover_image")
            }

            if (!prize) {
                missing.push("prize")
            }

            if (!startOn) {
                missing.push("startOn")
            }

            if (!type) {
                missing.push("type")
                missing.push("password")
            }

            if (type == "passwordProtected" && !password) {
                missing.push("password")
            }

            return fail(400, {
                where: missing
            })
        }

        const getPlayers = await prisma.tournamentPlayers.findMany({
            where: {
                tournamentId: Number(id)
            },
            select: {
                AuthUser: {
                    select: {
                        id: true,
                        username: true,
                        badges: true,
                        profile_picture: true
                    }
                }
            }
        })

        let players: any = getPlayers.map((item) => {
            return item.AuthUser
        })

        let bracket: any = []

        function createBracket() {
            bracket = []
            let playerLength: number = players.length
            let column: any = []
            let round: any = []

            if (playerLength == 1) {
                bracket.push([players])
            } else {
                for (let i = 0; i < Math.ceil(playerLength / 2); i++) {
                    for (let j = i * 2; j < i + 2; j++) {
                        round.push(players[j])
                    }

                    column.push(round)
                    round = []
                }

                bracket.push(column)
                column = []

                let index: number = 0

                playerLength = bracket[index].length

                while (playerLength != 1) {
                    for (let i = 0; i < Math.ceil(playerLength / 2); i++) {
                        for (let j = 0; j < 2; j++) {
                            round.push({
                                id: "",
                                username: "",
                                profile_picture: "",
                                badges: []
                            })
                        }
                        column.push(round)
                        round = []
                    }

                    bracket.push(column)
                    column = []

                    index++
                    playerLength = bracket[index].length
                }
            }

            bracket.push([
                [
                    {
                        id: "",
                        username: "",
                        profile_picture: "",
                        badges: [],
                        winner: true
                    }
                ]
            ])

            bracket = bracket
        }

        const getTournamentStatus = await prisma.tournament.findUnique({
            where: {
                id: Number(id)
            },
            select: {
                status: true
            }
        })

        let usersToRefresh: string[] = []

        if (getTournamentStatus?.status == status) {
            await prisma.tournament.update({
                where: {
                    id: Number(id)
                },
                data: {
                    title,
                    description,
                    cover_image,
                    prize: Number(prize),
                    startOn: new Date(startOn),
                    type: type as Type,
                    password,
                    tags: tags.length != 0 ? tags.split(",") : [],
                    status: status,
                    creatorStream: creatorString
                }
            })
        } else {
            if (status == "active") {
                createBracket()
                await prisma.tournament.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        title,
                        description,
                        cover_image,
                        prize: Number(prize),
                        startOn: new Date(startOn),
                        type: type as Type,
                        password,
                        tags: tags.length != 0 ? tags.split(",") : [],
                        status: status,
                        creatorStream: creatorString,
                        bracket: bracket
                    }
                })
            } else if (status == "scheduled") {
                await prisma.tournament.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        title,
                        description,
                        cover_image,
                        prize: Number(prize),
                        startOn: new Date(startOn),
                        type: type as Type,
                        password,
                        tags: tags.length != 0 ? tags.split(",") : [],
                        status: status,
                        creatorStream: creatorString
                    }
                })
            } else {
                const getTournamentBracket = await prisma.tournament.findUnique({
                    where: {
                        id: Number(id)
                    },
                    select: {
                        bracket: true
                    }
                })

                let players: Player[] = []
                bracket = getTournamentBracket?.bracket

                //@ts-ignore
                bracket.map((outerBracket) => {
                    //@ts-ignore
                    outerBracket.map((round) => {
                        //@ts-ignore
                        round.map((player) => {
                            players.unshift(player)
                        })
                    })
                })

                players = players.filter((player: Player) => {
                    return player.id != ""
                })

                const uniquePlayers = players.filter((obj, index, self) =>
                    index == self.findIndex((o) => o.id === obj.id)
                )

                function getLevel(xp: number) {
                    let level: number = levels.length - 1

                    for (let i = 0; i < levels.length; i++) {
                        if (xp < levels[i].xp) {
                            level = levels[i].level - 1
                            break
                        }
                    }

                    return level
                }

                await Promise.all(uniquePlayers.map(async (player: Player) => {
                    const getPlayer = await prisma.authUser.findUnique({
                        where: {
                            id: player.id
                        },
                        select: {
                            xp: true
                        }
                    })

                    if (getPlayer) {
                        usersToRefresh.push(player.id)
                        let xp: number

                        if (player.winner) {
                            xp = getPlayer.xp += 700
                            let level: number = getLevel(xp)

                            await prisma.authUser.update({
                                where: {
                                    id: player.id
                                },
                                data: {
                                    xp,
                                    level,
                                    prizeWon: {
                                        increment: Number(prize)
                                    }
                                }
                            })
                        } else {
                            xp = getPlayer.xp += 350
                            let level: number = getLevel(xp)

                            await prisma.authUser.update({
                                where: {
                                    id: player.id
                                },
                                data: {
                                    xp,
                                    level
                                }
                            })
                        }
                    }
                }))

                await prisma.tournament.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        title,
                        description,
                        cover_image,
                        prize: Number(prize),
                        startOn: new Date(startOn),
                        type: type as Type,
                        password,
                        tags: tags.length != 0 ? tags.split(",") : [],
                        status: status,
                        creatorStream: creatorString
                    }
                })
            }
        }

        console.log(usersToRefresh)

        return {
            done: true,
            usersToRefresh
        }
    }
}