import { Match, User } from "@/types/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parsePlaces(s: string): number | null {
  let parts = s.split(" ")
  if (parts.length != 2) {
    return null
  }

  let startingPlace = parts[1].split("-")[0]

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

export function formatTime(time: string): string {
  const date = new Date(time);

  // Extract day, month, and year
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getUTCFullYear();

  // Format as dd.mm.yyyy
  return `${day}.${month}.${year}`;
}


export const capitalizeName = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const formatDateTime = (dateTime: string) => {
  const [date, time] = dateTime.split('T');
  return `${date} ${time}`;
};

export const formatDate = (time: string) => {
  console.log("Time", time)
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

export const CalculateSVGWidth = (matches: Match[], vertical_gap: number, width: number) => {
  const matches_len = matches.reduce((max, item) => item.roundIndex > max.roundIndex ? item : max, { roundIndex: -Infinity }).roundIndex
  const SVG_WIDTH = (matches_len) * (width + vertical_gap)
  return SVG_WIDTH
}

export const CalculateSVGHeight = (matches: Match[], horisontal_gap: number, height: number) => {
  const count = matches.filter(item => item.roundIndex === 1).length || 0
  const SVG_HEIGTH = count * (height + horisontal_gap)
  return SVG_HEIGTH
}

export const CalcCurrentRoundMatches = (matches: Match[], round: number) => {
  const count = matches.filter(item => item.roundIndex === round).length || 0
  return count
}