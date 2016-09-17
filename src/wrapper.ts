'use strict';

let csstreeValidator = require('csstree-validator');
import { DiagnosticSeverity } from 'vscode-languageserver';

export function wrapper(options) {
    let report = csstreeValidator.validateString(options.code);
    let diagnostics = [];

    report = Object.keys(report).reduce((r, c) => r.concat(report[c]), []);

    report.forEach(warning => {
        diagnostics.push({
            message: `[CSSTree] ${warning.message}`,
            severity: DiagnosticSeverity.Warning,
            range: {
                start: {
                    line: warning.line - 1,
                    character: warning.column - 1
                },
                end: {
                    line: warning.line - 1,
                    character: warning.column - 1
                }
            }
        });
    });

    return Promise.resolve(diagnostics);
};