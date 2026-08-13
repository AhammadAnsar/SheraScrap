const fs = require('fs');
let code = fs.readFileSync('src/cms/CMSContext.tsx', 'utf8');

const targetStart = "        setCurrentUser(adminUser);\n        setIsAdminOpen(true);\n        return true;\n      }\n    }\n\n    // Direct content editor override";
const targetEnd = "    return false;\n  };";

const startIndex = code.indexOf(targetStart);
if (startIndex !== -1) {
    // find the NEXT instance of '    return false;\n  };' after startIndex
    const endIndex = code.indexOf(targetEnd, startIndex) + targetEnd.length;
    if (endIndex > targetEnd.length) {
        code = code.substring(0, startIndex) + code.substring(endIndex);
        fs.writeFileSync('src/cms/CMSContext.tsx', code);
        console.log("Fixed!");
    } else {
        console.log("Could not find targetEnd");
    }
} else {
    console.log("Could not find targetStart");
}
