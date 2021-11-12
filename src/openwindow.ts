'use strict';

import * as vscode from 'vscode';
import * as path from './path';
import cp = require('child_process');

export const OpenFileInNewWindowCommandId = 'open-window-tab-context.openFileInNewWindow';

export async function openFileInNewWindow(context?: any) {
	if (context instanceof vscode.Uri) {
		launchNewInstance(context.fsPath);

		if (vscode.workspace.getConfiguration().get("owtc.autoClose") === "Disable") {
			// If disable auto close mode, finish all.
			return;
		}

		let activeEditor = vscode.window.activeTextEditor;
		let activeFilePath = activeEditor?.document.uri.fsPath;
		if (activeFilePath === undefined) {
			// Probably the process here will not be executed.
			return;
		}

		if (activeFilePath === context.fsPath) {
			// When the active tab and the tab opened in a new window are the same
			vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		}
		/*
		else {
			// When the active tab and the tab opened in a new window are different
			let tmp = vscode.Uri.file(activeFilePath);                                                     // Backup the current active editor
			await vscode.commands.executeCommand<vscode.TextDocumentShowOptions>("vscode.open", context);  // Activate the Open in New Window editor
			await vscode.commands.executeCommand('workbench.action.closeActiveEditor');                    // close active editor
			vscode.commands.executeCommand<vscode.TextDocumentShowOptions>("vscode.open", tmp);            // Restore the active editor from a backup
		}
		*/
	} else {
		vscode.window.showWarningMessage('Command failed. There is not a file.');
	}
}

function launchNewInstance(filepath: string) {
	// fetch vscode execute path
	var codeCommand = path.getCodeCommandPath();

	if (codeCommand) {
		filepath = "\"" + filepath + "\"";
		codeCommand = "\"" + codeCommand + "\"";
		cp.execFile(codeCommand, ['-n', filepath], { shell: true });
	} else {
		vscode.window.showErrorMessage('Failed to fetch VScode execute path.');
	}
}