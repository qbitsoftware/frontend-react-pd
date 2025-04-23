import { PlayerKey } from "@/types/matches";

export const getPlayerKeys = (teamNumber: number, count: number): PlayerKey[] => {
    const keys: PlayerKey[] = [];
    if (teamNumber === 1) {
        const letters = ['a', 'b', 'c']
        for (let i = 0; i < count && i < letters.length; i++) {
            keys.push(`player_${letters[i]}_id` as PlayerKey)
        }
    } else {
        const letters = ['x', 'y', 'z'];
        for (let i = 0; i < count && i < letters.length; i++) {
            keys.push(`player_${letters[i]}_id` as PlayerKey)
        }
    }
    return keys
};

export const getCaptainKey = (teamNumber: number): 'captain_a' | 'captain_b' => {
    return teamNumber === 1 ? 'captain_a' : 'captain_b';
};

export const getPlayerLabel = (index: number, team: number): string => {
    if (team === 1) {
        const letters = ['A', 'B', 'C']
        return letters[index]
    } else {
        const letters = ['X', 'Y', 'Z'];
        return letters[index];
    }
};

export const getPairKeys = (teamNumber: number, count: number): PlayerKey[] => {
    const keys: PlayerKey[] = [];
    if (teamNumber === 1) {
        const letters = ['d', 'e']
        for (let i = 0; i < count && i < letters.length; i++) {
            keys.push(`player_${letters[i]}_id` as PlayerKey)
        }
    } else {
        const letters = ['v', 'w'];
        for (let i = 0; i < count && i < letters.length; i++) {
            keys.push(`player_${letters[i]}_id` as PlayerKey)
        }
    }
    return keys
};

export const getPairLabel = (index: number, team: number): string => {
    if (team === 1) {
        const letters = ['D', 'E']
        return letters[index]
    } else {
        const letters = ['V', 'W'];
        return letters[index];
    }
};

export const generateMatchOrderLabels = (playerCount: number) => {
    if (playerCount === 2) {
        return ["A-X", "B-Y", "DE-VW", "A-Y", "B-X"];
    } else if (playerCount >= 3) {
        return ["A-Y", "B-X", "C-Z", "DE-VW", "A-X", "C-Y", "B-Z"];
    } else {
        return [""]
    }
}