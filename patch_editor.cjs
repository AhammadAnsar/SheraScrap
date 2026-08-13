const fs = require('fs');
let code = fs.readFileSync('src/components/admin/RichTextEditor.tsx', 'utf8');

if (!code.includes("const [mounted, setMounted] = React.useState(false);")) {
  const targetReturn = '  return (\n    <div className=';
  const replaceReturn = `  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[250px] bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500">Loading editor...</div>;
  }

  return (
    <div className=`;
  code = code.replace(targetReturn, replaceReturn);
  fs.writeFileSync('src/components/admin/RichTextEditor.tsx', code);
  console.log("Patched RichTextEditor.tsx to delay rendering.");
}
