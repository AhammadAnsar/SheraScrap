const fs = require('fs');

const files = [
  'node_modules/formdata-polyfill/formdata.min.js',
  'node_modules/formdata-polyfill/FormData.js'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let code = fs.readFileSync(file, 'utf8');

    // In formdata.min.js:
    // Replace T&&(Q.fetch=... or T&&(Q.fetch=Q.fetch||... with a try-catch block
    code = code.replace(
      /T&&\([a-zA-Z0-9_.]*fetch\s*=\s*(?:[a-zA-Z0-9_.]*fetch\s*\|\|\s*)?function\(([^)]*)\)\{([^}]*\})\)\;/g,
      'T&&(function(){try{Q.fetch=function($1){$2}catch(e){}})();'
    );
    code = code.replace(
      /T&&\(Q\.fetch\s*=\s*(?:Q\.fetch\s*\|\|\s*)?function\(([^)]*)\)\{([^}]*\})\)\;/g,
      'T&&(function(){try{Q.fetch=function($1){$2}catch(e){}})();'
    );

    // In FormData.js:
    // Wrap global.fetch = function in try-catch
    code = code.replace(
      /if \(_fetch\) \{\s*global\.fetch = function/g,
      'if (_fetch) {\n    try {\n      global.fetch = function'
    );
    if (code.includes('try {\n      global.fetch = function') && !code.includes('} catch (e) {} // fetch-patch')) {
      code = code.replace(
        /return _fetch\.call\(this, input, init\)\s*\}\s*\}/g,
        'return _fetch.call(this, input, init)\n    }\n    } catch (e) {} // fetch-patch\n  }'
      );
    }

    fs.writeFileSync(file, code);
  }
}

console.log("Patched formdata-polyfill successfully");
