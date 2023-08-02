export interface Tournament {
    background_image: string,
    cover_image: string,
    description: string,
    gameId: number,
    id: number,
    authUserId: string,
    max_slots: number,
    prize: number,
    startOn: Date,
    status: string,
    team_size: number,
    title: string,
    type: string
}