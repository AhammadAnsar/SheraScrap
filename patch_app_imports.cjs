const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { BrowserRouter')) {
  code = code.replace(
    "import { CMSProvider, useCMS } from './cms/CMSContext';",
    "import { CMSProvider, useCMS } from './cms/CMSContext';\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';\nimport BlogPostPage from './components/BlogPostPage';"
  );
  fs.writeFileSync('src/App.tsx', code);
  console.log("Imports added to App.tsx");
}
