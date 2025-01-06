import { Match, User, Data, Contestant } from "@/types/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTournamentType(s: string): string {

  const parts = s.split("_")

  if (parts.length == 1) {
    return capitalize(s)
  }

  let res = ""
  parts.forEach(part => {
    res += capitalize(part) + " "
  })

  return res.trim()
}

export function parsePlaces(s: string): number | null {
  const parts = s.split(" ")
  if (parts.length != 2) {
    return null
  }

  const startingPlace = parts[1].split("-")[0]

  return Number(startingPlace)
}

export function sortBrackets(data: any[]): any[] {
  return data.sort((a, b) => {
    const placeA = parsePlaces(a.tables[0].name);
    const placeB = parsePlaces(b.tables[0].name);

    if (placeA === null || placeB === null) {
      return 0;
    }

    return placeA - placeB;
  });
}

export function findEnemyName(p1: number, p2: number, current: number, players: User[]): string {
  if (p1 == current) {
    const enemy = players.filter((player) => player.ID == p2)[0]
    if (enemy) {
      return enemy.first_name + enemy.last_name
    }
  } else {
    const enemy = players.filter((player) => player.ID == p1)[0]
    if (enemy) {
      return enemy.first_name + enemy.last_name
    }
  }
  return ""
}

export const formatDateString = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}


export const capitalizeName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const formatDateTime = (dateTime: string) => {
  const [date, time] = dateTime.split('T');
  return `${date} ${time}`;
};

export const formatDate = (time: string) => {
  const date = new Date(time);

  const formattedDate = date.toLocaleDateString("et-EE", {
    day: "numeric",
    month: "short"
  });

  return formattedDate
}

export const radians = (angle: number) => {
  return angle * (Math.PI / 180);
};

export const CalculateSVGWidth = (matches: Match[], vertical_gap: number) => {
  const matches_len = matches.reduce((max, item) => item.roundIndex > max.roundIndex ? item : max, { roundIndex: -Infinity }).roundIndex
  const SVG_WIDTH = (matches_len) * (vertical_gap)
  return SVG_WIDTH
}

export const CalculateSVGHeight = (matches: Match[], horisontal_gap: number, height: number) => {
  const count = matches.filter(item => item.roundIndex === 0).length || 0
  const SVG_HEIGTH = count * (height + horisontal_gap)
  return SVG_HEIGTH
}

export const CalcCurrentRoundMatches = (matches: Match[], round: number) => {
  const count = matches.filter(item => item.roundIndex === round).length || 0
  return count
}

export function formatName(fullName: string) {
  const nameParts = fullName.trim().split(/[-\s]+/);

  if (nameParts.length === 1) {
    return capitalize(fullName)
  }

  const lastName = nameParts.pop();

  const initials = nameParts.map(part => part.charAt(0).toUpperCase() + '.').join(' ');

  if (lastName) {
    return `${initials} ${capitalize(lastName)}`;
  }
  return `${initials}`;
}

export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export const getRandomFlag = () => {
  // const flags = ["🇺🇸", "🇨🇦", "🇬🇧", "🇫🇷", "🇩🇪", "🇯🇵", "🇮🇹", "🇪🇸", "🇧🇷", "🇦🇺"];
  // return flags[Math.floor(Math.random() * flags.length)];
  return "🇪🇪"
}

export const isMaxUInt32 = (num: number) => {
  const MAX_UINT32 = 4294967295;
  return num === MAX_UINT32;
}

export const FindContestant = (data: Data, contestantId: string) => {
  const emptyContestant: Contestant = {
    entryStatus: "",
    players: [
      {
        title: "",
        nationality: "",
      },
      {
        title: "",
        nationality: "",
      }
    ],
  }
  if (data.contestants) {
    if (data.contestants[contestantId]) {
      return data.contestants[contestantId]
    }
    return emptyContestant
  } else {
    return emptyContestant
  }
}

export const replaceSpecialCharacters = (str: string) => {
  return str.replace(/[äöõü]/gi, (char) => {
    switch (char.toLowerCase()) {
      case 'ä': return 'a';
      case 'ö': return 'o';
      case 'õ': return 'o';
      case 'ü': return 'u';
      default: return char;
    }
  })
}
