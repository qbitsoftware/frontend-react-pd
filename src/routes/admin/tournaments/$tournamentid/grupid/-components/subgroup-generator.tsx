
export function distributeParticipants(size: number): number[] {
  let numGroups = 1;
  if (size >= 6 && size <= 8) {
    numGroups = 2;
  } else if (size >= 9) {
    numGroups = Math.floor((size + 3) / 4);
  }

  const participantsPerGroup: number[] = Array(numGroups).fill(0);

  if (numGroups === 1) {
    participantsPerGroup[0] = size;
  } else {
    let index = 0;
    for (let i = 0; i < size; i++) {
      participantsPerGroup[index]++;
      index = (index + 1) % numGroups;
    }
  }

  return participantsPerGroup;
}