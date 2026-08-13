import React, { useState } from 'react';
import { Phone, MapPin, Mail, Clock, Send, MessageSquare, ExternalLink, Share2 } from 'lucide-react';
import { LanguagePack } from '../types';
import { useCMS } from '../cms/CMSContext';

interface ContactFormProps {
  lang: 'ar' | 'en';
  t: LanguagePack;
}

export default function ContactForm({ lang, t }: ContactFormProps) {
  const { addInquiry, cmsData } = useCMS();
  const isRtl = lang === 'ar';
  const settings = cmsData.settings;
  
  // Form states
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Save to CMS Inquiries
    addInquiry({
      name,
      phone,
      location: isRtl ? settings.locationAr : settings.locationEn,
      materialType: isRtl ? 'طلب تسعيرة سكراب' : 'Scrap Quote Request',
      notes: details
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto-trigger WhatsApp redirect
      const categoryText = encodeURIComponent(
        isRtl 
          ? `مرحباً شيرا للسكراب، الاسم: ${name}، رقم الجوال: ${phone}، تفاصيل السكراب: ${details}` 
          : `Hello Shera Scrap Haraj, Name: ${name}, Phone: ${phone}, Scrap: ${details}`
      );
      
      setTimeout(() => {
        window.open(`https://wa.me/${settings.whatsapp}?text=${categoryText}`, '_blank');
      }, 1500);

    }, 800);
  };

  const mapEmbedUrl = settings.googleMapEmbedUrl || "https://maps.google.com/maps?q=King%20Khaled%20St,%20Al%20Athir,%20Dammam%2032248,%20Saudi%20Arabia&t=&z=15&ie=UTF8&iwloc=&output=embed";

  return (
    <section className="py-16 md:py-24 bg-slate-50/60 border-b border-slate-100" id="contact">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-emerald-100">
            {isRtl ? "تواصل معنا مباشرة" : "Reach Our Team"}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            {t.contactTitle}
          </h2>
          <p className="text-slate-600 mt-3 text-sm md:text-base leading-relaxed">
            {t.contactSubtitle}
          </p>
        </div>

        {/* EQUAL HEIGHT SIDE-BY-SIDE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* CARD 1: Office & Workshop Contact */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>{isRtl ? "تفاصيل الاتصال والمقر" : "Office & Workshop Contact"}</span>
                </h3>
                <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {isRtl ? "رد فوري" : "Instant Support"}
                </span>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                
                {/* Detail 1: Address */}
                <div className="flex items-start gap-3 sm:col-span-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">{isRtl ? "الموقع الجغرافي والمستودع" : "Workshop Address"}</h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 leading-relaxed">
                      {isRtl ? settings.locationAr : settings.locationEn}
                    </p>
                  </div>
                </div>

                {/* Detail 2: Phone */}
                <div className="flex items-start gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">{isRtl ? "رقم الاتصال المباشر" : "Direct Hotline"}</h4>
                    <a href={`tel:${settings.phone}`} className="text-xs sm:text-sm font-black text-emerald-700 hover:underline mt-0.5 block truncate">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                {/* Detail 3: Email */}
                <div className="flex items-start gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">{isRtl ? "البريد الإلكتروني" : "Email Address"}</h4>
                    <a href={`mailto:${settings.email}`} className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block truncate hover:text-emerald-700">
                      {settings.email}
                    </a>
                  </div>
                </div>

                {/* Detail 4: Hours */}
                <div className="flex items-start gap-3 sm:col-span-2 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] text-slate-400 font-extrabold uppercase tracking-wider">{isRtl ? "ساعات العمل الرسمية" : "Service Availability"}</h4>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                      {isRtl ? settings.workingHoursAr : settings.workingHoursEn}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Social Media Connections Block */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-600" />
                  <span>{isRtl ? "تواصل معنا عبر شبكات التواصل الاجتماعية" : "Follow & Connect via Social Media"}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Facebook */}
                {settings.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 border border-blue-100 group"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="truncate">Facebook</span>
                  </a>
                )}

                {/* YouTube */}
                {settings.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 border border-red-100 group"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span className="truncate">YouTube</span>
                  </a>
                )}

                {/* Instagram */}
                {settings.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-700 hover:bg-pink-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 border border-pink-100 group"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span className="truncate">Instagram</span>
                  </a>
                )}

                {/* TikTok */}
                {settings.tiktokUrl && (
                  <a
                    href={settings.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-slate-100 hover:bg-slate-800 rounded-xl text-xs font-bold transition-all duration-200 border border-slate-800 group"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0 text-teal-400" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.28-2.26.46-4.59 1.99-6.32 1.53-1.73 3.78-2.67 6.07-2.58v4.19c-.93-.08-1.88.19-2.65.73-.83.56-1.36 1.48-1.43 2.47-.11 1.25.43 2.5 1.42 3.17.93.65 2.19.78 3.23.35 1.05-.41 1.84-1.37 2.02-2.48.08-1.16.03-2.33.03-3.49V.02z"/>
                    </svg>
                    <span className="truncate">TikTok</span>
                  </a>
                )}

                {/* WhatsApp Direct */}
                <a
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 border border-emerald-100 group"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* CARD 2: Schedule Free Truck Pickup & Quote */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            {isSuccess ? (
              <div className="text-center py-12 px-4 space-y-4 my-auto">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {isRtl ? "تم إرسال طلب التقييم بنجاح!" : "Quotation Request Sent!"}
                </h3>
                <p className="text-slate-600 font-medium text-xs md:text-sm max-w-md mx-auto">
                  {t.formSuccess}
                </p>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-800 text-xs font-semibold max-w-sm mx-auto">
                  {isRtl 
                    ? "الآن سنقوم بتحويلك تلقائياً إلى واتساب لتأكيد الصور وترتيب سيارة النقل المجانية..." 
                    : "Redirecting you to WhatsApp to confirm details with our dispatcher..."}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                    <h3 className="text-lg md:text-xl font-black text-slate-900">
                      {isRtl ? "طلب سيارة نقل مجانية وتسعير فوري" : "Schedule Free Truck Pickup & Quote"}
                    </h3>
                    <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                      {isRtl ? "نقل مجاني 🚛" : "Free Truck Pickup"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">{t.formName}</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isRtl ? "اكتب اسمك الكامل هنا" : "e.g., Mohammed Al-Qahtani"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">{t.formPhone}</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., 05XXXXXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>

                    {/* Scrap Details */}
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-700 block">{t.formDetails}</label>
                      <textarea
                        required
                        rows={3}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder={isRtl ? "حدد أنواع سكراب المتوفرة لديك (مثال: ٣ مكيفات سبليت تالفة بالدمام ونحاس)" : "Describe your scrap items, quantity, condition and your general location in Dammam area"}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 text-white font-extrabold py-3.5 rounded-xl hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed transition-all text-xs sm:text-sm shadow-md shadow-emerald-600/10 cursor-pointer"
                  id="contact-form-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t.formSubmitting}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.formSubmit}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* FULL PAGE WIDTH SMART GOOGLE MAP SECTION BELOW BOTH CARDS */}
        <div className="mt-10 md:mt-14 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <h3 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>{isRtl ? "خريطة موقع المستودع والمقر الرئيسي (Full Page View)" : "Main Warehouse Google Map Location"}</span>
            </h3>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.locationEn)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all self-start sm:self-auto"
            >
              <span>{isRtl ? "فتح في تطبيق خرائط Google" : "Open in Google Maps App"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl h-80 sm:h-96 md:h-[440px] relative bg-slate-900 group">
            <iframe 
              src={mapEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Shera Scrap Haraj Location Map"
              id="dammam-google-map"
              className="w-full h-full"
            />

            {/* Smart Floating Overlay Info Badge */}
            <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-md bg-slate-950/90 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                📍
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                  {isRtl ? "مؤسسة شيرا لشراء السكراب والمعدات" : "Shera Scrap Main Hub"}
                </h4>
                <p className="text-xs text-slate-200 font-bold mt-0.5 truncate">
                  {isRtl ? settings.locationAr : settings.locationEn}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
