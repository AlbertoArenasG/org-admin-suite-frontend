import type { ReactNode } from 'react';

type SearchCharacter = {
  value: string;
  start: number;
  end: number;
};

type TextMatch = {
  start: number;
  end: number;
};

export function highlightText(value: string, query?: string): ReactNode {
  const normalizedQuery = normalizeTextForSearch(query?.trim() ?? '');
  if (!normalizedQuery) return value;

  const characters = getSearchCharacters(value);
  const queryCharacters = Array.from(normalizedQuery);
  const matches = getAccentInsensitiveMatches(characters, queryCharacters);

  if (matches.length === 0) return value;

  const highlighted: ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (cursor < match.start) highlighted.push(value.slice(cursor, match.start));

    highlighted.push(
      <mark
        key={`${match.start}-${match.end}`}
        className="data-table-search-highlight rounded-sm px-0.5"
      >
        {value.slice(match.start, match.end)}
      </mark>
    );

    cursor = match.end;
  }

  if (cursor < value.length) highlighted.push(value.slice(cursor));

  return highlighted;
}

function getSearchCharacters(value: string): SearchCharacter[] {
  const characters: SearchCharacter[] = [];
  let offset = 0;

  for (const character of value) {
    const start = offset;
    offset += character.length;

    const normalized = normalizeTextForSearch(character);
    if (!normalized) {
      const previousCharacter = characters.at(-1);
      if (previousCharacter) previousCharacter.end = offset;
      continue;
    }

    for (const normalizedCharacter of normalized) {
      characters.push({ value: normalizedCharacter, start, end: offset });
    }
  }

  return characters;
}

function getAccentInsensitiveMatches(
  characters: SearchCharacter[],
  queryCharacters: string[]
): TextMatch[] {
  const matches: TextMatch[] = [];

  for (let index = 0; index <= characters.length - queryCharacters.length; ) {
    const isMatch = queryCharacters.every(
      (queryCharacter, offset) => characters[index + offset]?.value === queryCharacter
    );

    if (!isMatch) {
      index += 1;
      continue;
    }

    matches.push({
      start: characters[index].start,
      end: characters[index + queryCharacters.length - 1].end,
    });
    index += queryCharacters.length;
  }

  return matches;
}

function normalizeTextForSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
}
