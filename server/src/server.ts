'use strict';

import {
    createConnection, TextDocuments, ProposedFeatures, InitializeParams, DidChangeConfigurationNotification
} from 'vscode-languageserver';
import validateCSS from './validate';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments = new TextDocuments();
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;

    hasConfigurationCapability = capabilities.workspace && !!capabilities.workspace.configuration;
    hasWorkspaceFolderCapability = capabilities.workspace && !!capabilities.workspace.workspaceFolders;

    return {
        capabilities: {
            textDocumentSync: documents.syncKind
        }
    }
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
    }

    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders((_event) => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});

interface CSSTreeSettings {
    enableValidation: boolean;
}

const defaultSettings: CSSTreeSettings = { enableValidation: true };
let globalSettings: CSSTreeSettings = defaultSettings;
let documentSettings: Map<string, Thenable<CSSTreeSettings>> = new Map();

connection.onDidChangeConfiguration(async change => {
    debugger
    if (hasConfigurationCapability) {
        documentSettings.clear();
    } else {
        globalSettings = <CSSTreeSettings>(change.settings.csstree || defaultSettings);
    }

    documents.all().forEach(async doc => {
        const settings = await getDocumentSettings(doc.uri);

        if (settings.enableValidation) {
            validateCSS(connection, doc, settings)
        }
    });
});

async function getDocumentSettings(resource: string): Promise<CSSTreeSettings> {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }

    let result = documentSettings.get(resource);

    if (!result) {
        result = await connection.workspace.getConfiguration({ section: 'csstree', scopeUri: resource });
        documentSettings.set(resource, result);
    }

    return result;
}

documents.onDidClose(e => {
    documentSettings.delete(e.document.uri);
    connection.sendDiagnostics({ uri: e.document.uri, diagnostics: [] });
});
documents.onDidChangeContent(async change => {
    const settings = await getDocumentSettings(change.document.uri);

    if (settings.enableValidation) {
        validateCSS(connection, change.document, settings);
    }
});
documents.listen(connection);
connection.listen();