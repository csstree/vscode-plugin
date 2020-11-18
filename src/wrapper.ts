'use strict';

import { Diagnostic, DiagnosticSeverity, Range } from 'vscode-languageserver';
let { validate } = require('csstree-validator/lib/validate');

export function wrapper({ code }) {
  let errors = validate(code);
  let diagnostics: Diagnostic[] = [];
console.log({ errors });
  errors.forEach(({ line, column, loc, message }) => {
    let severity: DiagnosticSeverity = DiagnosticSeverity.Warning;
    let range: Range;

    if (loc && loc.start && loc.end) {
      range.start = { line: line - 1, character: column - 1 };
      range.end = { line: loc.end.line - 1, character: loc.end.column - 1 };
    } else {
      severity = DiagnosticSeverity.Error;
      range.start = { line: line - 1, character: column - 1 };
      range.end = { line: line - 1, character: column };
    }

    diagnostics.push({
      range,
      severity,
      message: `[CSSTree] ${message}`
    });
  });

  return Promise.resolve(diagnostics);
};
