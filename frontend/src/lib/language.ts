const extensionToLanguage: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  json: "json",
  md: "markdown",
  py: "python",
  rs: "rust",
  go: "go",
  java: "java",
  kt: "kotlin",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  c: "c",
  h: "c",
  cs: "csharp",
  php: "php",
  rb: "ruby",
  swift: "swift",
  sql: "sql",
  css: "css",
  scss: "scss",
  html: "html",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
  sh: "shell",
  bash: "shell",
  ps1: "powershell",
};

export const detectLanguageFromPath = (fileName?: string | null) => {
  if (!fileName) return "plaintext";
  const segments = fileName.split(".");
  const extension = segments.pop()?.toLowerCase();
  if (!extension) return "plaintext";
  return extensionToLanguage[extension] ?? "plaintext";
};
