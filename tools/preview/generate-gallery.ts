import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { glob } from 'glob';

const WORKSPACE_ROOT = process.cwd();
const ASSETS_PATH = path.join(WORKSPACE_ROOT, 'src/assets/generated');
const GALLERY_PATH = path.join(WORKSPACE_ROOT, 'gallery.html');

async function generateGallery() {
    console.log(chalk.blue('🖼️  Generating Asset Gallery...'));

    if (!await fs.pathExists(ASSETS_PATH)) {
        console.error(chalk.red('❌ No generated assets found. Run compile:content first.'));
        return;
    }

    const files = await glob('**/*.*', { cwd: ASSETS_PATH });
    
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Asset Gallery</title>
        <style>
            body { font-family: monospace; background: #1a1a1a; color: #fff; padding: 20px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
            .card { background: #2a2a2a; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #333; }
            .card img { width: 64px; height: 64px; image-rendering: pixelated; border: 1px solid #444; background: #000; }
            .card pre { text-align: left; font-size: 10px; background: #111; padding: 5px; overflow: auto; max-height: 100px; }
            h1 { border-bottom: 1px solid #444; padding-bottom: 10px; }
            .type-tag { font-size: 0.8em; color: #888; text-transform: uppercase; margin-bottom: 5px; display: block; }
        </style>
    </head>
    <body>
        <h1>Generated Content Gallery</h1>
        <div class="grid">
    `;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        const name = path.basename(file, ext);
        const fullPath = path.join(ASSETS_PATH, file);

        html += `<div class="card">`;
        html += `<span class="type-tag">${ext.replace('.', '')}</span>`;
        html += `<h3>${name}</h3>`;

        if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
            // Embed image as base64 to allow opening HTML directly without local server issues
            const bitmap = await fs.readFile(fullPath);
            const base64 = Buffer.from(bitmap).toString('base64');
            html += `<img src="data:image/${ext.replace('.', '')};base64,${base64}" />`;
        } else if (['.txt', '.json', '.md', '.obj'].includes(ext)) {
            const content = await fs.readFile(fullPath, 'utf-8');
            html += `<pre>${content}</pre>`;
        }

        html += `</div>`;
    }

    html += `
        </div>
    </body>
    </html>
    `;

    await fs.writeFile(GALLERY_PATH, html);
    console.log(chalk.green(`✅ Gallery generated at: ${GALLERY_PATH}`));
}

generateGallery().catch(console.error);
