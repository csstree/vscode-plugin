'use strict';

const path = require('path');

import {
    IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection,
	Files, TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity, 
	InitializeParams, InitializeResult
} from 'vscode-languageserver';

const wrapper = require('./wrapper');

let configBasedir;
let config;

const connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
const documents = new TextDocuments();

function validate(document) {
  return wrapper({
    code: document.getText(),
    codeFilename: Files.uriToFilePath(document.uri),
    config,
    configBasedir,
    syntax: 'css'
  }).then(diagnostics => {
    connection.sendDiagnostics({uri: document.uri, diagnostics});
  }).catch(err => {
    connection.window.showErrorMessage(err.stack.replace(/\n/g, ' '));
  });
}

function validateAll() {
  return Promise.all(documents.all().map(document => validate(document)));
}

connection.onInitialize(params => {
  if (params.rootPath) {
    configBasedir = params.rootPath;
  }

  validateAll();

  return {
    capabilities: {
      textDocumentSync: documents.syncKind
    }
  };
});
connection.onDidChangeConfiguration(params => {
  const settings = params.settings;
  config = settings.csstree.config;

  validateAll();
});
connection.onDidChangeWatchedFiles(() => validateAll());

documents.onDidChangeContent(event => validate(event.document));
documents.listen(connection);

connection.listen();