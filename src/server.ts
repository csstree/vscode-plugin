'use strict';

import path = require('path');
import { wrapper } from './wrapper';
import {
  IPCMessageReader, IPCMessageWriter,
  createConnection, IConnection, TextDocuments
} from 'vscode-languageserver';

let config;
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
let documents = new TextDocuments();

function validate(document) {
  return wrapper({
    code: document.getText(),
    document,
    config,
  }).then(diagnostics => {
    connection.sendDiagnostics({ uri: document.uri, diagnostics });
  }).catch(err => {
    connection.window.showErrorMessage(err.stack.replace(/\n/g, ' '));
  });
}

function validateAll() {
  return Promise.all(documents.all().map(doc => validate(doc)));
}

connection.onInitialize(params => {
  validateAll();

  return {
    capabilities: {
      textDocumentSync: documents.syncKind
    }
  };
});
connection.onDidChangeConfiguration(params => {
  let settings = params.settings;

  config = settings.csstree.config;
  validateAll();
});
documents.onDidChangeContent(event => validate(event.document));
documents.onDidClose(e => connection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] }));
documents.listen(connection);
connection.onDidChangeWatchedFiles(validateAll);
connection.listen();