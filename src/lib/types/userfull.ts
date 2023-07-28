export interface UserFull {
    id: string,
    email: string,
    badges: Badges[],
    join_date: Date,
    level: number,
    prizeWon: number,
    profile_picture: string,
    role: Role,
    tournamentsPlayed: number,
    username: string,
    socials: Array<any>,
    xp: number
}

enum Badges {
    verified,
    admin,
    company
}

enum Role {
    user,
    admin,
    company
}