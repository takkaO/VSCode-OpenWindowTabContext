'use strict';

import * as vscode from 'vscode';
import * as path from './path';
import cp = require('child_process');

export const OpenFileInNewWindowCommandId = 'open-window-tab-context.openFileInNewWindow';

export function openFileInNewWindow(context?: any) {
	if (context instanceof vscode.Uri) {
		launchNewInstance(context.fsPath);
	} else {
		vscode.window.showWarningMessage('Command failed. There is not a file.');
	}
}

function launchNewInstance(filepath: string) {
	// fetch vscode execute path
	var codeCommand = path.getCodeCommandPath();

	if (codeCommand) {
		cp.execFile(codeCommand, ['-n', filepath]);
	} else {
		vscode.window.showErrorMessage('Failed to fetch VScode execute path.');
	}
}