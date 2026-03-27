const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

['app', 'components'].forEach(d => {
    const files = walk(path.join(process.cwd(), d));
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;

        // Fix 1: Hardcoded text-white but dark mode wants it white (so light mode needs dark)
        newContent = newContent.replace(/text-white dark:text-white/g, 'text-zinc-900 dark:text-white');
        newContent = newContent.replace(/text-zinc-100 dark:text-white/g, 'text-zinc-900 dark:text-white');

        // Fix 2: text-white that specifies a non-white dark mode
        newContent = newContent.replace(/text-white dark:text-zinc-([^\s\"\'\`\}]*)/g, 'text-zinc-900 dark:text-zinc-$1');

        if (newContent !== content) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Fixed text colors in ' + file.replace(process.cwd(), ''));
        }
    });
});
