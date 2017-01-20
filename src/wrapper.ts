'use strict';

import { Diagnostic, DiagnosticSeverity, TextDocument, Range, Position } from 'vscode-languageserver';

let csstreeValidator = require('csstree-validator');
const TYPE_WARNING = 'Warning';
const TYPE_ERROR = 'Error';
const SEVERITY_WARNING = 'warning';
const SEVERITY_ERROR = 'error';

export function wrapper(options) {
  let report = csstreeValidator.validateString(options.code);
  let diagnostics:Diagnostic[] = [];

  report = Object.keys(report).reduce((r, c) => r.concat(report[c]), []);

  report.forEach(warning => {
    let doc: TextDocument = options.document;
    let range: Range = {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 0 }
    };
    let severity: DiagnosticSeverity = DiagnosticSeverity.Warning;

    range.start = { line: warning.line - 1, character: warning.column - 1 };

    if (warning.loc) {
      let endLine = warning.loc.end.line - 1;
      let endColumn = warning.loc.end.column - 1;

      if (!warning.message.indexOf('Unknown property')) {
        range.end = { line: range.start.line, character: range.start.character + warning.property.length };
      } else {
        range.end = { line: endLine, character: endColumn };
      }
    } else {
      severity = DiagnosticSeverity.Error;
      range.end = { line: range.start.line, character: range.start.character + 1 };
    }

    diagnostics.push({  
      range,
      severity,
      message: `[CSSTree] ${warning.message}`
    });
  });

  return Promise.resolve(diagnostics);
};