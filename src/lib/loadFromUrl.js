const allowedExtensions = [
    '.mzn',
    '.mzc',
    '.dzn',
    '.json',
    '.html',
    '.js',
    '.css',
];
import { isMoocFile, parseMooc, rewriteMoocReferences } from './mooc.js';

/** Match Playground's normal filename flattening and collision suffixes. */
function flattenedName(file, names) {
    const basename = file.split('/').pop();
    const dot = basename.endsWith('.mzc.mzn')
        ? basename.length - 8
        : basename.lastIndexOf('.');
    const stem = basename.substring(0, dot).replaceAll(/[\/\\.]/g, '');
    const suffix = basename.substring(dot);
    let name = `${stem}${suffix}`;
    let i = 2;
    while (names.has(name)) {
        name = `${stem}-${i++}${suffix}`;
    }
    return name;
}

/**
 * @param {string} url
 * @returns {Promise<{ files: Array<Record<string, any>>, tab?: number, solverId?: string, timestamp: number }>}
 */
export async function loadFromUrl(url) {
    const src =
        url.startsWith('http://') || url.startsWith('https://')
            ? url
            : `http://${url}`;
    const sourceUrl = new URL(src);
    const name = sourceUrl.pathname.split('/').pop();
    if (
        !name.endsWith('.mzp') &&
        allowedExtensions.every((ext) => !name.endsWith(ext))
    ) {
        throw new Error('File type not recognised');
    }
    const response = await fetch(sourceUrl);
    if (!response.ok) {
        throw new Error(
            `Request failed (${response.status} ${response.statusText})`,
        );
    }
    if (name.endsWith('.mzp')) {
        const project = await response.json();
        const files = [];
        const flattenedNames = new Set();
        const originalToFlattened = new Map();
        let moocContents = null;
        const openFile = project.openFiles[project.openTab];
        let tab = 0;
        for (const file of project.projectFiles) {
            const name = file.split('/').pop();
            if (
                !isMoocFile(name) &&
                allowedExtensions.every((ext) => !name.endsWith(ext))
            ) {
                continue;
            }
            const res = await fetch(new URL(file, src));
            if (!res.ok) {
                throw new Error(
                    `Request failed (${res.status} ${res.statusText})`,
                );
            }
            const contents = await res.text();
            if (isMoocFile(name)) {
                moocContents = contents;
                continue;
            }
            const finalName = flattenedName(file, flattenedNames);
            flattenedNames.add(finalName);
            originalToFlattened.set(file, finalName);
            if (file === openFile) {
                tab = files.length;
            }
            files.push({
                name: finalName,
                contents,
                hidden: project.openFiles.indexOf(file) === -1,
            });
        }
        if (moocContents !== null) {
            let assignment = null;
            let error = null;
            try {
                ({ assignment, error } = parseMooc(
                    rewriteMoocReferences(moocContents, originalToFlattened),
                    files,
                ));
            } catch (e) {
                error = e;
            }
            if (error) {
                globalThis.alert?.('Failed to load _mooc file');
            } else {
                files.push({
                    name: '_mooc',
                    contents: JSON.stringify(assignment),
                    hidden: true,
                });
            }
        }
        let solverId = project.selectedBuiltinConfigId;
        if (solverId === 'org.gecode.gecode') {
            solverId = 'org.minizinc.gecode_presolver';
        } else if (solverId === 'org.chuffed.chuffed') {
            solverId = 'org.minizinc.chuffed';
        }
        return {
            files,
            tab,
            solverId,
            timestamp: Date.now(),
        };
    } else {
        const contents = await response.text();
        return { files: [{ name, contents }], timestamp: Date.now() };
    }
}
