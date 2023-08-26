"use strict";

import * as vscode from "vscode";
import fs = require("fs");
import path = require("path");

var cache: { [bin: string]: string } = {};

export function getCodeCommandPath() {
	var exec: unknown = vscode.workspace.getConfiguration().get("owtc.command");
	let binName: string = '';

	if (typeof exec === "string") {
		if ((binName = String(exec)) === "auto") {
			switch (vscode.env.appName) {
				case "VSCodium":
					binName = "codium";
					break;
				case "Visual Studio Code - Insiders":
					binName = "code-insiders";
					break;
				default:
					binName = "code";
			}
		}
	}
	else {
		binName = "code";
	}

	var command = correctCommandName(binName);
	if (cache[command]) {
		return cache[command];
	}

	let codePath = "";
	let candidatePaths: string[] = [];

	// candidate 0
	if (fs.existsSync(binName)) {
		// It's full path.
		candidatePaths.push(binName);
	}
	// candidate 1
	codePath = path.join(path.dirname(process.execPath), "bin", command);
	if (fs.existsSync(codePath)) {
		candidatePaths.push(codePath);
	}
	// candidate 2
	codePath = path.join(path.dirname(process.execPath), "../Resources/app/bin", command);
	if (fs.existsSync(codePath)) {
		candidatePaths.push(codePath);
	}
	// candidate 3
	codePath = path.join(path.dirname(process.execPath), "../../../../Resources/app/bin", command);
	if (fs.existsSync(codePath)) {
		candidatePaths.push(codePath);
	}
	// candidate 4
	codePath = path.join(process.cwd(), command);
	if (fs.existsSync(codePath)) {
		candidatePaths.push(codePath);
	}
	// candidate 5
	codePath = path.join(process.cwd(), "bin", command);
	if (fs.existsSync(codePath)) {
		candidatePaths.push(codePath);
	}

	//console.log(candidatePaths);

	if (candidatePaths.length === 0) {
		return null;
	}

	if (candidatePaths.length === 1) {
		cache[command] = candidatePaths[0];
		return candidatePaths[0];
	}

	// when hit multiple candidates
	for (const p of candidatePaths) {
		const contents = fs.readFileSync(p, 'utf-8');
		if (contents.includes("VSCODE") && contents.includes("ELECTRON")) {
			// easy check file contents
			cache[command] = p;
			return p;
		}
	}

	return null;
}

export function isCodeCommandAvailable(): boolean {
	return getCodeCommandPath() !== null;
}

function correctCommandName(binName: string) {
	if (process.platform === "win32") {
		return binName + ".cmd";
	}
	return binName;
}
