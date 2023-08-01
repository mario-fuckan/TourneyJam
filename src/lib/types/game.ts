export interface Game {
    id: number;
    game_cover: string;
    game_background: string;
    game_showcase: string;
    game_name: string;
    game_description: string;
    game_tags: string[];
    game_website: string;
    authUserId: string;
    authUser: {
        username: string;
    }
}