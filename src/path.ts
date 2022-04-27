"use strict";

import * as vscode from "vscode";
import fs = require("fs");
import path = require("path");

var cache: { [bin: string]: string; } = {};

export function getCodeCommandPath() {
  	var exec: unknown = vscode.workspace.getConfiguration().get("owtc.command");
	var command = correctCommandName(typeof exec === "string" ? String(exec) : "code");
	if (cache[command]) {
		return cache[command];
	}

	let dir_name = process.cwd();
	if (process.platform !== "darwin") {
		// If platform is not Mac, add bin dir
		dir_name = path.join(dir_name, "bin");
	}
	let bin_path = path.join(dir_name, command);
	//console.log(bin_path);

	if (fs.existsSync(bin_path)) {
		cache[command] = bin_path;
		return bin_path;
	}

	return null;
}

export function isCodeCommandAvailable(): boolean {
	return getCodeCommandPath() !== null;
}

function correctCommandName(bin_name: string) {
	if (process.platform === "win32") {
		return bin_name + ".cmd";
	}
	return bin_name;
}
