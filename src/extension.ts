// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as op from './openwindow';
import { isCodeCommandAvailable } from './path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	/* Check VScode command */
	if (isCodeCommandAvailable() === false) {
		var msg = "[ Open Window Tab Context ] ";
		msg += "Failed to get VSCode command path.";
		vscode.window.showErrorMessage(msg);
	}

	let openFileInNewWindow = vscode.commands.registerCommand(op.OpenFileInNewWindowCommandId, op.openFileInNewWindow);

	context.subscriptions.push(openFileInNewWindow);
}

// this method is called when your extension is deactivated
export function deactivate() {}
