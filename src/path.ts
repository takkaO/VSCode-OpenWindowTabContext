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

	let code_path = "";
	let candidate_paths: string[] = [];
	// candidate 1
	code_path = path.join(path.dirname(process.execPath), "bin", command);
	if (fs.existsSync(code_path)) {
		candidate_paths.push(code_path);
	}
	// candidate 2
	code_path = path.join(process.cwd(), command);
	if (fs.existsSync(code_path)) {
		candidate_paths.push(code_path);
	}
	// candidate 3
	code_path = path.join(process.cwd(), "bin", command);
	if (fs.existsSync(code_path)) {
		candidate_paths.push(code_path);
	}

	//console.log(candidate_paths);

	if (candidate_paths.length === 0) {
		return null;
	}

	if (candidate_paths.length === 1) {
		cache[command] = candidate_paths[0];
		return candidate_paths[0];
	}

	// when hit multiple candidates
	for (const p of candidate_paths) {
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

function correctCommandName(bin_name: string) {
	if (process.platform === "win32") {
		return bin_name + ".cmd";
	}
	return bin_name;
}
