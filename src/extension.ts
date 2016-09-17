'use strict';

import path = require('path');
import vscode = require('vscode');
import { LanguageClient, SettingMonitor, TransportKind } from 'vscode-languageclient';

exports.activate = function activate(context) {
    let serverModule = path.join(__dirname, 'server.js');
    let client = new LanguageClient('csstree',
        {
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
        },
        {
            documentSelector: ['css'],
            synchronize: {
                configurationSection: 'csstree'
            }
        }
    );

    context.subscriptions.push(new SettingMonitor(client, 'csstree.enable').start());
};