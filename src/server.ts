import { wrapper } from './wrapper.js';
import {
  IPCMessageReader, IPCMessageWriter,
  createConnection, IConnection, TextDocuments,
  TextDocument
} from 'vscode-languageserver';

let config;
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
let documents = new TextDocuments();

async function validate(document: TextDocument) {
  try {
    const diagnostics = await wrapper({
      code: document.getText(),
    });
    connection.sendDiagnostics({ uri: document.uri, diagnostics });
  } catch (err) {
    connection.window.showErrorMessage(err.stack.replace(/\n/g, ' '));
  }
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
