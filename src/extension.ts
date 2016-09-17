'use strict';

const _path = require('path');

import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';
const vscode = require('vscode');

exports.activate = function activate(context) {
    const serverModule = _path.join(__dirname, 'server.js');

    const client = new LanguageClient('csstree', {
        run: {
            module: serverModule,
            transport: TransportKind.ipc
        },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: {
                execArgv: ['--nolazy', '--debug=6004']
            }
        }
    }, {
            documentSelector: ['css'],
            synchronize: {
                configurationSection: 'csstree'
            }
        });

    context.subscriptions.push(new SettingMonitor(client, 'csstree.enable').start());
};