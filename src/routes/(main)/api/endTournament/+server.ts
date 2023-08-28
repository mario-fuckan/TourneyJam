import { json } from "@sveltejs/kit"
import { prisma } from "$lib/server/prisma"
import type { Player } from "$lib/types/player"
import levels from "$lib/json/levels.json"

export async function POST({ request }) {
    const { id, bracket, prize } = await request.json()

    let players: Player[] = []

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

    let usersToRefresh: string[] = []

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
                            increment: prize
                        },
                        tournamentsPlayed: {
                            increment: 1
                        },
                        wins: {
                            increment: 1
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
                        level,
                        tournamentsPlayed: {
                            increment: 1
                        }
                    }
                })
            }
        }
    }))

    await prisma.tournament.update({
        where: {
            id
        },
        data: {
            status: "ended"
        }
    })

    return json({
        success: true,
        usersToRefresh
    })
}