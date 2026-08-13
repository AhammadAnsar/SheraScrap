const fs = require('fs');
let code = fs.readFileSync('src/cms/CMSContext.tsx', 'utf8');

const target1 = `          setCmsData(mergedData);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData));
          } catch (e) {}`;

const replace1 = `          setCmsData(prev => {
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(mergedData);
            if (prevStr === newStr) {
              return prev; // Break the infinite loop
            }
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, newStr);
            } catch (e) {}
            return mergedData;
          });`;

code = code.replace(target1, replace1);

const target2 = `            setCmsData(mergedData);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mergedData));
            } catch (e) {}`;

code = code.replace(target2, replace1);

fs.writeFileSync('src/cms/CMSContext.tsx', code);
console.log("Patched CMS loop.");
