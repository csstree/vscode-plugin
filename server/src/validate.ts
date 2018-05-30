'use strict';

import { Diagnostic, DiagnosticSeverity, TextDocument, Range, Connection } from 'vscode-languageserver';
import { validateString, ReportItem } from 'csstree-validator';

export default async function wrapper(connection: Connection, doc: TextDocument, _settings: any) {
    const diagnostics: Diagnostic[] = [];
    const source = doc.getText();
    const report = validateString(source);
    const reportItems: ReportItem[] = Object.keys(report).reduce((r, c) => r.concat(report[c]), []);

    reportItems.forEach(({ line, column, loc, node, message, property }: ReportItem) => {
        const range: Range = {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 0 }
        };
        let severity: DiagnosticSeverity = DiagnosticSeverity.Warning;

        if (loc && loc.start && loc.end) {
            range.start = { line: line - 1, character: column - 1 };

            if (!message.indexOf('Unknown property')) {
                range.end = { line: range.start.line, character: range.start.character + property.length };
            } else {
                range.end = { line: loc.end.line - 1, character: loc.end.column - 1 };
            }
        } else {
            severity = DiagnosticSeverity.Error;

            if (node) {
                range.start = { line: node.loc.start.line - 1, character: node.loc.start.column - 1 };
                range.end = { line: node.loc.end.line - 1, character: node.loc.end.column - 1 };
            } else {
                range.start = { line: line - 1, character: column - 1 };
                range.end = { line: line - 1, character: column };
            }
        }

        diagnostics.push({
            range,
            severity,
            message,
            source: 'csstree'
        });

        connection.sendDiagnostics({ uri: doc.uri, diagnostics });
    });
};