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

	let owtcOverrideMethod = vscode.commands.registerCommand("workbench.action.files.openFile", async (arg) => {
		owtcOpenFileOverride(owtcOverrideMethod);
	})

	// Method implementation
	async function owtcOpenFileOverride(methodDisposer: any) {
		methodDisposer.dispose();	// Abort and Dispose override method

		if (vscode.workspace.getConfiguration().get("owtc.overrideOpenFileMethod") === true) {
			// Call override method
			const options: vscode.OpenDialogOptions = {
				canSelectMany: false,
				openLabel: 'Open',
				filters: {
				   'All files': ['*']
			   }
		   };
		   
		   vscode.window.showOpenDialog(options).then(fileUri => {
			   if (fileUri && fileUri[0]) {
				   console.log('Selected file: ' + fileUri[0].fsPath);
			   }
		   });
		}
		else {
			// Call original method
			await vscode.commands.executeCommand("workbench.action.files.openFile");
		}

		let owtcOverrideMethod = vscode.commands.registerCommand("workbench.action.files.openFile", async (arg) => {
			owtcOpenFileOverride(owtcOverrideMethod);
		})
		context.subscriptions.push(owtcOverrideMethod);	//	re-register override method
	}

	context.subscriptions.push(owtcOverrideMethod);
}



// this method is called when your extension is deactivated
export function deactivate() { }
