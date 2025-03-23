import { UseGetTournamentMatches } from "@/queries/match";
import { useEffect, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { Tournament } from "@/types/types";

export const getDaysInMonth = (year: number) => {
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

export const getTournamentColor = (id: number | string) => {
  const hash =
    typeof id === "string"
      ? id.split("").reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0);
          return a & a;
        }, 0)
      : id;

  // Base colors with matching saturation and lightness levels
  const hues = [
    210, // blue
    180, // cyan/teal
    150, // green
    120, // lime
    80, // yellow/amber
    30, // orange
    0, // red
    330, // rose/pink
    300, // fuchsia
    270, // purple
    240, // indigo
  ];

  // Choose a hue based on the hash
  const hueIndex = Math.abs(hash) % hues.length;
  const hue = hues[hueIndex];

  // Create 2-3 variations per hue by slightly adjusting the saturation/lightness
  const variations = [
    { s: 70, l: 50 }, // Very light, subtle
    { s: 70, l: 40 }, // Medium light
    { s: 80, l: 30 }, // Slightly more saturated
  ];

  // Select a variation based on further hash manipulation
  const variationIndex = Math.floor(Math.abs(hash / 11)) % variations.length;
  const { s, l } = variations[variationIndex];

  // For browsers that support HSL in background-color
  return `hsl(${hue}, ${s}%, ${l}%)`;
};

// Format date for display
export const formatDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month, day);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format event dates as XX - XX (e.g., 06 - 08)
export const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.getDate().toString().padStart(2, "0")} - ${end.getDate().toString().padStart(2, "0")}`;
};

interface ProcessedEvent {
    id: string | number;
    name: string;
    start_date: string;
    end_date: string;
    sport: string;
    category: string;
    color: string;
    isGameday?: boolean;
    parentTournamentId?: number;
    class?: string;
    order?: number;
  }
  
  export const useTournamentEvents = (
    tournaments: Tournament[],
    queryClient: QueryClient
  ): ProcessedEvent[] => {
    const [processedEvents, setProcessedEvents] = useState<ProcessedEvent[]>([]);
    
    useEffect(() => {
      const processEvents = async () => {
        let events: ProcessedEvent[] = [];
      
        // Process each tournament
        for (const tournament of tournaments) {
          // Add championship tournaments as gamedays
          if (tournament.category === "Meistriliiga") {
            try {
              const matchesData = await queryClient.ensureQueryData(
                UseGetTournamentMatches(Number(tournament.id))
              );
      
              const uniqueGamedays = new Map<string, ProcessedEvent>();
      
              if (matchesData && matchesData.data) {
                matchesData.data.forEach((match) => {
                  const matchDate = match.match.start_date
                    ? new Date(match.match.start_date)
                    : null;
                  if (matchDate) {
                    const dateKey = matchDate.toISOString().split("T")[0];
      
                    if (!uniqueGamedays.has(dateKey)) {
                      uniqueGamedays.set(dateKey, {
                        id: `${tournament.id}-${dateKey}`,
                        name: `${tournament.name} - ${match.class}`,
                        start_date: dateKey,
                        end_date: dateKey,
                        sport: tournament.sport,
                        category: tournament.category,
                        class: match.class,
                        order: match.match.order,
                        color: getTournamentColor(`${tournament.id}`),
                        isGameday: true,
                        parentTournamentId: tournament.id,
                      });
                    }
                  }
                });
              }
      
              // Add each gameday as a separate event
              events.push(...Array.from(uniqueGamedays.values()));
            } catch (error) {
              console.error(
                `Error fetching matches for tournament ${tournament.id}:`,
                error
              );
            }
          } else {
            // For non-championship tournaments, add them directly
            events.push({
              ...tournament,
              color: getTournamentColor(tournament.id),
            });
          }
        }
        setProcessedEvents(events);
      };
      
      processEvents();
    }, [tournaments, queryClient]);
    
    return processedEvents;
  };