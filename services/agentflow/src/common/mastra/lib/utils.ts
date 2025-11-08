import { z } from 'zod';

import { ChangedLine, changedFileSchema } from '../schemas';

const extractLineNumberFromHeader = (headerLine: string): number | null => {
  const match = headerLine.match(/\+(\d+)/);

  return match ? Number.parseInt(match[1], 10) : null;
};

export const parsePatch = (patch: string | null) => {
  if (!patch) {
    return [];
  }

  const result: ChangedLine[] = [];
  let currentLineNumber = 0;

  for (const line of patch.split('\n')) {
    if (line.startsWith('@@')) {
      const extractedLineNumber = extractLineNumberFromHeader(line);

      if (extractedLineNumber !== null) {
        currentLineNumber = extractedLineNumber;
      }

      continue;
    }

    if (line.startsWith('+')) {
      result.push({
        content: line.substring(1),
        isAdded: true,
        lineNumber: currentLineNumber,
      });
    }

    if (!line.startsWith('-')) {
      currentLineNumber++;
    }
  }

  return result;
};

export const getPositionFromLine = (patch: string, lineNumber: number) => {
  if (!patch) {
    return null;
  }

  let position = 0;
  let currentLine = 0;

  for (const line of patch.split('\n')) {
    if (line.startsWith('@@')) {
      const extractedLineNumber = extractLineNumberFromHeader(line);

      if (extractedLineNumber !== null) {
        currentLine = extractedLineNumber;
      }
    } else if (!line.startsWith('-')) {
      if (currentLine === lineNumber) {
        return position;
      }

      currentLine++;
    }

    position++;
  }

  return null;
};

export const formatChanges = (files: z.infer<typeof changedFileSchema>[]): string =>
  files
    .map(
      (file) => `
File: ${file.filePath}
${file.changes
  .map((change) =>
    change.isAdded
      ? `L${change.lineNumber}: + ${change.content}`
      : `L${change.lineNumber}:   ${change.content}`,
  )
  .join('\n')}
`,
    )
    .join('\n');
