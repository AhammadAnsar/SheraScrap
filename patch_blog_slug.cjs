const fs = require('fs');
let code = fs.readFileSync('src/components/BlogSection.tsx', 'utf8');

code = code.replace(
  "to={`/article/${post.id}`}",
  "to={`/blog/${post.slug || post.id}`}"
);

fs.writeFileSync('src/components/BlogSection.tsx', code);
console.log("Patched BlogSection slug");
