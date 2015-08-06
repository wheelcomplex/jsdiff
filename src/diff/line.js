import Diff from './base';

export default class LineDiff extends Diff {
  tokenize(value) {
    let retLines = [],
        lines = value.split(/^/m);
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i],
          lastLine = lines[i - 1],
          lastLineLastChar = lastLine && lastLine[lastLine.length - 1];

      // Merge lines that may contain windows new lines
      if (line === '\n' && lastLineLastChar === '\r') {
          retLines[retLines.length - 1] = retLines[retLines.length - 1].slice(0, -1) + '\r\n';
      } else {
        if (this.ignoreTrim) {
          line = line.trim();
          // add a newline unless this is the last line.
          if (i < lines.length - 1) {
            line += '\n';
          }
        }
        retLines.push(line);
      }
    }

    return retLines;
  }
}

export const lineDiff = new LineDiff();
export const trimmedLineDiff = new LineDiff();
trimmedLineDiff.ignoreTrim = true;

export function diffLines(oldStr, newStr, callback) { return lineDiff.diff(oldStr, newStr, callback); }
export function diffTrimmedLines(oldStr, newStr, callback) { return trimmedLineDiff.diff(oldStr, newStr, callback); }
