import React, { useState } from 'react';
import { useCMS } from '../cms/CMSContext';
import { whatsappUrl } from '../utils/whatsapp';

export default function QuoteRequest({ lang }: { lang: 'ar' | 'en'; t?: unknown }) {
  const { cmsData } = useCMS();
  const ar = lang === 'ar';
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const message = ar ? `السلام عليكم، أريد تسعير السكراب.\nالنوع: ${material}\nالكمية والموقع: ${quantity}` : `Hello, I would like a scrap quote.\nMaterial: ${material}\nQuantity and location: ${quantity}`;
  return <section id="estimator" className="py-16 px-4 bg-emerald-50">
    <form className="max-w-xl mx-auto space-y-5" onSubmit={e => { e.preventDefault(); window.location.assign(whatsappUrl(cmsData.settings.whatsapp, message)); }}>
      <h2 className="text-2xl font-black">{ar ? 'اطلب تسعيرة عبر واتساب' : 'Request a quote on WhatsApp'}</h2>
      <p>{ar ? 'أخبرنا بالنوع والكمية والموقع. يمكن إرسال الصور داخل واتساب. السعر النهائي بعد الفحص والوزن.' : 'Tell us the material, quantity and location. Attach photos in WhatsApp. Final prices depend on inspection and weight.'}</p>
      <label className="block">{ar ? 'نوع السكراب' : 'Scrap material'}<input required maxLength={200} value={material} onChange={e => setMaterial(e.target.value)} className="block w-full p-3 rounded border" /></label>
      <label className="block">{ar ? 'الكمية والموقع' : 'Quantity and location'}<input required maxLength={500} value={quantity} onChange={e => setQuantity(e.target.value)} className="block w-full p-3 rounded border" /></label>
      <button className="bg-emerald-700 text-white rounded-xl px-6 py-3 font-bold">{ar ? 'متابعة إلى واتساب' : 'Continue to WhatsApp'}</button>
      <p className="text-sm">{ar ? 'اضغط إرسال داخل واتساب لإرسال الطلب.' : 'Press Send in WhatsApp to send your request.'}</p>
    </form>
  </section>;
}
