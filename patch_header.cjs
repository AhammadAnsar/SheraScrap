const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!code.includes("import { useNavigate, useLocation } from 'react-router-dom';")) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useNavigate, useLocation } from 'react-router-dom';");
}

const targetScrollToSection = `  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };`;

const replaceScrollToSection = `  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/#' + id);
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };`;

code = code.replace(targetScrollToSection, replaceScrollToSection);

// Fix the "window.scrollTo" in brand logo
code = code.replace(
  "onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}",
  "onClick={() => { if(location.pathname !== '/') { navigate('/'); } else { window.scrollTo({ top: 0, behavior: 'smooth' }); } }}"
);

fs.writeFileSync('src/components/Header.tsx', code);
console.log("Patched Header.tsx for Router compatibility.");
