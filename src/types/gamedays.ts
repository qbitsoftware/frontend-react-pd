
export interface Gameday {
    id: number;
    name: string;
    images: GamedayImage[]
    tournament_id: number;
    created_at?: string;
  }

export interface GamedayImage {
    id: number;
    gameday_id: number;
    image_url: string;
    file_name: string;
    file_size: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface GetGamedaysResponse {
    data: Gameday[]
    message: string
    error: string | null
  }
  
  export interface GetGamedayResponse {
    data: Gameday
    message: string
    error: string | null
  }
  
  export interface GamedayImagesResponse {
    data: GamedayImage[]
    message: string
    error: string | null
  }
  
  export interface GamedayImageResponse {
    data: GamedayImage
    message: string
    error: string | null
  }
  