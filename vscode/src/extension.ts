// vscode-extension/src/extension.ts
// Minimal VS Code extension providing completions and hover docs for Garur-CSS utilities.
// This is a simple provider that ships with a bundled small util-docs list.
// You can later enhance it to read your project's UTIL_DOCS from dist/handler.js or garur.config.

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

type UtilDoc = { id: string; desc: string; example?: string; category?: string };

// Try to read a workspace-level garur utility manifest (optional)
function loadWorkspaceUtilDocs(): UtilDoc[] {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) return [];
    const root = workspaceFolders[0].uri.fsPath;
    const manifest = path.join(root, "garur-utils.json"); // optional generated file
    if (fs.existsSync(manifest)) {
      return JSON.parse(fs.readFileSync(manifest, "utf-8"));
    }
  } catch { /* ignore */ }
  return [];
}

// Bundled small dataset (extendable)
const bundledDocs: UtilDoc[] = [
  { id: "p-4", desc: "Padding: 1rem", example: "p-4", category: "spacing" },
  { id: "m-4", desc: "Margin: 1rem", example: "m-4", category: "spacing" },
  { id: "bg-blue-500", desc: "Background color: blue 500", example: "bg-blue-500", category: "colors" },
  { id: "text-white", desc: "Text color: white", example: "text-white", category: "colors" },
  { id: "rounded", desc: "Border radius (default)", example: "rounded", category: "borderRadius" }
];

export function activate(context: vscode.ExtensionContext) {
  const workspaceDocs = loadWorkspaceUtilDocs();
  const docs = [...bundledDocs, ...workspaceDocs];

  const provider = vscode.languages.registerCompletionItemProvider(
    ["html", "javascript", "typescript", "javascriptreact", "typescriptreact"],
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const line = document.lineAt(position).text;
        // quick heuristic: only offer completions when inside class="" or className=""
        const prefix = line.slice(0, position.character);
        if (!/class(Name)?\s*=\s*["'][^"']*$/.test(prefix) && !/class(Name)?\s*=\s*\{["'][^"']*$/.test(prefix)) {
          return undefined;
        }

        return docs.map(d => {
          const item = new vscode.CompletionItem(d.id, vscode.CompletionItemKind.Snippet);
          item.detail = d.category || "garur";
          item.documentation = new vscode.MarkdownString(`**${d.id}**\n\n${d.desc}\n\nExample: \`${d.example || d.id}\``);
          return item;
        });
      }
    },
    "-", ":" // trigger characters
  );

  const hoverProvider = vscode.languages.registerHoverProvider(
    ["html", "javascript", "typescript", "javascriptreact", "typescriptreact"],
    {
      provideHover(document: vscode.TextDocument, position: vscode.Position) {
        const range = document.getWordRangeAtPosition(position, /[A-Za-z0-9\-\_:/]+/);
        if (!range) return null;
        const word = document.getText(range);
        const found = docs.find(d => d.id === word);
        if (!found) return null;
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`**${found.id}** — ${found.desc}\n\n`);
        if (found.example) markdown.appendCodeblock(found.example, "css");
        return new vscode.Hover(markdown);
      }
    }
  );

  const cmd = vscode.commands.registerCommand("garur.showDocs", () => {
    const panel = vscode.window.createWebviewPanel("garurDocs", "Garur Utilities", vscode.ViewColumn.One, {});
    const html = `<html><body><h2>Garur Utilities</h2><ul>${docs.map(d => `<li><b>${d.id}</b>: ${d.desc}</li>`).join("")}</ul></body></html>`;
    panel.webview.html = html;
  });

  context.subscriptions.push(provider, hoverProvider, cmd);
}

export function deactivate() {}