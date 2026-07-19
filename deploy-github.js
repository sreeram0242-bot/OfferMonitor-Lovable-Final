import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const distPath = '.output/public';

if (!fs.existsSync(distPath)) {
    console.error(`Error: Build directory ${distPath} does not exist. Please run npm run build first.`);
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
    
    execSync('git push -f https://github.com/sreeram0242-bot/OfferMonitor-Lovable-Final.git master:gh-pages', { cwd: distPath, stdio: 'inherit' });
    
    console.log('\\n✅ Successfully deployed to GitHub Pages! It will be live at https://sreeram0242-bot.github.io/OfferMonitor-Lovable-Final/ in a minute.');
} catch (error) {
    console.error('\\n❌ Deployment failed. Please ensure you are logged into GitHub.');
}
