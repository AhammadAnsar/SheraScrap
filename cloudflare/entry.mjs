export function chooseLanguage(request) {
 const ua=request.headers.get('user-agent')||'';
 if(/bot|crawl|spider|slurp|google-extended|perplexity/i.test(ua))return 'ar';
 const preference=request.headers.get('cookie')?.match(/(?:^|;\s*)shera_lang=(ar|en)(?:;|$)/)?.[1];
 if(preference)return preference;
 const country=request.cf?.country;
 return !country||['SA','AE','BH','KW','QA','OM'].includes(country)?'ar':'en';
}
export default {async fetch(request,env) {
 const url=new URL(request.url);
 if(url.pathname==='/')return new Response(null,{status:302,headers:{Location:`/${chooseLanguage(request)}/`,'Cache-Control':'private, no-store',Vary:'Cookie','X-Content-Type-Options':'nosniff'}});
 return env.ASSETS.fetch(request);
}};
