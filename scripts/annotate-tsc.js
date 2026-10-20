'use strict';

// Turns `tsc --pretty false` output into GitHub Actions annotations,
// one per file, so type errors show up on the workflow run and on pull requests.
const fs = require('fs');

const file = process.argv[2] || 'tsc.log';
const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';

const errorsByFile = new Map();
for (const line of text.split('\n')) {
  const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/);
  if (!match) continue;

  const [, path, row, col, code, message] = match;
  if (!errorsByFile.has(path)) errorsByFile.set(path, []);
  errorsByFile.get(path).push(`${row}:${col} ${code} ${message}`);
}

const escapeData = (value) =>
  value.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
const escapeProperty = (value) => escapeData(value).replace(/:/g, '%3A').replace(/,/g, '%2C');

for (const [path, errors] of errorsByFile) {
  const title = `TypeScript: ${errors.length} error(s)`;
  const message = escapeData(errors.join('\n')).slice(0, 60000);
  console.log(`::error file=${escapeProperty(path)},title=${escapeProperty(title)}::${message}`);
}
