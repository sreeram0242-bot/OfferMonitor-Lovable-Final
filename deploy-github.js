import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const distPath = '.output/public';

console.log('Building project for GitHub Pages...');

const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
const originalViteConfig = fs.readFileSync(viteConfigPath, 'utf-8');

try {
    // Inject the base path for GitHub Pages
    const newConfig = originalViteConfig.replace('vite: {}', `vite: { base: '/OfferMonitor-Lovable-Final/' }`);
    fs.writeFileSync(viteConfigPath, newConfig);

    // Run the build
    execSync('npm run build', { stdio: 'inherit' });
} catch (error) {
    console.error('Build failed!', error);
    process.exit(1);
} finally {
    // Restore original config so Lovable stays happy!
    fs.writeFileSync(viteConfigPath, originalViteConfig);
}

if (!fs.existsSync(distPath)) {
    console.error(`Error: Build directory ${distPath} does not exist even after build.`);
    process.exit(1);
}

fs.writeFileSync(path.join(distPath, '.nojekyll'), '');

console.log('Deploying to GitHub Pages...');

try {
    // Initialize git in the build folder and push it directly to the gh-pages branch
    execSync('git init', { cwd: distPath, stdio: 'inherit' });
    execSync('git add .', { cwd: distPath, stdio: 'inherit' });
    
    try {
        execSync('git commit -m "Deploy to GitHub Pages"', { cwd: distPath, stdio: 'inherit' });
    } catch (e) {
        // Ignore error if nothing to commit
    }
    
    // Copy the root .git/config to the output .git/config so we inherit credentials and don't hang!
    try {
        fs.copyFileSync('.git/config', path.join(distPath, '.git/config'));
    } catch (e) {
        console.error("Failed to copy git config, push might hang.");
    }
    
    execSync('git push -f origin master:gh-pages', { cwd: distPath, stdio: 'inherit' });
    
    console.log('\\n✅ Successfully deployed to GitHub Pages! It will be live at https://sreeram0242-bot.github.io/OfferMonitor-Lovable-Final/ in a minute.');
} catch (error) {
    console.error('\\n❌ Deployment failed. Please ensure you are logged into GitHub.');
}
