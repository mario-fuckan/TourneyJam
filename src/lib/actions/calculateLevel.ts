import levels from "$lib/json/levels.json"
import type { Levels } from "$lib/types/levels"

const typedLevels: Levels = levels

export function calculate(userLevel: number, userXP: number) {
    // UserLevel and rank

    let userRank: string

    if (userLevel >= 0 && userLevel <= 10) {
        userRank = "bronze"
    } else if (userLevel >= 11 && userLevel <= 20) {
        userRank = "silver"
    } else if (userLevel >= 21 && userLevel <= 30) {
        userRank = "gold"
    } else if (userLevel >= 31 && userLevel <= 40) {
        userRank = "emerald"
    } else if (userLevel >= 41 && userLevel <= 50) {
        userRank = "diamond"
    } else {
        userRank = "rainbow"
    }

    // Get xp for level above

    let nextLevel: number = userLevel + 1
    let nextLevelXP: number = typedLevels[nextLevel].xp

    let missingXP: number = 100 - ((nextLevelXP - userXP) / 500 * 100)
    let currentXP: number = Math.round(missingXP)

    return {
        userRank,
        levelPercentage: currentXP
    }
}