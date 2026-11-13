import { unzipSync } from 'fflate';
import { assessFile, MAX_FILES, MAX_FILE_BYTES, MAX_TOTAL_BYTES, normalizePath } from './engine';
import type { SourceFile } from './engine';

export interface ImportResult {
  files: SourceFile[];
  name: string;
  warnings: string[];
}

interface Entry { rawPath: string; path: string; size: number }

function prepare(entries: { rawPath: string; size: number }[]): { entries: Entry[]; root?: string } {
  if (entries.length > MAX_FILES) throw new Error('Choose a project with at most 500 files.');
  const seen = new Set<string>();
  let total = 0;
  const normalized = entries.map(entry => {
    const path = normalizePath(entry.rawPath);
    if (!path) throw new Error('The project contains an unsafe file path.');
    if (seen.has(path)) throw new Error(`Duplicate file path: ${path}`);
    seen.add(path);
    if (!Number.isSafeInteger(entry.size) || entry.size < 0) throw new Error('Invalid file size in project.');
    total += entry.size;
    if (total > MAX_TOTAL_BYTES) throw new Error('Project contents exceed the 10 MB limit. Choose a smaller folder or ZIP.');
    return { ...entry, path };
  });
  const firstRoot = normalized[0]?.path.split('/')[0];
  const root = firstRoot && normalized.every(entry => entry.path.startsWith(`${firstRoot}/`))
    && assessFile({ path: `${firstRoot}/contextcrate-probe.txt`, content: '' }).status === 'safe'
    ? firstRoot : undefined;
  return { entries: normalized.map(entry => ({ ...entry, path: root ? entry.path.slice(root.length + 1) : entry.path })), root };
}

function shouldRead(entry: Entry): boolean {
  return entry.size <= MAX_FILE_BYTES && assessFile({ path: entry.path, content: '', bytes: entry.size }).status === 'safe';
}

function decoded(entry: Entry, bytes?: Uint8Array): SourceFile {
  if (!bytes) return { path: entry.path, content: '', bytes: entry.size };
  if (bytes.length > MAX_FILE_BYTES || bytes.length !== entry.size) throw new Error(`File size does not match its metadata: ${entry.path}`);
  try {
    return { path: entry.path, content: new TextDecoder('utf-8', { fatal: true }).decode(bytes), bytes: entry.size };
  } catch {
    // A sentinel marks unsupported encoding as non-text without exposing lossy contents.
    return { path: entry.path, content: '\0', bytes: entry.size };
  }
}

function result(files: SourceFile[], name: string): ImportResult {
  const warnings: string[] = [];
  const excluded = files.filter(file => assessFile(file).status !== 'safe').length;
  if (excluded) warnings.push(`${excluded} file${excluded === 1 ? ' was' : 's were'} excluded by local safety and file rules. Review all selected files before sharing.`);
  return { files, name, warnings };
}

/** Reads only eligible files; credential and generated filenames are never opened. */
export async function importFiles(files: File[]): Promise<ImportResult> {
  if (!files.length) throw new Error('Choose source files, a folder, or a ZIP.');
  const prepared = prepare(files.map(file => ({ rawPath: file.webkitRelativePath || file.name, size: file.size })));
  const imported: SourceFile[] = [];
  for (let index = 0; index < prepared.entries.length; index++) {
    const entry = prepared.entries[index];
    imported.push(decoded(entry, shouldRead(entry) ? new Uint8Array(await files[index].arrayBuffer()) : undefined));
  }
  return result(imported, prepared.root || (files.length === 1 ? files[0].name : 'Imported files'));
}

/** Bounds central-directory sizes before any archive entries are decompressed. */
export async function importZip(file: File): Promise<ImportResult> {
  if (file.size > MAX_TOTAL_BYTES) throw new Error('ZIP exceeds the 10 MB compressed-size limit.');
  const metadata: { rawPath: string; size: number }[] = [];
  const compressed = new Uint8Array(await file.arrayBuffer());
  let entries: Entry[];
  let root: string | undefined;
  try {
    // First pass reads directory metadata only. No file is inflated.
    unzipSync(compressed, { filter: entry => {
      if (!Number.isSafeInteger(entry.originalSize) || entry.originalSize < 0) throw new Error('Invalid archive size.');
      if (entry.name.endsWith('/')) {
        if (!normalizePath(entry.name)) throw new Error('Unsafe archive directory.');
        return false;
      }
      metadata.push({ rawPath: entry.name, size: entry.originalSize });
      if (metadata.length > MAX_FILES) throw new Error('Too many archive files.');
      return false;
    } });
    ({ entries, root } = prepare(metadata));
  } catch (error) {
    throw new Error(`Cannot import ZIP: ${error instanceof Error ? error.message : 'invalid archive'}`);
  }
  if (!entries.length) throw new Error('The ZIP contains no files.');
  const byRaw = new Map(entries.map(entry => [entry.rawPath, entry]));
  try {
    const unpacked = unzipSync(compressed, { filter: info => {
      const entry = byRaw.get(info.name);
      return !!entry && shouldRead(entry);
    } });
    return result(entries.map(entry => decoded(entry, Object.prototype.hasOwnProperty.call(unpacked, entry.rawPath) ? unpacked[entry.rawPath] : undefined)), root || file.name.replace(/\.zip$/i, ''));
  } catch (error) {
    throw new Error(`Cannot read ZIP contents: ${error instanceof Error ? error.message : 'invalid archive'}`);
  }
}
