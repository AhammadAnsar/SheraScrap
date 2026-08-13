const fs = require('fs');
let content = fs.readFileSync('src/components/admin/AdminLoginModal.tsx', 'utf8');

const target = `  const handleSubmit = (e: React.FormEvent) => {
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

const replacement = `  const handleSubmit = async (e: React.FormEvent) => {
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

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/components/admin/AdminLoginModal.tsx', content);
    console.log("Success");
} else {
    console.log("Target not found!");
}
