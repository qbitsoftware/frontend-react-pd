export function splitLargeEliminationBrackets(data: Bracket): Bracket {
  const processedData = structuredClone(data);

  // Process each elimination
  processedData.eliminations = processedData.eliminations.map((elimination) => {
    // Process each table within the elimination
    const processedElimination = {
      ...elimination,
      elimination: [] as any[], // Will hold the processed tables
    };

    elimination.elimination.forEach((table) => {
      // If the table has more than 32 matches, split it
      if (table.matches && table.matches.length > 32) {
        const numSubBrackets = Math.ceil(table.matches.length / 32);

        // Create multiple sub-brackets with up to 32 matches each
        for (let i = 0; i < numSubBrackets; i++) {
          const start = i * 32;
          const end = Math.min((i + 1) * 32, table.matches.length);

          // Create a new table with a subset of matches
          const subTable = {
            ...table,
            name: `${table.name} ${i + 1}`,
            matches: table.matches.slice(start, end),
            rounds: calculateRoundsForSubBracket(
              table.matches.slice(start, end),
            ),
          };

          processedElimination.elimination.push(subTable);
        }
      } else {
        // Table has 32 or fewer matches, keep it as is
        processedElimination.elimination.push(table);
      }
    });

    return processedElimination;
  });

  return processedData;
}

// Helper function to calculate rounds for a sub-bracket
function calculateRoundsForSubBracket(matches: any[]) {
  // Determine how many rounds based on number of matches
  const numRounds = Math.ceil(Math.log2(matches.length + 1));

  // Create rounds array with the appropriate structure
  // This is just a placeholder - you'll need to adjust based on your actual rounds structure
  return Array(numRounds).fill({});
}
