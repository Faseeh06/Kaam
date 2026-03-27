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
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

['app/dashboard', 'app/admin', 'app/super'].forEach(d => {
    const files = walk(path.join(process.cwd(), d));
    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content.replace(/text-white dark:text-zinc-([^\s\"]*)/g, 'text-zinc-900 dark:text-zinc-$1');
        if (newContent !== content) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log('Updated ' + file);
        }
    });
});
