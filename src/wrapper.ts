'use strict';

const csstreeValidator = require('csstree-validator');
const langServer = require('vscode-languageserver');
import {
    DiagnosticSeverity
} from 'vscode-languageserver';

module.exports = function csstreeVSCode(options) {
    let report = csstreeValidator.validateString(options.code);
    let diagnostics = [];

    report = Object.keys(report).reduce((r, c) => r.concat(report[c]), []);

    report.forEach(warning => {
        diagnostics.push({
            message: `csstree: ${warning.message}`,
            severity: DiagnosticSeverity.Error,
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