export type Tournament = {
    CreatedAt: string;
    DeletedAt: string | null;
    ID: number;
    UpdatedAt: string;
    cap: number;
    end_date: string;
    name: string;
    start_date: string;
    type: 'single_elimination' | 'double_elimination' | 'round_robin' | 'meistriliiga';
    State: string;
    private: boolean;
};

