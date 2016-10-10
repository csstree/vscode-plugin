'use strict';

let csstreeValidator = require('csstree-validator');
let findEnd = require('./scanner.js').findEnd;
import { DiagnosticSeverity, TextDocument, Position } from 'vscode-languageserver';

export function wrapper(options) {
    let report = csstreeValidator.validateString(options.code);
    let diagnostics = [];

    report = Object.keys(report).reduce((r, c) => r.concat(report[c]), []);

    report.forEach(warning => {
        let line = warning.line - 1;
        let column = warning.column - 1
        let doc: TextDocument = options.document;
        let offset = doc.offsetAt(Position.create(line, column));
        let endPos: Position;

        if (!warning.message.indexOf('Unknown property')) {
            endPos = Position.create(line, column + warning.property.length);
        } else {
            endPos = doc.positionAt(findEnd(doc.getText(), offset));
        }

        diagnostics.push({
            message: `[CSSTree] ${warning.message}`,
            severity: DiagnosticSeverity.Warning,
            range: {
                start: {
                    line: line,
                    character: column
                },
                end: {
                    line: endPos.line,
                    character: endPos.character
                }
            }
        });
    });

    return Promise.resolve(diagnostics);
};