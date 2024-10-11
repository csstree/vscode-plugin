import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';
import { validate } from 'csstree-validator';

export function wrapper({ code }) {
  let diagnostics: Diagnostic[] = [];

  for (const { line, column, loc, message } of validate(code)) {
    let severity: DiagnosticSeverity = DiagnosticSeverity.Warning;
    let range: Range;

    if (loc && loc.start && loc.end) {
      range = {
        start: { line: line - 1, character: column - 1 },
        end: { line: loc.end.line - 1, character: loc.end.column - 1 }
      };
    } else {
      severity = DiagnosticSeverity.Error;
      range = {
        start: { line: line - 1, character: column - 1 },
        end: { line: line - 1, character: column }
      };
    }

    diagnostics.push({
      range,
      severity,
      message: `${message}`,
      source: 'csstree-validator'
    });
  }

  return Promise.resolve(diagnostics);
};
