/* خدای جهان کوچک — شبیه‌ساز زندگی، ژنتیک و تکامل | بدون وابستگی */
'use strict';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a);
const randi=(a,b)=>Math.floor(rand(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const FA_D='۰۱۲۳۴۵۶۷۸۹';
const fa=n=>String(n==null?'':n).replace(/[0-9]/g,d=>FA_D[d]).replace('.', '٫');
const fa1=n=>fa(Math.round(n*10)/10);
const fmtInt=n=>fa(Math.round(n).toLocaleString('en-US').replace(/,/g,'٬'));

/* ---------------- داده‌ها ---------------- */
const GENE_LABELS={speed:'سرعت',vision:'بینایی',size:'جثه',aggression:'پرخاشگری',metabolism:'متابولیسم کند',fertility:'باروری',cooperation:'همکاری',coldRes:'مقاومت سرما',heatRes:'مقاومت گرما',lifespan:'طول عمر',efficiency:'چابکی',immunity:'ایمنی',coat:'رنگ پوشش',mask:'پوشش تیره'};
/* قوانین ژنتیک: mode مندلی (۱ جایگاه) یا چندژنی (۳ جایگاه)؛ dominant=true یعنی آلل A غالب است.
   effect = شدت اثر فنوتیپی (۰٫۳ تا ۱)؛ mutRate = نرخ جهش هر آلل در هر تولد. */
function defaultRules(){
  const r={};
  Object.keys(GENE_LABELS).forEach(k=>{ r[k]={dominant:true,effect:0.8,mutRate:0.02,mode:'mendelian',loci:1}; });
  r.speed.mode='polygenic'; r.speed.loci=3;
  r.vision.mode='polygenic'; r.vision.loci=3;
  r.size.mode='polygenic'; r.size.loci=3;
  r.mask.effect=1; r.coat.effect=0.7;
  return r;
}
let GEN_RULES=defaultRules();
const POLYGENIC=new Set(['speed','vision','size']);
/* فنوتیپ از ژنوتیپ: ژنوتیپ = آرایه جایگاه‌ها، هر جایگاه [آلل۱، آلل۲] با ۱=A و ۰=a */
function phenotypeFor(key,gt){
  const rule=GEN_RULES[key], eff=rule.effect;
  const hi=0.28+0.67*eff, lo=0.30-0.22*eff; // مقدار فنوتیپ بالا / پایین
  if(rule.mode==='polygenic'){
    let dom=0,tot=0; for(const loc of gt){ for(const al of loc){ tot++; if(al===1) dom++; } }
    return clamp(0.14+0.76*(dom/tot)+ (gt._env||0),0.05,1);
  }
  const [a,b]=gt[0], domCount=a+b;
  const high=rule.dominant? domCount>=1 : domCount===0;
  return high? hi : lo;
}
function genotypeString(key,gt){
  if(GEN_RULES[key].mode==='polygenic'){
    let dom=0,tot=0; for(const loc of gt){ for(const al of loc){ tot++; if(al===1) dom++; } }
    return dom+'/'+tot+'A';
  }
  const [a,b]=gt[0];
  return (a?'A':'a')+(b?'A':'a');
}
function randomGenotype(key,p=0.5){
  const rule=GEN_RULES[key], gt=[];
  for(let i=0;i<rule.loci;i++) gt.push([Math.random()<p?1:0, Math.random()<p?1:0]);
  gt._env=rand(-0.04,0.04); // اثر محیطی کوچک برای چندژنی‌ها
  return gt;
}
function alleleFreq(key){ // p = فرکانس آلل A در کل جمعیت
  let a=0,tot=0; for(const ag of S.agents){ for(const loc of ag.genotype[key]){ for(const al of loc){ tot++; if(al===1) a++; } } }
  return tot? a/tot : 0.5;
}
function genotypeCounts(key){ // شمارش مشاهده‌شده AA/Aa/aa (برای چندژنی: جایگاه اول)
  let AA=0,Aa=0,aa=0;
  for(const ag of S.agents){ const [x,y]=ag.genotype[key][0]; if(x+y===2)AA++; else if(x+y===1)Aa++; else aa++; }
  return {AA,Aa,aa,n:AA+Aa+aa};
}
function hardyWeinberg(key){
  const p=alleleFreq(key), q=1-p, c=genotypeCounts(key), n=c.n||1;
  const exp={AA:p*p*n, Aa:2*p*q*n, aa:q*q*n};
  let chi=0; for(const k of ['AA','Aa','aa']) chi+=Math.pow(c[k]-exp[k],2)/Math.max(1,exp[k]);
  return {p,q,obs:c,exp,chi,deviation:chi/n};
}
function punnettFor(a,b,key){
  // هر والد با احتمال ۵۰٪ یکی از دو آلل جایگاه اول را می‌دهد → ۴ ترکیب
  const res={AA:0,Aa:0,aa:0};
  const ga=a.genotype[key][0], gb=b.genotype[key][0];
  for(const x of ga) for(const y of gb){ const s=x+y; if(s===2)res.AA++; else if(s===1)res.Aa++; else res.aa++; }
  return {AA:res.AA*25,Aa:res.Aa*25,aa:res.aa*25};
}
function phenotypeProb(a,b,key){ // احتمال فنوتیپ بالا در فرزند
  const pu=punnettFor(a,b,key), rule=GEN_RULES[key];
  if(rule.mode==='polygenic'){ // میانگین آلل‌های غالب والدین
    const pa=alleleFreqOf(a,key), pb=alleleFreqOf(b,key); return Math.round(((pa+pb)/2)*100);
  }
  return rule.dominant? pu.AA+pu.Aa : pu.aa;
}
function alleleFreqOf(a,key){ let d=0,t=0; for(const loc of a.genotype[key]) for(const al of loc){t++; if(al===1)d++;} return t?d/t:0; }
function inbreedingCoeff(a,b){
  if(!a||!b||!a.parents||!b.parents) return 0;
  const ancA=new Set(a.ancestors||[]), ancB=new Set(b.ancestors||[]);
  let shared=0; for(const id of ancA) if(ancB.has(id)) shared++;
  if(a.parents.some(p=>b.parents.includes(p))){
    const both=a.parents.filter(p=>b.parents.includes(p)).length;
    return both===2?0.25:0.125; // خواهر و برادر کامل / ناتنی
  }
  if(shared===0) return 0;
  return clamp(shared*0.0625,0,0.25); // اشتراک در پدربزرگ/مادربزرگ
}
const TRAITS=[
 {id:'speed',icon:'💨',name:'سرعت بالا',gene:'speed',desc:'دو برابر سریع‌تر به غذا می‌رسد، ولی انرژی بیشتری می‌سوزاند.'},
 {id:'vision',icon:'🦅',name:'بینایی عقابی',gene:'vision',desc:'غذا را از خیلی دورتر می‌بیند و کمتر گرسنه می‌ماند.'},
 {id:'slowMetab',icon:'🐢',name:'متابولیسم کند',gene:'metabolism',desc:'آهسته غذا می‌سوزاند؛ در قحطی دیرتر می‌میرد.'},
 {id:'aggressive',icon:'😡',name:'پرخاشگر',gene:'aggression',desc:'سر غذا می‌جنگد و غذای دیگران را می‌گیرد.'},
 {id:'giant',icon:'🦍',name:'غول‌پیکر',gene:'size',desc:'بزرگ و قوی؛ در دعوا برنده می‌شود ولی بیشتر غذا می‌خواهد.'},
 {id:'fertile',icon:'👶',name:'باروری بالا',gene:'fertility',desc:'سریع‌تر و بیشتر بچه‌دار می‌شود.'},
 {id:'coop',icon:'🤝',name:'همکاری‌گر',gene:'cooperation',desc:'به‌جای جنگیدن غذا را تقسیم می‌کند و کمتر زخمی می‌شود.'},
 {id:'cold',icon:'❄️',name:'مقاوم به سرما',gene:'coldRes',desc:'در سرما انرژی‌اش دیرتر تمام می‌شود.'},
 {id:'heat',icon:'🔥',name:'مقاوم به گرما',gene:'heatRes',desc:'در موج گرما زنده می‌ماند.'},
 {id:'longlife',icon:'⏳',name:'عمر طولانی',gene:'lifespan',desc:'دو برابر بیشتر عمر می‌کند و نسل‌های بیشتری می‌سازد.'},
 {id:'efficient',icon:'🪽',name:'چابک',gene:'efficiency',desc:'با حرکت کمتر، انرژی کمتری می‌سوزاند.'},
 {id:'immune',icon:'🛡️',name:'ایمنی قوی',gene:'immunity',desc:'در برابر طاعون مقاوم است و کمتر بیمار می‌شود.'},
 {id:'darkcoat',icon:'🌑',name:'پوشش تیره',gene:'mask',desc:'اپیستازی: اگر ظاهر شود، بدن تیره می‌شود و رنگ پوشش را می‌پوشاند.'},
 /* --- دسته ۱: حواس (x001–x015) --- */
 {id:'x001',icon:'👂',name:'شنوایی تیز',gene:'vision',desc:'صداهای غذا و خطر را از دور می‌شنود و زودتر واکنش نشان می‌دهد.'},
 {id:'x002',icon:'👃',name:'بویایی قوی',gene:'vision',desc:'بوی غذا را از فاصله‌ی دور حس می‌کند و مستقیم به سمتش می‌رود.'},
 {id:'x003',icon:'👁️',name:'چشم تیزبین',gene:'vision',desc:'ریزترین غذاها را هم از دور تشخیص می‌دهد.'},
 {id:'x004',icon:'🌙',name:'بینایی شبانه',gene:'vision',desc:'در تاریکی شب هم غذا را می‌بیند و شکار می‌کند.'},
 {id:'x005',icon:'🧭',name:'حس جهت‌یابی',gene:'vision',desc:'همیشه می‌داند غذا کجاست و مسیر مستقیم را پیدا می‌کند.'},
 {id:'x006',icon:'⚡',name:'واکنش برق‌آسا',gene:'speed',desc:'به‌محض دیدن غذا مثل برق به سمتش می‌پرد.'},
 {id:'x007',icon:'🦉',name:'گوش‌های جغدی',gene:'vision',desc:'حتی در سکوت هم کوچک‌ترین حرکت را حس می‌کند.'},
 {id:'x008',icon:'🔍',name:'نگاه جست‌وجوگر',gene:'vision',desc:'زمین را وجب‌به‌وجب می‌گردد و غذای پنهان را پیدا می‌کند.'},
 {id:'x009',icon:'🌫️',name:'دید در مه',gene:'vision',desc:'در مه و تاریکی هم دیدش کم نمی‌شود.'},
 {id:'x010',icon:'📡',name:'شنونده‌ی خطر',gene:'vision',desc:'نزدیک‌شدن رقیب را زود حس می‌کند و فرار می‌کند.'},
 {id:'x011',icon:'🧠',name:'حافظه‌ی مکانی',gene:'vision',desc:'جای غذاهای قبلی را به خاطر می‌سپارد و دوباره برمی‌گردد.'},
 {id:'x012',icon:'🎯',name:'تمرکز شکار',gene:'vision',desc:'روی یک هدف قفل می‌کند و تا رسیدن به آن ول نمی‌کند.'},
 {id:'x013',icon:'🦇',name:'حس پژواکی',gene:'vision',desc:'با صدا محیط را می‌سنجد و در تاریکی راهش را پیدا می‌کند.'},
 {id:'x014',icon:'🌡️',name:'حس گرما',gene:'vision',desc:'گرمای بدن دیگران را از دور حس می‌کند.'},
 {id:'x015',icon:'💡',name:'ذهن روشن',gene:'vision',desc:'محیط را سریع‌تر یاد می‌گیرد و غذا را زودتر پیدا می‌کند.'},
 /* --- دسته ۲: بدن و قدرت (x016–x030) --- */
 {id:'x016',icon:'💪',name:'بازوی پولادین',gene:'size',desc:'عضله‌هایش قوی‌اند و در دعوا کمتر کسی حریفش می‌شود.'},
 {id:'x017',icon:'🦍',name:'تنومند',gene:'size',desc:'جثه‌ی بزرگی دارد و رقیب‌ها از او می‌ترسند.'},
 {id:'x018',icon:'🪨',name:'پوست سنگی',gene:'size',desc:'پوست سفتش ضربه‌ها را کم می‌کند.'},
 {id:'x019',icon:'🏋️',name:'قدرت بدنی',gene:'size',desc:'در کشمکش سر غذا معمولاً برنده است.'},
 {id:'x020',icon:'🦏',name:'شاخ‌دار',gene:'size',desc:'با شاخش رقیب را عقب می‌راند و غذایش را می‌گیرد.'},
 {id:'x021',icon:'🐘',name:'سنگین‌وزن',gene:'size',desc:'وزنش زیاد است و کسی نمی‌تواند او را هل بدهد.'},
 {id:'x022',icon:'🌩️',name:'سرعت برق',gene:'speed',desc:'آن‌قدر سریع است که غذا را قبل از همه می‌قاپد.'},
 {id:'x023',icon:'🏃',name:'دونده‌ی استقامت',gene:'speed',desc:'سریع می‌دود و دیر خسته می‌شود.'},
 {id:'x024',icon:'🐆',name:'چابکی یوز',gene:'speed',desc:'شتابش بی‌نظیر است و در یک چشم‌به‌هم‌زدن می‌رسد.'},
 {id:'x025',icon:'🪽',name:'سبک‌بال',gene:'efficiency',desc:'بدنش سبک است و با انرژی کم مسافت زیادی می‌رود.'},
 {id:'x026',icon:'🦘',name:'جهنده',gene:'speed',desc:'با جهش‌های بلند سریع به غذا می‌رسد.'},
 {id:'x027',icon:'🐢',name:'لاک‌پشتی',gene:'size',desc:'لاک سختش او را از ضربه‌ها محافظت می‌کند.'},
 {id:'x028',icon:'💎',name:'بدن الماسی',gene:'size',desc:'بدنش سخت و محکم است و زخم کمتر می‌خورد.'},
 {id:'x029',icon:'🦁',name:'یال‌دار',gene:'size',desc:'یالش او را بزرگ‌تر نشان می‌دهد و رقیب‌ها عقب می‌کشند.'},
 {id:'x030',icon:'👣',name:'قدم‌های بلند',gene:'speed',desc:'با هر قدم مسافت بیشتری می‌رود و زود به غذا می‌رسد.'},
 /* --- دسته ۳: رفتار و هوش (x031–x045) --- */
 {id:'x031',icon:'🧠',name:'هوش بالا',gene:'efficiency',desc:'راه کوتاه‌تر را انتخاب می‌کند و کمتر انرژی هدر می‌دهد.'},
 {id:'x032',icon:'🤔',name:'متفکر',gene:'efficiency',desc:'قبل از حرکت فکر می‌کند و بهترین مسیر را می‌رود.'},
 {id:'x033',icon:'🧩',name:'حل‌کننده‌ی مسئله',gene:'efficiency',desc:'غذاهای دور از دسترس را با راه‌حل پیدا می‌کند.'},
 {id:'x034',icon:'🎭',name:'فریبکار',gene:'aggression',desc:'با فریب رقیب را از غذا دور می‌کند.'},
 {id:'x035',icon:'😤',name:'لجباز',gene:'aggression',desc:'سر غذا هیچ‌وقت عقب نمی‌کشد.'},
 {id:'x036',icon:'😠',name:'تندخو',gene:'aggression',desc:'زود عصبانی می‌شود و سر کوچک‌ترین غذا دعوا می‌کند.'},
 {id:'x037',icon:'🤫',name:'پنهان‌کار',gene:'efficiency',desc:'بی‌سروصدا حرکت می‌کند و غذایش را قایم می‌کند.'},
 {id:'x038',icon:'🦊',name:'روباه‌صفت',gene:'efficiency',desc:'زیرک است و غذا را بدون دعوا به دست می‌آورد.'},
 {id:'x039',icon:'🐺',name:'گرگ‌صفت',gene:'aggression',desc:'درنده و جسور است و از هیچ دعوایی نمی‌ترسد.'},
 {id:'x040',icon:'😌',name:'آرام و صبور',gene:'metabolism',desc:'آرام می‌ماند و انرژی‌اش را برای لحظه‌ی مناسب نگه می‌دارد.'},
 {id:'x041',icon:'⏳',name:'شکارچی صبور',gene:'metabolism',desc:'ساعت‌ها صبر می‌کند تا بهترین لحظه برای شکار برسد.'},
 {id:'x042',icon:'🧘',name:'خونسرد',gene:'metabolism',desc:'در شرایط سخت هم آرام است و انرژی‌اش را هدر نمی‌دهد.'},
 {id:'x043',icon:'🎯',name:'دقیق و متمرکز',gene:'vision',desc:'فقط به هدفش نگاه می‌کند و حواسش پرت نمی‌شود.'},
 {id:'x044',icon:'🔄',name:'یادگیرنده‌ی سریع',gene:'efficiency',desc:'از تجربه‌ها سریع یاد می‌گیرد و اشتباهش را تکرار نمی‌کند.'},
 {id:'x045',icon:'📋',name:'برنامه‌ریز',gene:'efficiency',desc:'حرکت‌هایش را طوری برنامه می‌ریزد که کمترین انرژی را بسوزاند.'},
 /* --- دسته ۴: بقا و مقاومت (x046–x060) --- */
 {id:'x046',icon:'❄️',name:'پوست یخی',gene:'coldRes',desc:'در سرمای کشنده هم بدنش گرم می‌ماند.'},
 {id:'x047',icon:'🧊',name:'خون سرد',gene:'coldRes',desc:'سرما او را کند نمی‌کند و مثل همیشه حرکت می‌کند.'},
 {id:'x048',icon:'🏔️',name:'کوه‌نورد',gene:'coldRes',desc:'به هوای سرد کوهستان عادت کرده و سرما اذیتش نمی‌کند.'},
 {id:'x049',icon:'🔥',name:'پوست آتشین',gene:'heatRes',desc:'گرمای سوزان او را از پا نمی‌اندازد.'},
 {id:'x050',icon:'🌡️',name:'تحمل گرما',gene:'heatRes',desc:'در موج گرما هم خنک می‌ماند و زنده می‌ماند.'},
 {id:'x051',icon:'🏜️',name:'صحرانشین',gene:'heatRes',desc:'به گرمای صحرا عادت کرده و آب کمی می‌خواهد.'},
 {id:'x052',icon:'🛡️',name:'سپر ایمنی',gene:'immunity',desc:'بدنش در برابر بیماری‌ها مثل سپر عمل می‌کند.'},
 {id:'x053',icon:'💉',name:'آنتی‌بادی قوی',gene:'immunity',desc:'طاعون را سریع شکست می‌دهد و دوباره بیمار نمی‌شود.'},
 {id:'x054',icon:'🦠',name:'مقاوم به طاعون',gene:'immunity',desc:'اگر طاعون بگیرد، خیلی زود خوب می‌شود.'},
 {id:'x055',icon:'⏰',name:'عمر دراز',gene:'lifespan',desc:'سال‌ها بیشتر از بقیه عمر می‌کند.'},
 {id:'x056',icon:'🌱',name:'جوان‌ماننده',gene:'lifespan',desc:'دیر پیر می‌شود و مدت زیادی جوان و قوی می‌ماند.'},
 {id:'x057',icon:'🩹',name:'بازیابی سریع',gene:'lifespan',desc:'زخم‌هایش زود خوب می‌شود و عمر طولانی‌تری دارد.'},
 {id:'x058',icon:'🕯️',name:'کندسوز',gene:'metabolism',desc:'انرژی‌اش را قطره‌قطره مصرف می‌کند و در قحطی دوام می‌آورد.'},
 {id:'x059',icon:'🍂',name:'خواب زمستانی',gene:'metabolism',desc:'وقتی غذا نیست، به خواب می‌رود و انرژی‌اش را ذخیره می‌کند.'},
 {id:'x060',icon:'🏋️',name:'تحمل گرسنگی',gene:'metabolism',desc:'گرسنگی را بیشتر از بقیه تحمل می‌کند.'},
 /* --- دسته ۵: اجتماعی و جفت‌یابی (x061–x075) --- */
 {id:'x061',icon:'🤝',name:'دوست‌داشتنی',gene:'cooperation',desc:'همه دوستش دارند و غذا را با او تقسیم می‌کنند.'},
 {id:'x062',icon:'💞',name:'جذاب',gene:'fertility',desc:'جفت‌های زیادی جذبش می‌شوند و بیشتر بچه‌دار می‌شود.'},
 {id:'x063',icon:'👨‍👩‍👧‍👦',name:'خانواده‌دوست',gene:'cooperation',desc:'به خانواده‌اش غذا می‌رساند و از بچه‌ها مراقبت می‌کند.'},
 {id:'x064',icon:'🎤',name:'سخنگوی گروه',gene:'cooperation',desc:'گروه را دور غذا جمع می‌کند و دعوا را کم می‌کند.'},
 {id:'x065',icon:'🕊️',name:'صلح‌طلب',gene:'cooperation',desc:'همیشه دعوا را به آشتی تبدیل می‌کند.'},
 {id:'x066',icon:'🤗',name:'مهربان',gene:'cooperation',desc:'غذایش را با گرسنه‌ها تقسیم می‌کند.'},
 {id:'x067',icon:'💍',name:'وفادار',gene:'fertility',desc:'به یک جفت وفادار می‌ماند و بچه‌هایش سالم‌ترند.'},
 {id:'x068',icon:'🌹',name:'عاشق‌پیشه',gene:'fertility',desc:'در فصل جفت‌گیری فعال‌تر از بقیه است.'},
 {id:'x069',icon:'🎵',name:'آوازخوان',gene:'fertility',desc:'با آوازش جفت‌ها را از دور جذب می‌کند.'},
 {id:'x070',icon:'🦚',name:'پرهای رنگی',gene:'coat',desc:'پرهای رنگی‌اش جفت‌ها را مجذوب می‌کند.'},
 {id:'x071',icon:'✨',name:'درخشان',gene:'coat',desc:'پوشش براقش در چشم جفت‌ها می‌درخشد.'},
 {id:'x072',icon:'🎨',name:'رنگارنگ',gene:'coat',desc:'رنگ‌های شادش او را میان جمع متمایز می‌کند.'},
 {id:'x073',icon:'👑',name:'رهبر گروه',gene:'cooperation',desc:'دیگران دنبالش می‌روند و گروه منظم‌تر غذا پیدا می‌کند.'},
 {id:'x074',icon:'🛡️',name:'محافظ گروه',gene:'cooperation',desc:'از ضعیف‌ترها مراقبت می‌کند و گروه را نگه می‌دارد.'},
 {id:'x075',icon:'🐾',name:'وفادار به گله',gene:'cooperation',desc:'هیچ‌وقت گله را تنها نمی‌گذارد و همیشه با هم شکار می‌کنند.'},
 /* --- دسته ۶: محیط و آب‌وهوا (x076–x090) --- */
 {id:'x076',icon:'🌧️',name:'باران‌دوست',gene:'coldRes',desc:'باران او را سرحال می‌کند و در هوای مرطوب بهتر حرکت می‌کند.'},
 {id:'x077',icon:'☀️',name:'آفتاب‌پرست',gene:'heatRes',desc:'نور خورشید به او انرژی می‌دهد.'},
 {id:'x078',icon:'🌪️',name:'طوفان‌نورد',gene:'size',desc:'در طوفان هم سر جایش می‌ایستد و جابه‌جا نمی‌شود.'},
 {id:'x079',icon:'🌊',name:'شناگر',gene:'efficiency',desc:'در زمین‌های خیس سریع‌تر حرکت می‌کند.'},
 {id:'x080',icon:'🏜️',name:'کویرنورد',gene:'heatRes',desc:'به گرما و خشکی کویر عادت کرده است.'},
 {id:'x081',icon:'⛷️',name:'برف‌نورد',gene:'coldRes',desc:'روی برف راحت راه می‌رود و سرما اذیتش نمی‌کند.'},
 {id:'x082',icon:'🌲',name:'جنگل‌نورد',gene:'vision',desc:'میان درخت‌ها هم راهش را گم نمی‌کند و غذا پیدا می‌کند.'},
 {id:'x083',icon:'🦉',name:'شب‌زنده‌دار',gene:'vision',desc:'شب‌ها فعال است و وقتی بقیه خواب‌اند غذا جمع می‌کند.'},
 {id:'x084',icon:'🌑',name:'استتار تاریک',gene:'mask',desc:'در تاریکی با محیط یکی می‌شود و دیده نمی‌شود.'},
 {id:'x085',icon:'🍁',name:'استتار پاییزی',gene:'coat',desc:'رنگش با برگ‌ها یکی است و رقیب‌ها او را نمی‌بینند.'},
 {id:'x086',icon:'🟢',name:'استتار سبز',gene:'coat',desc:'میان سبزه‌ها پنهان می‌شود و کسی متوجهش نمی‌شود.'},
 {id:'x087',icon:'⚪',name:'پوشش برفی',gene:'coat',desc:'سفید است و در برف کاملاً پنهان می‌شود.'},
 {id:'x088',icon:'🖤',name:'پوشش شبانه',gene:'mask',desc:'پوشش تیره‌اش او را در شب نامرئی می‌کند.'},
 {id:'x089',icon:'☁️',name:'ابرنشین',gene:'coldRes',desc:'هوای سرد و ابری را دوست دارد و در آن سرحال است.'},
 {id:'x090',icon:'⛰️',name:'بلندقد',gene:'size',desc:'قد بلندش باعث می‌شود غذا را از بالای سر بقیه ببیند.'},
 /* --- دسته ۷: تغذیه و شکار (x091–x100) --- */
 {id:'x091',icon:'🍖',name:'گوشت‌خوار',gene:'metabolism',desc:'غذاها برایش سیرکننده‌ترند و دیرتر گرسنه می‌شود.'},
 {id:'x092',icon:'🥦',name:'گیاه‌خوار حرفه‌ای',gene:'metabolism',desc:'از غذاهای ساده هم خوب سیر می‌شود.'},
 {id:'x093',icon:'🍯',name:'شیرین‌دوست',gene:'metabolism',desc:'با غذای کم هم سیر می‌شود.'},
 {id:'x094',icon:'🦅',name:'شکارچی آسمان',gene:'speed',desc:'از بالا غذا را نشانه می‌گیرد و با سرعت می‌قاپد.'},
 {id:'x095',icon:'🕷️',name:'تله‌گذار',gene:'efficiency',desc:'کمین می‌کند و بدون دویدن زیاد غذا به دست می‌آورد.'},
 {id:'x096',icon:'🐍',name:'کمین‌گر',gene:'efficiency',desc:'بی‌حرکت صبر می‌کند تا غذا به او نزدیک شود.'},
 {id:'x097',icon:'🦷',name:'دندان‌های تیز',gene:'aggression',desc:'غذای سفت را هم راحت می‌خورد و سر غذا می‌جنگد.'},
 {id:'x098',icon:'🤝',name:'شکارچی گروهی',gene:'cooperation',desc:'با هم شکار می‌کنند و غذای بزرگ را تقسیم می‌کنند.'},
 {id:'x099',icon:'🏃',name:'شکارچی دونده',gene:'speed',desc:'شکارش را با دویدن دنبال می‌کند تا خسته شود.'},
 {id:'x100',icon:'🧺',name:'جمع‌کننده‌ی غذا',gene:'efficiency',desc:'غذا را جمع می‌کند و ذخیره می‌کند تا در قحطی استفاده کند.'},
];
const NAME_A=['آرا','نیلا','کیان','سارا','داریوش','مهسا','آرش','نگار','پارسا','ترانه','رادین','یاسمین','بردیا','آیدا','سهراب','لیلا','کاوه','نازنین','ارشیا','ستاره'];
const NAME_B=['','‌نژاد','‌زاده','‌پور','‌فر','‌کیا'];
const SEASONS=[['🌸 بهار',0],['☀️ تابستان',91],['🍂 پاییز',182],['❄️ زمستان',273]];

/* ---------------- وضعیت ---------------- */
const S={
  running:true, speed:1, day:1, timeOfDay:8, // ساعت ۰ تا ۲۴
  agents:[], foods:[], parts:[], floaters:[], corpses:[],
  nextId:1, nextLineage:1, births:0, deaths:0, fights:0,
  deathsBy:{'گرسنگی':0,'پیری':0,'جنگ':0,'طاعون':0,'صاعقه':0,'شهاب':0,'خدا':0},
  droughtUntil:0, plagueActive:false, selected:null, follow:false, armed:null,
  customTraits:JSON.parse(localStorage.getItem('godsim-custom')||'[]'),
  historyPop:[], historyTraits:[], historyAllele:[], lastHist:0, elapsed:0, fps:60,
  mateSelected:null, pickMate:false, alleleGene:'speed',
  mutations:{neutral:0,beneficial:0,harmful:0},
  genetics:{matePref:'none',matePrefStrength:0.6},
  settings:{popCap:120,foodRate:4,foodEnergy:25,hungerRate:1,mutation:0.08,temperature:20,dayLength:60},
};
let W=800,H=600,DPR=1, foodAcc=0, statAcc=0, chartAcc=0;
const canvas=$('#world'), ctx=canvas.getContext('2d');

/* ---------------- کش اسپرایت (پرفورمنس) ----------------
   ظاهر هر موجود (هاله + بدن + چشم‌ها) یک بار در یک بوم آفسکرین رندر می‌شود
   و در هر فریم فقط با drawImage کپی می‌شود — به‌جای ~۸ قوس در هر فریم.
   کلید کش: سطل رنگ (۲۴ سطل) × سطل جثه (۸ سطل) × تیره/روشن. */
const SPRITES=new Map();
let foodSpriteCache=null, bgGrad=null, bgPhase='';
function agentSprite(hue,sizeVal,dark){
  const hueB=Math.round(hue/15)*15, sizeB=Math.round(sizeVal*7)/7;
  const key=hueB+'|'+sizeB+'|'+(dark?1:0);
  let s=SPRITES.get(key); if(s) return s;
  const r=5+sizeB*7, pad=r*1.7+2, px=Math.ceil(pad*2*DPR);
  const c=document.createElement('canvas'); c.width=px; c.height=px;
  const g=c.getContext('2d'); g.scale(DPR,DPR); g.translate(pad,pad);
  g.fillStyle=dark?'rgba(100,116,139,.28)':`hsla(${hueB} 80% 60% / .28)`;
  g.beginPath(); g.arc(0,0,r*1.7,0,Math.PI*2); g.fill();
  g.fillStyle=dark?'#1e293b':`hsl(${hueB} 75% 58%)`;
  if(dark){g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1.5;g.beginPath();g.arc(0,0,r,0,Math.PI*2);g.stroke();}
  g.beginPath(); g.arc(0,0,r,0,Math.PI*2); g.fill();
  // چشم‌ها رو به +x (در draw با rotate به جهت حرکت می‌چرخد)
  g.fillStyle='#fff';
  g.beginPath(); g.arc(r*0.45,r*0.32,r*0.22,0,Math.PI*2); g.fill();
  g.beginPath(); g.arc(r*0.45,-r*0.32,r*0.22,0,Math.PI*2); g.fill();
  g.fillStyle='#111';
  g.beginPath(); g.arc(r*0.6,r*0.32,r*0.11,0,Math.PI*2); g.fill();
  g.beginPath(); g.arc(r*0.6,-r*0.32,r*0.11,0,Math.PI*2); g.fill();
  s={c,pad}; SPRITES.set(key,s); return s;
}
function foodSprite(){
  if(foodSpriteCache) return foodSpriteCache;
  const pad=12, r=5.25, px=Math.ceil(pad*2*DPR);
  const c=document.createElement('canvas'); c.width=px; c.height=px;
  const g=c.getContext('2d'); g.scale(DPR,DPR); g.translate(pad,pad);
  g.fillStyle='rgba(52,211,153,.25)'; g.beginPath(); g.arc(0,0,r*2.1,0,Math.PI*2); g.fill();
  g.fillStyle='#4ade80'; g.beginPath(); g.arc(0,0,r,0,Math.PI*2); g.fill();
  g.fillStyle='#bbf7d0'; g.beginPath(); g.arc(-1.5,-1.5,r*0.35,0,Math.PI*2); g.fill();
  foodSpriteCache={c,pad,r}; return foodSpriteCache;
}
function skyGrad(night,dusk){
  const ph=night?'n':dusk?'d':'day';
  if(!bgGrad||bgPhase!==ph){ bgPhase=ph;
    const g=ctx.createLinearGradient(0,0,0,H);
    if(night){g.addColorStop(0,'#0a1030');g.addColorStop(1,'#0d1a2e');}
    else if(dusk){g.addColorStop(0,'#2b1d4e');g.addColorStop(1,'#3a2b1e');}
    else {g.addColorStop(0,'#0e2a24');g.addColorStop(1,'#123a2a');}
    bgGrad=g; }
  return bgGrad;
}

/* ---------------- ابزار جهان ---------------- */
function logEvent(text,kind=''){
  const li=document.createElement('li'); if(kind) li.className=kind;
  const t=document.createElement('time'); t.textContent='روز '+fa(S.day);
  li.appendChild(t); li.appendChild(document.createTextNode(text));
  const box=$('#eventLog'); box.prepend(li);
  while(box.children.length>80) box.lastChild.remove();
}
function toast(text,ms=2600){
  const el=$('#toast'); el.textContent=text; el.hidden=false;
  clearTimeout(toast._t); toast._t=setTimeout(()=>el.hidden=true,ms);
}
function seasonOf(day){const d=(day-1)%365; for(let i=SEASONS.length-1;i>=0;i--) if(d>=SEASONS[i][1]) return SEASONS[i][0]; return SEASONS[0][0];}
function tempNow(){
  const seasonal=[8,26,12,-4][Math.floor(((S.day-1)%365)/91.25)]||8;
  const daySwing=Math.sin((S.timeOfDay-9)/24*Math.PI*2)*4;
  return S.settings.temperature*0.55+seasonal*0.45+daySwing;
}
function burst(x,y,color,n=14,pow=120){
  for(let i=0;i<n;i++){const a=rand(Math.PI*2),s=rand(20,pow);
    S.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(.4,.9),max:.9,color,r:rand(1.5,3.5)});}
  if(S.parts.length>300) S.parts.splice(0,S.parts.length-300); // سقف ذره‌ها
  if(S.floaters.length>80) S.floaters.splice(0,S.floaters.length-80);
}
function floater(x,y,text,color='#fff'){S.floaters.push({x,y,text,color,life:1.4});}
function geneAvg(){const g={}; if(!S.agents.length) return g;
  Object.keys(GENE_LABELS).forEach(k=>g[k]=S.agents.reduce((s,a)=>s+a.genes[k],0)/S.agents.length); return g;}
function traitFreq(t){ if(!S.agents.length) return 0;
  return S.agents.filter(a=>a.genes[t.gene]>=0.72).length/S.agents.length*100;}

/* ---------------- آفرینش ---------------- */
function randomGenotypeAll(p=0.5){
  const gt={}; Object.keys(GENE_LABELS).forEach(k=>gt[k]=randomGenotype(k,p)); return gt;
}
function genesFromGenotype(gt){
  const g={}; Object.keys(GENE_LABELS).forEach(k=>g[k]=phenotypeFor(k,gt[k])); return g;
}
function randomGenes(){ return genesFromGenotype(randomGenotypeAll()); }
function makeAgent(x,y,genes,gen=1,lineage=null,hue=null,genotype=null,parents=[],ancestors=[]){
  const id=S.nextId++;
  const gt=genotype||randomGenotypeAll();
  const base=genes||genesFromGenotype(gt);
  const lin=lineage||S.nextLineage++;
  return {id,name:pick(NAME_A)+pick(NAME_B)+'-'+fa(id),sex:Math.random()<.5?'♀':'♂',
    x:x??rand(30,W-30),y:y??rand(30,H-30),angle:rand(Math.PI*2),
    genes:base,genotype:gt,gen,lineage:lin,hue:hue??Math.floor(rand(0,360)),
    parents,ancestors,
    energy:rand(55,90),health:100,age:0,lifespan:rand(2.2,3.8)*(0.6+base.lifespan),
    mateCd:rand(2,6),fightCd:0,plague:0,plagueT:0,dead:false,children:0,parentNames:'',
    wanderT:rand(0,2),tx:0,ty:0,targetFood:null};
}
function coatIsDark(a){
  // اپیستازی: ژن mask اگر فنوتیپ بالا داشته باشد، رنگ coat را می‌پوشاند
  return a.genes.mask>=0.6;
}
function spawnInitial(n){
  for(let i=0;i<n;i++) S.agents.push(makeAgent());
  logEvent(n+' موجود در جهان آفریده شدند.','good');
}
function spawnFood(x,y){
  S.foods.push({x:x??rand(16,W-16),y:y??rand(16,H-16),energy:S.settings.foodEnergy,pulse:rand(Math.PI*2),r:rand(4,6.5)});
}
function resetWorld(n){
  S.agents=[];S.foods=[];S.parts=[];S.floaters=[];S.corpses=[];S.selected=null;S.follow=false;
  S.day=1;S.timeOfDay=8;S.births=0;S.deaths=0;S.fights=0;S.droughtUntil=0;S.plagueActive=false;
  S.deathsBy={'گرسنگی':0,'پیری':0,'جنگ':0,'طاعون':0,'صاعقه':0,'شهاب':0,'خدا':0};
  S.historyPop=[];S.historyTraits=[];S.historyAllele=[];S.elapsed=0;
  S.mutations={neutral:0,beneficial:0,harmful:0}; S.mateSelected=null; S.pickMate=false;
  for(let i=0;i<70;i++) spawnFood();
  spawnInitial(n||S.settings.popCap);
  $('#extinctBox').hidden=true; updateSelected();
}

/* ---------------- مرگ و تولد ---------------- */
function killAgent(a,cause,silent){
  if(a.dead) return; a.dead=true; S.deaths++; S.deathsBy[cause]=(S.deathsBy[cause]||0)+1;
  S.corpses.push({x:a.x,y:a.y,r:a.genes.size*7+6,life:14,energy:14});
  burst(a.x,a.y,cause==='گرسنگی'?'#94a3b8':'#fb7185',12,80);
  floater(a.x,a.y-14,cause==='گرسنگی'?'☠ گرسنگی':cause==='پیری'?'👴 پیری':'💀 '+cause,'#fda4af');
  if(S.selected===a){S.selected=null;S.follow=false;updateSelected();}
  if(S.agents.length<10&&!silent) logEvent('⚠️ جمعیت به زیر ۱۰ رسید! جهان در خطر انقراض است.','bad');
}
function inheritAllele(parent,key,locus){
  const gt=parent.genotype[key][locus];
  let al=pick(gt); // هر آلل والد ۵۰٪ شانس انتقال دارد (قانون تفکیک مندل)
  // جهش: با نرخ مخصوص هر ژن × ضریب سراسری، آلل برعکس می‌شود
  const rule=GEN_RULES[key];
  const effRate=clamp(rule.mutRate*(S.settings.mutation/0.08),0,0.3);
  if(Math.random()<effRate){
    const before=phenotypeFor(key,parent.genotype[key]);
    al=al===1?0:1;
    const afterGt=parent.genotype[key].map((loc,i)=>i===locus?[...loc]:[...loc]);
    // طبقه‌بندی جهش بر اساس تغییر فنوتیپ همان ژن
    const tmp=JSON.parse(JSON.stringify(parent.genotype[key])); tmp[locus]=[al,tmp[locus][1]];
    const after=phenotypeFor(key,tmp);
    if(Math.abs(after-before)<0.02) S.mutations.neutral++;
    else if(after>before){ S.mutations.beneficial++;
      if(Math.random()<0.25) logEvent('🧬 جهش مفید در ژن «'+GENE_LABELS[key]+'» — فنوتیپ بهتر شد.','good'); }
    else { S.mutations.harmful++;
      if(Math.random()<0.25) logEvent('🧬 جهش مضر در ژن «'+GENE_LABELS[key]+'» — فنوتیپ ضعیف‌تر شد.','bad'); }
  }
  return al;
}
function reproduce(a,b){
  const F=inbreedingCoeff(a,b);
  const childGt={};
  Object.keys(GENE_LABELS).forEach(k=>{
    const rule=GEN_RULES[k], loci=[];
    for(let i=0;i<rule.loci;i++) loci.push([inheritAllele(a,k,i),inheritAllele(b,k,i)]);
    loci._env=rand(-0.04,0.04);
    childGt[k]=loci;
  });
  const childGenes=genesFromGenotype(childGt);
  const ancestors=[...new Set([...(a.ancestors||[]),...(b.ancestors||[]),a.id,b.id])].slice(-14);
  const c=makeAgent(a.x+rand(-16,16),a.y+rand(-16,16),childGenes,Math.max(a.gen,b.gen)+1,
    Math.random()<.5?a.lineage:b.lineage, Math.random()<.5?a.hue:b.hue, childGt, [a.id,b.id], ancestors);
  c.parentNames=a.name+' و '+b.name;
  c.inbreedF=F;
  if(F>0){ // افسردگی هم‌خونی: سلامتی و عمر کمتر، گاهی مرگ در بدو تولد
    c.health=clamp(100-F*140,15,100); c.lifespan*=(1-F*0.7);
    if(F>=0.25&&Math.random()<0.35){
      S.deaths++; S.deathsBy['هم‌خونی']=(S.deathsBy['هم‌خونی']||0)+1;
      logEvent('💔 فرزند '+a.name+' و '+b.name+' به‌خاطر هم‌خونی (F=٪'+fa(Math.round(F*100))+') در بدو تولد مرد.','bad');
      a.children++;b.children++;a.energy-=18;b.energy-=18;a.mateCd=9;b.mateCd=9; return;
    }
    if(Math.random()<0.4) logEvent('⚠️ فرزند هم‌خون متولد شد (ضریب هم‌خونی ٪'+fa(Math.round(F*100))+') — ضعیف‌تر از معمول.','bad');
  }
  a.children++;b.children++;a.energy-=18;b.energy-=18;a.mateCd=9;b.mateCd=9;
  S.agents.push(c); S.births++;
  burst(c.x,c.y,'#fbbf24',10,70); floater(c.x,c.y-16,'👶 نسل '+fa(c.gen),'#fde68a');
  if(c.gen>=5&&Math.random()<.3) logEvent('🌟 '+c.name+' از نسل '+fa(c.gen)+' متولد شد ('+c.parentNames+').','good');
}

/* ---------------- تیک شبیه‌سازی ---------------- */
function nearestFood(a){
  let best=null,bd=(60+a.genes.vision*200)**2;
  // جست‌وجوی ساده روی غذاهای نزدیک (با جمعیت کم غذا، حلقه کامل ارزان است)
  for(const f of S.foods){const dx=f.x-a.x,dy=f.y-a.y,d=dx*dx+dy*dy; if(d<bd){bd=d;best=f;}}
  return best;
}
function nearestMate(a){
  // انتخاب جنسی: اگر ترجیح فعال باشد، ماده‌ها نرهای سریع‌تر/بزرگ‌تر را حتی از دورتر ترجیح می‌دهند
  const pref=S.genetics.matePref, strength=S.genetics.matePrefStrength;
  let best=null,bestScore=-Infinity;
  for(const o of S.agents){ if(o===a||o.dead||o.sex===a.sex||o.energy<60||o.mateCd>0||o.age<0.4) continue;
    const dx=o.x-a.x,dy=o.y-a.y,d=Math.hypot(dx,dy); if(d>220) continue;
    let score=-d;
    if(pref!=='none'&&a.sex==='♀'){
      const attr=pref==='speed'?o.genes.speed:pref==='size'?o.genes.size:(o.genes.speed+o.genes.size)/2;
      score+=attr*strength*300;
      if(attr<0.35&&Math.random()<0.5*strength) continue; // رد کردن نر ضعیف
    }
    if(score>bestScore){bestScore=score;best=o;}
  }
  return best;
}
function doBottleneck(n,label){
  if(S.agents.length<=n){ toast('جمعیت همین حالا '+fa(S.agents.length)+' نفر است'); return; }
  const beforeP=alleleFreq(S.alleleGene);
  const keep=[...S.agents].sort(()=>Math.random()-.5).slice(0,n);
  const keepSet=new Set(keep.map(a=>a.id));
  let killed=0;
  for(const a of [...S.agents]) if(!keepSet.has(a.id)){ a.dead=true; killed++; S.deaths++; }
  S.agents=S.agents.filter(a=>!a.dead);
  const afterP=alleleFreq(S.alleleGene);
  logEvent('🍼 '+label+': جمعیت از '+fa(keep.length+killed)+' به '+fa(n)+' نفر رسید. فرکانس آلل A در ژن «'+GENE_LABELS[S.alleleGene]+'» از ٪'+fa(Math.round(beforeP*100))+' به ٪'+fa(Math.round(afterP*100))+' جهید — این رانش ژنتیکی است، نه انتخاب!','bad');
  toast('🍼 '+label+' — فرکانس آلل‌ها تصادفی جابه‌جا شد');
}
function addMigrants(n){
  const hueBase=Math.floor(rand(0,360));
  for(let i=0;i<n;i++){
    // مهاجرها از جمعیت دیگری می‌آیند: فرکانس آلل متفاوت (p≈۰٫۸۵ برای سرعت و جثه)
    const gt=randomGenotypeAll(0.5);
    gt.speed=randomGenotype('speed',0.85); gt.size=randomGenotype('size',0.85); gt.vision=randomGenotype('vision',0.3);
    const a=makeAgent(rand(30,W-30),rand(30,H-30),null,1,null,hueBase,gt);
    a.name='🧳 مهاجر-'+fa(a.id); S.agents.push(a);
  }
  logEvent('🧳 '+fa(n)+' مهاجر با ژن‌های متفاوت وارد جهان شدند — جریان ژنی شروع شد.','god');
  toast('🧳 مهاجرها آمدند');
}
function tick(dt){
  S.elapsed+=dt;
  const dayLen=S.settings.dayLength;
  S.timeOfDay+=dt*24/dayLen; if(S.timeOfDay>=24){S.timeOfDay-=24;S.day++;
    if(S.day%10===0) logEvent('📅 روز '+fa(S.day)+' رسید — '+seasonOf(S.day)+'، جمعیت '+fa(S.agents.length)+' موجود.');
  }
  // خشکسالی
  const drought=S.elapsed<S.droughtUntil;
  if(!drought){ foodAcc+=S.settings.foodRate*dt; while(foodAcc>=1){foodAcc--; if(S.foods.length<420) spawnFood();} }
  // لاشه‌ها → کمی غذا
  for(const c of S.corpses){ c.life-=dt; if(c.life<10&&Math.random()<dt*.3&&S.foods.length<420) spawnFood(c.x+rand(-14,14),c.y+rand(-14,14)); }
  S.corpses=S.corpses.filter(c=>c.life>0);

  const temp=tempNow(), cold=temp<2, hot=temp>33;
  const crowded=S.agents.length/S.settings.popCap;
  const fertFactor=crowded>=1?0.05:crowded>0.8?0.5:1;

  for(const a of S.agents){
    if(a.dead) continue;
    a.age+=dt/dayLen; a.mateCd=Math.max(0,a.mateCd-dt); a.fightCd=Math.max(0,a.fightCd-dt);
    // مصرف انرژی: حرکت + جثه + دما
    const drain=S.settings.hungerRate*(0.55+a.genes.size*0.5)*(1.15-a.genes.metabolism*0.55)*(1.15-a.genes.efficiency*0.35)*dt*1.4;
    let extra=0;
    if(cold) extra=(1-a.genes.coldRes)*(2-temp)*0.35*dt;
    if(hot) extra=(1-a.genes.heatRes)*(temp-33)*0.3*dt;
    a.energy=clamp(a.energy-drain-extra,0,100);
    if(a.energy<=0){ a.health-=14*dt; if(a.health<=0){killAgent(a,'گرسنگی');continue;} }
    else if(a.energy>40) a.health=clamp(a.health+4*dt,0,100);
    if(a.age>=a.lifespan){ killAgent(a,'پیری'); continue; }
    // طاعون
    if(a.plague>0){ a.plagueT+=dt; a.health-=9*dt*(1-a.genes.immunity*0.7);
      if(Math.random()<dt*0.25){ for(const o of S.agents){ if(o===a||o.dead||o.plague>0) continue;
        const dx=o.x-a.x,dy=o.y-a.y; if(dx*dx+dy*dy<45*45&&Math.random()<(1-o.genes.immunity*0.85)*0.5){o.plague=1;o.plagueT=0;} } }
      if(a.plagueT>14){ a.plague=0; a.health=clamp(a.health+20,0,100); floater(a.x,a.y-14,'💚 بهبود',' #86efac'); }
      if(a.health<=0){ killAgent(a,'طاعون'); continue; }
    }
    // رفتار: غذا، جفت، سرگردانی
    const speed=(34+a.genes.speed*78)*(a.energy<25?1.25:1)*(a.plague>0?0.6:1);
    let mx=0,my=0,moving=false;
    const mate=(a.energy>68&&a.mateCd<=0&&a.age>0.4)?nearestMate(a):null;
    if(mate&&Math.random()<fertFactor*dt*0.25){ const dx=mate.x-a.x,dy=mate.y-a.y,d=Math.hypot(dx,dy);
      if(d<34){ reproduce(a,mate); }
      else {mx=dx/d;my=dy/d;moving=true;}
    } else {
      const f=a.targetFood&&!a.targetFood.eaten? a.targetFood : (a.targetFood=nearestFood(a));
      if(f){ const dx=f.x-a.x,dy=f.y-a.y,d=Math.hypot(dx,dy);
        if(d<a.genes.size*7+9){
          // جنگ سر غذا؟
          const rival=S.agents.find(o=>o!==a&&!o.dead&&o.targetFood===f&&o.fightCd<=0&&a.fightCd<=0&&a.genes.aggression>0.35&&o.genes.aggression>0.3&&a.energy<75&&o.energy<75);
          if(rival&&a.genes.cooperation<0.6&&rival.genes.cooperation<0.6){
            S.fights++; a.fightCd=3; rival.fightCd=3;
            const pa=a.genes.size*0.6+a.genes.aggression*0.4+rand(.2), pr=rival.genes.size*0.6+rival.genes.aggression*0.4+rand(.2);
            const win=pa>=pr?a:rival, lose=win===a?rival:a;
            lose.health-=26; lose.energy=Math.max(0,lose.energy-10);
            lose.x+= (lose.x-win.x)*0.6; lose.y+=(lose.y-win.y)*0.6;
            burst(f.x,f.y,'#f43f5e',10,90); floater(f.x,f.y-18,'⚔️',' #fda4af');
            if(lose.health<=0) killAgent(lose,'جنگ');
          } else if(rival&& (a.genes.cooperation>=0.6||rival.genes.cooperation>=0.6)){
            // همکاری: نصف‌نصف
            a.energy=clamp(a.energy+f.energy*0.55,0,100); rival.energy=clamp(rival.energy+f.energy*0.45,0,100);
            f.eaten=true; a.targetFood=null; rival.targetFood=null;
            floater(f.x,f.y-14,'🤝 تقسیم','#a7f3d0');
          } else { a.energy=clamp(a.energy+f.energy,0,100); f.eaten=true; a.targetFood=null;
            burst(f.x,f.y,'#34d399',6,50); }
        } else {mx=dx/d;my=dy/d;moving=true;}
      } else { a.wanderT-=dt; if(a.wanderT<=0){a.wanderT=rand(1,3);a.angle=rand(Math.PI*2);} mx=Math.cos(a.angle);my=Math.sin(a.angle);moving=true; }
    }
    if(moving){ a.x+=mx*speed*dt; a.y+=my*speed*dt; a.angle=Math.atan2(my,mx); }
    a.x=clamp(a.x,12,W-12); a.y=clamp(a.y,12,H-12);
  }
  S.foods=S.foods.filter(f=>!f.eaten);
  S.agents=S.agents.filter(a=>!a.dead);
  // تاریخچه
  if(S.elapsed-S.lastHist>0.6){ S.lastHist=S.elapsed;
    S.historyPop.push(S.agents.length); if(S.historyPop.length>240) S.historyPop.shift();
    const topFreqs=TRAITS.map(t=>({id:t.id,name:t.name,val:Math.round(traitFreq(t))}));
    topFreqs.sort((a,b)=>b.val-a.val); // فرکانس هر ویژگی فقط یک بار حساب می‌شود
    S.historyTraits.push(topFreqs.slice(0,3)); if(S.historyTraits.length>240) S.historyTraits.shift();
    const snap={}; Object.keys(GENE_LABELS).forEach(k=>snap[k]=alleleFreq(k));
    S.historyAllele.push(snap); if(S.historyAllele.length>240) S.historyAllele.shift();
  }
  if(S.agents.length===0){ if(!S.extinctShown){ S.extinctShown=true; $('#extinctBox').hidden=false; logEvent('💀 انقراض! همه‌ی موجودات مردند.','bad'); } }
  else { $('#extinctBox').hidden=true; S.extinctShown=false; }
}

/* ---------------- رندر ---------------- */
function resize(){
  const r=$('#stage').getBoundingClientRect();
  DPR=Math.min(1.5,window.devicePixelRatio||1);
  W=Math.max(320,r.width); H=Math.max(320,r.height);
  canvas.width=W*DPR; canvas.height=H*DPR; canvas.style.width=W+'px'; canvas.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  bgGrad=null; SPRITES.clear(); foodSpriteCache=null; // کش‌ها با اندازه‌ی تازه بازسازی می‌شوند
}
function draw(){
  // آسمان / زمین (گرادیان فقط وقتی فاز روز عوض شود ساخته می‌شود)
  const night=S.timeOfDay<6||S.timeOfDay>19, dusk=(S.timeOfDay>17&&S.timeOfDay<20)||(S.timeOfDay>5&&S.timeOfDay<7);
  ctx.fillStyle=skyGrad(night,dusk); ctx.fillRect(0,0,W,H);
  // تپه‌های نرم
  ctx.fillStyle=night?'rgba(255,255,255,.03)':'rgba(255,255,255,.045)';
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(W*(0.2+i*0.3),H+40,W*0.45,90,0,Math.PI,0);ctx.fill();}
  // لاشه‌ها
  for(const c of S.corpses){ctx.globalAlpha=clamp(c.life/14,0,1)*.5;ctx.fillStyle='#94a3b8';
    ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
  // غذا (اسپرایت کش‌شده)
  const fs=foodSprite();
  for(const f of S.foods){
    const p=1+Math.sin(S.elapsed*3+f.pulse)*0.18;
    const w=fs.pad*2*(f.r*p/fs.r);
    ctx.drawImage(fs.c,f.x-w/2,f.y-w/2,w,w);
  }
  // موجودات
  for(const a of S.agents){
    const r=5+a.genes.size*7, sel=S.selected===a;
    // هاله‌ی بینایی موقع انتخاب
    if(sel){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.setLineDash([5,5]);ctx.beginPath();
      ctx.arc(a.x,a.y,60+a.genes.vision*200,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();ctx.arc(a.x,a.y,r+7+Math.sin(S.elapsed*5)*2,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1;}
    if(a.plague>0){ctx.fillStyle='rgba(132,204,22,.3)';ctx.beginPath();ctx.arc(a.x,a.y,r+5,0,Math.PI*2);ctx.fill();}
    const darkCoat=coatIsDark(a);
    const spr=agentSprite(a.hue,a.genes.size,darkCoat);
    ctx.save(); ctx.translate(a.x,a.y); ctx.rotate(a.angle);
    ctx.drawImage(spr.c,-spr.pad,-spr.pad,spr.pad*2,spr.pad*2); ctx.restore();
    // نوار انرژی بالای سر وقتی گرسنه یا انتخاب‌شده
    if(sel||a.energy<30){ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(a.x-r,a.y-r-9,r*2,4);
      ctx.fillStyle=a.energy<25?'#f43f5e':'#f59e0b';ctx.fillRect(a.x-r,a.y-r-9,r*2*(a.energy/100),4);}
  }
  // ذره‌ها و متن‌های شناور
  for(const p of S.parts){p.x+=p.vx*0.016;p.y+=p.vy*0.016;p.life-=0.016;ctx.globalAlpha=clamp(p.life/p.max,0,1);
    ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1; S.parts=S.parts.filter(p=>p.life>0);
  ctx.font='bold 13px Vazirmatn, sans-serif';ctx.textAlign='center';
  for(const f of S.floaters){f.y-=0.5;f.life-=0.016;ctx.globalAlpha=clamp(f.life,0,1);
    ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y);}
  ctx.globalAlpha=1; S.floaters=S.floaters.filter(f=>f.life>0);
  // تاریکی شب
  if(night){ctx.fillStyle='rgba(4,8,30,.34)';ctx.fillRect(0,0,W,H);}
  else if(dusk){ctx.fillStyle='rgba(30,16,60,.16)';ctx.fillRect(0,0,W,H);}
}

/* ---------------- قدرت‌های خدا ---------------- */
const POWERS=[
 {id:'food',icon:'🍎',name:'باران غذا',desc:'۲۵ غذا همان‌جا می‌ریزد',armed:true},
 {id:'lightning',icon:'⚡',name:'صاعقه',desc:'نزدیک‌ترین موجود را می‌کشد',armed:true},
 {id:'meteor',icon:'☄️',name:'شهاب',desc:'همه را در شعاع ۷۰ می‌کشد',armed:true},
 {id:'plague',icon:'🦠',name:'طاعون',desc:'از یک موجود شروع، سرایت می‌کند',armed:true},
 {id:'bless',icon:'✨',name:'برکت',desc:'همه را سیر و سالم می‌کند',armed:false},
 {id:'drought',icon:'🏜️',name:'خشکسالی',desc:'۲۰ ثانیه غذا نمی‌روید',armed:false},
];
const PRESETS=[
 {id:'paradise',icon:'🌈',name:'بهشت غذا',desc:'غذای فراوان، زندگی آرام',apply(){setSetting('foodRate',8);setSetting('hungerRate',0.6);setSetting('temperature',22);}},
 {id:'famine',icon:'🥀',name:'قحطی',desc:'غذا کم، گرسنگی زیاد',apply(){setSetting('foodRate',0.6);setSetting('hungerRate',1.7);}},
 {id:'ice',icon:'🧊',name:'عصر یخبندان',desc:'سرمای کشنده −۱۲ درجه',apply(){setSetting('temperature',-12);setSetting('foodRate',1.2);setSetting('hungerRate',1.4);}},
 {id:'heat',icon:'🌡️',name:'موج گرما',desc:'گرمای ۳۸ درجه',apply(){setSetting('temperature',38);setSetting('foodRate',1.5);setSetting('hungerRate',1.3);}},
 {id:'war',icon:'⚔️',name:'جنگ همه‌علیه‌همه',desc:'پرخاشگری به نیمی از جمعیت',apply(){setSetting('foodRate',1);setSetting('hungerRate',1.2);injectTrait(TRAITS[3],50,true);}},
 {id:'calm',icon:'🕊️',name:'بهشت آرام',desc:'همکاری به نیمی از جمعیت',apply(){setSetting('foodRate',4);setSetting('hungerRate',0.7);injectTrait(TRAITS[6],50,true);}},
];
const SLIDERS=[
 {k:'popCap',label:'ظرفیت جمعیت',desc:'بیشتر از این، باروری کم می‌شود',min:50,max:500,step:10,fmt:v=>fa(v)+' موجود'},
 {k:'foodRate',label:'سرعت رویش غذا',desc:'چند غذا در هر ثانیه می‌روید',min:0.5,max:10,step:0.5,fmt:v=>fa1(v)+' در ثانیه'},
 {k:'foodEnergy',label:'انرژی هر غذا',desc:'هر غذا چقدر سیر می‌کند',min:10,max:50,step:5,fmt:v=>'٪'+fa(v)},
 {k:'hungerRate',label:'سرعت گرسنگی',desc:'انرژی با چه سرعتی خالی می‌شود',min:0.5,max:3,step:0.1,fmt:v=>'×'+fa1(v)},
 {k:'mutation',label:'نرخ جهش ژنتیکی',desc:'بچه‌ها چقدر با والدین فرق می‌کنند',min:0,max:0.3,step:0.02,fmt:v=>'٪'+fa(Math.round(v*100))},
 {k:'temperature',label:'دمای پایه جهان',desc:'سرما و گرما گرسنگی و مرگ می‌آورند',min:-20,max:40,step:1,fmt:v=>fa(v)+'°C'},
 {k:'dayLength',label:'طول هر روز',desc:'هر روز جهان چند ثانیه طول بکشد',min:20,max:180,step:10,fmt:v=>fa(v)+' ثانیه'},
];
function setSetting(k,v){ S.settings[k]=v; const inp=$('#sl-'+k); if(inp) inp.value=v; const b=$('#slv-'+k); if(b) b.textContent=SLIDERS.find(s=>s.k===k).fmt(v); }
function buildSliders(){
  $('#sliders').innerHTML=SLIDERS.map(s=>`<div class="slider-row"><div class="s-head"><span>${s.label}</span><b id="slv-${s.k}">${s.fmt(S.settings[s.k])}</b></div><div class="s-desc">${s.desc}</div><input type="range" id="sl-${s.k}" min="${s.min}" max="${s.max}" step="${s.step}" value="${S.settings[s.k]}" aria-label="${s.label}"></div>`).join('');
  SLIDERS.forEach(s=>{ $('#sl-'+s.k).addEventListener('input',e=>setSetting(s.k,parseFloat(e.target.value))); });
}
function buildPresets(){
  $('#presetGrid').innerHTML=PRESETS.map((p,i)=>`<button class="preset" type="button" data-i="${i}"><b>${p.icon} ${p.name}</b><span>${p.desc}</span></button>`).join('');
  $$('#presetGrid .preset').forEach(b=>b.addEventListener('click',()=>{
    const p=PRESETS[+b.dataset.i]; p.apply(); logEvent('🌦 سناریوی «'+p.name+'» اجرا شد.','god'); toast('سناریوی «'+p.name+'» اجرا شد');
  }));
}
function buildPowers(){
  $('#powerGrid').innerHTML=POWERS.map((p,i)=>`<button class="power" type="button" data-i="${i}"><b>${p.icon} ${p.name}</b><span>${p.desc}</span></button>`).join('');
  $$('#powerGrid .power').forEach(b=>b.addEventListener('click',()=>{
    const p=POWERS[+b.dataset.i];
    if(!p.armed){ execPower(p.id,W/2,H/2); return; }
    armPower(p.id);
  }));
}
function armPower(id){
  S.armed=id; const p=POWERS.find(x=>x.id===id);
  $('#armedName').textContent=p.name; $('#armedBar').hidden=false;
  $$('#powerGrid .power').forEach(b=>b.classList.toggle('armed-btn',POWERS[+b.dataset.i].id===id));
  $$('#powerGrid .power').forEach(b=>b.classList.toggle('armed-btn',POWERS[+b.dataset.i].id===id));
  toast('قدرت «'+p.name+'» آماده است — روی زمین بزن');
}
function disarm(){ S.armed=null; $('#armedBar').hidden=true; $$('#powerGrid .power').forEach(b=>b.classList.remove('armed-btn')); }
function nearestAgent(x,y,maxD=90){
  let best=null,bd=maxD*maxD;
  for(const a of S.agents){const dx=a.x-x,dy=a.y-y,d=dx*dx+dy*dy; if(d<bd){bd=d;best=a;}}
  return best;
}
function execPower(id,x,y){
  if(id==='food'){ for(let i=0;i<25;i++) spawnFood(x+rand(-90,90),y+rand(-90,90)); burst(x,y,'#4ade80',18,140); logEvent('🍎 باران غذا بارید.','god'); }
  else if(id==='lightning'){ const a=nearestAgent(x,y,120);
    burst(x,y,'#fde047',22,180); floater(x,y-20,'⚡','#fde047');
    if(a){killAgent(a,'صاعقه'); logEvent('⚡ صاعقه '+a.name+' را زد.','god');} else logEvent('⚡ صاعقه به زمین خورد و کسی نمرد.','god'); }
  else if(id==='meteor'){ burst(x,y,'#fb923c',30,220); let n=0;
    for(const a of [...S.agents]){const dx=a.x-x,dy=a.y-y; if(dx*dx+dy*dy<70*70){killAgent(a,'شهاب');n++;}}
    logEvent('☄️ شهاب فرود آمد و '+fa(n)+' موجود را کشت.','god'); }
  else if(id==='plague'){ const a=nearestAgent(x,y,120)||pick(S.agents);
    if(a){a.plague=1;a.plagueT=0;S.plagueActive=true;burst(a.x,a.y,'#84cc16',14,100);
      logEvent('🦠 طاعون از '+a.name+' شروع شد!','bad'); toast('طاعون شروع شد — ببین چه‌کسی زنده می‌ماند');} }
  else if(id==='bless'){ for(const a of S.agents){a.energy=100;a.health=100;a.plague=0;} burst(W/2,H/2,'#fbbf24',30,260);
    logEvent('✨ برکت خدا: همه سیر و سالم شدند.','god'); toast('✨ برکت بر همه فرود آمد'); }
  else if(id==='drought'){ S.droughtUntil=S.elapsed+20; logEvent('🏜️ خشکسالی ۲۰ ثانیه‌ای شروع شد — غذا نمی‌روید.','god'); toast('🏜️ خشکسالی شروع شد'); }
  disarm();
}

/* ---------------- آزمایشگاه ویژگی‌ها ---------------- */
function setGenotypeHigh(a,key){
  const rule=GEN_RULES[key];
  for(let i=0;i<rule.loci;i++) a.genotype[key][i]=[1,1]; // AA در همه جایگاه‌ها
  a.genes[key]=phenotypeFor(key,a.genotype[key]);
}
function setGenotypeLow(a,key){
  const rule=GEN_RULES[key];
  for(let i=0;i<rule.loci;i++) a.genotype[key][i]=[0,0]; // aa در همه جایگاه‌ها
  a.genes[key]=phenotypeFor(key,a.genotype[key]);
}
function injectTrait(t,pct,silent){
  const chosen=[...S.agents].sort(()=>Math.random()-.5).slice(0,Math.max(1,Math.round(S.agents.length*pct/100)));
  for(const a of chosen) setGenotypeHigh(a,t.gene);
  if(!silent){ logEvent('🧬 ویژگی «'+t.name+'» به '+fa(pct)+'٪ جمعیت ('+fa(chosen.length)+' موجود) تزریق شد — ژنوتیپ AA گرفتند و به فرزندانشان هم می‌رسد.','god');
    toast('🧬 «'+t.name+'» به '+fa(pct)+'٪ تزریق شد'); }
  return chosen.length;
}
function removeTrait(t){
  let n=0; for(const a of S.agents){ if(a.genes[t.gene]>=0.72){setGenotypeLow(a,t.gene);n++;} }
  logEvent('🧹 ویژگی «'+t.name+'» از '+fa(n)+' موجود حذف شد (ژن به aa برگشت).','god'); toast('ویژگی «'+t.name+'» حذف شد');
}
let traitPage=0, traitQuery='', traitGene='';
const TRAITS_PER_PAGE=50;
function traitFiltered(){
  return TRAITS.filter(t=>(!traitGene||t.gene===traitGene)&&(!traitQuery||t.name.includes(traitQuery)||t.desc.includes(traitQuery)));
}
function renderTraitPage(){
  const list=traitFiltered();
  const pages=Math.max(1,Math.ceil(list.length/TRAITS_PER_PAGE));
  traitPage=clamp(traitPage,0,pages-1);
  const start=traitPage*TRAITS_PER_PAGE, page=list.slice(start,start+TRAITS_PER_PAGE);
  $('#traitList').innerHTML=page.map(t=>`<div class="trait" id="tr-${t.id}">
    <div class="trait-head"><span class="trait-ico">${t.icon}</span><div><b>${t.name}</b><small>${t.desc}</small></div>
    <div class="trait-freq"><b id="tf-${t.id}">٪۰</b><span>فراوانی</span></div></div>
    <div class="freq-bar"><i id="tb-${t.id}" style="width:0%"></i></div>
    <div class="trait-btns">
      <button class="btn inject" type="button" data-act="i10">تزریق ۱۰٪</button>
      <button class="btn inject" type="button" data-act="i25">تزریق ۲۵٪</button>
      <button class="btn inject" type="button" data-act="i50">تزریق ۵۰٪</button>
      <button class="btn inject" type="button" data-act="i100">تزریق همه</button>
      <button class="btn remove" type="button" data-act="rm">🗑 حذف</button>
    </div></div>`).join('')||'<p class="note">ویژگی‌ای پیدا نشد.</p>';
  $('#traitPageInfo').textContent=list.length?('نمایش '+fa(start+1)+' تا '+fa(Math.min(start+TRAITS_PER_PAGE,list.length))+' از '+fa(list.length)+' ویژگی'):'۰ ویژگی';
  $('#traitPrev').disabled=traitPage===0;
  $('#traitNext').disabled=traitPage>=pages-1;
  $$('#traitList .trait').forEach(el=>{
    const t=TRAITS.find(x=>x.id===el.id.slice(3));
    el.querySelectorAll('[data-act]').forEach(b=>b.addEventListener('click',()=>{
      const act=b.dataset.act;
      if(act==='rm') removeTrait(t);
      else injectTrait(t,parseInt(act.slice(1),10));
      updateStats();
    }));
  });
}
function buildTraits(){
  renderTraitPage();
  $('#traitSearch').addEventListener('input',e=>{traitQuery=e.target.value.trim();traitPage=0;renderTraitPage();});
  $('#traitGeneFilter').addEventListener('change',e=>{traitGene=e.target.value;traitPage=0;renderTraitPage();});
  $('#traitPrev').addEventListener('click',()=>{traitPage--;renderTraitPage();});
  $('#traitNext').addEventListener('click',()=>{traitPage++;renderTraitPage();});
  renderCustomTraits();
}
function renderCustomTraits(){
  $('#customTraitList').innerHTML=S.customTraits.map((t,i)=>`<span class="pill">✨ ${t.name} <button data-i="${i}" data-a="inj" type="button" style="border:0;background:none;color:#fff">＋۲۵٪</button> <button data-i="${i}" data-a="del" type="button" style="border:0;background:none;color:#fff">✕</button></span>`).join('')||'<span style="color:var(--muted);font-size:12px">هنوز ویژگی دلخواهی نساخته‌ای.</span>';
  $$('#customTraitList button').forEach(b=>b.addEventListener('click',()=>{
    const t=S.customTraits[+b.dataset.i];
    if(b.dataset.a==='del'){ S.customTraits.splice(+b.dataset.i,1); localStorage.setItem('godsim-custom',JSON.stringify(S.customTraits)); renderCustomTraits(); }
    else { const fake={name:t.name,gene:t.gene}; injectTrait(fake,25); }
  }));
}

/* ---------------- نمودارها و آمار ---------------- */
function drawLineChart(cv,series,labels,color){
  const c=cv.getContext('2d'),w=cv.width,h=cv.height; c.clearRect(0,0,w,h);
  c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;
  for(let i=1;i<4;i++){c.beginPath();c.moveTo(0,h*i/4);c.lineTo(w,h*i/4);c.stroke();}
  if(!series.length){c.fillStyle='#a8b2d8';c.font='22px Vazirmatn, sans-serif';c.textAlign='center';c.fillText('هنوز داده‌ای نیست — کمی صبر کن',w/2,h/2);return;}
  const max=Math.max(10,...series);
  c.strokeStyle=color;c.lineWidth=3;c.lineJoin='round';c.beginPath();
  series.forEach((v,i)=>{const x=i/(Math.max(1,series.length-1))*w, y=h-8-(v/max)*(h-20); i?c.lineTo(x,y):c.moveTo(x,y);});
  c.stroke();
  c.fillStyle='#fff';c.font='bold 20px Vazirmatn, sans-serif';c.textAlign='right';
  c.fillText(labels||'',w-10,26);
}
function drawTraitChart(){
  const cv=$('#chartTraits'),c=cv.getContext('2d'),w=cv.width,h=cv.height; c.clearRect(0,0,w,h);
  const hist=S.historyTraits; if(hist.length<2){drawLineChart(cv,[],'', '#7c5cff');return;}
  const ids=[...new Set(hist.flatMap(x=>x.map(y=>y.id)))].slice(0,3);
  const colors=['#7c5cff','#22d3ee','#f59e0b'];
  c.strokeStyle='rgba(255,255,255,.08)';
  for(let i=1;i<4;i++){c.beginPath();c.moveTo(0,h*i/4);c.lineTo(w,h*i/4);c.stroke();}
  ids.forEach((id,ci)=>{
    const vals=hist.map(row=>{const f=row.find(r=>r.id===id);return f?f.val:0;});
    c.strokeStyle=colors[ci];c.lineWidth=3;c.beginPath();
    vals.forEach((v,i)=>{const x=i/(Math.max(1,vals.length-1))*w,y=h-8-(v/100)*(h-20); i?c.lineTo(x,y):c.moveTo(x,y);});
    c.stroke();
    const t=TRAITS.find(x=>x.id===id)||S.customTraits.find(x=>x.id===id);
    c.fillStyle=colors[ci];c.font='bold 18px Vazirmatn, sans-serif';c.textAlign='right';
    c.fillText((t?t.name:id)+' ٪'+fa(vals[vals.length-1]||0),w-10,26+ci*24);
  });
}
function updateStats(){
  $('#statPop').textContent=fa(S.agents.length);
  $('#statFood').textContent=fa(S.foods.length);
  $('#statBirths').textContent=fa(S.births);
  $('#statDeaths').textContent=fa(S.deaths);
  const avgGen=S.agents.length?S.agents.reduce((s,a)=>s+a.gen,0)/S.agents.length:0;
  $('#statGen').textContent=fa1(avgGen);
  $('#statFights').textContent=fa(S.fights);
  $('#clockDay').textContent='روز '+fa(S.day);
  $('#clockSeason').textContent=seasonOf(S.day);
  $('#clockTemp').textContent=fa(Math.round(tempNow()))+'°C';
  const hh=Math.floor(S.timeOfDay), mm=Math.floor((S.timeOfDay-hh)*60);
  $('#clockTime').textContent=fa(String(hh).padStart(2,'0'))+':'+fa(String(mm).padStart(2,'0'));
  $('#footFps').textContent=fa(Math.round(S.fps))+' فریم';
  // فراوانی ویژگی‌ها
  for(const t of TRAITS){const f=traitFreq(t);
    const el=$('#tf-'+t.id); if(el) el.textContent='٪'+fa(Math.round(f));
    const bar=$('#tb-'+t.id); if(bar) bar.style.width=f+'%';}
  // تبارها
  const byLin={}; for(const a of S.agents){(byLin[a.lineage]=byLin[a.lineage]||{n:0,hue:a.hue}).n++;}
  const topLin=Object.entries(byLin).sort((a,b)=>b[1].n-a[1].n).slice(0,5);
  $('#lineageList').innerHTML=topLin.map(([id,v],i)=>`<div class="lin-row"><span><span class="lin-dot" style="background:hsl(${v.hue} 75% 58%)"></span>تبار ${fa(id)} ${i===0?'👑':''}</span><b>${fa(v.n)} موجود</b></div>`).join('')||'<p class="note">هنوز موجودی نیست.</p>';
  const allFreq=TRAITS.map(t=>({t,f:traitFreq(t)})).sort((a,b)=>b.f-a.f);
  $('#topTraitsNote').textContent='برترین ویژگی‌ها حالا: '+allFreq.slice(0,3).map(x=>x.t.name+' ٪'+fa(Math.round(x.f))).join(' • ');
  $('#freqList').innerHTML=allFreq.slice(0,15).map(x=>`<div class="freq-row"><span>${x.t.icon} ${x.t.name}</span><div class="bar"><i style="width:${x.f}%"></i></div><b>٪${fa(Math.round(x.f))}</b></div>`).join('');
  $('#deathList').innerHTML=Object.entries(S.deathsBy).map(([k,v])=>`<div class="death-row"><span>💀 ${k}</span><b>${fa(v)}</b></div>`).join('');
  const avg=geneAvg();
  $('#avgGenes').innerHTML=Object.entries(GENE_LABELS).map(([k,label])=>`<div class="avg-row"><span>${label}</span><b>${avg[k]!=null?'٪'+fa(Math.round(avg[k]*100)):'—'}</b></div>`).join('');
  // هاردی–واینبرگ + رانش برای ژن انتخاب‌شده
  const hwEl=$('#hwBox');
  if(hwEl&&S.agents.length>0){
    const hw=hardyWeinberg(S.alleleGene), gk=S.alleleGene;
    const status=hw.deviation<0.02?'<span class="hw-ok">در تعادل است ✓</span>':'<span class="hw-warn">از تعادل منحرف است — فشار انتخاب یا رانش در کار است!</span>';
    hwEl.innerHTML=`<b>⚖️ تعادل هاردی–واینبرگ — ژن «${GENE_LABELS[gk]}»</b><br>`+
      `فرکانس آلل: p (A) = <b>${fa1(hw.p)}</b> ، q (a) = <b>${fa1(hw.q)}</b> &nbsp;|&nbsp; p²+2pq+q² = ۱<br>`+
      `مورد انتظار: AA ٪${fa(Math.round(hw.p*hw.p*100))} • Aa ٪${fa(Math.round(2*hw.p*hw.q*100))} • aa ٪${fa(Math.round(hw.q*hw.q*100))}<br>`+
      `مشاهده‌شده: AA ${fa(hw.obs.AA)} • Aa ${fa(hw.obs.Aa)} • aa ${fa(hw.obs.aa)} &nbsp;|&nbsp; انحراف: ${fa1(hw.deviation)} — ${status}<br>`+
      `جهش‌ها تاکنون: خنثی ${fa(S.mutations.neutral)} • مفید ${fa(S.mutations.beneficial)} • مضر ${fa(S.mutations.harmful)}`;
    const hist=S.historyAllele;
    if(hist.length>5){
      const ps=hist.map(h=>h[gk]||0.5), drift=Math.max(...ps)-Math.min(...ps);
      $('#driftNote').textContent='شاخص رانش ژنتیکی ('+GENE_LABELS[gk]+'): فرکانس آلل A در این بازه بین ٪'+fa(Math.round(Math.min(...ps)*100))+' تا ٪'+fa(Math.round(Math.max(...ps)*100))+' نوسان کرده (دامنه ٪'+fa(Math.round(drift*100))+'). وقتی جمعیت کوچک می‌شود این دامنه بزرگ‌تر می‌شود — همان رانش ژنتیکی.';
    }
  }
  if(S.selected) updateSelected(true);
}
function updateSelected(keep){
  const card=$('#selectedCard'), a=S.selected;
  if(!a||a.dead){ card.hidden=true; return; }
  card.hidden=false;
  $('#selDot').style.background=`hsl(${a.hue} 75% 58%)`; $('#selDot').style.color=`hsl(${a.hue} 75% 58%)`;
  $('#selName').textContent=a.name;
  $('#selMeta').textContent='نسل '+fa(a.gen)+' • تبار '+fa(a.lineage)+' • سن '+fa1(a.age)+' روز';
  $('#selSex').textContent=a.sex==='♀'?'♀ ماده':'♂ نر';
  $('#selHunger').style.width=a.energy+'%'; $('#selHungerTxt').textContent='٪'+fa(Math.round(a.energy));
  $('#selHealth').style.width=a.health+'%'; $('#selHealthTxt').textContent='٪'+fa(Math.round(a.health));
  const agePct=clamp(a.age/a.lifespan*100,0,100);
  $('#selAge').style.width=agePct+'%'; $('#selAgeTxt').textContent=fa1(a.age)+' / '+fa1(a.lifespan)+' روز';
  $('#selGenes').innerHTML=Object.entries(GENE_LABELS).map(([k,label])=>`<div class="g"><span>${label}</span><b>٪${fa(Math.round(a.genes[k]*100))}</b></div>`).join('');
  const F=a.inbreedF||0;
  $('#selInbreed').style.width=(F*100)+'%'; $('#selInbreedTxt').textContent='٪'+fa(Math.round(F*100))+(F>=0.125?' ⚠️ هم‌خون':'');
  $('#selGenotype').innerHTML=Object.entries(GENE_LABELS).map(([k,label])=>{
    const gt=a.genotype[k], str=genotypeString(k,gt), poly=GEN_RULES[k].mode==='polygenic';
    const hidden=!poly&&GEN_RULES[k].dominant&&str==='Aa';
    return `<span class="gtype${poly?' poly':''}">${label}: <b>${str}</b>${hidden?' <span class="hidden-allele">حامل پنهان</span>':''}${poly?' (چندژنی)':''}</span>`;
  }).join('');
  const traitPills=TRAITS.filter(t=>a.genes[t.gene]>=0.72);
  const pillsHtml=traitPills.slice(0,8).map(t=>`<span class="pill">${t.icon} ${t.name}</span>`).join('')+(traitPills.length>8?` <span class="pill more">+${fa(traitPills.length-8)} ویژگی دیگر</span>`:'');
  $('#selTraits').innerHTML=pillsHtml||'<span style="color:var(--muted)">ویژگی برجسته‌ای ندارد — هنوز معمولی است.</span>';
  $('#selFamily').textContent=(a.parentNames?'والدین: '+a.parentNames+' • ':'')+'فرزندان: '+fa(a.children)+' • '+(a.plague>0?'🦠 بیمار است!':'سالم است')+(coatIsDark(a)?' • 🌑 پوشش تیره (اپیستازی)':'');
  $('#btnFollow').textContent=S.follow?'👁 در حال دنبال‌کردن — لغو':'👁 دنبال‌کردن';
  renderPunnettMini();
}

/* ---------------- جدول پانت + آزمایشگاه ژنتیک ---------------- */
function punnettHTML(a,b){
  if(!a||!b) return '<p class="note">هنوز دو والد انتخاب نشده‌اند.</p>';
  let rows=Object.keys(GENE_LABELS).map(k=>{
    const pu=punnettFor(a,b,k), ph=phenotypeProb(a,b,k);
    return `<div class="p-row"><span>${GENE_LABELS[k]} — ${a.name} × ${b.name}</span><span>AA ٪${fa(pu.AA)} • Aa ٪${fa(pu.Aa)} • aa ٪${fa(pu.aa)} • فنوتیپ بالا ٪${fa(ph)}</span></div>`;
  }).join('');
  return `<b>💞 ${a.name} × ${b.name}</b><div style="margin-top:6px">${rows}</div>`;
}
function renderPunnettMini(){
  const el=$('#punnettMini'); if(!el) return;
  if(S.selected&&S.mateSelected&&S.mateSelected!==S.selected){ el.hidden=false; el.innerHTML=punnettHTML(S.selected,S.mateSelected); }
  else el.hidden=true;
}
function renderPunnettBox(){
  const el=$('#punnettBox'); if(!el) return;
  el.innerHTML=punnettHTML(S.selected,S.mateSelected);
}
function drawAlleleChart(){
  const cv=$('#chartAllele'); if(!cv) return;
  const c=cv.getContext('2d'),w=cv.width,h=cv.height; c.clearRect(0,0,w,h);
  const hist=S.historyAllele, gk=S.alleleGene;
  c.strokeStyle='rgba(255,255,255,.08)';
  for(let i=1;i<4;i++){c.beginPath();c.moveTo(0,h*i/4);c.lineTo(w,h*i/4);c.stroke();}
  if(hist.length<2){c.fillStyle='#a8b2d8';c.font='22px Vazirmatn, sans-serif';c.textAlign='center';c.fillText('هنوز داده‌ای نیست — کمی صبر کن',w/2,h/2);return;}
  const drawLine=(vals,color)=>{c.strokeStyle=color;c.lineWidth=3;c.beginPath();
    vals.forEach((v,i)=>{const x=i/(Math.max(1,vals.length-1))*w,y=h-8-v*(h-20); i?c.lineTo(x,y):c.moveTo(x,y);}); c.stroke();};
  drawLine(hist.map(s=>s[gk]??0.5),'#7c5cff');
  drawLine(hist.map(s=>1-(s[gk]??0.5)),'#f59e0b');
  const p=hist[hist.length-1][gk]??0.5;
  c.fillStyle='#a78bfa';c.font='bold 18px Vazirmatn, sans-serif';c.textAlign='right';
  c.fillText('p (A) = '+fa1(p),w-10,26);
  c.fillStyle='#fbbf24'; c.fillText('q (a) = '+fa1(1-p),w-10,50);
}
function buildGeneRules(){
  const box=$('#geneRules'); if(!box) return;
  box.innerHTML=Object.keys(GENE_LABELS).map(k=>{
    const r=GEN_RULES[k];
    return `<div class="gene-rule" data-gene="${k}">
      <div class="gr-head"><b>${GENE_LABELS[k]}</b><span>${r.mode==='polygenic'?'چندژنی (۳ جایگاه)':'مندلی (۱ جایگاه)'}</span></div>
      <div class="gr-row">
        <label>آلل غالب
          <select class="gr-dom"><option value="A" ${r.dominant?'selected':''}>A غالب (Aa مثل AA)</option><option value="a" ${!r.dominant?'selected':''}>a غالب (Aa مثل aa)</option></select>
        </label>
        <label>نرخ جهش این ژن <b class="gr-mut-txt">٪${fa(Math.round(r.mutRate*100))}</b>
          <input type="range" class="gr-mut" min="0" max="0.2" step="0.01" value="${r.mutRate}">
        </label>
        <label>شدت اثر فنوتیپی <b class="gr-eff-txt">${fa1(r.effect)}</b>
          <input type="range" class="gr-eff" min="0.3" max="1" step="0.05" value="${r.effect}">
        </label>
        <label>فرکانس آلل A حالا <b class="gr-p">٪${fa(Math.round(alleleFreq(k)*100))}</b><span>— با تغییر قانون، فنوتیپ‌ها دوباره محاسبه می‌شوند</span></label>
      </div></div>`;
  }).join('');
  $$('#geneRules .gene-rule').forEach(el=>{
    const k=el.dataset.gene;
    el.querySelector('.gr-dom').addEventListener('change',e=>{ GEN_RULES[k].dominant=e.target.value==='A'; applyRulesToAll(); logEvent('🔬 قانون ژن «'+GENE_LABELS[k]+'» عوض شد: حالا آلل '+(GEN_RULES[k].dominant?'A':'a')+' غالب است.','god'); });
    el.querySelector('.gr-mut').addEventListener('input',e=>{ GEN_RULES[k].mutRate=parseFloat(e.target.value); el.querySelector('.gr-mut-txt').textContent='٪'+fa(Math.round(GEN_RULES[k].mutRate*100)); });
    el.querySelector('.gr-eff').addEventListener('input',e=>{ GEN_RULES[k].effect=parseFloat(e.target.value); el.querySelector('.gr-eff-txt').textContent=fa1(GEN_RULES[k].effect); applyRulesToAll(); });
  });
}
function applyRulesToAll(){
  for(const a of S.agents){ a.genes=genesFromGenotype(a.genotype); }
  updateStats();
}
function buildAlleleSelect(){
  const sel=$('#alleleGeneSelect'); if(!sel) return;
  sel.innerHTML=Object.keys(GENE_LABELS).map(k=>`<option value="${k}" ${k===S.alleleGene?'selected':''}>${GENE_LABELS[k]}</option>`).join('');
  sel.addEventListener('change',e=>{ S.alleleGene=e.target.value; updateStats(); drawAlleleChart(); });
}
const GUIDE=[
 {t:'🧬 وراثت مندلی',d:'هر ویژگی دو نسخه (آلل) دارد؛ یکی از پدر، یکی از مادر. ژنوتیپ AA یعنی هر دو آلل بزرگ، Aa یعنی یکی بزرگ یکی کوچک، aa یعنی هر دو کوچک.',ex:'مثال: اگر سرعت AA باشد سریع است، Aa هم سریع است چون A غالب است، ولی aa کند است. Aa حامل پنهان آلل کوچک است و می‌تواند به بچه‌اش بدهد.'},
 {t:'🔲 جدول پانت',d:'جدول پانت همه‌ی ترکیب‌های ممکن آلل‌های پدر و مادر را نشان می‌دهد و احتمال ژنوتیپ بچه را حساب می‌کند.',ex:'مثال: Aa × Aa می‌شود ۲۵٪ AA، ۵۰٪ Aa و ۲۵٪ aa. یعنی یک‌چهارم بچه‌ها ویژگی مغلوب را نشان می‌دهند.'},
 {t:'📊 چندژنی (Polygenic)',d:'بعضی ویژگی‌ها مثل سرعت، بینایی و جثه را یک ژن تعیین نمی‌کند؛ جمع چند ژن + کمی اثر محیط است، پس مقدارشان پیوسته و متنوع است.',ex:'مثال: سرعت حاصل ۳ جایگاه ژنی است؛ هرچه آلل A بیشتر باشد، سریع‌تر است. به‌همین دلیل سرعت‌ها پله‌پله نیستند.'},
 {t:'🎲 جهش',d:'گاهی هنگام تولد یک آلل برعکس می‌شود. بیشتر جهش‌ها خنثی‌اند (فنوتیپ عوض نمی‌شود)، بعضی مفید و بعضی مضرند.',ex:'مثال: جهش Aa به AA وقتی A غالب است خنثی است؛ ولی جهش AA به aa می‌تواند یک موجود سریع را کند کند.'},
 {t:'🌊 رانش ژنتیکی و گلوگاه',d:'وقتی جمعیت کوچک می‌شود، فرکانس آلل‌ها تصادفی جابه‌جا می‌شود، حتی بدون هیچ انتخابی. این رانش است.',ex:'مثال: دکمه گلوگاه جمعیت را به ۱۰ نفر می‌رساند؛ ببین فرکانس آلل A چطور ناگهان از ۵۰٪ به ۲۰٪ یا ۸۰٪ می‌پرد.'},
 {t:'🌱 اثر بنیان‌گذار',d:'اگر چند نفر جدا شوند و جمعیت تازه‌ای بسازند، ژن‌های آن چند نفر، ژن کل نسل‌های بعد می‌شود.',ex:'مثال: ۵ بنیان‌گذار که تصادفی بیشترشان آلل a دارند، جمعیتی می‌سازند که نسل‌ها a در آن زیاد است.'},
 {t:'💞 انتخاب طبیعی و جنسی',d:'موجود سازگارتر بیشتر زنده می‌ماند و بچه‌دار می‌شود (انتخاب طبیعی). ماده‌ها هم ممکن است نر خاصی را ترجیح دهند (انتخاب جنسی).',ex:'مثال: در قحطی، متابولیسم کند برنده است. اگر ترجیح جنسی روی «سریع‌تر» باشد، نرهای سریع حتی اگر کمی گرسنه‌تر باشند، بیشتر جفت می‌گیرند.'},
 {t:'🧳 جریان ژنی',d:'مهاجرت ژن‌های تازه وارد جمعیت می‌کند و تنوع را برمی‌گرداند.',ex:'مثال: ۸ مهاجر با ژن سرعت متفاوت وارد کن؛ ببین چطور در چند نسل آلل‌هایشان در کل جمعیت پخش می‌شود.'},
 {t:'💔 افسردگی هم‌خونی',d:'تولیدمثل خویشاوندان نزدیک، آلل‌های مغلوب مضر را کنار هم می‌آورد؛ فرزند ضعیف‌تر می‌شود یا می‌میرد.',ex:'مثال: خواهر و برادر (F=۲۵٪) بچه‌دار شوند، بچه ۳۵٪ شانس مرگ در بدو تولد دارد و عمرش کوتاه‌تر است.'},
 {t:'⚖️ تعادل هاردی–واینبرگ',d:'اگر هیچ انتخاب، جهش، مهاجرت و رانشی نباشد، فرکانس ژنوتیپ‌ها ثابت می‌ماند: AA=p² ، Aa=2pq ، aa=q².',ex:'مثال: اگر p=۰٫۶ باشد، انتظار داریم ۳۶٪ AA، ۴۸٪ Aa و ۱۶٪ aa ببینیم. هرچه مشاهده‌شده از این دورتر باشد، یعنی انتخاب یا رانش در کار است.'},
 {t:'🎭 اپیستازی',d:'یک ژن می‌تواند اثر ژن دیگر را کاملاً بپوشاند؛ مثل اینکه یک کلید، چراغ دیگری را خاموش کند.',ex:'مثال: ژن «پوشش تیره» اگر ظاهر شود، بدن تیره می‌شود، هرچقدر هم ژن «رنگ پوشش» روشن باشد. رنگ روشن زیر پوشش تیره پنهان می‌ماند ولی به بچه‌ها منتقل می‌شود.'},
];
function buildGuide(){
  const box=$('#guideList'); if(!box) return;
  box.innerHTML=GUIDE.map(g=>`<div class="guide-card"><h4>${g.t}</h4><p>${g.d}</p><p class="ex">${g.ex}</p></div>`).join('');
}

/* ---------------- ورودی لمسی / موس ---------------- */
let lastTap=0,lastTapX=0,lastTapY=0,downX=0,downY=0;
function canvasPos(e){ const r=canvas.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }
canvas.addEventListener('pointerdown',e=>{ const p=canvasPos(e); downX=p.x; downY=p.y; });
canvas.addEventListener('pointerup',e=>{
  const p=canvasPos(e); if(Math.hypot(p.x-downX,p.y-downY)>12) return; // کشیدن بود، نه ضربه
  const now=Date.now();
  if(now-lastTap<350&&Math.hypot(p.x-lastTapX,p.y-lastTapY)<45){
    for(let i=0;i<12;i++) spawnFood(p.x+rand(-70,70),p.y+rand(-70,70));
    burst(p.x,p.y,'#4ade80',16,120); toast('🍎 باران غذا!'); lastTap=0; return;
  }
  lastTap=now; lastTapX=p.x; lastTapY=p.y;
  if(S.armed){ execPower(S.armed,p.x,p.y); return; }
  const a=nearestAgent(p.x,p.y,34);
  if(a){
    if(S.pickMate){ S.mateSelected=a; S.pickMate=false; toast('💞 والد دوم: '+a.name+' — جدول پانت را در تب ژنتیک ببین'); renderPunnettBox(); updateSelected(); return; }
    S.selected=a; updateSelected();
  }
  else { S.selected=null; S.follow=false; updateSelected(); }
});
canvas.addEventListener('contextmenu',e=>e.preventDefault());

/* ---------------- سیم‌کشی دکمه‌ها ---------------- */
function setRunning(v){
  S.running=v; $('#btnPlay').textContent=v?'⏸ توقف':'▶️ ادامه';
}
$('#btnPlay').addEventListener('click',()=>setRunning(!S.running));
$('#btnSpeed').addEventListener('click',()=>{
  S.speed=S.speed===1?2:S.speed===2?4:S.speed===4?8:1;
  $('#btnSpeed').textContent='⚡ سرعت ×'+fa(S.speed);
});
$('#btnStep').addEventListener('click',()=>{ if(S.running) setRunning(false); tick(0.5); draw(); updateStats(); });
$('#btnReset').addEventListener('click',()=>{
  if(confirm('دنیای تازه بسازم؟ همه‌ی موجودات و تاریخچه پاک می‌شود.')){ resetWorld(); logEvent('🌍 دنیای تازه آفریده شد.','god'); toast('🌍 دنیای تازه آفریده شد'); }
});
$('#btnRebirth').addEventListener('click',()=>{ resetWorld(); toast('🌱 آفرینش دوباره!'); });
$('#btnPanel').addEventListener('click',()=>$('#panel').classList.toggle('open'));
$('#panelHandle').addEventListener('click',()=>$('#panel').classList.toggle('open'));
$$('.tab').forEach(t=>t.addEventListener('click',()=>{
  $$('.tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
  $$('.tab-page').forEach(p=>p.classList.remove('active'));
  $('#tab-'+t.dataset.tab).classList.add('active');
  $('#panel').classList.add('open');
}));
$('#btnDisarm').addEventListener('click',disarm);
$('#btnAdd10').addEventListener('click',()=>{ for(let i=0;i<10;i++) S.agents.push(makeAgent()); logEvent('➕ ۱۰ موجود تازه آفریده شدند.','god'); toast('➕ ۱۰ موجود اضافه شد'); });
$('#btnAddFood').addEventListener('click',()=>{ for(let i=0;i<25;i++) spawnFood(); toast('🍎 ۲۵ غذا ریخته شد'); });
$('#btnKill10').addEventListener('click',()=>{
  const victims=[...S.agents].sort(()=>Math.random()-.5).slice(0,10);
  victims.forEach(a=>killAgent(a,'خدا')); logEvent('💀 خدا ۱۰ موجود را کشت.','god');
});
$('#btnCloseSelected').addEventListener('click',()=>{S.selected=null;S.follow=false;updateSelected();});
$('#btnFollow').addEventListener('click',()=>{ S.follow=!S.follow; updateSelected(); toast(S.follow?'👁 دنبال می‌کنم':'دنبال‌کردن لغو شد'); });
$('#btnFeedOne').addEventListener('click',()=>{ if(S.selected){S.selected.energy=100;burst(S.selected.x,S.selected.y,'#4ade80',10,80);updateSelected();} });
$('#btnKillOne').addEventListener('click',()=>{ if(S.selected){const n=S.selected.name;killAgent(S.selected,'خدا');logEvent('⚡ خدا '+n+' را حذف کرد.','god');} });
$('#btnTraitOne').addEventListener('click',()=>{
  if(!S.selected) return;
  const t=pick(TRAITS); setGenotypeHigh(S.selected,t.gene);
  logEvent('🧬 به '+S.selected.name+' ویژگی «'+t.name+'» داده شد (ژنوتیپ AA).','god'); toast('🧬 «'+t.name+'» به '+S.selected.name+' داده شد'); updateSelected();
});
$('#btnPickMate').addEventListener('click',()=>{
  if(!S.selected){ toast('اول یک موجود را انتخاب کن'); return; }
  S.pickMate=true; toast('💞 حالا موجود دوم را روی زمین بزن تا والد دوم شود');
});
$('#btnRandomMut').addEventListener('click',()=>{
  for(const a of S.agents){const k=pick(Object.keys(GENE_LABELS)); const rule=GEN_RULES[k];
    for(let i=0;i<rule.loci;i++){ if(Math.random()<0.5) a.genotype[k][i]=[Math.random()<.5?1:0,Math.random()<.5?1:0]; }
    a.genes[k]=phenotypeFor(k,a.genotype[k]);}
  logEvent('🎲 جهش تصادفی در همه‌ی موجودات رخ داد.','god'); toast('🎲 جهش تصادفی اعمال شد');
});
$('#btnShuffleGenes').addEventListener('click',()=>{
  for(const a of S.agents){ a.genotype=randomGenotypeAll(); a.genes=genesFromGenotype(a.genotype); }
  logEvent('🔀 ژن‌های همه به‌هم ریخته شد.','god'); toast('🔀 ژن‌ها به‌هم ریخته شد');
});
$('#btnBottleneck').addEventListener('click',()=>doBottleneck(10,'گلوگاه جمعیتی'));
$('#btnBottleneck2').addEventListener('click',()=>doBottleneck(10,'گلوگاه جمعیتی'));
$('#btnFounder').addEventListener('click',()=>doBottleneck(5,'اثر بنیان‌گذار'));
$('#btnMigrant').addEventListener('click',()=>addMigrants(8));
$('#btnMigrant2').addEventListener('click',()=>addMigrants(8));
$('#btnResetRules').addEventListener('click',()=>{
  GEN_RULES=defaultRules(); S.genetics={matePref:'none',matePrefStrength:0.6};
  $('#matePref').value='none'; $('#matePrefStrength').value=0.6; $('#matePrefStrengthTxt').textContent='۰٫۶';
  applyRulesToAll(); buildGeneRules();
  logEvent('🔬 قوانین ژنتیک به حالت علمی استاندارد برگشت.','god'); toast('قوانین به حالت استاندارد برگشت');
});
$('#matePref').addEventListener('change',e=>{ S.genetics.matePref=e.target.value; logEvent('💞 ترجیح جنسی عوض شد: '+e.target.selectedOptions[0].textContent,'god'); });
$('#matePrefStrength').addEventListener('input',e=>{ S.genetics.matePrefStrength=parseFloat(e.target.value); $('#matePrefStrengthTxt').textContent=fa1(S.genetics.matePrefStrength); });
$('#ctPower').addEventListener('input',e=>$('#ctPowerTxt').textContent=fa1(parseFloat(e.target.value)));
$('#btnCreateTrait').addEventListener('click',()=>{
  const name=$('#ctName').value.trim();
  if(!name){ toast('اول یک نام برای ویژگی بنویس'); $('#ctName').focus(); return; }
  const t={id:'ct'+Date.now(),icon:'✨',name,gene:$('#ctGene').value,power:parseFloat($('#ctPower').value)};
  S.customTraits.push(t); localStorage.setItem('godsim-custom',JSON.stringify(S.customTraits));
  injectTrait(t,25); renderCustomTraits(); $('#ctName').value='';
  logEvent('✨ ویژگی دلخواه «'+name+'» ساخته و به ۲۵٪ تزریق شد.','god');
});
$('#btnSave').addEventListener('click',()=>{
  const data={v:2,settings:S.settings,day:S.day,timeOfDay:S.timeOfDay,births:S.births,deaths:S.deaths,fights:S.fights,
    deathsBy:S.deathsBy,nextId:S.nextId,nextLineage:S.nextLineage,mutations:S.mutations,genetics:S.genetics,
    geneRules:GEN_RULES,alleleGene:S.alleleGene,
    agents:S.agents.map(a=>({x:a.x,y:a.y,genes:a.genes,genotype:a.genotype,gen:a.gen,lineage:a.lineage,hue:a.hue,sex:a.sex,energy:a.energy,health:a.health,age:a.age,lifespan:a.lifespan,children:a.children,name:a.name,parents:a.parents||[],ancestors:a.ancestors||[],inbreedF:a.inbreedF||0}))};
  localStorage.setItem('godsim-save',JSON.stringify(data)); toast('💾 جهان ذخیره شد'); logEvent('💾 جهان ذخیره شد.','good');
});
$('#btnLoad').addEventListener('click',()=>{
  const raw=localStorage.getItem('godsim-save');
  if(!raw){ toast('ذخیره‌ای پیدا نشد'); return; }
  try{
    const d=JSON.parse(raw);
    Object.assign(S.settings,d.settings); S.day=d.day; S.timeOfDay=d.timeOfDay;
    S.births=d.births; S.deaths=d.deaths; S.fights=d.fights; S.deathsBy=d.deathsBy;
    S.nextId=d.nextId; S.nextLineage=d.nextLineage; S.agents=[]; S.foods=[]; S.selected=null;
    if(d.geneRules) GEN_RULES=d.geneRules;
    if(d.genetics) Object.assign(S.genetics,d.genetics);
    if(d.mutations) S.mutations=d.mutations;
    if(d.alleleGene) S.alleleGene=d.alleleGene;
    for(const a of d.agents){
      // سازگاری با ذخیره‌های قدیمی (v1) که ژنوتیپ نداشتند
      const gt=a.genotype||randomGenotypeAll();
      Object.keys(GENE_LABELS).forEach(k=>{ if(!gt[k]) gt[k]=randomGenotype(k,0.5); if(gt[k]._env===undefined) gt[k]._env=0; });
      const ag=makeAgent(a.x,a.y,a.genes||genesFromGenotype(gt),a.gen,a.lineage,a.hue,gt,a.parents||[],a.ancestors||[]);
      Object.assign(ag,{sex:a.sex,energy:a.energy,health:a.health,age:a.age,lifespan:a.lifespan,children:a.children,name:a.name,inbreedF:a.inbreedF||0});
      ag.genes=genesFromGenotype(gt); S.agents.push(ag);
    }
    for(let i=0;i<70;i++) spawnFood();
    buildSliders(); buildGeneRules(); buildAlleleSelect();
    $('#matePref').value=S.genetics.matePref; $('#matePrefStrength').value=S.genetics.matePrefStrength;
    $('#matePrefStrengthTxt').textContent=fa1(S.genetics.matePrefStrength);
    $('#extinctBox').hidden=true;
    toast('📂 ذخیره بارگذاری شد'); logEvent('📂 ذخیره‌ی جهان بارگذاری شد.','good');
  }catch(e){ toast('ذخیره خراب است'); }
});
function download(name,text,type){
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([text],{type})); a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000);
}
$('#btnExport').addEventListener('click',()=>{
  const data={day:S.day,population:S.agents.length,births:S.births,deaths:S.deaths,deathsBy:S.deathsBy,fights:S.fights,
    avgGenes:geneAvg(),traitFreq:Object.fromEntries(TRAITS.map(t=>[t.name,Math.round(traitFreq(t))])),settings:S.settings,
    geneRules:GEN_RULES,genetics:S.genetics,mutations:S.mutations,
    alleleFreq:Object.fromEntries(Object.keys(GENE_LABELS).map(k=>[k,alleleFreq(k)])),
    hardyWeinberg:Object.fromEntries(Object.keys(GENE_LABELS).map(k=>[k,hardyWeinberg(k)]))};
  download('god-sim-stats-day-'+S.day+'.json',JSON.stringify(data,null,2),'application/json'); toast('📥 خروجی آمار دانلود شد');
});
$('#btnExportLog').addEventListener('click',()=>{
  const text=[...$('#eventLog').children].reverse().map(li=>li.textContent).join('\n');
  download('god-sim-log-day-'+S.day+'.txt',text||'رویدادی ثبت نشده.','text/plain'); toast('📜 خروجی رویدادها دانلود شد');
});
$('#btnClearLog').addEventListener('click',()=>{ $('#eventLog').innerHTML=''; logEvent('🧹 دفتر رویدادها پاک شد.'); });
$('#btnCopyLog').addEventListener('click',async()=>{
  const text=[...$('#eventLog').children].reverse().map(li=>li.textContent).join('\n');
  try{ await navigator.clipboard.writeText(text); toast('📋 رویدادها کپی شد'); }catch(e){ toast('کپی نشد — مرورگر اجازه نداد'); }
});

/* ---------------- حلقه اصلی ---------------- */
let lastT=performance.now(), acc=0;
function loop(now){
  const rawDt=Math.min(0.1,(now-lastT)/1000); lastT=now;
  S.fps=S.fps*0.95+(1/Math.max(rawDt,0.001))*0.05;
  if(S.running){ acc+=rawDt*S.speed; let steps=0;
    while(acc>1/60&&steps<8){ tick(1/60); acc-=1/60; steps++; }
    if(steps===8) acc=0;
  }
  draw();
  statAcc+=rawDt;
  if(statAcc>0.25){ statAcc=0; updateStats(); }
  chartAcc+=rawDt;
  if(chartAcc>1){ chartAcc=0; drawLineChart($('#chartPop'),S.historyPop,'جمعیت: '+fa(S.agents.length),'#34d399'); drawTraitChart(); drawAlleleChart(); }
  requestAnimationFrame(loop);
}

/* ---------------- شروع ---------------- */
window.addEventListener('resize',resize);
buildSliders(); buildPresets(); buildPowers(); buildTraits(); buildGeneRules(); buildAlleleSelect(); buildGuide();
resize(); resetWorld(120);
logEvent('👋 به جهان کوچک خوش آمدی، خدا! موجودات دنبال غذا می‌گردند؛ ویژگی تزریق کن و تکامل را تماشا کن.','good');
logEvent('💡 راهنما: دو بار روی زمین بزن = باران غذا. روی یک موجود بزن تا ژن‌هایش را ببینی.','good');
updateStats(); requestAnimationFrame(loop);
