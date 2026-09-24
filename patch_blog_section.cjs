const fs = require('fs');
let code = fs.readFileSync('src/components/BlogSection.tsx', 'utf8');

code = code.replace(
  "import { useNavigate } from 'react-router-dom';",
  "import { useNavigate, Link } from 'react-router-dom';"
);

// We need to replace the read more button or wrapper with a Link.
// The current code might use a button with navigate
code = code.replace(
  /onClick=\{\(\) => navigate\(\`\/article\/\$\{post.id\}\`\)\}/g,
  "" // we'll use a Link inside or around instead if we can, wait, let's just use the router navigate properly for now to avoid breaking JSX structure.
);

fs.writeFileSync('src/components/BlogSection.tsx', code);
console.log("Patched BlogSection.tsx");
