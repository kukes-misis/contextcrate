import { describe, expect, it, vi } from 'vitest';
import { strToU8, zipSync } from 'fflate';
import { assessFiles, MAX_FILE_BYTES, MAX_TOTAL_BYTES } from './engine';
import { importFiles, importZip } from './imports';

function source(path: string, content = 'export const answer = 42;'): File {
  const file = new File([content], path.split('/').pop()!);
  Object.defineProperty(file, 'webkitRelativePath', { value: path });
  return file;
}
function archive(files: Record<string, string>): File {
  const data = Object.fromEntries(Object.entries(files).map(([path, content]) => [path, strToU8(content)]));
  return new File([zipSync(data) as Uint8Array<ArrayBuffer>], 'project.zip');
}

describe('folder and file imports', () => {
  it('strips a common project root and preserves UTF-8 source', async () => {
    const imported = await importFiles([source('demo/src/main.ts', 'const greeting = "Привет";'), source('demo/README.md', '# Demo')]);
    expect(imported.name).toBe('demo');
    expect(imported.files.map(file => file.path)).toEqual(['src/main.ts', 'README.md']);
    expect(imported.files[0].content).toContain('Привет');
  });
  it('never opens credential, generated or oversize files', async () => {
    const secret = source('demo/.env', 'SECRET=private');
    const generated = source('demo/dist/app.js');
    const large = source('demo/large.ts', 'a'.repeat(MAX_FILE_BYTES + 1));
    const readers = [secret, generated, large].map(file => vi.spyOn(file, 'arrayBuffer').mockRejectedValue(new Error('must not read')));
    const imported = await importFiles([secret, generated, large, source('demo/README.md')]);
    readers.forEach(reader => expect(reader).not.toHaveBeenCalled());
    expect(assessFiles(imported.files).map(file => file.status)).toEqual(['blocked', 'ignored', 'ignored', 'safe']);
  });
  it('does not strip a sensitive root', async () => {
    const file = source('.git/config', 'private repository details');
    const read = vi.spyOn(file, 'arrayBuffer');
    const imported = await importFiles([file]);
    expect(imported.files[0].path).toBe('.git/config');
    expect(read).not.toHaveBeenCalled();
  });
  it('rejects traversal and duplicate normalized paths before reading', async () => {
    await expect(importFiles([source('demo/../secret.ts')])).rejects.toThrow('небезопасный');
    await expect(importFiles([source('demo/src/a.ts'), source('demo/src/./a.ts')])).rejects.toThrow('Повторяющийся');
  });
  it('preserves unrelated roots and rejects too many files', async () => {
    const imported = await importFiles([source('one/a.ts'), source('two/b.ts')]);
    expect(imported.files.map(file => file.path)).toEqual(['one/a.ts', 'two/b.ts']);
    await expect(importFiles(Array.from({ length: 501 }, (_, i) => source(`root/${i}.ts`)))).rejects.toThrow('500');
  });
  it('rejects empty imports and total source size over limit', async () => {
    await expect(importFiles([])).rejects.toThrow('Выберите');
    const file = source('large.ts');
    Object.defineProperty(file, 'size', { value: MAX_TOTAL_BYTES + 1 });
    await expect(importFiles([file])).rejects.toThrow('10 МБ');
  });
  it('marks unsupported byte encodings as ignored rather than sharing corrupt text', async () => {
    const imported = await importFiles([new File([new Uint8Array([0xff, 0xfe, 0x00])], 'legacy.txt')]);
    expect(assessFiles(imported.files)[0].status).toBe('ignored');
  });
});

describe('bounded ZIP imports', () => {
  it('imports source but excludes credentials and generated contents', async () => {
    const imported = await importZip(archive({ 'demo/src/main.ts': 'export const x = 1;', 'demo/.env': 'DO_NOT_READ=secret', 'demo/node_modules/dep/index.js': 'generated' }));
    expect(imported.name).toBe('demo');
    expect(imported.files[0].content).toContain('export const');
    expect(imported.files[1].content).toBe('');
    expect(imported.files[2].content).toBe('');
    expect(assessFiles(imported.files).map(file => file.status)).toEqual(['safe', 'blocked', 'ignored']);
  });
  it('rejects traversal archive entries', async () => {
    await expect(importZip(archive({ '../outside.ts': 'bad' }))).rejects.toThrow('небезопасный');
  });
  it('does not decompress files larger than the individual limit', async () => {
    const imported = await importZip(archive({ 'demo/huge.txt': 'a'.repeat(MAX_FILE_BYTES + 1), 'demo/ok.ts': 'ok' }));
    expect(imported.files[0].content).toBe('');
    expect(assessFiles(imported.files)[0].status).toBe('ignored');
    expect(imported.files[1].content).toBe('ok');
  });
  it('rejects a compressed bomb by uncompressed directory size', async () => {
    const file = archive({ 'huge.txt': 'a'.repeat(MAX_TOTAL_BYTES + 1) });
    expect(file.size).toBeLessThan(100_000);
    await expect(importZip(file)).rejects.toThrow('10 МБ');
  });
  it('rejects a malformed or oversized compressed archive', async () => {
    await expect(importZip(new File(['not a zip'], 'broken.zip'))).rejects.toThrow('Не удалось импортировать ZIP');
    const file = archive({ 'ok.txt': 'ok' });
    Object.defineProperty(file, 'size', { value: MAX_TOTAL_BYTES + 1 });
    const read = vi.spyOn(file, 'arrayBuffer');
    await expect(importZip(file)).rejects.toThrow('сжатого ZIP');
    expect(read).not.toHaveBeenCalled();
  });
});
