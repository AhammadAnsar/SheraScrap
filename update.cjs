const fs = require('fs');

// 1. UPDATE AdminLoginModal.tsx
let modalContent = fs.readFileSync('src/components/admin/AdminLoginModal.tsx', 'utf8');
const modalTarget = `  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (lockoutTimer > 0) {
      return;
    }

    // Security captcha validation
    if (captchaInput.trim() !== captchaCode) {
      setErrorMsg(
        isRtl 
          ? 'رمز التحقق الأمني المكتوب غير صحيح. يرجى إعادة المحاولة' 
          : 'Security verification code is invalid. Please try again.'
      );
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(username, password);

      if (success) {
        setFailedAttempts(0);
        setErrorMsg('');
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        generateCaptcha();
        
        if (newAttempts >= 5) {
          setLockoutTimer(60); // 60 seconds lockout
          setErrorMsg(
            isRtl 
              ? 'تم حظر النظام مؤقتاً لمدة 60 ثانية بسبب تجاوز المحاولات الفاشلة' 
              : 'System temporarily locked for 60s due to multiple failed attempts'
          );
        } else {
          setErrorMsg(
            isRtl 
              ? \`بيانات الدخول غير صحيحة. المحاولة (\${newAttempts}/5) المتبقية\` 
              : \`Authentication failed. Invalid credentials (\${newAttempts}/5 attempts)\`
          );
        }
      }
      setIsSubmitting(false);
    }, 400);
  };`;

const modalReplace = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (lockoutTimer > 0) {
      return;
    }

    // Security captcha validation
    if (captchaInput.trim() !== captchaCode) {
      setErrorMsg(
        isRtl 
          ? 'رمز التحقق الأمني المكتوب غير صحيح. يرجى إعادة المحاولة' 
          : 'Security verification code is invalid. Please try again.'
      );
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(username, password);

      if (success) {
        setFailedAttempts(0);
        setErrorMsg('');
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        generateCaptcha();
        
        if (newAttempts >= 5) {
          setLockoutTimer(60); // 60 seconds lockout
          setErrorMsg(
            isRtl 
              ? 'تم حظر النظام مؤقتاً لمدة 60 ثانية بسبب تجاوز المحاولات الفاشلة' 
              : 'System temporarily locked for 60s due to multiple failed attempts'
          );
        } else {
          setErrorMsg(
            isRtl 
              ? \`بيانات الدخول غير صحيحة. المحاولة (\${newAttempts}/5) المتبقية\` 
              : \`Authentication failed. Invalid credentials (\${newAttempts}/5 attempts)\`
          );
        }
      }
    } catch (err) {
      setErrorMsg(isRtl ? 'حدث خطأ أثناء تسجيل الدخول' : 'An error occurred during login');
      generateCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };`;

if (modalContent.includes(modalTarget)) {
    modalContent = modalContent.replace(modalTarget, modalReplace);
    fs.writeFileSync('src/components/admin/AdminLoginModal.tsx', modalContent);
    console.log("Success modal replace");
} else {
    console.log("Modal Target not found!");
}

// 2. UPDATE CMSContext.tsx
let cmsContent = fs.readFileSync('src/cms/CMSContext.tsx', 'utf8');

const intfTarget = `login: (username: string, pass: string) => boolean;`;
const intfReplace = `login: (username: string, pass: string) => Promise<boolean>;`;
cmsContent = cmsContent.replace(intfTarget, intfReplace);

if (!cmsContent.includes('signInWithEmailAndPassword')) {
  cmsContent = cmsContent.replace("import { db } from '../lib/firebase';", "import { db, auth } from '../lib/firebase';\nimport { signInWithEmailAndPassword } from 'firebase/auth';");
}

const loginTarget = `  const login = (usernameInput: string, passInput: string): boolean => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    if (!cleanUsername || !cleanPass) return false;

    // Direct super admin override for quick access
    if (cleanUsername === 'admin' || cleanUsername === 'admin@shera-scrap.com') {
      const allowedAdminPasswords = [
        'Shera#SuperAdmin$2026!',
        'admin',
        'admin123',
        '123456',
        'shera123'
      ];
      const foundAdmin = cmsData.users.find(u => u.username.toLowerCase() === 'admin' || u.email.toLowerCase() === cleanUsername);
      if (allowedAdminPasswords.includes(cleanPass) || (foundAdmin && foundAdmin.password === cleanPass)) {
        const adminUser: AdminUser = foundAdmin || {
          id: 'usr-admin-1',
          username: 'admin',
          password: 'Shera#SuperAdmin$2026!',
          name: 'مدير النظام الرئيسي (Admin)',
          email: 'admin@shera-scrap.com',
          role: 'super_admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
          createdAt: '2026-01-01',
          lastLogin: new Date().toISOString().split('T')[0]
        };
        setCurrentUser(adminUser);
        setIsAdminOpen(true);
        return true;
      }
    }

    // Direct content editor override
    if (cleanUsername === 'editor' || cleanUsername === 'editor@shera-scrap.com') {
      const allowedEditorPasswords = [
        'Shera#ContentEditor$2026!',
        'editor',
        'editor123',
        '123456'
      ];
      const foundEditor = cmsData.users.find(u => u.username.toLowerCase() === 'editor' || u.email.toLowerCase() === cleanUsername);
      if (allowedEditorPasswords.includes(cleanPass) || (foundEditor && foundEditor.password === cleanPass)) {
        const editorUser: AdminUser = foundEditor || {
          id: 'usr-editor-1',
          username: 'editor',
          password: 'Shera#ContentEditor$2026!',
          name: 'محرر المحتوى (Editor)',
          email: 'editor@shera-scrap.com',
          role: 'editor',
          avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80',
          createdAt: '2026-01-01',
          lastLogin: new Date().toISOString().split('T')[0]
        };
        setCurrentUser(editorUser);
        setIsAdminOpen(true);
        return true;
      }
    }

    // Dynamic users check
    const user = cmsData.users.find(u => 
      (u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername) && 
      u.password === cleanPass
    );

    if (user) {
      setCurrentUser(user);
      setIsAdminOpen(true);
      return true;
    }

    return false;
  };`;

const loginReplace = `  const login = async (usernameInput: string, passInput: string): Promise<boolean> => {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPass = passInput.trim();

    if (!cleanUsername || !cleanPass) return false;

    // Firebase Authentication for actual security
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanUsername, cleanPass);
      if (userCredential.user) {
        // Construct basic admin profile from token/email
        const adminUser: AdminUser = {
          id: userCredential.user.uid,
          username: userCredential.user.email?.split('@')[0] || 'admin',
          password: '', // Never store passwords in memory now
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
    } catch (error) {
      console.error('Firebase Auth Error:', error);
    }
    
    return false;
  };`;

if (cmsContent.includes(loginTarget)) {
    cmsContent = cmsContent.replace(loginTarget, loginReplace);
    fs.writeFileSync('src/cms/CMSContext.tsx', cmsContent);
    console.log("Success cms replace");
} else {
    console.log("CMS Target not found!");
}
