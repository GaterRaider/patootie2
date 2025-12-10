
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../client/public/images');

async function optimizeImages() {
    console.log('Starting image optimization...');

    // 1. patootie-portrait.webp
    // Original is ~1142x1143
    // Strategies:
    // - 800w for desktop/retina
    // - 400w for mobile
    // Maintain aspect ratio to preserve cropping
    const portraitPath = path.join(PUBLIC_DIR, 'patootie-portrait.webp');
    if (fs.existsSync(portraitPath)) {
        console.log('Optimizing patootie-portrait.webp...');

        // 800px width
        await sharp(portraitPath)
            .resize(800)
            .webp({ quality: 80 })
            .toFile(path.join(PUBLIC_DIR, 'patootie-portrait-800.webp'));

        // 400px width
        await sharp(portraitPath)
            .resize(400)
            .webp({ quality: 80 })
            .toFile(path.join(PUBLIC_DIR, 'patootie-portrait-400.webp'));

        console.log('✓ Created 800w and 400w versions of portrait');
    } else {
        console.warn('⚠ patootie-portrait.webp not found');
    }

    // 2. HandokHelperLogoOnly.webp
    // Original is ~249x253
    // Strategies:
    // - 128w for larger display
    // - 64w for small icon
    const logoPath = path.join(PUBLIC_DIR, 'HandokHelperLogoOnly.webp');
    if (fs.existsSync(logoPath)) {
        console.log('Optimizing HandokHelperLogoOnly.webp...');

        // 128px width
        await sharp(logoPath)
            .resize(128)
            .webp({ quality: 85 }) // Slightly higher quality for logo (text/lines)
            .toFile(path.join(PUBLIC_DIR, 'HandokHelperLogoOnly-128.webp'));

        // 64px width
        await sharp(logoPath)
            .resize(64)
            .webp({ quality: 85 })
            .toFile(path.join(PUBLIC_DIR, 'HandokHelperLogoOnly-64.webp'));

        console.log('✓ Created 128w and 64w versions of logo');
    } else {
        console.warn('⚠ HandokHelperLogoOnly.webp not found');
    }
}

optimizeImages().catch(err => {
    console.error('Error optimizing images:', err);
    process.exit(1);
});
