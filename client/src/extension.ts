'use strict';

import * as path from 'path';

import { workspace, ExtensionContext, Disposable, Uri } from 'vscode';
import {
    LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, CancellationToken, Middleware,
    DidChangeConfigurationNotification, ConfigurationParams
} from 'vscode-languageclient';

interface CSSTreeSettings {
    enableValidation: boolean;
}

let client: LanguageClient;

namespace Configuration {
    let configurationListener: Disposable;

    export function computeConfiguration(params: ConfigurationParams, _token: CancellationToken, _next: Function): any[] {
        const result: (CSSTreeSettings | null)[] = [];

        if (params.items) {
            for (const { section, scopeUri } of params.items) {
                let uri: Uri;

                if (scopeUri) {
                    uri = client.protocol2CodeConverter.asUri(scopeUri);
                }

                const config = workspace.getConfiguration(section, uri);

                if (config) {
                    result.push({
                        enableValidation: config.get('enableValidation')
                    });
                } else {
                    result.push(null);
                }
            }
        }

        return result;
    }

    export function initialize() {
        configurationListener = workspace.onDidChangeConfiguration(() => {
            client.sendNotification(DidChangeConfigurationNotification.type, { settings: null });
        });
    }

    export function dispose() {
        if (configurationListener) {
            configurationListener.dispose();
        }
    }
}


export function activate(context: ExtensionContext) {
    const serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
    const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
    }
    const middleware: Middleware = {
        workspace: {
            configuration: Configuration.computeConfiguration
        }
    };
    const clientOptions: LanguageClientOptions = {
        documentSelector: ['css'],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
            configurationSection: ['csstree']
        },
        middleware: middleware
    }

    client = new LanguageClient('csstree', 'csstree language server', serverOptions, clientOptions);
    client.start();
    //Configuration.initialize();
}

export function deactivate(): Thenable<void> {
    if (!client) {
        return undefined;
    }
    Configuration.dispose();
    return client.stop();
}