const fs = require('fs');
let code = fs.readFileSync('src/cms/CMSContext.tsx', 'utf8');

// The original function has "return false;\n  };" at the end.
const startIndex = code.indexOf('const login = (usernameInput: string, passInput: string): boolean => {');
const endIndex = code.indexOf('return false;\n  };', startIndex) + 'return false;\n  };'.length;

if (startIndex !== -1 && endIndex !== -1) {
    const newLogin = `const login = async (usernameInput: string, passInput: string): Promise<boolean> => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    if (!cleanUsername || !cleanPass) return false;

    // Use Firebase Authentication
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanUsername, cleanPass);
      if (userCredential.user) {
        const adminUser: AdminUser = {
          id: userCredential.user.uid,
          username: userCredential.user.email?.split('@')[0] || 'admin',
          password: '',
          name: 'مدير النظام (Admin)',
          email: userCredential.user.email || '',
          role: 'super_admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
          createdAt: '2026-01-01',
          lastLogin: new Date().toISOString().split('T')[0]
        };
        setCurrentUser(adminUser);
        setIsAdminOpen(true);
        return true;
      }
    } catch (e) {
      console.error("Auth failed:", e);
    }
    return false;
  };`;
    
    code = code.substring(0, startIndex) + newLogin + code.substring(endIndex);
    fs.writeFileSync('src/cms/CMSContext.tsx', code);
    console.log("Patched successfully again");
} else {
    console.log("Could not find login function block correctly");
}
