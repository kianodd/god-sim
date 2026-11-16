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

/* ---------------- آیکون‌های واقعی (SVG) به‌جای ایموجی ----------------
   هر آیکون یک رشته‌ی SVG درون‌خطی است؛ icon('fire') آن را برمی‌گرداند.
   در رندر UI به‌جای ایموجی از icon() استفاده می‌شود. */
const ICONS={
world:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/>',
play:'<path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none"/>',
pause:'<path d="M8 5v14M16 5v14"/>',
step:'<path d="M5 4l9 8-9 8z" fill="currentColor" stroke="none"/><path d="M18 5v14"/>',
reset:'<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>',
panel:'<path d="M4 7h16M4 12h16M4 17h16"/><circle cx="9" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="17" r="2"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 15c2.8.3 4.8 1.9 5.5 4.5"/>',
food:'<circle cx="12" cy="14" r="6.5"/><path d="M12 8c0-2.5 1-4 2.5-5"/><path d="M12 8.5c-2.5-1.5-5-0.5-5.5 1.5 1.5 1.5 4 1 5.5-1.5z"/>',
land:'<path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
birth:'<circle cx="12" cy="12" r="9"/><path d="M9 12a3 3 0 0 1 6 0"/><path d="M8 16c1-1 2.5-1.5 4-1.5s3 .5 4 1.5"/>',
death:'<circle cx="12" cy="11" r="8"/><path d="M9 20v-3M15 20v-3M9 20h6"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/>',
gene:'<path d="M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9"/><path d="M8 6.5h8M8 17.5h8"/>',
fight:'<path d="M4 4l12 12M16 4L4 16"/><path d="M14 3l7 1-1 7M10 3l-7 1 1 7"/>',
wood:'<path d="M12 3l6 9H6z"/><path d="M12 12l4 6H8z"/><path d="M12 18v3"/>',
coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.5-1.3-2.5-3-2.5s-3 1-3 2.5 1 2 3 2.5 3 1 3 2.5-1.3 2.5-3 2.5-3-1-3-2.5"/>',
home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
farm:'<path d="M12 22V8"/><path d="M12 8C12 5 10 3 7 3c0 3 2 5 5 5zM12 12c0-3 2-5 5-5 0 3-2 5-5 5zM12 16c0-3-2-5-5-5 0 3 2 5 5 5z"/>',
pasture:'<path d="M3 9v10M9 9v10M15 9v10M21 9v10M3 12h18M3 16h18"/>',
school:'<path d="M3 9l9-5 9 5-9 5z"/><path d="M6 11v6M12 13v6M18 11v6M4 20h16"/>',
university:'<path d="M3 9l9-6 9 6z"/><path d="M5 10v9M10 10v9M14 10v9M19 10v9M3 20h18"/>',
hospital:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8M8 12h8"/>',
market:'<path d="M4 9l1-4h14l1 4"/><path d="M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0"/><path d="M5 11v9h14v-9"/>',
workshop:'<path d="M14 5l5 5-2.5 2.5-5-5z"/><path d="M12 7L3 16l2 2 9-9"/>',
wall:'<path d="M3 18V8h18v10"/><path d="M3 13h18M9 8v5M15 8v5M9 13v5M15 13v5"/>',
tower:'<path d="M9 21V9l-2-4h10l-2 4v12"/><path d="M7 21h10M12 12v3"/>',
barracks:'<path d="M12 3L2 20h20z"/><path d="M9 20v-5h6v5"/>',
castle:'<path d="M4 21V8l-1-3h4l1 3h8l1-3h4l-1 3v13"/><path d="M3 21h18M10 21v-6h4v6"/>',
crown:'<path d="M3 19h18v2.5H3z"/><path d="M4 18L2.5 7l5.5 4L12 4l4 7 5.5-4L20 18z"/><circle cx="12" cy="14" r="1.2" fill="#ef4444" stroke="none"/>',
cube:'<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 12l9-5M12 12L3 7M12 12v10"/>',
grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
tent:'<path d="M12 4L2 20h20z"/><path d="M12 12v8"/>',
command:'<path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z"/>',
armory:'<path d="M6 3l12 12M18 3L6 15"/><path d="M4 20l4-1-1-4zM20 20l-4-1 1-4z"/>',
fire:'<path d="M12 3c1 3-2 5-2 8a4 4 0 0 0 8 0c0-2-1-3-1-3s3 2 3 5a7 7 0 0 1-14 0c0-5 4-7 6-10z"/>',
tools:'<path d="M14 4l6 6-3 3-6-6z"/><path d="M11 7L4 14l2 2 7-7"/>',
herding:'<circle cx="12" cy="12" r="6"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><path d="M12 4v-2M12 22v-2M4 12H2M22 12h-2"/>',
pottery:'<path d="M9 3h6M10 3c0 3-3 4-3 7 0 2 1 3 2 4v7h6v-7c1-1 2-2 2-4 0-3-3-4-3-7"/>',
copper:'<path d="M7 5h10l2 6H5z"/><path d="M9 17h6l1 4H8z"/>',
bronze:'<path d="M7 5h10l2 6H5z"/><path d="M9 17h6l1 4H8z"/><path d="M12 11v3"/>',
iron:'<path d="M7 5h10l2 6H5z"/><path d="M12 11v9"/>',
wheel:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 3v7M12 14v7M3 12h7M14 12h7M6 6l4 4M18 6l-4 4M6 18l4-4M18 18l-4-4"/>',
writing:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
money:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.5-1.3-2.5-3-2.5s-3 1-3 2.5 1 2 3 2.5 3 1 3 2.5-1.3 2.5-3 2.5-3-1-3-2.5"/>',
medicine:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
math:'<path d="M4 20L20 4"/><path d="M4 4h8v8H4z"/>',
schooling:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 2 2.5 3 6 3s6-1 6-3v-5M22 9v5"/>',
woodsword:'<path d="M5 19L17 7"/><path d="M15 3l6 6-2.5 2.5L13 6z"/><path d="M4 20l3-1-1-3z"/>',
bow:'<path d="M6 3c6 4 6 14 0 18"/><path d="M6 3v18"/><path d="M6 12h14M17 12l-3-2M17 12l-3 2"/>',
armor:'<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
spear:'<path d="M4 20L18 6"/><path d="M18 6l-3-1-1-3z"/>',
gatherer:'<path d="M5 10h14l-2 10H7z"/><path d="M9 10c0-3 1.5-5 3-5s3 2 3 5"/>',
farmer:'<path d="M12 22V8"/><path d="M12 8C12 5 10 3 7 3c0 3 2 5 5 5zM12 12c0-3 2-5 5-5 0 3-2 5-5 5z"/>',
builder:'<path d="M14 5l5 5-2.5 2.5-5-5z"/><path d="M12 7L3 16l2 2 9-9"/>',
warrior:'<path d="M5 19L17 7"/><path d="M15 3l6 6-2.5 2.5L13 6z"/>',
scholar:'<path d="M4 5a3 3 0 0 1 3-2h13v16H7a3 3 0 0 0-3 3z"/><path d="M4 19a3 3 0 0 1 3-3h13"/>',
healer:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
trader:'<path d="M12 4v16M6 20h12"/><path d="M5 8l-2.5 5a3 3 0 0 0 5 0zM19 8l-2.5 5a3 3 0 0 0 5 0z"/>',
herder:'<circle cx="12" cy="13" r="6"/><path d="M8 8c0-2 1.5-3 4-3s4 1 4 3"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/>',
blacksmith:'<path d="M5 9h14l-2 4H7z"/><path d="M8 13h8l-1 8H9z"/>',
guard:'<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
hunter:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
woodcutter:'<path d="M14 4l6 6-3 3-6-6z"/><path d="M11 7L4 14l2 2 7-7"/><path d="M4 20l2-2"/>',
miner:'<path d="M14 4l6 6-3 3-6-6z"/><path d="M11 7L4 14l2 2 7-7"/><circle cx="17" cy="17" r="3"/>',
cook:'<path d="M4 11h16v3a8 8 0 0 1-16 0z"/><path d="M8 11V7M12 11V6M16 11V7"/>',
sexworker:'<path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/>',
god:'<path d="M7 18a4 4 0 1 1 .6-7.96A5 5 0 0 1 17 8.5 4.5 4.5 0 0 1 17 18z"/><path d="M12 12l-2 4h4z"/>',
traits:'<path d="M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9"/>',
genetics:'<path d="M9 3h6M10 3v6l-6 9a3 3 0 0 0 2.5 4h11a3 3 0 0 0 2.5-4l-6-9V3"/><path d="M7.5 15h9"/>',
civ:'<path d="M3 9l9-6 9 6z"/><path d="M5 10v9M10 10v9M14 10v9M19 10v9M3 20h18"/>',
stats:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
log:'<path d="M6 3h9a3 3 0 0 1 3 3v15l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
guide:'<path d="M4 5a3 3 0 0 1 3-2h13v16H7a3 3 0 0 0-3 3z"/><path d="M4 19a3 3 0 0 1 3-3h13"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
moon:'<path d="M20 13A8 8 0 1 1 11 4a6.5 6.5 0 0 0 9 9z"/>',
temp:'<path d="M10 4a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/><path d="M12 9v6"/>',
heart:'<path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/>',
hunger:'<circle cx="12" cy="13" r="7"/><path d="M12 6c0-2 1-3 3-3"/>',
age:'<path d="M6 3h12M6 21h12M7 3c0 6 5 6 5 9s-5 3-5 9M17 3c0 6-5 6-5 9s5 3 5 9"/>',
knowledge:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.8.6 1.5 1.3 1.5 2.1h4c0-.8.7-1.5 1.5-2.1A6 6 0 0 0 12 3z"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>',
follow:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>',
feed:'<circle cx="12" cy="13" r="7"/><path d="M12 6c0-2 1-3 3-3"/>',
mate:'<path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/><path d="M12 8v4"/>',
kill:'<circle cx="12" cy="11" r="8"/><path d="M9 20v-3M15 20v-3M9 20h6"/>',
save:'<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>',
load:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
export:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>',
clear:'<path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
minus:'<path d="M5 12h14"/>',
check:'<path d="M4 12l5 5L20 6"/>',
lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
gift:'<rect x="4" y="10" width="16" height="10"/><path d="M12 10v10M4 14h16M12 10c-4 0-5-2-5-4s3-3 5 1c2-4 5-3 5-1s-1 4-5 4z"/>',
peace:'<path d="M12 3v18M12 7c-3-2-6-1-6 1s2 3 6 3 4-1 6-3-3-3-6-1z"/>',
war:'<path d="M4 4l12 12M16 4L4 16"/><path d="M14 3l7 1-1 7M10 3l-7 1 1 7"/>',
flag:'<path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/>',
sword:'<path d="M5 19L17 7"/><path d="M15 3l6 6-2.5 2.5L13 6z"/>',
shield:'<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/>',
star:'<path d="M12 2l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z"/>',
sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z"/>',
tree:'<path d="M12 3l6 9H6z"/><path d="M12 12l4 6H8z"/><path d="M12 18v3"/>',
stone:'<path d="M6 16l3-8 6-2 4 5-2 6-8 2z"/>',
sheep:'<circle cx="12" cy="13" r="6"/><path d="M8 8c0-2 1.5-3 4-3s4 1 4 3"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/>',
cow:'<circle cx="12" cy="13" r="6"/><path d="M8 9l-2-2M16 9l2-2"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/>',
wolf:'<path d="M5 5l4 4 3-2 3 2 4-4-1 8-3 3h-6l-3-3z"/><path d="M9 16v4M15 16v4"/>',
bear:'<circle cx="9" cy="8" r="2"/><circle cx="15" cy="8" r="2"/><circle cx="12" cy="13" r="7"/><circle cx="10" cy="12" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/>',
meat:'<path d="M15 6a4 4 0 0 1 4 4c0 3-3 5-6 5l-6 5-2-2 5-6c0-3 2-6 5-6z"/>',
milk:'<path d="M9 3h6M10 3v4l-2 3v11h8V10l-2-3V3"/><path d="M9 14h6"/>',
rain:'<path d="M7 15a4 4 0 1 1 .6-7.96A5 5 0 0 1 17 8.5 4.5 4.5 0 0 1 17 15z"/><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2"/>',
lightning:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
meteor:'<circle cx="15" cy="9" r="5"/><path d="M10 12L4 18M12 8L8 4M16 14l-2 6"/>',
plague:'<circle cx="12" cy="12" r="3"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"/>',
bless:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
drought:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
paradise:'<path d="M4 18a8 8 0 0 1 16 0"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M10 18a2 2 0 0 1 4 0"/>',
famine:'<path d="M12 22V8"/><path d="M12 8c0-3-2-5-5-5 0 3 2 5 5 5z"/>',
ice:'<path d="M12 2v20M4 6l16 12M20 6L4 18"/><path d="M12 2l-2 3M12 2l2 3M12 22l-2-3M12 22l2-3"/>',
heat:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4"/>',
calm:'<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15z"/><path d="M5 19c3-6 7-10 11-12"/>',
map:'<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
zoomin:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5M11 8v6M8 11h6"/>',
zoomout:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5M8 11h6"/>',
center:'<circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
close:'<path d="M6 6l12 12M18 6L6 18"/>',
family:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M12 14c-1.5-1-2.5-1.8-2.5-3a1.5 1.5 0 0 1 2.5-1.2A1.5 1.5 0 0 1 14.5 11c0 1.2-1 2-2.5 3z"/>',
loyalty:'<path d="M12 20s-7-4.5-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.5-9 9-9 9z"/><path d="M7 12l2 2 4-4"/>',
opinion:'<path d="M12 4v16M6 20h12"/><path d="M5 8l-2.5 5a3 3 0 0 0 5 0zM19 8l-2.5 5a3 3 0 0 0 5 0z"/>',
chief:'<path d="M3 8l4 4 5-6 5 6 4-4-2 11H5z"/>',
leave:'<path d="M14 4h6v16h-6"/><path d="M3 12h11M10 8l4 4-4 4"/>',
join:'<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20c.8-3.2 3.4-5 6.5-5 1 0 2 .2 2.8.6"/><path d="M18 8v6M15 11h6"/>',
found:'<path d="M5 21V4"/><path d="M5 4h13l-3 4 3 4H5"/>',
battle:'<path d="M4 4l12 12M16 4L4 16"/><path d="M14 3l7 1-1 7M10 3l-7 1 1 7"/>',
loot:'<path d="M6 8h12l-1 12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M9 8c0-3 1.5-5 3-5s3 2 3 5"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>',
speed:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
vision:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/>',
size:'<path d="M12 3v18M5 8l7-5 7 5"/><path d="M5 21h14"/>',
aggression:'<path d="M12 3l2.5 6.5L21 9l-5 4.5L17.5 20 12 16.5 6.5 20 8 13.5 3 9l6.5-.5z"/>',
metabolism:'<path d="M12 3v18M5 8l7-5 7 5"/><circle cx="12" cy="16" r="3"/>',
fertility:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
cooperation:'<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M3 20c.6-3 2.5-5 5-5s4.4 2 5 5M11 20c.6-3 2.5-5 5-5s4.4 2 5 5"/>',
coldRes:'<path d="M12 2v20M4 6l16 12M20 6L4 18"/>',
heatRes:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/>',
lifespan:'<path d="M6 3h12M6 21h12M7 3c0 6 5 6 5 9s-5 3-5 9M17 3c0 6-5 6-5 9s5 3 5 9"/>',
efficiency:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
immunity:'<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
coat:'<path d="M12 3c-4 2-6 5-6 9a6 6 0 0 0 12 0c0-4-2-7-6-9z"/>',
mask:'<path d="M3 12c2-4 6-6 9-6s7 2 9 6c-2 4-6 6-9 6s-7-2-9-6z"/><circle cx="12" cy="12" r="2.5"/>',
/* v4: آیکون‌های تازه (اتحاد، مغازه‌های شغلی، محاصره، تجارت) */
alliance:'<circle cx="8" cy="12" r="4.5"/><circle cx="16" cy="12" r="4.5"/>',
bakery:'<path d="M4 14a8 5 0 0 1 16 0v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M9 14v-1.5M13 14v-1.5M17 14v-1.5"/>',
granary:'<path d="M8 21V9a4 4 0 0 1 8 0v12"/><path d="M5 21h14"/><path d="M8 13h8M8 17h8"/>',
smithy:'<path d="M4 7h16v3H4z"/><path d="M9 10l-1 6h8l-1-6"/><path d="M7 20h10"/>',
butcher:'<path d="M4 4h9a3 3 0 0 1 3 3v4H8a4 4 0 0 1-4-4z"/><path d="M16 11l5 5M18 9l4 4"/>',
library:'<path d="M5 4h4v16H5zM11 4h4v16h-4zM17 4h2v16h-2z"/>',
clinic:'<path d="M9 3h6v4h4v6h-4v8H9v-8H5V7h4z"/>',
inn:'<path d="M3 18v-8M3 14h18v4"/><path d="M3 14a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3"/><circle cx="6.5" cy="11" r="1.5"/>',
siege:'<path d="M4 20h16"/><path d="M6 20l9-13 4 2"/><circle cx="19" cy="6" r="2.5"/>',
rubble:'<path d="M4 20h16M6 20v-6l4 2v4M12 20v-9l4 3v6M18 20v-4"/>',
repair:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17a2.1 2.1 0 0 0 3 3l5.3-5.3a4 4 0 0 0 5.4-5.4L14.5 12l-2.5-2.5z"/>',
demolish:'<path d="M13 4l7 7"/><path d="M4 20l7-7"/><path d="M15 3l6 6-2 2-6-6z"/>',
trade:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
scale:'<path d="M12 4v16M8 20h8"/><path d="M5 7h14"/><path d="M7 7l-2.5 5a2.8 2.8 0 0 0 5 0zM17 7l-2.5 5a2.8 2.8 0 0 0 5 0z"/>',
upgrade:'<path d="M6 15l6-6 6 6M6 20l6-6 6 6"/>',
};
function icon(n,cls){ return '<svg class="ic'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[n]||ICONS.star)+'</svg>'; }

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
 {id:'speed',icon:'speed',name:'سرعت بالا',gene:'speed',desc:'دو برابر سریع‌تر به غذا می‌رسد، ولی انرژی بیشتری می‌سوزاند.'},
 {id:'vision',icon:'vision',name:'بینایی عقابی',gene:'vision',desc:'غذا را از خیلی دورتر می‌بیند و کمتر گرسنه می‌ماند.'},
 {id:'slowMetab',icon:'metabolism',name:'متابولیسم کند',gene:'metabolism',desc:'آهسته غذا می‌سوزاند؛ در قحطی دیرتر می‌میرد.'},
 {id:'aggressive',icon:'aggression',name:'پرخاشگر',gene:'aggression',desc:'سر غذا می‌جنگد و غذای دیگران را می‌گیرد.'},
 {id:'giant',icon:'size',name:'غول‌پیکر',gene:'size',desc:'بزرگ و قوی؛ در دعوا برنده می‌شود ولی بیشتر غذا می‌خواهد.'},
 {id:'fertile',icon:'fertility',name:'باروری بالا',gene:'fertility',desc:'سریع‌تر و بیشتر بچه‌دار می‌شود.'},
 {id:'coop',icon:'cooperation',name:'همکاری‌گر',gene:'cooperation',desc:'به‌جای جنگیدن غذا را تقسیم می‌کند و کمتر زخمی می‌شود.'},
 {id:'cold',icon:'coldRes',name:'مقاوم به سرما',gene:'coldRes',desc:'در سرما انرژی‌اش دیرتر تمام می‌شود.'},
 {id:'heat',icon:'heatRes',name:'مقاوم به گرما',gene:'heatRes',desc:'در موج گرما زنده می‌ماند.'},
 {id:'longlife',icon:'lifespan',name:'عمر طولانی',gene:'lifespan',desc:'دو برابر بیشتر عمر می‌کند و نسل‌های بیشتری می‌سازد.'},
 {id:'efficient',icon:'efficiency',name:'چابک',gene:'efficiency',desc:'با حرکت کمتر، انرژی کمتری می‌سوزاند.'},
 {id:'immune',icon:'immunity',name:'ایمنی قوی',gene:'immunity',desc:'در برابر طاعون مقاوم است و کمتر بیمار می‌شود.'},
 {id:'darkcoat',icon:'mask',name:'پوشش تیره',gene:'mask',desc:'اپیستازی: اگر ظاهر شود، بدن تیره می‌شود و رنگ پوشش را می‌پوشاند.'},
 /* --- دسته ۱: حواس (x001–x015) --- */
 {id:'x001',icon:'vision',name:'شنوایی تیز',gene:'vision',desc:'صداهای غذا و خطر را از دور می‌شنود و زودتر واکنش نشان می‌دهد.'},
 {id:'x002',icon:'vision',name:'بویایی قوی',gene:'vision',desc:'بوی غذا را از فاصله‌ی دور حس می‌کند و مستقیم به سمتش می‌رود.'},
 {id:'x003',icon:'vision',name:'چشم تیزبین',gene:'vision',desc:'ریزترین غذاها را هم از دور تشخیص می‌دهد.'},
 {id:'x004',icon:'vision',name:'بینایی شبانه',gene:'vision',desc:'در تاریکی شب هم غذا را می‌بیند و شکار می‌کند.'},
 {id:'x005',icon:'vision',name:'حس جهت‌یابی',gene:'vision',desc:'همیشه می‌داند غذا کجاست و مسیر مستقیم را پیدا می‌کند.'},
 {id:'x006',icon:'speed',name:'واکنش برق‌آسا',gene:'speed',desc:'به‌محض دیدن غذا مثل برق به سمتش می‌پرد.'},
 {id:'x007',icon:'vision',name:'گوش‌های جغدی',gene:'vision',desc:'حتی در سکوت هم کوچک‌ترین حرکت را حس می‌کند.'},
 {id:'x008',icon:'vision',name:'نگاه جست‌وجوگر',gene:'vision',desc:'زمین را وجب‌به‌وجب می‌گردد و غذای پنهان را پیدا می‌کند.'},
 {id:'x009',icon:'vision',name:'دید در مه',gene:'vision',desc:'در مه و تاریکی هم دیدش کم نمی‌شود.'},
 {id:'x010',icon:'vision',name:'شنونده‌ی خطر',gene:'vision',desc:'نزدیک‌شدن رقیب را زود حس می‌کند و فرار می‌کند.'},
 {id:'x011',icon:'vision',name:'حافظه‌ی مکانی',gene:'vision',desc:'جای غذاهای قبلی را به خاطر می‌سپارد و دوباره برمی‌گردد.'},
 {id:'x012',icon:'vision',name:'تمرکز شکار',gene:'vision',desc:'روی یک هدف قفل می‌کند و تا رسیدن به آن ول نمی‌کند.'},
 {id:'x013',icon:'vision',name:'حس پژواکی',gene:'vision',desc:'با صدا محیط را می‌سنجد و در تاریکی راهش را پیدا می‌کند.'},
 {id:'x014',icon:'vision',name:'حس گرما',gene:'vision',desc:'گرمای بدن دیگران را از دور حس می‌کند.'},
 {id:'x015',icon:'vision',name:'ذهن روشن',gene:'vision',desc:'محیط را سریع‌تر یاد می‌گیرد و غذا را زودتر پیدا می‌کند.'},
 /* --- دسته ۲: بدن و قدرت (x016–x030) --- */
 {id:'x016',icon:'size',name:'بازوی پولادین',gene:'size',desc:'عضله‌هایش قوی‌اند و در دعوا کمتر کسی حریفش می‌شود.'},
 {id:'x017',icon:'size',name:'تنومند',gene:'size',desc:'جثه‌ی بزرگی دارد و رقیب‌ها از او می‌ترسند.'},
 {id:'x018',icon:'size',name:'پوست سنگی',gene:'size',desc:'پوست سفتش ضربه‌ها را کم می‌کند.'},
 {id:'x019',icon:'size',name:'قدرت بدنی',gene:'size',desc:'در کشمکش سر غذا معمولاً برنده است.'},
 {id:'x020',icon:'size',name:'شاخ‌دار',gene:'size',desc:'با شاخش رقیب را عقب می‌راند و غذایش را می‌گیرد.'},
 {id:'x021',icon:'size',name:'سنگین‌وزن',gene:'size',desc:'وزنش زیاد است و کسی نمی‌تواند او را هل بدهد.'},
 {id:'x022',icon:'speed',name:'سرعت برق',gene:'speed',desc:'آن‌قدر سریع است که غذا را قبل از همه می‌قاپد.'},
 {id:'x023',icon:'speed',name:'دونده‌ی استقامت',gene:'speed',desc:'سریع می‌دود و دیر خسته می‌شود.'},
 {id:'x024',icon:'speed',name:'چابکی یوز',gene:'speed',desc:'شتابش بی‌نظیر است و در یک چشم‌به‌هم‌زدن می‌رسد.'},
 {id:'x025',icon:'efficiency',name:'سبک‌بال',gene:'efficiency',desc:'بدنش سبک است و با انرژی کم مسافت زیادی می‌رود.'},
 {id:'x026',icon:'speed',name:'جهنده',gene:'speed',desc:'با جهش‌های بلند سریع به غذا می‌رسد.'},
 {id:'x027',icon:'size',name:'لاک‌پشتی',gene:'size',desc:'لاک سختش او را از ضربه‌ها محافظت می‌کند.'},
 {id:'x028',icon:'size',name:'بدن الماسی',gene:'size',desc:'بدنش سخت و محکم است و زخم کمتر می‌خورد.'},
 {id:'x029',icon:'size',name:'یال‌دار',gene:'size',desc:'یالش او را بزرگ‌تر نشان می‌دهد و رقیب‌ها عقب می‌کشند.'},
 {id:'x030',icon:'speed',name:'قدم‌های بلند',gene:'speed',desc:'با هر قدم مسافت بیشتری می‌رود و زود به غذا می‌رسد.'},
 /* --- دسته ۳: رفتار و هوش (x031–x045) --- */
 {id:'x031',icon:'efficiency',name:'هوش بالا',gene:'efficiency',desc:'راه کوتاه‌تر را انتخاب می‌کند و کمتر انرژی هدر می‌دهد.'},
 {id:'x032',icon:'efficiency',name:'متفکر',gene:'efficiency',desc:'قبل از حرکت فکر می‌کند و بهترین مسیر را می‌رود.'},
 {id:'x033',icon:'efficiency',name:'حل‌کننده‌ی مسئله',gene:'efficiency',desc:'غذاهای دور از دسترس را با راه‌حل پیدا می‌کند.'},
 {id:'x034',icon:'aggression',name:'فریبکار',gene:'aggression',desc:'با فریب رقیب را از غذا دور می‌کند.'},
 {id:'x035',icon:'aggression',name:'لجباز',gene:'aggression',desc:'سر غذا هیچ‌وقت عقب نمی‌کشد.'},
 {id:'x036',icon:'aggression',name:'تندخو',gene:'aggression',desc:'زود عصبانی می‌شود و سر کوچک‌ترین غذا دعوا می‌کند.'},
 {id:'x037',icon:'efficiency',name:'پنهان‌کار',gene:'efficiency',desc:'بی‌سروصدا حرکت می‌کند و غذایش را قایم می‌کند.'},
 {id:'x038',icon:'efficiency',name:'روباه‌صفت',gene:'efficiency',desc:'زیرک است و غذا را بدون دعوا به دست می‌آورد.'},
 {id:'x039',icon:'aggression',name:'گرگ‌صفت',gene:'aggression',desc:'درنده و جسور است و از هیچ دعوایی نمی‌ترسد.'},
 {id:'x040',icon:'metabolism',name:'آرام و صبور',gene:'metabolism',desc:'آرام می‌ماند و انرژی‌اش را برای لحظه‌ی مناسب نگه می‌دارد.'},
 {id:'x041',icon:'metabolism',name:'شکارچی صبور',gene:'metabolism',desc:'ساعت‌ها صبر می‌کند تا بهترین لحظه برای شکار برسد.'},
 {id:'x042',icon:'metabolism',name:'خونسرد',gene:'metabolism',desc:'در شرایط سخت هم آرام است و انرژی‌اش را هدر نمی‌دهد.'},
 {id:'x043',icon:'vision',name:'دقیق و متمرکز',gene:'vision',desc:'فقط به هدفش نگاه می‌کند و حواسش پرت نمی‌شود.'},
 {id:'x044',icon:'efficiency',name:'یادگیرنده‌ی سریع',gene:'efficiency',desc:'از تجربه‌ها سریع یاد می‌گیرد و اشتباهش را تکرار نمی‌کند.'},
 {id:'x045',icon:'efficiency',name:'برنامه‌ریز',gene:'efficiency',desc:'حرکت‌هایش را طوری برنامه می‌ریزد که کمترین انرژی را بسوزاند.'},
 /* --- دسته ۴: بقا و مقاومت (x046–x060) --- */
 {id:'x046',icon:'coldRes',name:'پوست یخی',gene:'coldRes',desc:'در سرمای کشنده هم بدنش گرم می‌ماند.'},
 {id:'x047',icon:'coldRes',name:'خون سرد',gene:'coldRes',desc:'سرما او را کند نمی‌کند و مثل همیشه حرکت می‌کند.'},
 {id:'x048',icon:'coldRes',name:'کوه‌نورد',gene:'coldRes',desc:'به هوای سرد کوهستان عادت کرده و سرما اذیتش نمی‌کند.'},
 {id:'x049',icon:'heatRes',name:'پوست آتشین',gene:'heatRes',desc:'گرمای سوزان او را از پا نمی‌اندازد.'},
 {id:'x050',icon:'heatRes',name:'تحمل گرما',gene:'heatRes',desc:'در موج گرما هم خنک می‌ماند و زنده می‌ماند.'},
 {id:'x051',icon:'heatRes',name:'صحرانشین',gene:'heatRes',desc:'به گرمای صحرا عادت کرده و آب کمی می‌خواهد.'},
 {id:'x052',icon:'immunity',name:'سپر ایمنی',gene:'immunity',desc:'بدنش در برابر بیماری‌ها مثل سپر عمل می‌کند.'},
 {id:'x053',icon:'immunity',name:'آنتی‌بادی قوی',gene:'immunity',desc:'طاعون را سریع شکست می‌دهد و دوباره بیمار نمی‌شود.'},
 {id:'x054',icon:'immunity',name:'مقاوم به طاعون',gene:'immunity',desc:'اگر طاعون بگیرد، خیلی زود خوب می‌شود.'},
 {id:'x055',icon:'lifespan',name:'عمر دراز',gene:'lifespan',desc:'سال‌ها بیشتر از بقیه عمر می‌کند.'},
 {id:'x056',icon:'lifespan',name:'جوان‌ماننده',gene:'lifespan',desc:'دیر پیر می‌شود و مدت زیادی جوان و قوی می‌ماند.'},
 {id:'x057',icon:'lifespan',name:'بازیابی سریع',gene:'lifespan',desc:'زخم‌هایش زود خوب می‌شود و عمر طولانی‌تری دارد.'},
 {id:'x058',icon:'metabolism',name:'کندسوز',gene:'metabolism',desc:'انرژی‌اش را قطره‌قطره مصرف می‌کند و در قحطی دوام می‌آورد.'},
 {id:'x059',icon:'metabolism',name:'خواب زمستانی',gene:'metabolism',desc:'وقتی غذا نیست، به خواب می‌رود و انرژی‌اش را ذخیره می‌کند.'},
 {id:'x060',icon:'metabolism',name:'تحمل گرسنگی',gene:'metabolism',desc:'گرسنگی را بیشتر از بقیه تحمل می‌کند.'},
 /* --- دسته ۵: اجتماعی و جفت‌یابی (x061–x075) --- */
 {id:'x061',icon:'cooperation',name:'دوست‌داشتنی',gene:'cooperation',desc:'همه دوستش دارند و غذا را با او تقسیم می‌کنند.'},
 {id:'x062',icon:'fertility',name:'جذاب',gene:'fertility',desc:'جفت‌های زیادی جذبش می‌شوند و بیشتر بچه‌دار می‌شود.'},
 {id:'x063',icon:'cooperation',name:'خانواده‌دوست',gene:'cooperation',desc:'به خانواده‌اش غذا می‌رساند و از بچه‌ها مراقبت می‌کند.'},
 {id:'x064',icon:'cooperation',name:'سخنگوی گروه',gene:'cooperation',desc:'گروه را دور غذا جمع می‌کند و دعوا را کم می‌کند.'},
 {id:'x065',icon:'cooperation',name:'صلح‌طلب',gene:'cooperation',desc:'همیشه دعوا را به آشتی تبدیل می‌کند.'},
 {id:'x066',icon:'cooperation',name:'مهربان',gene:'cooperation',desc:'غذایش را با گرسنه‌ها تقسیم می‌کند.'},
 {id:'x067',icon:'fertility',name:'وفادار',gene:'fertility',desc:'به یک جفت وفادار می‌ماند و بچه‌هایش سالم‌ترند.'},
 {id:'x068',icon:'fertility',name:'عاشق‌پیشه',gene:'fertility',desc:'در فصل جفت‌گیری فعال‌تر از بقیه است.'},
 {id:'x069',icon:'fertility',name:'آوازخوان',gene:'fertility',desc:'با آوازش جفت‌ها را از دور جذب می‌کند.'},
 {id:'x070',icon:'coat',name:'پرهای رنگی',gene:'coat',desc:'پرهای رنگی‌اش جفت‌ها را مجذوب می‌کند.'},
 {id:'x071',icon:'coat',name:'درخشان',gene:'coat',desc:'پوشش براقش در چشم جفت‌ها می‌درخشد.'},
 {id:'x072',icon:'coat',name:'رنگارنگ',gene:'coat',desc:'رنگ‌های شادش او را میان جمع متمایز می‌کند.'},
 {id:'x073',icon:'cooperation',name:'رهبر گروه',gene:'cooperation',desc:'دیگران دنبالش می‌روند و گروه منظم‌تر غذا پیدا می‌کند.'},
 {id:'x074',icon:'cooperation',name:'محافظ گروه',gene:'cooperation',desc:'از ضعیف‌ترها مراقبت می‌کند و گروه را نگه می‌دارد.'},
 {id:'x075',icon:'cooperation',name:'وفادار به گله',gene:'cooperation',desc:'هیچ‌وقت گله را تنها نمی‌گذارد و همیشه با هم شکار می‌کنند.'},
 /* --- دسته ۶: محیط و آب‌وهوا (x076–x090) --- */
 {id:'x076',icon:'coldRes',name:'باران‌دوست',gene:'coldRes',desc:'باران او را سرحال می‌کند و در هوای مرطوب بهتر حرکت می‌کند.'},
 {id:'x077',icon:'heatRes',name:'آفتاب‌پرست',gene:'heatRes',desc:'نور خورشید به او انرژی می‌دهد.'},
 {id:'x078',icon:'size',name:'طوفان‌نورد',gene:'size',desc:'در طوفان هم سر جایش می‌ایستد و جابه‌جا نمی‌شود.'},
 {id:'x079',icon:'efficiency',name:'شناگر',gene:'efficiency',desc:'در زمین‌های خیس سریع‌تر حرکت می‌کند.'},
 {id:'x080',icon:'heatRes',name:'کویرنورد',gene:'heatRes',desc:'به گرما و خشکی کویر عادت کرده است.'},
 {id:'x081',icon:'coldRes',name:'برف‌نورد',gene:'coldRes',desc:'روی برف راحت راه می‌رود و سرما اذیتش نمی‌کند.'},
 {id:'x082',icon:'vision',name:'جنگل‌نورد',gene:'vision',desc:'میان درخت‌ها هم راهش را گم نمی‌کند و غذا پیدا می‌کند.'},
 {id:'x083',icon:'vision',name:'شب‌زنده‌دار',gene:'vision',desc:'شب‌ها فعال است و وقتی بقیه خواب‌اند غذا جمع می‌کند.'},
 {id:'x084',icon:'mask',name:'استتار تاریک',gene:'mask',desc:'در تاریکی با محیط یکی می‌شود و دیده نمی‌شود.'},
 {id:'x085',icon:'coat',name:'استتار پاییزی',gene:'coat',desc:'رنگش با برگ‌ها یکی است و رقیب‌ها او را نمی‌بینند.'},
 {id:'x086',icon:'coat',name:'استتار سبز',gene:'coat',desc:'میان سبزه‌ها پنهان می‌شود و کسی متوجهش نمی‌شود.'},
 {id:'x087',icon:'coat',name:'پوشش برفی',gene:'coat',desc:'سفید است و در برف کاملاً پنهان می‌شود.'},
 {id:'x088',icon:'mask',name:'پوشش شبانه',gene:'mask',desc:'پوشش تیره‌اش او را در شب نامرئی می‌کند.'},
 {id:'x089',icon:'coldRes',name:'ابرنشین',gene:'coldRes',desc:'هوای سرد و ابری را دوست دارد و در آن سرحال است.'},
 {id:'x090',icon:'size',name:'بلندقد',gene:'size',desc:'قد بلندش باعث می‌شود غذا را از بالای سر بقیه ببیند.'},
 /* --- دسته ۷: تغذیه و شکار (x091–x100) --- */
 {id:'x091',icon:'metabolism',name:'گوشت‌خوار',gene:'metabolism',desc:'غذاها برایش سیرکننده‌ترند و دیرتر گرسنه می‌شود.'},
 {id:'x092',icon:'metabolism',name:'گیاه‌خوار حرفه‌ای',gene:'metabolism',desc:'از غذاهای ساده هم خوب سیر می‌شود.'},
 {id:'x093',icon:'metabolism',name:'شیرین‌دوست',gene:'metabolism',desc:'با غذای کم هم سیر می‌شود.'},
 {id:'x094',icon:'speed',name:'شکارچی آسمان',gene:'speed',desc:'از بالا غذا را نشانه می‌گیرد و با سرعت می‌قاپد.'},
 {id:'x095',icon:'efficiency',name:'تله‌گذار',gene:'efficiency',desc:'کمین می‌کند و بدون دویدن زیاد غذا به دست می‌آورد.'},
 {id:'x096',icon:'efficiency',name:'کمین‌گر',gene:'efficiency',desc:'بی‌حرکت صبر می‌کند تا غذا به او نزدیک شود.'},
 {id:'x097',icon:'aggression',name:'دندان‌های تیز',gene:'aggression',desc:'غذای سفت را هم راحت می‌خورد و سر غذا می‌جنگد.'},
 {id:'x098',icon:'cooperation',name:'شکارچی گروهی',gene:'cooperation',desc:'با هم شکار می‌کنند و غذای بزرگ را تقسیم می‌کنند.'},
 {id:'x099',icon:'speed',name:'شکارچی دونده',gene:'speed',desc:'شکارش را با دویدن دنبال می‌کند تا خسته شود.'},
 {id:'x100',icon:'efficiency',name:'جمع‌کننده‌ی غذا',gene:'efficiency',desc:'غذا را جمع می‌کند و ذخیره می‌کند تا در قحطی استفاده کند.'},
 /* --- دسته ۱: هنر و نمایش (x101–x115) --- */
 {id:'x101',icon:'coat',name:'نقاش',gene:'coat',desc:'بدنش رنگ‌های زیبایی دارد که در نمایش جفت‌یابی می‌درخشد.'},
 {id:'x102',icon:'speed',name:'رقصنده',gene:'speed',desc:'با حرکت‌های نرم و سریع توجه دیگران را جلب می‌کند.'},
 {id:'x103',icon:'cooperation',name:'بازیگر',gene:'cooperation',desc:'رفتارش را با موقعیت عوض می‌کند و گروه را سرگرم می‌کند.'},
 {id:'x104',icon:'coat',name:'پرآراسته',gene:'coat',desc:'پرهایش را مرتب و درخشان نگه می‌دارد تا زیباتر دیده شود.'},
 {id:'x105',icon:'coat',name:'براق',gene:'coat',desc:'بدنش در نور می‌درخشد و در تاریکی دیده می‌شود.'},
 {id:'x106',icon:'aggression',name:'نمایشگر',gene:'aggression',desc:'با نمایش قدرت رقبا را می‌ترساند بدون اینکه بجنگد.'},
 {id:'x107',icon:'coat',name:'رنگ‌پاش',gene:'coat',desc:'رنگ بدنش را با فصل عوض می‌کند و همیشه تازه به نظر می‌رسد.'},
 {id:'x108',icon:'cooperation',name:'صحنه‌ساز',gene:'cooperation',desc:'جایی برای نمایش گروه پیدا می‌کند و همه را دور هم جمع می‌کند.'},
 {id:'x109',icon:'cooperation',name:'سخنور',gene:'cooperation',desc:'با صداهای بلند و واضح پیامش را به همه می‌رساند.'},
 {id:'x110',icon:'speed',name:'گام‌سبک',gene:'speed',desc:'قدم‌هایش سبک است و انگار روی زمین راه نمی‌رود.'},
 {id:'x111',icon:'mask',name:'خال‌دار هنری',gene:'mask',desc:'خال‌های بدنش مثل نقاشی‌اند و او را از دیگران متمایز می‌کنند.'},
 {id:'x112',icon:'coat',name:'آینه‌ای',gene:'coat',desc:'پوستش نور را بازتاب می‌دهد و شکارچی را گمراه می‌کند.'},
 {id:'x113',icon:'mask',name:'ماسک‌دار',gene:'mask',desc:'نشانه‌های روی صورتش او را برای دیگران جذاب می‌کند.'},
 {id:'x114',icon:'efficiency',name:'ریتمیک',gene:'efficiency',desc:'حرکت‌هایش هماهنگ است و انرژی کمتری مصرف می‌کند.'},
 {id:'x115',icon:'coat',name:'رنگین‌کمانی',gene:'coat',desc:'بدنش چند رنگ است و در هر نور زیباتر دیده می‌شود.'},
 /* --- دسته ۲: موسیقی و صدا (x116–x130) --- */
 {id:'x116',icon:'fertility',name:'نغمه‌خوان',gene:'fertility',desc:'آوازش در فصل جفت‌یابی بلندتر و زیباتر می‌شود.'},
 {id:'x117',icon:'aggression',name:'طبل‌زن',gene:'aggression',desc:'با ضربات محکم روی زمین قلمرویش را اعلام می‌کند.'},
 {id:'x118',icon:'vision',name:'بوق‌زن',gene:'vision',desc:'صدایش از دور شنیده می‌شود و گله را خبر می‌کند.'},
 {id:'x119',icon:'cooperation',name:'زنگوله‌ای',gene:'cooperation',desc:'صدای زنگوله‌اش گله را دور هم نگه می‌دارد.'},
 {id:'x120',icon:'fertility',name:'چهچهه‌زن',gene:'fertility',desc:'چهچهه‌اش جفت‌ها را از دور جذب می‌کند.'},
 {id:'x121',icon:'aggression',name:'صدای بلند',gene:'aggression',desc:'فریادش آن‌قدر بلند است که رقیب عقب می‌نشیند.'},
 {id:'x122',icon:'vision',name:'شنوای دقیق',gene:'vision',desc:'کوچک‌ترین صداها را هم می‌شنود و زود خطر را می‌فهمد.'},
 {id:'x123',icon:'efficiency',name:'ریتم‌شناس',gene:'efficiency',desc:'ضرباهنگ قدم‌هایش منظم است و انرژی را ذخیره می‌کند.'},
 {id:'x124',icon:'cooperation',name:'ملودی‌ساز',gene:'cooperation',desc:'آواز گروه را هماهنگ می‌کند تا همه با هم بخوانند.'},
 {id:'x125',icon:'fertility',name:'ساززن',gene:'fertility',desc:'با صداهای گوناگون جفتش را مجذوب می‌کند.'},
 {id:'x126',icon:'efficiency',name:'سکوت‌گر',gene:'efficiency',desc:'در شکار سکوت می‌کند تا شکار متوجهش نشود.'},
 {id:'x127',icon:'cooperation',name:'هشداردهنده',gene:'cooperation',desc:'با فریاد بلند گله را از خطر خبر می‌کند.'},
 {id:'x128',icon:'vision',name:'آهنگ‌شناس',gene:'vision',desc:'از روی صدا جهت و فاصله را درست تشخیص می‌دهد.'},
 {id:'x129',icon:'cooperation',name:'زوزه‌کش',gene:'cooperation',desc:'زوزه‌اش گله را در شب دور هم جمع می‌کند.'},
 {id:'x130',icon:'lifespan',name:'ترانه‌خوان شب',gene:'lifespan',desc:'شب‌ها آواز می‌خواند و روزها استراحت می‌کند.'},
 /* --- دسته ۳: خواب و استراحت (x131–x145) --- */
 {id:'x131',icon:'lifespan',name:'خواب‌آلود عمیق',gene:'lifespan',desc:'خواب عمیقش بدنش را خوب ترمیم می‌کند و عمرش را زیاد می‌کند.'},
 {id:'x132',icon:'vision',name:'شب‌بیدار',gene:'vision',desc:'شب‌ها بیدار است و در تاریکی خوب می‌بیند.'},
 {id:'x133',icon:'efficiency',name:'روزبیدار',gene:'efficiency',desc:'روزها فعال است و از نور خورشید انرژی می‌گیرد.'},
 {id:'x134',icon:'cooperation',name:'خواب‌گاه‌ساز',gene:'cooperation',desc:'لانه‌ای امن برای خواب گروه می‌سازد.'},
 {id:'x135',icon:'metabolism',name:'چرت‌زن',gene:'metabolism',desc:'چرت‌های کوتاه انرژی‌اش را سریع برمی‌گرداند.'},
 {id:'x136',icon:'metabolism',name:'زمستان‌خواب',gene:'metabolism',desc:'در سرما می‌خوابد و با چربی بدنش زمستان را می‌گذراند.'},
 {id:'x137',icon:'speed',name:'سحرخیز',gene:'speed',desc:'با طلوع خورشید بیدار می‌شود و زودتر از همه غذا پیدا می‌کند.'},
 {id:'x138',icon:'vision',name:'مهتاب‌دوست',gene:'vision',desc:'زیر نور ماه بهتر می‌بیند و شب شکار می‌کند.'},
 {id:'x139',icon:'vision',name:'خواب سبک',gene:'vision',desc:'خوابش سبک است و با کوچک‌ترین صدا بیدار می‌شود.'},
 {id:'x140',icon:'lifespan',name:'استراحت‌طلب',gene:'lifespan',desc:'زیاد استراحت می‌کند و بدنش دیرتر فرسوده می‌شود.'},
 {id:'x141',icon:'coldRes',name:'خوابیدن روی درخت',gene:'coldRes',desc:'روی درخت می‌خوابد و از سرمای زمین در امان می‌ماند.'},
 {id:'x142',icon:'fertility',name:'رؤیابین',gene:'fertility',desc:'خواب راحتش باعث می‌شود سرحال‌تر باشد و راحت‌تر جفت پیدا کند.'},
 {id:'x143',icon:'efficiency',name:'ساعت بدنی دقیق',gene:'efficiency',desc:'بدنش ساعت دقیقی دارد و همیشه سر وقت بیدار می‌شود.'},
 {id:'x144',icon:'cooperation',name:'خواب گروهی',gene:'cooperation',desc:'با گروه می‌خوابد و گرمای هم را نگه می‌دارند.'},
 {id:'x145',icon:'vision',name:'خواب‌نیمه',gene:'vision',desc:'با یک چشم باز می‌خوابد تا خطر را زود ببیند.'},
 /* --- دسته ۴: حافظه و یادگیری (x146–x160) --- */
 {id:'x146',icon:'efficiency',name:'حافظه‌ی قوی',gene:'efficiency',desc:'جای غذا و آب را یادش می‌ماند و دوباره پیدا می‌کند.'},
 {id:'x147',icon:'vision',name:'نقشه‌خوان',gene:'vision',desc:'مسیرها را یاد می‌گیرد و راه بازگشت را گم نمی‌کند.'},
 {id:'x148',icon:'efficiency',name:'زودآموز',gene:'efficiency',desc:'رفتار تازه را یک بار می‌بیند و یاد می‌گیرد.'},
 {id:'x149',icon:'vision',name:'کنجکاو',gene:'vision',desc:'چیزهای تازه را بررسی می‌کند تا غذا پیدا کند.'},
 {id:'x150',icon:'efficiency',name:'مسئله‌حل‌کن',gene:'efficiency',desc:'برای رسیدن به غذا راه‌های تازه پیدا می‌کند.'},
 {id:'x151',icon:'lifespan',name:'تجربه‌آموز',gene:'lifespan',desc:'از تجربه‌هایش درس می‌گیرد و اشتباه را تکرار نمی‌کند.'},
 {id:'x152',icon:'vision',name:'چهره‌شناس',gene:'vision',desc:'چهره‌ی دوست و دشمن را از هم تشخیص می‌دهد.'},
 {id:'x153',icon:'speed',name:'راه‌یاب',gene:'speed',desc:'کوتاه‌ترین راه به غذا را یاد می‌گیرد و سریع‌تر می‌رسد.'},
 {id:'x154',icon:'metabolism',name:'حافظه‌ی فصلی',gene:'metabolism',desc:'یادش می‌ماند هر فصل غذا کجاست.'},
 {id:'x155',icon:'cooperation',name:'تقلیدکننده',gene:'cooperation',desc:'رفتار بزرگ‌ترها را تقلید می‌کند و سریع یاد می‌گیرد.'},
 {id:'x156',icon:'vision',name:'نشانه‌شناس',gene:'vision',desc:'نشانه‌های زمین را می‌خواند و آب را پیدا می‌کند.'},
 {id:'x157',icon:'fertility',name:'ایده‌پرداز',gene:'fertility',desc:'راه تازه برای جلب توجه پیدا می‌کند.'},
 {id:'x158',icon:'efficiency',name:'حافظه‌ی راه‌ها',gene:'efficiency',desc:'جای لانه و پنهان‌گاه را همیشه یادش می‌ماند.'},
 {id:'x159',icon:'cooperation',name:'داستان‌گو',gene:'cooperation',desc:'تجربه‌هایش را به بچه‌ها منتقل می‌کند.'},
 {id:'x160',icon:'vision',name:'جستجوگر دقیق',gene:'vision',desc:'چیزهای کوچک را با دقت پیدا می‌کند.'},
 /* --- دسته ۵: مهاجرت و سفر (x161–x175) --- */
 {id:'x161',icon:'speed',name:'مهاجر دوربرد',gene:'speed',desc:'هزاران کیلومتر پرواز می‌کند تا به سرزمین گرم برسد.'},
 {id:'x162',icon:'vision',name:'قطب‌نما‌دار',gene:'vision',desc:'جهت را از روی خورشید و ستاره‌ها پیدا می‌کند.'},
 {id:'x163',icon:'lifespan',name:'جهانگرد',gene:'lifespan',desc:'سفرهای طولانی بدنش را قوی کرده و عمرش را زیاد می‌کند.'},
 {id:'x164',icon:'efficiency',name:'مهاجر دریایی',gene:'efficiency',desc:'در اقیانوس مسیر طولانی را با انرژی کم شنا می‌کند.'},
 {id:'x165',icon:'metabolism',name:'پیاده‌روی طولانی',gene:'metabolism',desc:'ساعت‌ها راه می‌رود و خسته نمی‌شود.'},
 {id:'x166',icon:'cooperation',name:'پرواز دسته‌جمعی',gene:'cooperation',desc:'در دسته پرواز می‌کند و باد را با هم می‌شکنند.'},
 {id:'x167',icon:'vision',name:'مهاجرت‌شناس',gene:'vision',desc:'زمان مهاجرت را از تغییر فصل می‌فهمد.'},
 {id:'x168',icon:'speed',name:'موج‌سوار',gene:'speed',desc:'روی موج‌ها سوار می‌شود و سریع‌تر به مقصد می‌رسد.'},
 {id:'x169',icon:'coldRes',name:'کوه‌پیما',gene:'coldRes',desc:'از کوه‌های بلند می‌گذرد و سرما اذیتش نمی‌کند.'},
 {id:'x170',icon:'heatRes',name:'صحرانورد',gene:'heatRes',desc:'در بیابان راه می‌رود و گرما را تحمل می‌کند.'},
 {id:'x171',icon:'cooperation',name:'راهنمای گله',gene:'cooperation',desc:'راه را بلد است و گله را به مقصد می‌رساند.'},
 {id:'x172',icon:'speed',name:'پروانه‌وار',gene:'speed',desc:'سبک پرواز می‌کند و مسیر طولانی را طی می‌کند.'},
 {id:'x173',icon:'efficiency',name:'باران‌گریز',gene:'efficiency',desc:'پیش از باران راه می‌افتد و به جای خشک می‌رسد.'},
 {id:'x174',icon:'lifespan',name:'آرام‌سفر',gene:'lifespan',desc:'آهسته ولی پیوسته سفر می‌کند و انرژی‌اش تمام نمی‌شود.'},
 {id:'x175',icon:'vision',name:'بازگشت‌گر',gene:'vision',desc:'راه خانه را از هزاران کیلومتر دورتر پیدا می‌کند.'},
 /* --- دسته ۶: آب و شنا (x176–x190) --- */
 {id:'x176',icon:'speed',name:'شناگر ماهر',gene:'speed',desc:'در آب سریع شنا می‌کند و از شکارچی فرار می‌کند.'},
 {id:'x177',icon:'efficiency',name:'ماهی‌خوار',gene:'efficiency',desc:'ماهی را راحت شکار می‌کند و خوب می‌خورد.'},
 {id:'x178',icon:'heatRes',name:'آب‌دوست',gene:'heatRes',desc:'در آب خنک می‌شود و گرما اذیتش نمی‌کند.'},
 {id:'x179',icon:'size',name:'موج‌شکن',gene:'size',desc:'بدنش بزرگ است و موج‌های دریا تکانش نمی‌دهند.'},
 {id:'x180',icon:'vision',name:'شیرجه‌زن',gene:'vision',desc:'از بالا آب را می‌بیند و شیرجه می‌زند تا ماهی بگیرد.'},
 {id:'x181',icon:'metabolism',name:'شناور',gene:'metabolism',desc:'روی آب شناور می‌ماند و انرژی زیادی مصرف نمی‌کند.'},
 {id:'x182',icon:'coat',name:'رنگ‌آبی',gene:'coat',desc:'رنگ بدنش آبی است و در آب دیده نمی‌شود.'},
 {id:'x183',icon:'metabolism',name:'آب‌نوش زیاد',gene:'metabolism',desc:'آب زیادی می‌نوشد و در خشکی هم دوام می‌آورد.'},
 {id:'x184',icon:'vision',name:'جریان‌خوان',gene:'vision',desc:'جریان آب را می‌فهمد و خلاف آن شنا نمی‌کند.'},
 {id:'x185',icon:'efficiency',name:'صدف‌جمع‌کن',gene:'efficiency',desc:'صدف را از ته آب پیدا می‌کند و می‌خورد.'},
 {id:'x186',icon:'lifespan',name:'غواص',gene:'lifespan',desc:'زیر آب نفسش را نگه می‌دارد و غذای عمیق را می‌گیرد.'},
 {id:'x187',icon:'heatRes',name:'ساحل‌نشین',gene:'heatRes',desc:'کنار ساحل زندگی می‌کند و آفتاب را دوست دارد.'},
 {id:'x188',icon:'coldRes',name:'آب‌عمیق‌رو',gene:'coldRes',desc:'در آب‌های سرد و عمیق شنا می‌کند و سرما را حس نمی‌کند.'},
 {id:'x189',icon:'fertility',name:'باران‌پسند',gene:'fertility',desc:'باران باعث می‌شود شاداب‌تر شود و راحت‌تر جفت پیدا کند.'},
 {id:'x190',icon:'immunity',name:'فلس‌دار',gene:'immunity',desc:'فلس‌هایش بدنش را از زخم و بیماری محافظت می‌کنند.'},
 /* --- دسته ۷: خاک و زمین (x191–x200) --- */
 {id:'x191',icon:'efficiency',name:'حفار',gene:'efficiency',desc:'زمین را می‌کند و لانه‌ی زیرزمینی می‌سازد.'},
 {id:'x192',icon:'efficiency',name:'کرم‌خوار',gene:'efficiency',desc:'کرم‌های زیر خاک را پیدا می‌کند و می‌خورد.'},
 {id:'x193',icon:'heatRes',name:'خاک‌دوست',gene:'heatRes',desc:'روی خاک گرم راه می‌رود و پاهایش نمی‌سوزد.'},
 {id:'x194',icon:'coldRes',name:'سنگ‌پناه',gene:'coldRes',desc:'پشت سنگ‌ها پنهان می‌شود و از سرما در امان می‌ماند.'},
 {id:'x195',icon:'fertility',name:'بذرکار',gene:'fertility',desc:'بذر گیاهان را پخش می‌کند و زمین را سبز نگه می‌دارد.'},
 {id:'x196',icon:'cooperation',name:'لانه‌ساز',gene:'cooperation',desc:'لانه‌ی بزرگ زیر زمین می‌سازد و گروه در آن زندگی می‌کند.'},
 {id:'x197',icon:'vision',name:'زمین‌شناس',gene:'vision',desc:'خاک خوب را از روی رنگش تشخیص می‌دهد.'},
 {id:'x198',icon:'speed',name:'صخره‌نورد',gene:'speed',desc:'روی صخره‌ها سریع بالا می‌رود و از دسترس شکارچی دور می‌شود.'},
 {id:'x199',icon:'efficiency',name:'چوب‌جمع‌کن',gene:'efficiency',desc:'چوب و برگ جمع می‌کند و لانه‌اش را گرم نگه می‌دارد.'},
 {id:'x200',icon:'metabolism',name:'دانه‌کار',gene:'metabolism',desc:'دانه‌ها را ذخیره می‌کند و در زمستان می‌خورد.'},
 {id:'x201',icon:'metabolism',name:'خواب‌عمیق',gene:'metabolism',desc:'در خواب عمیق انرژی‌اش را سریع بازمی‌یابد و صبح سرحال بیدار می‌شود.'},
 {id:'x202',icon:'vision',name:'شب‌گرد',gene:'vision',desc:'شب‌ها بیدار می‌ماند و در تاریکی بهتر از روز می‌بیند.'},
 {id:'x203',icon:'efficiency',name:'چرت‌دوست',gene:'efficiency',desc:'با چرت‌های کوتاه خستگی‌اش را می‌زداید و انرژی‌اش را نگه می‌دارد.'},
 {id:'x204',icon:'cooperation',name:'هم‌خواب',gene:'cooperation',desc:'کنار هم‌گروهی‌هایش می‌خوابد و از گرمای جمع استفاده می‌کند.'},
 {id:'x205',icon:'vision',name:'جغدشب',gene:'vision',desc:'چشم‌هایش در تاریکی شب مثل جغد تیز می‌بیند.'},
 {id:'x206',icon:'speed',name:'سپیده‌خیز',gene:'speed',desc:'با اولین نور خورشید بیدار می‌شود و زودتر از همه به غذا می‌رسد.'},
 {id:'x207',icon:'lifespan',name:'خواب‌آلود',gene:'lifespan',desc:'با خواب زیاد انرژی‌اش را ذخیره می‌کند و بدنش دیرتر فرسوده می‌شود.'},
 {id:'x208',icon:'speed',name:'خواب‌سبک',gene:'speed',desc:'خواب سبکی دارد و با کوچک‌ترین صدا فوراً بیدار و آماده‌ی فرار است.'},
 {id:'x209',icon:'vision',name:'ستاره‌نگر',gene:'vision',desc:'شب‌ها به آسمان نگاه می‌کند و جهت‌یابی‌اش در تاریکی بهتر است.'},
 {id:'x210',icon:'metabolism',name:'خرس‌خواب',gene:'metabolism',desc:'در زمستان خواب زمستانی می‌رود و با چربی بدنش زنده می‌ماند.'},
 {id:'x211',icon:'efficiency',name:'نیمه‌خواب',gene:'efficiency',desc:'نیمی از مغزش همیشه بیدار است و خطر را زود حس می‌کند.'},
 {id:'x212',icon:'cooperation',name:'آغوش‌خواب',gene:'cooperation',desc:'کنار بچه‌هایش می‌خوابد و آن‌ها را در خواب هم گرم نگه می‌دارد.'},
 {id:'x213',icon:'speed',name:'زنگ‌دار',gene:'speed',desc:'بدنش مثل ساعت سر وقت بیدار می‌شود و هیچ روزی دیر نمی‌کند.'},
 {id:'x214',icon:'lifespan',name:'لانه‌نرم',gene:'lifespan',desc:'لانه‌اش را نرم و گرم می‌سازد و در آن بهتر استراحت می‌کند.'},
 {id:'x215',icon:'aggression',name:'خرناس‌کش',gene:'aggression',desc:'با خرناس‌های بلند رقبا را از قلمرویش می‌ترساند.'},
 {id:'x216',icon:'efficiency',name:'حافظه‌قوی',gene:'efficiency',desc:'جای غذا و آب را برای همیشه به خاطر می‌سپارد.'},
 {id:'x217',icon:'efficiency',name:'یادگیرنده',gene:'efficiency',desc:'از تجربه‌هایش سریع یاد می‌گیرد و اشتباهش را تکرار نمی‌کند.'},
 {id:'x218',icon:'vision',name:'نقشه‌شناس',gene:'vision',desc:'نقشه‌ی ذهنی دقیقی از قلمرویش دارد و هیچ‌وقت گم نمی‌شود.'},
 {id:'x219',icon:'speed',name:'کاوشگر',gene:'speed',desc:'همه‌چیز را بو می‌کند و بررسی می‌کند تا غذای تازه پیدا کند.'},
 {id:'x220',icon:'cooperation',name:'استاد',gene:'cooperation',desc:'به بچه‌های گروه شکار و زندگی را یاد می‌دهد.'},
 {id:'x221',icon:'efficiency',name:'معماگر',gene:'efficiency',desc:'مسئله‌های تازه را با فکر حل می‌کند و راه غذا را پیدا می‌کند.'},
 {id:'x222',icon:'lifespan',name:'خاطره‌دار',gene:'lifespan',desc:'خاطره‌ی خطرهای قدیمی را نگه می‌دارد و از آن‌ها دوری می‌کند.'},
 {id:'x223',icon:'mask',name:'خودشناس',gene:'mask',desc:'خودش را در آب می‌شناسد و رفتارش را با دیگران تنظیم می‌کند.'},
 {id:'x224',icon:'vision',name:'قطب‌نما',gene:'vision',desc:'جهت‌یابی ذاتی دارد و در سفرهای دور راه را گم نمی‌کند.'},
 {id:'x225',icon:'vision',name:'تماشاگر',gene:'vision',desc:'با تماشای دیگران شکار را یاد می‌گیرد بدون اینکه خودش تجربه کند.'},
 {id:'x226',icon:'efficiency',name:'تکرارکن',gene:'efficiency',desc:'با تکرار یک کار آن را کامل یاد می‌گیرد و استادش می‌شود.'},
 {id:'x227',icon:'cooperation',name:'ایده‌ساز',gene:'cooperation',desc:'راه‌های تازه برای رسیدن به غذا پیدا می‌کند و به گروه نشان می‌دهد.'},
 {id:'x228',icon:'cooperation',name:'قصه‌گو',gene:'cooperation',desc:'با صداهایش تجربه‌ها را به بچه‌ها منتقل می‌کند.'},
 {id:'x229',icon:'metabolism',name:'آزمایشگر',gene:'metabolism',desc:'غذاهای تازه را با احتیاط می‌چشد و خوراکی‌های خوب را پیدا می‌کند.'},
 {id:'x230',icon:'vision',name:'نشانه‌گذار',gene:'vision',desc:'با نشانه‌های بو و خراش راه برگشت را علامت می‌زند.'},
 {id:'x231',icon:'lifespan',name:'مهاجر',gene:'lifespan',desc:'هر سال مسافت‌های دور را سفر می‌کند و به سرزمین‌های پرغذا می‌رسد.'},
 {id:'x232',icon:'speed',name:'سفرگر',gene:'speed',desc:'سفرهای طولانی را سریع طی می‌کند و خسته نمی‌شود.'},
 {id:'x233',icon:'efficiency',name:'جهان‌گرد',gene:'efficiency',desc:'در سفر انرژی‌اش را خوب مدیریت می‌کند و دیر گرسنه می‌شود.'},
 {id:'x234',icon:'vision',name:'راه‌شناس',gene:'vision',desc:'در راه‌های ناشناخته هم مسیر درست را پیدا می‌کند.'},
 {id:'x235',icon:'speed',name:'پروازدور',gene:'speed',desc:'پروازهای طولانی را بدون توقف انجام می‌دهد.'},
 {id:'x236',icon:'metabolism',name:'شناگر دور',gene:'metabolism',desc:'در آب مسافت‌های زیاد شنا می‌کند و خسته نمی‌شود.'},
 {id:'x237',icon:'size',name:'قله‌نورد',gene:'size',desc:'از کوه‌های بلند بالا می‌رود و به مراتع تازه می‌رسد.'},
 {id:'x238',icon:'speed',name:'موج‌ران',gene:'speed',desc:'روی موج‌ها سوار می‌شود و سریع‌تر از همه حرکت می‌کند.'},
 {id:'x239',icon:'cooperation',name:'راهنما',gene:'cooperation',desc:'گروه را در سفر رهبری می‌کند و همه را سالم به مقصد می‌رساند.'},
 {id:'x240',icon:'coldRes',name:'چادرنشین',gene:'coldRes',desc:'در سفر چادر می‌زند و در سرما هم گرم می‌ماند.'},
 {id:'x241',icon:'vision',name:'ردپاخوان',gene:'vision',desc:'ردپای حیوان‌ها را می‌خواند و راه آب و غذا را پیدا می‌کند.'},
 {id:'x242',icon:'efficiency',name:'هواشناس',gene:'efficiency',desc:'تغییر آب‌وهوا را زود حس می‌کند و پیش از طوفان پناه می‌گیرد.'},
 {id:'x243',icon:'fertility',name:'کوچ‌گر',gene:'fertility',desc:'با تغییر فصل کوچ می‌کند و بچه‌هایش در جای امن به دنیا می‌آیند.'},
 {id:'x244',icon:'cooperation',name:'نقشه‌کش',gene:'cooperation',desc:'مسیرهای تازه را کشف می‌کند و به گروه نشان می‌دهد.'},
 {id:'x245',icon:'lifespan',name:'کوچ‌پرنده',gene:'lifespan',desc:'با تغییر فصل کوچ می‌کند و در سرزمین گرم زمستان را می‌گذراند.'},
 {id:'x246',icon:'speed',name:'تندشنا',gene:'speed',desc:'در آب سریع شنا می‌کند و از شکارچی فرار می‌کند.'},
 {id:'x247',icon:'metabolism',name:'ماهی‌خور',gene:'metabolism',desc:'ماهی شکار می‌کند و از پروتئین آن قوی می‌شود.'},
 {id:'x248',icon:'efficiency',name:'آب‌باز',gene:'efficiency',desc:'در آب بازی می‌کند و با تمرین شناگر بهتری می‌شود.'},
 {id:'x249',icon:'vision',name:'غواص‌عمیق',gene:'vision',desc:'زیر آب چشم‌هایش تیز می‌بیند و غذای پنهان را پیدا می‌کند.'},
 {id:'x250',icon:'size',name:'نهنگ‌وار',gene:'size',desc:'بدنش بزرگ و قدرتمند است و در آب‌های عمیق شنا می‌کند.'},
 {id:'x251',icon:'coat',name:'سموروار',gene:'coat',desc:'پوستش ضد آب است و در آب سرد هم گرم می‌ماند.'},
 {id:'x252',icon:'lifespan',name:'لاک‌دار',gene:'lifespan',desc:'لاک محکمی دارد و در آب آرام و طولانی زندگی می‌کند.'},
 {id:'x253',icon:'heatRes',name:'قطره‌دوست',gene:'heatRes',desc:'با پاشیدن آب روی بدنش در گرما خنک می‌ماند.'},
 {id:'x254',icon:'cooperation',name:'ساحل‌گرد',gene:'cooperation',desc:'کنار ساحل زندگی می‌کند و با گروه ماهی می‌گیرد.'},
 {id:'x255',icon:'mask',name:'هشت‌پا',gene:'mask',desc:'با هشت بازویش غذا را می‌گیرد و رنگش را با آب عوض می‌کند.'},
 {id:'x256',icon:'coldRes',name:'باران‌شنا',gene:'coldRes',desc:'در باران شنا می‌کند و از سرمای آب نمی‌ترسد.'},
 {id:'x257',icon:'aggression',name:'کوسه‌وار',gene:'aggression',desc:'در آب شکارچی ترسناکی است و ماهی‌ها از او فرار می‌کنند.'},
 {id:'x258',icon:'size',name:'بادکنکی',gene:'size',desc:'وقتی خطر می‌بیند بدنش را باد می‌کند و بزرگ‌تر به نظر می‌رسد.'},
 {id:'x259',icon:'efficiency',name:'خرچنگی',gene:'efficiency',desc:'با چنگال‌هایش صدف می‌شکند و به غذای درون آن می‌رسد.'},
 {id:'x260',icon:'immunity',name:'مرجان‌دوست',gene:'immunity',desc:'کنار مرجان‌ها زندگی می‌کند و از سم آن‌ها در امان است.'},
 {id:'x261',icon:'vision',name:'تاریکی‌دوست',gene:'vision',desc:'در تاریکی کامل هم راهش را پیدا می‌کند.'},
 {id:'x262',icon:'coat',name:'نورافشان',gene:'coat',desc:'بدنش در تاریکی می‌درخشد و جفتش را جذب می‌کند.'},
 {id:'x263',icon:'vision',name:'نورافکن',gene:'vision',desc:'چشم‌هایش در تاریکی برق می‌زند و شکار را می‌ترساند.'},
 {id:'x264',icon:'lifespan',name:'ماه‌پرست',gene:'lifespan',desc:'با نور ماه فعالیت می‌کند و در شب‌های مهتابی شکار می‌کند.'},
 {id:'x265',icon:'heatRes',name:'شمع‌روشن',gene:'heatRes',desc:'در تاریکی غارها زندگی می‌کند و گرمای بدنش را نگه می‌دارد.'},
 {id:'x266',icon:'vision',name:'خفاش‌وار',gene:'vision',desc:'با پژواک صدا در تاریکی راهش را پیدا می‌کند.'},
 {id:'x267',icon:'efficiency',name:'کهکشان‌نگر',gene:'efficiency',desc:'از ستاره‌ها جهت‌یابی می‌کند و در سفر گم نمی‌شود.'},
 {id:'x268',icon:'mask',name:'سایه‌رو',gene:'mask',desc:'در سایه‌ها پنهان می‌شود و شکارچی او را نمی‌بیند.'},
 {id:'x269',icon:'cooperation',name:'چراغ‌دار',gene:'cooperation',desc:'نورش را به گروه نشان می‌دهد و همه را به غذا راهنمایی می‌کند.'},
 {id:'x270',icon:'heatRes',name:'آفتاب‌گیر',gene:'heatRes',desc:'با آفتاب گرفتن بدنش را گرم می‌کند و انرژی می‌گیرد.'},
 {id:'x271',icon:'aggression',name:'نیمه‌شب',gene:'aggression',desc:'در نیمه‌شب شکار می‌کند وقتی دیگران خواب‌اند.'},
 {id:'x272',icon:'speed',name:'نورشکن',gene:'speed',desc:'در نور کم هم سریع حرکت می‌کند و شکارش را می‌گیرد.'},
 {id:'x273',icon:'fertility',name:'درخشنده',gene:'fertility',desc:'در فصل جفت‌یابی بدنش درخشان‌تر می‌شود و جفت پیدا می‌کند.'},
 {id:'x274',icon:'vision',name:'شهاب‌بین',gene:'vision',desc:'حرکت‌های سریع در آسمان را می‌بیند و خطر را زود حس می‌کند.'},
 {id:'x275',icon:'coldRes',name:'غارنشین',gene:'coldRes',desc:'در غارهای تاریک و خنک زندگی می‌کند و از گرما در امان است.'},
 {id:'x276',icon:'cooperation',name:'خانه‌ساز',gene:'cooperation',desc:'لانه‌ی محکمی می‌سازد و گروه را در آن جا می‌دهد.'},
 {id:'x277',icon:'aggression',name:'مرزدار',gene:'aggression',desc:'از مرز قلمرویش با قدرت دفاع می‌کند و غریبه‌ها را بیرون می‌کند.'},
 {id:'x278',icon:'mask',name:'پرچم‌دار',gene:'mask',desc:'با نشانه‌های بویایی قلمرویش را علامت می‌زند.'},
 {id:'x279',icon:'size',name:'سنگ‌چین',gene:'size',desc:'با سنگ‌ها دیوار لانه‌اش را محکم می‌کند.'},
 {id:'x280',icon:'metabolism',name:'باغ‌دار',gene:'metabolism',desc:'کنار لانه‌اش گیاه خوراکی می‌کارد و همیشه غذا دارد.'},
 {id:'x281',icon:'efficiency',name:'تونل‌ساز',gene:'efficiency',desc:'تونل‌های زیرزمینی می‌سازد و از آن‌ها فرار می‌کند.'},
 {id:'x282',icon:'lifespan',name:'قلعه‌ساز',gene:'lifespan',desc:'لانه‌اش را مثل قلعه محکم می‌سازد و سال‌ها در آن زندگی می‌کند.'},
 {id:'x283',icon:'cooperation',name:'دیوارکش',gene:'cooperation',desc:'با کمک گروه دیوار لانه را می‌سازد و همه در آن امن‌اند.'},
 {id:'x284',icon:'coldRes',name:'سقف‌سبز',gene:'coldRes',desc:'روی سقف لانه‌اش گیاه می‌گذارد تا در سرما گرم بماند.'},
 {id:'x285',icon:'heatRes',name:'آتش‌نگهبان',gene:'heatRes',desc:'آتش را نگه می‌دارد و لانه‌اش را در شب گرم و روشن نگه می‌دارد.'},
 {id:'x286',icon:'speed',name:'چوب‌بر',gene:'speed',desc:'چوب‌ها را سریع می‌برد و لانه‌اش را زود می‌سازد.'},
 {id:'x287',icon:'efficiency',name:'انبارساز',gene:'efficiency',desc:'غذا را در انبار لانه ذخیره می‌کند و در قحطی استفاده می‌کند.'},
 {id:'x288',icon:'aggression',name:'دربان',gene:'aggression',desc:'در ورودی لانه می‌ایستد و از بچه‌ها محافظت می‌کند.'},
 {id:'x289',icon:'immunity',name:'کلبه‌نشین',gene:'immunity',desc:'کلبه‌اش را تمیز نگه می‌دارد و کمتر بیمار می‌شود.'},
 {id:'x290',icon:'cooperation',name:'کلیددار',gene:'cooperation',desc:'راه ورود به لانه را فقط به اعضای گروه نشان می‌دهد.'},
 {id:'x291',icon:'fertility',name:'بچه‌دوست',gene:'fertility',desc:'بچه‌ها را دوست دارد و از آن‌ها مراقبت می‌کند تا بزرگ شوند.'},
 {id:'x292',icon:'metabolism',name:'شیرده',gene:'metabolism',desc:'به بچه‌هایش شیر می‌دهد و آن‌ها را قوی بزرگ می‌کند.'},
 {id:'x293',icon:'aggression',name:'بچه‌نگهبان',gene:'aggression',desc:'از بچه‌های گروه با جانش دفاع می‌کند و شکارچی را دور می‌کند.'},
 {id:'x294',icon:'cooperation',name:'لالایی‌خوان',gene:'cooperation',desc:'با صدای آرام بچه‌ها را می‌خواباند و آرامشان می‌کند.'},
 {id:'x295',icon:'efficiency',name:'غذارسان',gene:'efficiency',desc:'غذا را به بچه‌های گرسنه می‌رساند و اول به آن‌ها می‌دهد.'},
 {id:'x296',icon:'cooperation',name:'آموزگار بچه',gene:'cooperation',desc:'به بچه‌ها شکار و زندگی را قدم‌به‌قدم یاد می‌دهد.'},
 {id:'x297',icon:'cooperation',name:'عروسک‌ساز',gene:'cooperation',desc:'با بازی به بچه‌ها زندگی را یاد می‌دهد.'},
 {id:'x298',icon:'immunity',name:'تب‌سنج',gene:'immunity',desc:'بچه‌ی بیمار را زود تشخیص می‌دهد و از او مراقبت می‌کند.'},
 {id:'x299',icon:'lifespan',name:'آغوش‌گرم',gene:'lifespan',desc:'بچه‌ها را در آغوش گرم نگه می‌دارد تا سرما نخورند.'},
 {id:'x300',icon:'aggression',name:'پدرانه',gene:'aggression',desc:'مثل شیر از بچه‌هایش محافظت می‌کند و هیچ‌کس جرئت نزدیک شدن ندارد.'},
 {id:'x301',icon:'coat',name:'نقاش‌طبیعت',gene:'coat',desc:'با رنگ‌های بدنش نقش‌های زیبایی می‌کشد و در جفت‌یابی توجه جلب می‌کند.'},
 {id:'x302',icon:'cooperation',name:'هنرپیشه',gene:'cooperation',desc:'با حرکات نمایشی گروه را سرگرم می‌کند و همبستگی گروه را بیشتر می‌کند.'},
 {id:'x303',icon:'speed',name:'پایکوب',gene:'speed',desc:'با رقص سریع و چابک از شکارچی فرار می‌کند.'},
 {id:'x304',icon:'efficiency',name:'آکروبات',gene:'efficiency',desc:'با حرکات آکروباتیک از موانع می‌پرد و انرژی کمتری مصرف می‌کند.'},
 {id:'x305',icon:'coat',name:'رنگ‌آمیز',gene:'coat',desc:'رنگ بدنش را با فصل عوض می‌کند و همیشه با محیط هماهنگ است.'},
 {id:'x306',icon:'cooperation',name:'دلقک‌گروه',gene:'cooperation',desc:'با شوخی گروه را شاد نگه می‌دارد و استرس گروه کم می‌شود.'},
 {id:'x307',icon:'mask',name:'پرنقش',gene:'mask',desc:'پرهای نقش‌دارش او را زیباتر نشان می‌دهد و جفت بیشتری جذب می‌کند.'},
 {id:'x308',icon:'cooperation',name:'نمایش‌ساز',gene:'cooperation',desc:'برای گروه صحنه می‌سازد و بچه‌ها در آن بازی و تمرین می‌کنند.'},
 {id:'x309',icon:'lifespan',name:'قاب‌ساز',gene:'lifespan',desc:'لانه‌اش را با نقش و رنگ تزیین می‌کند و سال‌ها همان‌جا می‌ماند.'},
 {id:'x310',icon:'coat',name:'نقش‌بند',gene:'coat',desc:'روی بدنش نقش‌های رنگی می‌کشد و در گروه شناخته می‌شود.'},
 {id:'x311',icon:'fertility',name:'ترانه‌سرا',gene:'fertility',desc:'آواز زیبایش جفت را از دور جذب می‌کند.'},
 {id:'x312',icon:'aggression',name:'دهل‌زن',gene:'aggression',desc:'با صدای طبل قلمرویش را اعلام می‌کند و غریبه‌ها را می‌ترساند.'},
 {id:'x313',icon:'cooperation',name:'هم‌آواز',gene:'cooperation',desc:'با گروه هم‌آواز می‌شود و هماهنگی گروه را بیشتر می‌کند.'},
 {id:'x314',icon:'vision',name:'ناقوس‌زن',gene:'vision',desc:'صدای زنگش خطر را زود به گروه خبر می‌دهد.'},
 {id:'x315',icon:'aggression',name:'فریادزن',gene:'aggression',desc:'فریاد بلندش شکارچی را می‌ترساند و گروه را نجات می‌دهد.'},
 {id:'x316',icon:'efficiency',name:'نی‌نواز',gene:'efficiency',desc:'با نواختن نی آرام راه می‌رود و انرژی‌اش را ذخیره می‌کند.'},
 {id:'x317',icon:'vision',name:'گوش‌تیز',gene:'vision',desc:'صداهای خیلی ضعیف را می‌شنود و شکار را از دور پیدا می‌کند.'},
 {id:'x318',icon:'cooperation',name:'شنونده',gene:'cooperation',desc:'به صدای گروه گوش می‌دهد و زودتر به کمک می‌رسد.'},
 {id:'x319',icon:'fertility',name:'چهچه‌زن',gene:'fertility',desc:'چهچه‌ی زیبایش در فصل جفت‌یابی توجه جفت را جلب می‌کند.'},
 {id:'x320',icon:'speed',name:'ساکت‌رو',gene:'speed',desc:'بی‌صدا حرکت می‌کند و شکارش را غافلگیر می‌کند.'},
 {id:'x321',icon:'metabolism',name:'خواب‌زده',gene:'metabolism',desc:'زیاد می‌خوابد و انرژی‌اش را آهسته مصرف می‌کند.'},
 {id:'x322',icon:'vision',name:'شبگرد',gene:'vision',desc:'شب‌ها بیدار است و در تاریکی خوب می‌بیند و شکار می‌کند.'},
 {id:'x323',icon:'efficiency',name:'نیم‌خواب',gene:'efficiency',desc:'چرت‌های کوتاه انرژی‌اش را برمی‌گرداند و کمتر خسته می‌شود.'},
 {id:'x324',icon:'lifespan',name:'لانه‌خواب',gene:'lifespan',desc:'در لانه‌ی گرم و امن می‌خوابد و بیشتر عمر می‌کند.'},
 {id:'x325',icon:'speed',name:'فجرخیز',gene:'speed',desc:'سحر بیدار می‌شود و اولین غذا را پیدا می‌کند.'},
 {id:'x326',icon:'vision',name:'جغدگونه',gene:'vision',desc:'مثل جغد در تاریکی می‌بیند و شب شکار می‌کند.'},
 {id:'x327',icon:'coldRes',name:'خواب‌زمستانی',gene:'coldRes',desc:'در زمستان به خواب عمیق می‌رود و سرما را بی‌خطر می‌گذراند.'},
 {id:'x328',icon:'metabolism',name:'خمیازه‌کش',gene:'metabolism',desc:'با خواب زیاد بدنش کند کار می‌کند و دیر گرسنه می‌شود.'},
 {id:'x329',icon:'lifespan',name:'ماه‌خواب',gene:'lifespan',desc:'زیر نور ماه می‌خوابد و آرام‌تر پیر می‌شود.'},
 {id:'x330',icon:'efficiency',name:'ساعت‌بدن',gene:'efficiency',desc:'ساعت بدنش دقیق است و همیشه سر وقت بیدار و فعال است.'},
 {id:'x331',icon:'lifespan',name:'ذهن‌قوی',gene:'lifespan',desc:'جای غذا را برای همیشه یادش می‌ماند و هر سال برمی‌گردد.'},
 {id:'x332',icon:'cooperation',name:'تازه‌آموز',gene:'cooperation',desc:'سریع از بزرگ‌ترها یاد می‌گیرد و زود مستقل می‌شود.'},
 {id:'x333',icon:'vision',name:'راه‌بلد',gene:'vision',desc:'نقشه‌ی محیط را در ذهنش دارد و هیچ‌وقت گم نمی‌شود.'},
 {id:'x334',icon:'vision',name:'مشاهده‌گر',gene:'vision',desc:'با دقت همه‌چیز را زیر نظر می‌گیرد و خطر را زود می‌بیند.'},
 {id:'x335',icon:'cooperation',name:'آموزگار',gene:'cooperation',desc:'به بچه‌های گروه شکار یاد می‌دهد و گروه قوی‌تر می‌شود.'},
 {id:'x336',icon:'efficiency',name:'گره‌گشا',gene:'efficiency',desc:'راه‌حل مشکلات را سریع پیدا می‌کند و کمتر گیر می‌کند.'},
 {id:'x337',icon:'fertility',name:'افسانه‌گو',gene:'fertility',desc:'تجربه‌هایش را به بچه‌ها منتقل می‌کند و آن‌ها زودتر بزرگ می‌شوند.'},
 {id:'x338',icon:'speed',name:'جهت‌یاب',gene:'speed',desc:'جهت را همیشه درست تشخیص می‌دهد و سریع به غذا می‌رسد.'},
 {id:'x339',icon:'lifespan',name:'تجربه‌اندوز',gene:'lifespan',desc:'از هر اشتباه درس می‌گیرد و بیشتر عمر می‌کند.'},
 {id:'x340',icon:'cooperation',name:'خیال‌پرداز',gene:'cooperation',desc:'ایده‌های تازه برای پیدا کردن غذا دارد و گروه را سیر می‌کند.'},
 {id:'x341',icon:'speed',name:'آب‌تنی',gene:'speed',desc:'در آب سریع شنا می‌کند و از شکارچی فرار می‌کند.'},
 {id:'x342',icon:'metabolism',name:'ماهی‌گیر',gene:'metabolism',desc:'ماهی شکار می‌کند و با غذای آبی سیر می‌شود.'},
 {id:'x343',icon:'heatRes',name:'آب‌نشین',gene:'heatRes',desc:'در آب خنک می‌ماند و گرما اذیتش نمی‌کند.'},
 {id:'x344',icon:'speed',name:'موج‌نشین',gene:'speed',desc:'روی موج‌ها سوار می‌شود و سریع جابه‌جا می‌شود.'},
 {id:'x345',icon:'cooperation',name:'دلفین‌گونه',gene:'cooperation',desc:'مثل دلفین با گروه شنا می‌کند و با هم شکار می‌کنند.'},
 {id:'x346',icon:'vision',name:'عمق‌رو',gene:'vision',desc:'زیر آب شکار می‌بیند و غواصی می‌کند.'},
 {id:'x347',icon:'coldRes',name:'کرانه‌نشین',gene:'coldRes',desc:'کنار آب زندگی می‌کند و در سرما هم غذای آبی پیدا می‌کند.'},
 {id:'x348',icon:'aggression',name:'آب‌پاش',gene:'aggression',desc:'آب به سمت دشمن می‌پاشد و او را عقب می‌راند.'},
 {id:'x349',icon:'lifespan',name:'سپرپوش',gene:'lifespan',desc:'مثل لاک‌پشت آرام ولی طولانی عمر می‌کند.'},
 {id:'x350',icon:'immunity',name:'باران‌نشین',gene:'immunity',desc:'زیر باران خیس می‌شود ولی سرما نمی‌خورد.'},
 {id:'x351',icon:'mask',name:'نهان‌رو',gene:'mask',desc:'خودش را خوب پنهان می‌کند و شکارچی او را پیدا نمی‌کند.'},
 {id:'x352',icon:'coat',name:'رنگ‌عوض‌کن',gene:'coat',desc:'رنگ بدنش را با محیط عوض می‌کند و نامرئی می‌شود.'},
 {id:'x353',icon:'coat',name:'برگ‌پوش',gene:'coat',desc:'بدنش شبیه برگ است و در جنگل دیده نمی‌شود.'},
 {id:'x354',icon:'speed',name:'شبح‌رو',gene:'speed',desc:'بی‌صدا و سریع حرکت می‌کند و مثل شبح ناپدید می‌شود.'},
 {id:'x355',icon:'efficiency',name:'تارتن',gene:'efficiency',desc:'در تارهایش پنهان می‌شود و با کمترین انرژی شکار می‌کند.'},
 {id:'x356',icon:'mask',name:'روباه‌گونه',gene:'mask',desc:'مثل روباه در بوته‌ها پنهان می‌شود و غافلگیرانه شکار می‌کند.'},
 {id:'x357',icon:'mask',name:'تاریک‌پوش',gene:'mask',desc:'در تاریکی کاملاً محو می‌شود و دیده نمی‌شود.'},
 {id:'x358',icon:'coat',name:'سنگ‌نما',gene:'coat',desc:'بدنش شبیه سنگ است و شکارچی از کنارش رد می‌شود.'},
 {id:'x359',icon:'coldRes',name:'برف‌پوش',gene:'coldRes',desc:'در برف سفید می‌شود و در زمستان دیده نمی‌شود.'},
 {id:'x360',icon:'mask',name:'نامرئی',gene:'mask',desc:'آن‌قدر بی‌حرکت می‌ایستد که شکارچی او را نمی‌بیند.'},
 {id:'x361',icon:'aggression',name:'شجاع',gene:'aggression',desc:'از هیچ شکارچی نمی‌ترسد و برای گروه می‌جنگد.'},
 {id:'x362',icon:'aggression',name:'سپردار',gene:'aggression',desc:'با سپر بدنش جلوی حمله می‌ایستد و گروه را حفظ می‌کند.'},
 {id:'x363',icon:'aggression',name:'جنگجو',gene:'aggression',desc:'در جنگ سر غذا همیشه برنده می‌شود.'},
 {id:'x364',icon:'speed',name:'ترسو',gene:'speed',desc:'زود می‌ترسد و سریع فرار می‌کند و زنده می‌ماند.'},
 {id:'x365',icon:'heatRes',name:'آتش‌دل',gene:'heatRes',desc:'از آتش نمی‌ترسد و نزدیک آن غذا پیدا می‌کند.'},
 {id:'x366',icon:'aggression',name:'رعدنترس',gene:'aggression',desc:'از طوفان نمی‌ترسد و در بدترین هوا هم بیرون می‌رود.'},
 {id:'x367',icon:'vision',name:'عقاب‌دل',gene:'vision',desc:'شجاعانه از بلندی می‌پرد و طعمه را از دور می‌بیند.'},
 {id:'x368',icon:'size',name:'زورمند',gene:'size',desc:'قوی و بزرگ است و هیچ‌کس جرئت حمله به او را ندارد.'},
 {id:'x369',icon:'speed',name:'فراری',gene:'speed',desc:'به‌محض خطر سریع فرار می‌کند و جان سالم به در می‌برد.'},
 {id:'x370',icon:'efficiency',name:'سنگ‌نورد',gene:'efficiency',desc:'شجاعانه از صخره بالا می‌رود و به غذای دور از دسترس می‌رسد.'},
 {id:'x371',icon:'fertility',name:'قهرمان',gene:'fertility',desc:'در مسابقه برنده می‌شود و جفت‌های بیشتری جذب می‌کند.'},
 {id:'x372',icon:'cooperation',name:'بازیگوش',gene:'cooperation',desc:'با بازی گروه را کنار هم نگه می‌دارد و دوستی‌شان بیشتر می‌شود.'},
 {id:'x373',icon:'speed',name:'دونده‌مسابقه',gene:'speed',desc:'در دویدن با همه مسابقه می‌دهد و همیشه اول می‌رسد.'},
 {id:'x374',icon:'vision',name:'نشانه‌گیر',gene:'vision',desc:'هدف را دقیق می‌زند و هیچ‌وقت شکار را از دست نمی‌دهد.'},
 {id:'x375',icon:'size',name:'کشتی‌گیر',gene:'size',desc:'در کشتی گرفتن قوی‌تر است و قلمرویش را حفظ می‌کند.'},
 {id:'x376',icon:'lifespan',name:'شانس‌آور',gene:'lifespan',desc:'همیشه شانس می‌آورد و از خطرها جان سالم به در می‌برد.'},
 {id:'x377',icon:'cooperation',name:'توپ‌باز',gene:'cooperation',desc:'با بازی گروهی بچه‌ها را فعال نگه می‌دارد.'},
 {id:'x378',icon:'fertility',name:'مدال‌آور',gene:'fertility',desc:'با پیروزی‌هایش در گروه مشهور می‌شود و جفت پیدا می‌کند.'},
 {id:'x379',icon:'speed',name:'اول‌شونده',gene:'speed',desc:'همیشه در مسابقه‌ی غذا اول می‌رسد.'},
 {id:'x380',icon:'efficiency',name:'برگ‌باز',gene:'efficiency',desc:'با حیله و زیرکی در بازی برنده می‌شود و کمتر انرژی مصرف می‌کند.'},
 {id:'x381',icon:'vision',name:'ستاره‌بین',gene:'vision',desc:'آسمان را زیر نظر می‌گیرد و مسیرش را از ستاره‌ها پیدا می‌کند.'},
 {id:'x382',icon:'lifespan',name:'دنیاگرد',gene:'lifespan',desc:'به جاهای دور سفر می‌کند و غذاهای تازه پیدا می‌کند.'},
 {id:'x383',icon:'speed',name:'ستاره‌راه',gene:'speed',desc:'جهت را همیشه درست تشخیص می‌دهد و سریع به مقصد می‌رسد.'},
 {id:'x384',icon:'efficiency',name:'ولگرد',gene:'efficiency',desc:'پیاده‌روی طولانی را دوست دارد و با کمترین غذا سفر می‌کند.'},
 {id:'x385',icon:'coldRes',name:'اوج‌گیر',gene:'coldRes',desc:'به قله‌های سرد می‌رود و سرما اذیتش نمی‌کند.'},
 {id:'x386',icon:'heatRes',name:'آتشفشان‌گرد',gene:'heatRes',desc:'از گرمای آتشفشان نمی‌ترسد و نزدیک آن غذا پیدا می‌کند.'},
 {id:'x387',icon:'vision',name:'غارگرد',gene:'vision',desc:'غارهای تاریک را کاوش می‌کند و در تاریکی می‌بیند.'},
 {id:'x388',icon:'metabolism',name:'اقیانوس‌نورد',gene:'metabolism',desc:'سفرهای دریایی طولانی می‌رود و غذای دریا می‌خورد.'},
 {id:'x389',icon:'fertility',name:'پروانه‌گرد',gene:'fertility',desc:'دنبال گل‌ها و جفت‌های تازه می‌گردد و همه‌جا سفر می‌کند.'},
 {id:'x390',icon:'cooperation',name:'پرس‌وجوگر',gene:'cooperation',desc:'همه‌چیز را وارسی می‌کند و غذای پنهان را برای گروه پیدا می‌کند.'},
 {id:'x391',icon:'metabolism',name:'آرام',gene:'metabolism',desc:'آرام می‌نشیند و انرژی‌اش را آهسته مصرف می‌کند.'},
 {id:'x392',icon:'lifespan',name:'صبور',gene:'lifespan',desc:'صبورانه منتظر غذا می‌ماند و بیشتر عمر می‌کند.'},
 {id:'x393',icon:'cooperation',name:'لطیف',gene:'cooperation',desc:'لطیف و مهربان است و گروه او را دوست دارد.'},
 {id:'x394',icon:'efficiency',name:'نسیم‌رو',gene:'efficiency',desc:'مثل نسیم آرام حرکت می‌کند و انرژی‌اش را ذخیره می‌کند.'},
 {id:'x395',icon:'coldRes',name:'نیلوفر',gene:'coldRes',desc:'در آب سرد آرام می‌ماند و سرما اذیتش نمی‌کند.'},
 {id:'x396',icon:'heatRes',name:'مه‌نشین',gene:'heatRes',desc:'در سایه‌ی ابرها آرام می‌خوابد و گرما به او نمی‌رسد.'},
 {id:'x397',icon:'metabolism',name:'حلزونی',gene:'metabolism',desc:'آرام و کند حرکت می‌کند ولی خیلی کم غذا می‌خواهد.'},
 {id:'x398',icon:'fertility',name:'گندم‌زار',gene:'fertility',desc:'آرام در مزرعه می‌ماند و بچه‌های زیادی بزرگ می‌کند.'},
 {id:'x399',icon:'coldRes',name:'یخ‌نشین',gene:'coldRes',desc:'روی یخ آرام می‌نشیند و سرما را دوست دارد.'},
 {id:'x400',icon:'cooperation',name:'صلح‌جو',gene:'cooperation',desc:'با همه صلح می‌کند و گروه بدون جنگ زندگی می‌کند.'},
 {id:'x401',icon:'vision',name:'رازجو',gene:'vision',desc:'همیشه به گوشه‌های ناشناخته می‌رود و غذای پنهان را پیدا می‌کند.'},
 {id:'x402',icon:'vision',name:'نقشه‌نگار',gene:'vision',desc:'مسیرها را به خاطر می‌سپارد و همیشه کوتاه‌ترین راه به غذا را می‌یابد.'},
 {id:'x403',icon:'vision',name:'ردگیر',gene:'vision',desc:'رد غذا و دوستان را از دور دنبال می‌کند و هرگز گم نمی‌شود.'},
 {id:'x404',icon:'speed',name:'جستجوگر',gene:'speed',desc:'بی‌وقفه در جستجوی غذا می‌گردد و زودتر از بقیه به آن می‌رسد.'},
 {id:'x405',icon:'efficiency',name:'ماجراجو',gene:'efficiency',desc:'به جاهای تازه سر می‌زند و با انرژی کم، غذای بیشتری پیدا می‌کند.'},
 {id:'x406',icon:'vision',name:'کاشف',gene:'vision',desc:'سرزمین‌های تازه را پیدا می‌کند و غذاهای تازه را زودتر از همه می‌چشد.'},
 {id:'x407',icon:'cooperation',name:'پرسشگر',gene:'cooperation',desc:'با پرسیدن و نگاه کردن از دیگران یاد می‌گیرد و گروه را باهوش‌تر می‌کند.'},
 {id:'x408',icon:'vision',name:'تیزبین',gene:'vision',desc:'کوچک‌ترین حرکت غذا را از فاصله‌ی دور می‌بیند.'},
 {id:'x409',icon:'efficiency',name:'راه‌گشا',gene:'efficiency',desc:'همیشه راه خانه و غذا را می‌داند و انرژی‌اش را هدر نمی‌دهد.'},
 {id:'x410',icon:'vision',name:'دیده‌بان',gene:'vision',desc:'از بلندی همه‌جا را زیر نظر دارد و خطر و غذا را زود می‌بیند.'},
 {id:'x411',icon:'metabolism',name:'سرگردان',gene:'metabolism',desc:'پیوسته در حرکت است و بدنش با غذای کم هم دوام می‌آورد.'},
 {id:'x412',icon:'vision',name:'گمشده‌یاب',gene:'vision',desc:'چیزهای گم‌شده و غذای پنهان را جایی که کسی نمی‌بیند پیدا می‌کند.'},
 {id:'x413',icon:'vision',name:'افق‌نگر',gene:'vision',desc:'به دورترین نقطه نگاه می‌کند و غذاهای آینده را پیش‌بینی می‌کند.'},
 {id:'x414',icon:'speed',name:'بی‌قرار',gene:'speed',desc:'هرگز یک‌جا نمی‌ماند و با حرکت مداوم زودتر به غذا می‌رسد.'},
 {id:'x415',icon:'lifespan',name:'جهان‌نورد',gene:'lifespan',desc:'دور دنیا سفر می‌کند و تجربه‌اش عمرش را طولانی‌تر می‌کند.'},
 {id:'x416',icon:'mask',name:'استتارگر',gene:'mask',desc:'رنگ بدنش با محیط یکی می‌شود و دشمن او را نمی‌بیند.'},
 {id:'x417',icon:'mask',name:'سایه‌گرد',gene:'mask',desc:'در سایه‌ها حرکت می‌کند و بی‌آنکه دیده شود به غذا می‌رسد.'},
 {id:'x418',icon:'mask',name:'دیده‌نشو',gene:'mask',desc:'چنان آرام و پنهان حرکت می‌کند که گویی اصلاً آنجا نیست.'},
 {id:'x419',icon:'aggression',name:'کمین‌نشین',gene:'aggression',desc:'در کمین می‌نشیند و با یک حمله‌ی ناگهانی غذای دیگران را می‌گیرد.'},
 {id:'x420',icon:'mask',name:'شب‌رو',gene:'mask',desc:'شب‌ها فعال است و در تاریکی غذا می‌یابد و از خطر پنهان می‌ماند.'},
 {id:'x421',icon:'coat',name:'خاکستری',gene:'coat',desc:'پوشش خاکستری‌اش او را در مه و سنگ‌ها پنهان می‌کند.'},
 {id:'x422',icon:'coat',name:'برگ‌رنگ',gene:'coat',desc:'بدنش رنگ برگ‌های خشک را دارد و میان درختان دیده نمی‌شود.'},
 {id:'x423',icon:'coat',name:'سنگی',gene:'coat',desc:'پوستش مثل سنگ است و هم پنهان می‌شود و هم ضربه را تحمل می‌کند.'},
 {id:'x424',icon:'mask',name:'مه‌آلود',gene:'mask',desc:'در مه گم می‌شود و شکارچی نمی‌تواند رد او را بگیرد.'},
 {id:'x425',icon:'efficiency',name:'بی‌صدا',gene:'efficiency',desc:'بی‌هیچ صدایی حرکت می‌کند و انرژی کمتری هم می‌سوزاند.'},
 {id:'x426',icon:'mask',name:'پنهان‌رو',gene:'mask',desc:'خود را میان دیگران قایم می‌کند و در دعوا کمتر هدف قرار می‌گیرد.'},
 {id:'x427',icon:'mask',name:'شبح‌وار',gene:'mask',desc:'مثل سایه می‌گذرد و کسی نمی‌فهمد از کجا آمد و کجا رفت.'},
 {id:'x428',icon:'coat',name:'تاریک‌رو',gene:'coat',desc:'پوشش تیره‌اش او را در شب کاملاً پنهان می‌کند.'},
 {id:'x429',icon:'mask',name:'نقاب‌دار',gene:'mask',desc:'چهره‌اش پشت نقابی پنهان است و دشمن نیت او را نمی‌خواند.'},
 {id:'x430',icon:'mask',name:'ردپوش',gene:'mask',desc:'رد پای خود را پاک می‌کند و هیچ‌کس نمی‌تواند دنبالش کند.'},
 {id:'x431',icon:'speed',name:'دریارو',gene:'speed',desc:'در آب سریع شنا می‌کند و غذای رودخانه را زودتر می‌گیرد.'},
 {id:'x432',icon:'vision',name:'ژرف‌رو',gene:'vision',desc:'به عمق آب می‌رود و غذاهایی را می‌بیند که دیگران نمی‌بینند.'},
 {id:'x433',icon:'speed',name:'موج‌گرد',gene:'speed',desc:'روی موج‌ها سوار می‌شود و سریع به ساحل غذا می‌رسد.'},
 {id:'x434',icon:'metabolism',name:'آبزی',gene:'metabolism',desc:'در آب زندگی می‌کند و بدنش با غذای آبی خیلی کم دوام می‌آورد.'},
 {id:'x435',icon:'efficiency',name:'رودخانه‌ای',gene:'efficiency',desc:'کنار رودخانه زندگی می‌کند و با کمترین تلاش همیشه سیر است.'},
 {id:'x436',icon:'coldRes',name:'باران‌خور',gene:'coldRes',desc:'باران و سرما او را اذیت نمی‌کند و در هوای بارانی هم شاد است.'},
 {id:'x437',icon:'fertility',name:'حباب‌ساز',gene:'fertility',desc:'حباب‌های زیادی می‌سازد و بچه‌هایش درون آن‌ها امن بزرگ می‌شوند.'},
 {id:'x438',icon:'metabolism',name:'صیدگر',gene:'metabolism',desc:'ماهی می‌گیرد و با یک ماهی مدت زیادی سیر می‌ماند.'},
 {id:'x439',icon:'heatRes',name:'ساحل‌رو',gene:'heatRes',desc:'کنار ساحل در گرمای آفتاب آرام زندگی می‌کند و گرما اذیتش نمی‌کند.'},
 {id:'x440',icon:'lifespan',name:'جزیره‌ای',gene:'lifespan',desc:'در جزیره‌ای آرام و دور از خطر، عمر طولانی و بی‌دغدغه‌ای دارد.'},
 {id:'x441',icon:'size',name:'نهنگ‌سان',gene:'size',desc:'به بزرگی یک نهنگ است و در آب هیچ‌کس جرئت دعوا با او را ندارد.'},
 {id:'x442',icon:'immunity',name:'مرجانی',gene:'immunity',desc:'میان مرجان‌ها زندگی می‌کند و بدنش در برابر بیماری مقاوم شده است.'},
 {id:'x443',icon:'metabolism',name:'جزر و مدی',gene:'metabolism',desc:'با جزر و مد غذا می‌خورد و بدنش با کم و زیاد غذا کنار می‌آید.'},
 {id:'x444',icon:'efficiency',name:'قطره‌ای',gene:'efficiency',desc:'با یک قطره آب و یک دانه غذا مدت زیادی زنده می‌ماند.'},
 {id:'x445',icon:'coat',name:'ابری',gene:'coat',desc:'پوشش سفید و ابری‌اش او را میان موج‌ها پنهان می‌کند.'},
 {id:'x446',icon:'speed',name:'پروازگر',gene:'speed',desc:'در آسمان پرواز می‌کند و از بالا غذا را زودتر از همه می‌بیند.'},
 {id:'x447',icon:'efficiency',name:'بال‌دار',gene:'efficiency',desc:'بال دارد و با پرواز، بدون خستگی به غذاهای دور می‌رسد.'},
 {id:'x448',icon:'vision',name:'آسمان‌نشین',gene:'vision',desc:'بالای ابرها زندگی می‌کند و همه‌ی سرزمین را زیر نظر دارد.'},
 {id:'x449',icon:'speed',name:'بادپا',gene:'speed',desc:'با باد می‌دود و سرعتش از همه‌ی دونده‌ها بیشتر است.'},
 {id:'x450',icon:'lifespan',name:'بلندپرواز',gene:'lifespan',desc:'به بلندترین آرزوها می‌رسد و زندگی طولانی و پرباری دارد.'},
 {id:'x451',icon:'heatRes',name:'ابرگرد',gene:'heatRes',desc:'روی ابرها استراحت می‌کند و گرمای زمین به او نمی‌رسد.'},
 {id:'x452',icon:'vision',name:'اختربین',gene:'vision',desc:'ستاره‌ها را می‌شناسد و شب‌ها با آن‌ها راه غذا را پیدا می‌کند.'},
 {id:'x453',icon:'speed',name:'شهاب‌رو',gene:'speed',desc:'مثل شهاب می‌گذرد و هیچ‌کس نمی‌تواند به او برسد.'},
 {id:'x454',icon:'coldRes',name:'کوه‌نشین',gene:'coldRes',desc:'روی قله‌های سرد زندگی می‌کند و سرما برایش عادی است.'},
 {id:'x455',icon:'vision',name:'عقاب‌وار',gene:'vision',desc:'چشم عقاب دارد و از کیلومترها دورتر طعمه را می‌بیند.'},
 {id:'x456',icon:'metabolism',name:'پرنده‌خو',gene:'metabolism',desc:'غذای پرنده‌ها را می‌خورد و با دانه‌های کوچک هم سیر می‌شود.'},
 {id:'x457',icon:'efficiency',name:'بادبان‌دار',gene:'efficiency',desc:'مثل کشتی با باد حرکت می‌کند و بدون تلاش به غذای دور می‌رسد.'},
 {id:'x458',icon:'size',name:'آسمان‌خراش',gene:'size',desc:'قدش به آسمان می‌رسد و در دعوا همه از او می‌ترسند.'},
 {id:'x459',icon:'mask',name:'مهتابی',gene:'mask',desc:'در نور مهتاب پنهان می‌شود و شب‌ها بی‌دیده به غذا می‌رسد.'},
 {id:'x460',icon:'heatRes',name:'خورشیدپرست',gene:'heatRes',desc:'زیر آفتاب داغ هم شاد است و گرما او را قوی‌تر می‌کند.'},
 {id:'x461',icon:'cooperation',name:'ابزارساز',gene:'cooperation',desc:'ابزار می‌سازد و با آن‌ها گروه غذا را راحت‌تر به دست می‌آورد.'},
 {id:'x462',icon:'size',name:'سنگ‌تراش',gene:'size',desc:'سنگ می‌تراشد و با بازوهای قوی‌اش در دعوا برنده می‌شود.'},
 {id:'x463',icon:'efficiency',name:'چوب‌کار',gene:'efficiency',desc:'از چوب ابزار می‌سازد و با کمترین زحمت غذای بیشتری به دست می‌آورد.'},
 {id:'x464',icon:'cooperation',name:'خانه‌بان',gene:'cooperation',desc:'برای گروه خانه می‌سازد و همه در آن امن و آرام زندگی می‌کنند.'},
 {id:'x465',icon:'aggression',name:'دیواربان',gene:'aggression',desc:'دیوار می‌کشد و قلمروش را با قدرت از دیگران محافظت می‌کند.'},
 {id:'x466',icon:'aggression',name:'مرزبان',gene:'aggression',desc:'مرز گروه را نگه می‌دارد و بیگانه‌ها را با جنگ دور می‌کند.'},
 {id:'x467',icon:'aggression',name:'قلمروبان',gene:'aggression',desc:'صاحب قلمرو است و هرکس وارد شود با او می‌جنگد.'},
 {id:'x468',icon:'metabolism',name:'انباردار',gene:'metabolism',desc:'غذا را انبار می‌کند و در قحطی از ذخیره‌اش سیر می‌ماند.'},
 {id:'x469',icon:'metabolism',name:'ذخیره‌گر',gene:'metabolism',desc:'برای روزهای سخت غذا ذخیره می‌کند و هرگز گرسنه نمی‌ماند.'},
 {id:'x470',icon:'cooperation',name:'پل‌ساز',gene:'cooperation',desc:'پل می‌سازد تا گروه راحت به غذای آن‌سوی رودخانه برسد.'},
 {id:'x471',icon:'heatRes',name:'آتش‌افروز',gene:'heatRes',desc:'آتش روشن می‌کند و در کنار آن از سرما و گرما نمی‌ترسد.'},
 {id:'x472',icon:'aggression',name:'تله‌ساز',gene:'aggression',desc:'تله می‌گذارد و غذای دیگران را بدون جنگ به دست می‌آورد.'},
 {id:'x473',icon:'cooperation',name:'بافنده',gene:'cooperation',desc:'تور و پارچه می‌بافد و با آن‌ها برای گروه غذا و خانه فراهم می‌کند.'},
 {id:'x474',icon:'efficiency',name:'سفالگر',gene:'efficiency',desc:'کوزه می‌سازد و آب و غذا را با کمترین هدررفت نگه می‌دارد.'},
 {id:'x475',icon:'vision',name:'چراغ‌افروز',gene:'vision',desc:'چراغ دارد و تاریکی برایش مانع دیدن غذا نیست.'},
 {id:'x476',icon:'fertility',name:'مادرانه',gene:'fertility',desc:'مثل مادر از بچه‌ها مراقبت می‌کند و آن‌ها زود بزرگ می‌شوند.'},
 {id:'x477',icon:'fertility',name:'پدرسان',gene:'fertility',desc:'مثل پدر از بچه‌ها نگهبانی می‌کند و نسل‌های زیادی به دنیا می‌آورد.'},
 {id:'x478',icon:'cooperation',name:'بچه‌بان',gene:'cooperation',desc:'از بچه‌های گروه نگهداری می‌کند تا والدینشان دنبال غذا بروند.'},
 {id:'x479',icon:'fertility',name:'لانه‌بان',gene:'fertility',desc:'لانه‌ای گرم می‌سازد و بچه‌هایش در آن سالم بزرگ می‌شوند.'},
 {id:'x480',icon:'fertility',name:'دایه‌وار',gene:'fertility',desc:'به بچه‌ها شیر و غذا می‌دهد و آن‌ها را قوی بار می‌آورد.'},
 {id:'x481',icon:'cooperation',name:'سرگروه',gene:'cooperation',desc:'جلوی گروه حرکت می‌کند و همه به دنبال او به غذا می‌رسند.'},
 {id:'x482',icon:'speed',name:'پیشرو',gene:'speed',desc:'همیشه جلوتر از همه است و اولین غذا نصیب او می‌شود.'},
 {id:'x483',icon:'cooperation',name:'رهنما',gene:'cooperation',desc:'راه را به دیگران نشان می‌دهد و گروه را از خطر دور نگه می‌دارد.'},
 {id:'x484',icon:'cooperation',name:'داور',gene:'cooperation',desc:'میان دعواها داوری می‌کند و گروه بدون جنگ زندگی می‌کند.'},
 {id:'x485',icon:'cooperation',name:'میانجی',gene:'cooperation',desc:'دعوا را با حرف حل می‌کند و غذا را عادلانه تقسیم می‌کند.'},
 {id:'x486',icon:'lifespan',name:'بزرگ‌تر',gene:'lifespan',desc:'پیر و باتجربه است و با تجربه‌اش عمر گروه را طولانی می‌کند.'},
 {id:'x487',icon:'cooperation',name:'یاددهنده',gene:'cooperation',desc:'به بچه‌ها یاد می‌دهد کجا غذا پیدا کنند و گروه باهوش‌تر می‌شود.'},
 {id:'x488',icon:'cooperation',name:'سرپرست',gene:'cooperation',desc:'از همه مراقبت می‌کند و نظم گروه را نگه می‌دارد.'},
 {id:'x489',icon:'immunity',name:'محافظ',gene:'immunity',desc:'از گروه در برابر بیماری و خطر محافظت می‌کند و همه سالم می‌مانند.'},
 {id:'x490',icon:'cooperation',name:'هم‌تیمی',gene:'cooperation',desc:'همیشه کنار دوستانش است و با کمک هم غذا را تقسیم می‌کنند.'},
 {id:'x491',icon:'aggression',name:'دلاور',gene:'aggression',desc:'از هیچ خطری نمی‌ترسد و سر غذا با قدرت می‌جنگد.'},
 {id:'x492',icon:'aggression',name:'نترس',gene:'aggression',desc:'ترس ندارد و در برابر بزرگ‌ترین دشمن هم عقب نمی‌نشیند.'},
 {id:'x493',icon:'aggression',name:'جنگ‌آور',gene:'aggression',desc:'جنگجوی ماهری است و در دعوا غذای دیگران را می‌گیرد.'},
 {id:'x494',icon:'size',name:'پهلوان',gene:'size',desc:'قهرمان گروه است؛ بزرگ و قوی و در دعوا همیشه برنده.'},
 {id:'x495',icon:'size',name:'ستبر',gene:'size',desc:'تنومند و قوی است و کسی جرئت دعوا با او را ندارد.'},
 {id:'x496',icon:'size',name:'نیرومند',gene:'size',desc:'نیروی زیادی دارد و در دعوا همه را کنار می‌زند.'},
 {id:'x497',icon:'lifespan',name:'بردبار',gene:'lifespan',desc:'صبور است و آرام زندگی می‌کند؛ عمرش طولانی‌تر می‌شود.'},
 {id:'x498',icon:'metabolism',name:'آرام‌دل',gene:'metabolism',desc:'دلش آرام است و بدنش با غذای کم هم مدت زیادی دوام می‌آورد.'},
 {id:'x499',icon:'cooperation',name:'هم‌پیمان',gene:'cooperation',desc:'به گروه وفادار است و همیشه کنار دوستانش می‌ماند.'},
 {id:'x500',icon:'lifespan',name:'جاودانه',gene:'lifespan',desc:'چنان سالم و قوی زندگی می‌کند که گویی جاودانه است.'},
 {id:'x501',icon:'vision',name:'خطاط',gene:'vision',desc:'چشم هنرمندانه‌اش غذا را از دور تشخیص می‌دهد.'},
 {id:'x502',icon:'cooperation',name:'صحنه‌گردان',gene:'cooperation',desc:'با نمایش و حرکاتش دیگران را به همکاری دعوت می‌کند.'},
 {id:'x503',icon:'speed',name:'پای‌کوب',gene:'speed',desc:'با حرکات موزون و سریع، زودتر از بقیه به غذا می‌رسد.'},
 {id:'x504',icon:'mask',name:'شعبده‌باز',gene:'mask',desc:'با ترفندهایش شکارچیان را گمراه می‌کند و پنهان می‌ماند.'},
 {id:'x505',icon:'coat',name:'رنگ‌نگار',gene:'coat',desc:'پوشش رنگارنگش در میان گل‌ها پنهانش می‌کند.'},
 {id:'x506',icon:'cooperation',name:'کارگردان',gene:'cooperation',desc:'دیگران را سازمان می‌دهد تا با هم غذا پیدا کنند.'},
 {id:'x507',icon:'cooperation',name:'خواننده',gene:'cooperation',desc:'آوازش گروه را دور هم جمع می‌کند.'},
 {id:'x508',icon:'speed',name:'بالرین',gene:'speed',desc:'با قدم‌های سبک و سریع، بی‌صدا به غذا نزدیک می‌شود.'},
 {id:'x509',icon:'efficiency',name:'نوازنده',gene:'efficiency',desc:'با ریتم منظم، انرژی‌اش را هدر نمی‌دهد.'},
 {id:'x510',icon:'size',name:'مجسمه‌ساز',gene:'size',desc:'با بدن بزرگ و قوی‌اش سنگ‌ها را جابه‌جا می‌کند.'},
 {id:'x511',icon:'mask',name:'دلقک',gene:'mask',desc:'با چهره خندانش دشمن را فریب می‌دهد.'},
 {id:'x512',icon:'vision',name:'عکاس',gene:'vision',desc:'چشم تیزبینش کوچک‌ترین غذا را از دور می‌بیند.'},
 {id:'x513',icon:'efficiency',name:'طراح',gene:'efficiency',desc:'نقشه ذهنی‌اش راه رسیدن به غذا را کوتاه می‌کند.'},
 {id:'x514',icon:'speed',name:'بندباز',gene:'speed',desc:'تعادل و چابکی‌اش او را سریع‌تر از همه می‌کند.'},
 {id:'x515',icon:'mask',name:'نقش‌آفرین',gene:'mask',desc:'نقش‌های گوناگون بازی می‌کند تا دشمن او را نشناسد.'},
 {id:'x516',icon:'efficiency',name:'آهنگساز',gene:'efficiency',desc:'ریتم درونی‌اش انرژی‌اش را بهینه مصرف می‌کند.'},
 {id:'x517',icon:'aggression',name:'دایره‌زن',gene:'aggression',desc:'صدای طبلش دشمنان را می‌ترساند و دور می‌کند.'},
 {id:'x518',icon:'cooperation',name:'شیپورچی',gene:'cooperation',desc:'با شیپورش گروه را برای شکار فرا می‌خواند.'},
 {id:'x519',icon:'mask',name:'زمزمه‌گر',gene:'mask',desc:'زمزمه آرامش دشمن را متوجه او نمی‌کند.'},
 {id:'x520',icon:'fertility',name:'ترانه‌خوان',gene:'fertility',desc:'آواز زیبایش جفت بیشتری جذب می‌کند.'},
 {id:'x521',icon:'speed',name:'گوش‌سپار',gene:'speed',desc:'صدای غذا را زود می‌شنود و سریع به سمتش می‌دود.'},
 {id:'x522',icon:'efficiency',name:'ریتم‌دان',gene:'efficiency',desc:'با ریتم بدن، انرژی‌اش را کم مصرف می‌کند.'},
 {id:'x523',icon:'aggression',name:'فریادگر',gene:'aggression',desc:'فریاد بلندش رقیبان را فراری می‌دهد.'},
 {id:'x524',icon:'cooperation',name:'سرودخوان',gene:'cooperation',desc:'آواز گروهی‌اش پیوند گروه را قوی‌تر می‌کند.'},
 {id:'x525',icon:'speed',name:'ریتم‌ساز',gene:'speed',desc:'با ضرباهنگ تند، سریع‌تر حرکت می‌کند.'},
 {id:'x526',icon:'efficiency',name:'پیانیست',gene:'efficiency',desc:'انگشتان چابکش غذا را سریع و دقیق جمع می‌کند.'},
 {id:'x527',icon:'cooperation',name:'هم‌خوان',gene:'cooperation',desc:'با هم‌خوانی گروه، هماهنگی شکار بیشتر می‌شود.'},
 {id:'x528',icon:'aggression',name:'غرش‌گر',gene:'aggression',desc:'زوزه ترسناکش دشمنان را عقب می‌راند.'},
 {id:'x529',icon:'mask',name:'سکوت‌شکن',gene:'mask',desc:'در سکوت حرکت می‌کند و دیده نمی‌شود.'},
 {id:'x530',icon:'cooperation',name:'نغمه‌ساز',gene:'cooperation',desc:'نغمه‌اش گروه را هماهنگ نگه می‌دارد.'},
 {id:'x531',icon:'metabolism',name:'خواب‌گیر',gene:'metabolism',desc:'با خواب عمیق، انرژی‌اش کندتر مصرف می‌شود.'},
 {id:'x532',icon:'vision',name:'شب‌پا',gene:'vision',desc:'در تاریکی شب بهتر می‌بیند و غذا پیدا می‌کند.'},
 {id:'x533',icon:'lifespan',name:'استراحت‌جو',gene:'lifespan',desc:'با استراحت کافی، عمر طولانی‌تری دارد.'},
 {id:'x534',icon:'metabolism',name:'چرت‌گر',gene:'metabolism',desc:'چرت‌های کوتاه انرژی‌اش را ذخیره می‌کند.'},
 {id:'x535',icon:'coldRes',name:'ماه‌نشین',gene:'coldRes',desc:'در شب‌های سرد، بدنش گرما را حفظ می‌کند.'},
 {id:'x536',icon:'efficiency',name:'خمیازه‌گر',gene:'efficiency',desc:'با مصرف کم انرژی، دیرتر گرسنه می‌شود.'},
 {id:'x537',icon:'immunity',name:'آشیانه‌خواب',gene:'immunity',desc:'در لانه امن استراحت می‌کند و کمتر بیمار می‌شود.'},
 {id:'x538',icon:'vision',name:'مهتاب‌رو',gene:'vision',desc:'زیر نور ماه غذا را به‌خوبی می‌بیند.'},
 {id:'x539',icon:'lifespan',name:'رویاگر',gene:'lifespan',desc:'خواب آرامش استرس را کم می‌کند و عمرش را زیاد می‌کند.'},
 {id:'x540',icon:'metabolism',name:'خواب‌گرد',gene:'metabolism',desc:'در خواب متابولیسمش کند می‌شود و انرژی ذخیره می‌کند.'},
 {id:'x541',icon:'vision',name:'ستاره‌شمار',gene:'vision',desc:'چشمش به تاریکی عادت کرده و در شب غذا می‌بیند.'},
 {id:'x542',icon:'heatRes',name:'بالش‌دوست',gene:'heatRes',desc:'در گرمای روز در سایه استراحت می‌کند و خنک می‌ماند.'},
 {id:'x543',icon:'immunity',name:'خواب‌سنگین',gene:'immunity',desc:'خواب عمیق بدنش را در برابر بیماری قوی می‌کند.'},
 {id:'x544',icon:'speed',name:'شب‌نشین',gene:'speed',desc:'شب‌ها بیدار است و سریع‌تر از رقیبان غذا می‌یابد.'},
 {id:'x545',icon:'metabolism',name:'تنبل',gene:'metabolism',desc:'کم‌تحرک است و انرژی‌اش دیر تمام می‌شود.'},
 {id:'x546',icon:'efficiency',name:'حافظه‌دار',gene:'efficiency',desc:'جای غذا را به خاطر می‌سپارد و مستقیم به سمتش می‌رود.'},
 {id:'x547',icon:'vision',name:'کتاب‌خوان',gene:'vision',desc:'از تجربه‌ها می‌آموزد و غذا را زودتر می‌بیند.'},
 {id:'x548',icon:'cooperation',name:'مربی',gene:'cooperation',desc:'به دیگران یاد می‌دهد کجا غذا پیدا کنند.'},
 {id:'x549',icon:'speed',name:'جست‌وجوگر',gene:'speed',desc:'کنجکاوی‌اش او را سریع به جاهای جدید می‌رساند.'},
 {id:'x550',icon:'efficiency',name:'معماساز',gene:'efficiency',desc:'مسئله‌ها را حل می‌کند و راه کوتاه غذا را پیدا می‌کند.'},
 {id:'x551',icon:'vision',name:'یادداشت‌گر',gene:'vision',desc:'نشانه‌های غذا را به خاطر می‌سپارد و دوباره پیدا می‌کند.'},
 {id:'x552',icon:'lifespan',name:'شاگرد',gene:'lifespan',desc:'با یادگیری از بزرگ‌ترها، خطاها را کمتر می‌کند و بیشتر عمر می‌کند.'},
 {id:'x553',icon:'lifespan',name:'خردمند',gene:'lifespan',desc:'تجربه‌اش او را از خطر دور نگه می‌دارد و عمرش طولانی می‌شود.'},
 {id:'x554',icon:'efficiency',name:'پژوهشگر',gene:'efficiency',desc:'روش‌های تازه شکار را آزمایش می‌کند و انرژی کمتری هدر می‌دهد.'},
 {id:'x555',icon:'cooperation',name:'حکایت‌گو',gene:'cooperation',desc:'قصه‌هایش تجربه گروه را بیشتر می‌کند و همکاری را قوی می‌کند.'},
 {id:'x556',icon:'mask',name:'ذهن‌خوان',gene:'mask',desc:'نیت دشمن را حدس می‌زند و پیش از حمله پنهان می‌شود.'},
 {id:'x557',icon:'cooperation',name:'استادکار',gene:'cooperation',desc:'به جوان‌ترها یاد می‌دهد و گروه را قوی‌تر می‌کند.'},
 {id:'x558',icon:'vision',name:'ردیاب',gene:'vision',desc:'رد غذا را با چشم تیز دنبال می‌کند.'},
 {id:'x559',icon:'efficiency',name:'حل‌کننده',gene:'efficiency',desc:'مشکلات را سریع حل می‌کند و انرژی ذخیره می‌کند.'},
 {id:'x560',icon:'immunity',name:'دانا',gene:'immunity',desc:'دانستن گیاهان دارویی او را از بیماری نجات می‌دهد.'},
 {id:'x561',icon:'coldRes',name:'پاییزی',gene:'coldRes',desc:'در هوای سرد پاییز بدنش گرما را نگه می‌دارد.'},
 {id:'x562',icon:'coldRes',name:'زمستانی',gene:'coldRes',desc:'در سرمای زمستان هم به‌راحتی زنده می‌ماند.'},
 {id:'x563',icon:'fertility',name:'بهاری',gene:'fertility',desc:'در بهار بیشتر بچه‌دار می‌شود.'},
 {id:'x564',icon:'heatRes',name:'تابستانی',gene:'heatRes',desc:'گرمای تابستان او را اذیت نمی‌کند.'},
 {id:'x565',icon:'metabolism',name:'برگ‌ریز',gene:'metabolism',desc:'در پاییز متابولیسمش کند می‌شود و انرژی ذخیره می‌کند.'},
 {id:'x566',icon:'efficiency',name:'ساعت‌شناس',gene:'efficiency',desc:'زمان دقیق غذا خوردن را می‌داند و انرژی هدر نمی‌دهد.'},
 {id:'x567',icon:'vision',name:'سپیده‌دم',gene:'vision',desc:'در نور کم سپیده‌دم غذا را خوب می‌بیند.'},
 {id:'x568',icon:'speed',name:'غروب‌رو',gene:'speed',desc:'هنگام غروب سریع‌تر از همه به لانه برمی‌گردد.'},
 {id:'x569',icon:'lifespan',name:'فصل‌شناس',gene:'lifespan',desc:'با تغییر فصل سازگار می‌شود و بیشتر عمر می‌کند.'},
 {id:'x570',icon:'lifespan',name:'شکیبا',gene:'lifespan',desc:'صبرش او را از خطر دور می‌کند و عمرش را زیاد می‌کند.'},
 {id:'x571',icon:'immunity',name:'باران‌گرد',gene:'immunity',desc:'باران او را تازه می‌کند و کمتر بیمار می‌شود.'},
 {id:'x572',icon:'heatRes',name:'آفتاب‌دوست',gene:'heatRes',desc:'زیر آفتاب گرم هم خنک و سرحال می‌ماند.'},
 {id:'x573',icon:'mask',name:'برف‌رو',gene:'mask',desc:'پوشش سفیدش روی برف او را پنهان می‌کند.'},
 {id:'x574',icon:'speed',name:'بادخیز',gene:'speed',desc:'با باد همراه می‌شود و سریع‌تر حرکت می‌کند.'},
 {id:'x575',icon:'lifespan',name:'ماه‌گرد',gene:'lifespan',desc:'با چرخه ماه هماهنگ است و عمرش طولانی می‌شود.'},
 {id:'x576',icon:'fertility',name:'عاشق',gene:'fertility',desc:'با عشق بیشتر جفت می‌گیرد و بچه‌دار می‌شود.'},
 {id:'x577',icon:'cooperation',name:'پیمان‌دار',gene:'cooperation',desc:'به جفتش وفادار می‌ماند و با هم غذا پیدا می‌کنند.'},
 {id:'x578',icon:'fertility',name:'دلداده',gene:'fertility',desc:'جذابیتش جفت‌های بیشتری جذب می‌کند.'},
 {id:'x579',icon:'cooperation',name:'همسر',gene:'cooperation',desc:'با همسرش همکاری می‌کند و بیشتر غذا جمع می‌کند.'},
 {id:'x580',icon:'cooperation',name:'آشتی‌طلب',gene:'cooperation',desc:'با دیگران صلح می‌کند و گروه را متحد نگه می‌دارد.'},
 {id:'x581',icon:'cooperation',name:'دلسوز',gene:'cooperation',desc:'مهربانی‌اش دیگران را به کمک به او وامی‌دارد.'},
 {id:'x582',icon:'fertility',name:'گل‌دوست',gene:'fertility',desc:'بوی گل جفتش را جذب می‌کند.'},
 {id:'x583',icon:'fertility',name:'دلبر',gene:'fertility',desc:'زیبایی‌اش جفت‌های زیادی جذب می‌کند.'},
 {id:'x584',icon:'immunity',name:'پاک‌دل',gene:'immunity',desc:'دل پاکش استرس را کم می‌کند و بدنش سالم می‌ماند.'},
 {id:'x585',icon:'cooperation',name:'یار',gene:'cooperation',desc:'همیشه کنار یارش است و با هم شکار می‌کنند.'},
 {id:'x586',icon:'fertility',name:'نامزد',gene:'fertility',desc:'برای جفت‌یابی انرژی بیشتری می‌گذارد.'},
 {id:'x587',icon:'cooperation',name:'آشتی‌گر',gene:'cooperation',desc:'دعواها را حل می‌کند و گروه را یکپارچه نگه می‌دارد.'},
 {id:'x588',icon:'lifespan',name:'عاطفی',gene:'lifespan',desc:'پیوند عاطفی‌اش استرس را کم می‌کند و عمرش را زیاد می‌کند.'},
 {id:'x589',icon:'fertility',name:'رمانتیک',gene:'fertility',desc:'رفتار رمانتیکش جفتش را جذب می‌کند.'},
 {id:'x590',icon:'cooperation',name:'همدل',gene:'cooperation',desc:'احساس دیگران را می‌فهمد و گروه هماهنگ‌تر می‌شود.'},
 {id:'x591',icon:'efficiency',name:'ثروتمند',gene:'efficiency',desc:'ذخیره غذایش زیاد است و کمتر گرسنه می‌ماند.'},
 {id:'x592',icon:'metabolism',name:'ذخیره‌ساز',gene:'metabolism',desc:'غذا را ذخیره می‌کند و در قحطی زنده می‌ماند.'},
 {id:'x593',icon:'vision',name:'گنج‌یاب',gene:'vision',desc:'چشمش گنج‌های غذا را از دور می‌بیند.'},
 {id:'x594',icon:'speed',name:'سکه‌جمع‌کن',gene:'speed',desc:'سریع غذا جمع می‌کند و ذخیره‌اش زیاد می‌شود.'},
 {id:'x595',icon:'efficiency',name:'بسته‌بند',gene:'efficiency',desc:'غذا را مرتب ذخیره می‌کند و هدر نمی‌دهد.'},
 {id:'x596',icon:'lifespan',name:'گنجینه‌دار',gene:'lifespan',desc:'با ذخیره کافی، در سختی‌ها بیشتر عمر می‌کند.'},
 {id:'x597',icon:'metabolism',name:'خرج‌کن',gene:'metabolism',desc:'انرژی‌اش را حساب‌شده خرج می‌کند و دیر گرسنه می‌شود.'},
 {id:'x598',icon:'mask',name:'کلیدبان',gene:'mask',desc:'مخفی‌گاه ذخیره‌اش را از دشمن پنهان می‌کند.'},
 {id:'x599',icon:'coat',name:'جواهر',gene:'coat',desc:'پوشش درخشانش دشمن را گیج می‌کند.'},
 {id:'x600',icon:'aggression',name:'برنده',gene:'aggression',desc:'در رقابت بر سر غذا همیشه پیروز می‌شود.'},
 {id:'x601',icon:'speed',name:'دورپیما',gene:'speed',desc:'در فصل مهاجرت مسافت‌های بسیار طولانی را بدون توقف طی می‌کند.'},
 {id:'x602',icon:'vision',name:'جهت‌یاب ستاره‌ای',gene:'vision',desc:'در شب با ستاره‌ها مسیر مهاجرت را پیدا می‌کند.'},
 {id:'x603',icon:'cooperation',name:'راهنمای کاروان',gene:'cooperation',desc:'گروه را در مسیرهای طولانی مهاجرت هدایت می‌کند.'},
 {id:'x604',icon:'metabolism',name:'ذخیره‌ساز سفر',gene:'metabolism',desc:'پیش از سفر طولانی چربی زیادی ذخیره می‌کند.'},
 {id:'x605',icon:'speed',name:'بال‌های مهاجرت',gene:'speed',desc:'با بال‌های قوی‌اش در مهاجرت از دیگران جلو می‌افتد.'},
 {id:'x606',icon:'lifespan',name:'کوچ‌نشین فصلی',gene:'lifespan',desc:'با تغییر فصل‌ها به سرزمین‌های تازه کوچ می‌کند.'},
 {id:'x607',icon:'efficiency',name:'مسافر تنهای شب',gene:'efficiency',desc:'در تاریکی شب به‌تنهایی مسافت‌های طولانی را طی می‌کند.'},
 {id:'x608',icon:'metabolism',name:'خستگی‌ناپذیر جاده',gene:'metabolism',desc:'در سفرهای طولانی دیر خسته می‌شود.'},
 {id:'x609',icon:'vision',name:'بازگشت به خانه',gene:'vision',desc:'همیشه راه بازگشت به زادگاهش را پیدا می‌کند.'},
 {id:'x610',icon:'speed',name:'عبورکننده از کوه',gene:'speed',desc:'از گذرگاه‌های کوهستانی دشوار عبور می‌کند.'},
 {id:'x611',icon:'cooperation',name:'سفیر گروه',gene:'cooperation',desc:'پیام گروه را به گروه‌های دیگر می‌رساند.'},
 {id:'x612',icon:'speed',name:'پای پیاده‌رو',gene:'speed',desc:'روی زمین با قدم‌های بلند و سریع راه می‌رود.'},
 {id:'x613',icon:'efficiency',name:'نقشه‌خوان ذاتی',gene:'efficiency',desc:'مسیرهای کوتاه را به‌صورت غریزی انتخاب می‌کند.'},
 {id:'x614',icon:'speed',name:'کوچنده دریا',gene:'speed',desc:'در فصل مناسب به سوی دریاهای دور مهاجرت می‌کند.'},
 {id:'x615',icon:'speed',name:'همراه باد',gene:'speed',desc:'با جریان باد مسافت زیادی را بدون انرژی طی می‌کند.'},
 {id:'x616',icon:'speed',name:'شناگر سریع',gene:'speed',desc:'در آب با سرعت بالایی شنا می‌کند.'},
 {id:'x617',icon:'metabolism',name:'غواص عمیق',gene:'metabolism',desc:'به عمق آب شیرجه می‌زند و مدت طولانی زیر آب می‌ماند.'},
 {id:'x618',icon:'efficiency',name:'ماهی‌خور ماهر',gene:'efficiency',desc:'ماهی‌ها را در آب با مهارت شکار می‌کند.'},
 {id:'x619',icon:'metabolism',name:'شناور آرام',gene:'metabolism',desc:'روی سطح آب بی‌حرکت شناور می‌ماند و انرژی ذخیره می‌کند.'},
 {id:'x620',icon:'coat',name:'پوست ضدآب',gene:'coat',desc:'پوستش آب را دفع می‌کند و در باران خیس نمی‌شود.'},
 {id:'x621',icon:'metabolism',name:'نفس‌گیر زیر آب',gene:'metabolism',desc:'می‌تواند نفسش را زیر آب مدت طولانی نگه دارد.'},
 {id:'x622',icon:'speed',name:'سوار بر موج',gene:'speed',desc:'روی موج‌ها سوار می‌شود و سریع حرکت می‌کند.'},
 {id:'x623',icon:'speed',name:'رودگذر',gene:'speed',desc:'از رودخانه‌های خروشان با قدرت عبور می‌کند.'},
 {id:'x624',icon:'metabolism',name:'آب‌نوش کم‌مصرف',gene:'metabolism',desc:'با آب بسیار کمی زنده می‌ماند.'},
 {id:'x625',icon:'vision',name:'صیاد ساحلی',gene:'vision',desc:'از ساحل طعمه‌های درون آب را به‌خوبی می‌بیند.'},
 {id:'x626',icon:'cooperation',name:'شنای دسته‌جمعی',gene:'cooperation',desc:'با گروه به‌صورت هماهنگ شنا می‌کند.'},
 {id:'x627',icon:'coat',name:'خزنده‌ی باتلاق',gene:'coat',desc:'در گل و باتلاق به‌راحتی حرکت می‌کند و استتار می‌شود.'},
 {id:'x628',icon:'coldRes',name:'یخ‌شکن',gene:'coldRes',desc:'روی یخ‌های نازک راه می‌رود و در آب سرد شنا می‌کند.'},
 {id:'x629',icon:'efficiency',name:'جزر و مدخوان',gene:'efficiency',desc:'زمان جزر و مد را حس می‌کند و از آن استفاده می‌کند.'},
 {id:'x630',icon:'lifespan',name:'دریانورد',gene:'lifespan',desc:'زندگی‌اش را بیشتر در آب می‌گذراند تا خشکی.'},
 {id:'x631',icon:'metabolism',name:'خاک‌خور',gene:'metabolism',desc:'از مواد معدنی خاک تغذیه می‌کند.'},
 {id:'x632',icon:'size',name:'کندوکار زمین',gene:'size',desc:'با پنجه‌های قوی زمین را می‌کند و لانه می‌سازد.'},
 {id:'x633',icon:'lifespan',name:'ریشه‌دار',gene:'lifespan',desc:'در یک مکان ثابت سال‌ها زندگی می‌کند.'},
 {id:'x634',icon:'speed',name:'دیواره‌نورد',gene:'speed',desc:'از صخره‌ها و سنگ‌های بلند بالا می‌رود.'},
 {id:'x635',icon:'coat',name:'گل‌ولای‌دوست',gene:'coat',desc:'در گل و لای زندگی می‌کند و پوستش از آن محافظت می‌شود.'},
 {id:'x636',icon:'aggression',name:'نگهبان لانه',gene:'aggression',desc:'از لانه و قلمروش با شدت دفاع می‌کند.'},
 {id:'x637',icon:'vision',name:'زیرزمینی',gene:'vision',desc:'در تاریکی زیر زمین به‌خوبی می‌بیند.'},
 {id:'x638',icon:'size',name:'تپه‌ساز',gene:'size',desc:'با خاک تپه‌های بلند برای لانه می‌سازد.'},
 {id:'x639',icon:'vision',name:'زمین‌لرزه‌حس',gene:'vision',desc:'لرزش‌های زمین را پیش از دیگران حس می‌کند.'},
 {id:'x640',icon:'fertility',name:'دانه‌پاش',gene:'fertility',desc:'دانه‌های گیاهان را در زمین می‌کارد و پخش می‌کند.'},
 {id:'x641',icon:'size',name:'گودال‌کن',gene:'size',desc:'گودال‌های عمیق برای پنهان شدن می‌کند.'},
 {id:'x642',icon:'coat',name:'خاکستری استتار',gene:'coat',desc:'رنگ خاکستری‌اش او را در خاک استتار می‌کند.'},
 {id:'x643',icon:'coldRes',name:'صخره‌نشین',gene:'coldRes',desc:'روی صخره‌های سرد و خشک زندگی می‌کند.'},
 {id:'x644',icon:'efficiency',name:'معدن‌یاب',gene:'efficiency',desc:'مواد معدنی مفید را در خاک پیدا می‌کند.'},
 {id:'x645',icon:'speed',name:'پروازگر بلند',gene:'speed',desc:'در آسمان بالا پرواز می‌کند و مسافت زیادی را می‌پیماید.'},
 {id:'x646',icon:'size',name:'بال‌زن قوی',gene:'size',desc:'با بال‌های قدرتمند در برابر باد پرواز می‌کند.'},
 {id:'x647',icon:'speed',name:'شیرجه‌زن آسمانی',gene:'speed',desc:'از آسمان با سرعت به سمت طعمه شیرجه می‌زند.'},
 {id:'x648',icon:'lifespan',name:'ساکن ابرها',gene:'lifespan',desc:'بیشتر عمرش را در ارتفاعات بالا می‌گذراند.'},
 {id:'x649',icon:'vision',name:'بادخوان',gene:'vision',desc:'جهت باد را حس می‌کند و مسیر پروازش را تنظیم می‌کند.'},
 {id:'x650',icon:'vision',name:'چشم آسمانی',gene:'vision',desc:'از ارتفاع بالا زمین را با جزئیات می‌بیند.'},
 {id:'x651',icon:'coat',name:'بال‌های رنگی',gene:'coat',desc:'بال‌های رنگارش او را در آسمان چشمگیر می‌کند.'},
 {id:'x652',icon:'cooperation',name:'پرواز گروهی',gene:'cooperation',desc:'با گروه به شکل منظم پرواز می‌کند.'},
 {id:'x653',icon:'fertility',name:'آشیانه‌ساز بلند',gene:'fertility',desc:'آشیانه‌اش را در بلندترین درخت‌ها می‌سازد.'},
 {id:'x654',icon:'speed',name:'صاعقه‌گریز',gene:'speed',desc:'از طوفان و صاعقه به‌سرعت فرار می‌کند.'},
 {id:'x655',icon:'metabolism',name:'بال‌بال‌زن آرام',gene:'metabolism',desc:'با کمترین انرژی در آسمان می‌ماند.'},
 {id:'x656',icon:'mask',name:'سایه‌نشین ابر',gene:'mask',desc:'در سایه‌ی ابرها پنهان می‌شود تا دیده نشود.'},
 {id:'x657',icon:'coldRes',name:'فرازنشین',gene:'coldRes',desc:'در هوای سرد ارتفاعات بالا راحت زندگی می‌کند.'},
 {id:'x658',icon:'efficiency',name:'گشت‌زن آسمان',gene:'efficiency',desc:'در آسمان به‌دنبال غذا گشت می‌زند و کم انرژی مصرف می‌کند.'},
 {id:'x659',icon:'vision',name:'شب‌بین',gene:'vision',desc:'در تاریکی شب به‌خوبی می‌بیند.'},
 {id:'x660',icon:'vision',name:'چشم درخشان',gene:'vision',desc:'چشم‌هایش در تاریکی می‌درخشد و راه را نشان می‌دهد.'},
 {id:'x661',icon:'mask',name:'سایه‌دوست',gene:'mask',desc:'در سایه‌ها پنهان می‌شود و دیده نمی‌شود.'},
 {id:'x662',icon:'coat',name:'نورگریز',gene:'coat',desc:'از نور شدید آفتاب فرار می‌کند و در سایه می‌ماند.'},
 {id:'x663',icon:'lifespan',name:'ماه‌دوست',gene:'lifespan',desc:'در شب‌های مهتابی فعال است و روزها می‌خوابد.'},
 {id:'x664',icon:'vision',name:'ستاره‌خوان',gene:'vision',desc:'با نور ستاره‌ها مسیرش را در شب پیدا می‌کند.'},
 {id:'x665',icon:'metabolism',name:'تاریکی‌پسند',gene:'metabolism',desc:'در تاریکی با کمترین انرژی شکار می‌کند.'},
 {id:'x666',icon:'mask',name:'برق‌زن',gene:'mask',desc:'در تاریکی نور می‌تاباند تا طعمه را جذب کند.'},
 {id:'x667',icon:'efficiency',name:'غروب‌نشین',gene:'efficiency',desc:'در غروب خورشید فعال می‌شود و شکار می‌کند.'},
 {id:'x668',icon:'vision',name:'سپیده‌خوان',gene:'vision',desc:'با اولین نور سپیده‌دم از خواب بیدار می‌شود.'},
 {id:'x669',icon:'coat',name:'سیاه‌پوش',gene:'coat',desc:'پوشش تیره‌اش او را در شب استتار می‌کند.'},
 {id:'x670',icon:'coat',name:'نوربازتاب',gene:'coat',desc:'پوست براقش نور را بازتاب می‌دهد و شکارچیان را گیج می‌کند.'},
 {id:'x671',icon:'lifespan',name:'شب‌گرد تنها',gene:'lifespan',desc:'شب‌ها به‌تنهایی می‌گردد و روزها پنهان می‌شود.'},
 {id:'x672',icon:'mask',name:'فانوس‌دار',gene:'mask',desc:'نور کوچکی دارد که در تاریکی راه را نشان می‌دهد.'},
 {id:'x673',icon:'lifespan',name:'جوان همیشگی',gene:'lifespan',desc:'با گذر سال‌ها جوان و چابک می‌ماند.'},
 {id:'x674',icon:'lifespan',name:'پیر دانا',gene:'lifespan',desc:'با افزایش سن تجربه‌اش بیشتر می‌شود و بهتر زنده می‌ماند.'},
 {id:'x675',icon:'lifespan',name:'دیرپیر',gene:'lifespan',desc:'دیرتر از دیگران پیر می‌شود و دیرتر ضعیف می‌شود.'},
 {id:'x676',icon:'fertility',name:'جوان‌پرور',gene:'fertility',desc:'از جوان‌های گروه مراقبت می‌کند تا بزرگ شوند.'},
 {id:'x677',icon:'coat',name:'موی سپید',gene:'coat',desc:'با افزایش سن موهایش سفید می‌شود و احترام گروه را دارد.'},
 {id:'x678',icon:'lifespan',name:'کودکی طولانی',gene:'lifespan',desc:'دوران کودکی‌اش طولانی است و دیر بالغ می‌شود.'},
 {id:'x679',icon:'fertility',name:'بلوغ زودرس',gene:'fertility',desc:'زودتر از دیگران بالغ می‌شود و زودتر بچه‌دار می‌شود.'},
 {id:'x680',icon:'speed',name:'نیروی جوانی',gene:'speed',desc:'در جوانی سریع‌تر و قوی‌تر از همیشه است.'},
 {id:'x681',icon:'immunity',name:'پیر مقاوم',gene:'immunity',desc:'با وجود سن بالا در برابر بیماری مقاوم است.'},
 {id:'x682',icon:'lifespan',name:'بازجوانی',gene:'lifespan',desc:'در هر فصل پوست و بدنش تازه می‌شود.'},
 {id:'x683',icon:'cooperation',name:'خردمند پیر',gene:'cooperation',desc:'پیرهای گروه به جوان‌ها راه بقا را یاد می‌دهند.'},
 {id:'x684',icon:'size',name:'نوزاد قوی',gene:'size',desc:'از بدو تولد بزرگ‌تر و قوی‌تر از دیگران است.'},
 {id:'x685',icon:'lifespan',name:'جوانی ابدی',gene:'lifespan',desc:'نشانه‌های پیری در او دیر ظاهر می‌شود.'},
 {id:'x686',icon:'efficiency',name:'پیر سفرکرده',gene:'efficiency',desc:'با تجربه‌ی سال‌ها سفر مسیرهای امن را می‌شناسد.'},
 {id:'x687',icon:'immunity',name:'بیماری‌گریز',gene:'immunity',desc:'به‌ندرت بیمار می‌شود.'},
 {id:'x688',icon:'immunity',name:'شفابخش',gene:'immunity',desc:'زخم‌هایش سریع‌تر از دیگران خوب می‌شود.'},
 {id:'x689',icon:'immunity',name:'گیاه‌درمان',gene:'immunity',desc:'گیاهان دارویی را می‌شناسد و با آن‌ها خود را درمان می‌کند.'},
 {id:'x690',icon:'immunity',name:'ضدسم',gene:'immunity',desc:'در برابر سم‌ها مقاوم است.'},
 {id:'x691',icon:'heatRes',name:'تب‌بر',gene:'heatRes',desc:'در برابر تب و گرمای بدن مقاوم است.'},
 {id:'x692',icon:'coldRes',name:'سرماخورده‌ناپذیر',gene:'coldRes',desc:'در سرما بیمار نمی‌شود.'},
 {id:'x693',icon:'cooperation',name:'پاک‌کننده زخم',gene:'cooperation',desc:'زخم‌های هم‌گروهی‌هایش را تمیز می‌کند.'},
 {id:'x694',icon:'metabolism',name:'میکروب‌خور',gene:'metabolism',desc:'میکروب‌ها را در بدنش از بین می‌برد.'},
 {id:'x695',icon:'immunity',name:'واکسینه طبیعی',gene:'immunity',desc:'یک بار بیمار می‌شود و بعد برای همیشه مصون می‌ماند.'},
 {id:'x696',icon:'cooperation',name:'درمانگر گروه',gene:'cooperation',desc:'به اعضای بیمار گروه کمک می‌کند تا خوب شوند.'},
 {id:'x697',icon:'efficiency',name:'زخم‌بند',gene:'efficiency',desc:'زخم‌هایش را با برگ و خاک می‌بندد و سریع خوب می‌شود.'},
 {id:'x698',icon:'heatRes',name:'تب‌دار فعال',gene:'heatRes',desc:'حتی با تب هم فعال می‌ماند و شکار می‌کند.'},
 {id:'x699',icon:'lifespan',name:'نجات‌یافته',gene:'lifespan',desc:'از بیماری‌های سخت جان سالم به در می‌برد.'},
 {id:'x700',icon:'immunity',name:'پزشک طبیعت',gene:'immunity',desc:'با خوردن گیاهان خاص بیماری‌اش را درمان می‌کند.'},
 {id:'x701',icon:'metabolism',name:'کوچ‌نشین',gene:'metabolism',desc:'با تغییر فصل کوچ می‌کند و همیشه نزدیک غذا می‌ماند.'},
 {id:'x702',icon:'vision',name:'راه‌یاب کهن',gene:'vision',desc:'مسیرهای قدیمی مهاجرت را به خاطر می‌سپارد و هرگز گم نمی‌شود.'},
 {id:'x703',icon:'speed',name:'بال‌های مهاجر',gene:'speed',desc:'در سفرهای طولانی خسته نمی‌شود و زودتر از بقیه می‌رسد.'},
 {id:'x704',icon:'vision',name:'قطب‌نمای درونی',gene:'vision',desc:'جهت شمال را حس می‌کند و در سفر راه را گم نمی‌کند.'},
 {id:'x705',icon:'lifespan',name:'مسافر خستگی‌ناپذیر',gene:'lifespan',desc:'سفرهای طولانی به بدنش آسیب نمی‌زند و عمرش کم نمی‌شود.'},
 {id:'x706',icon:'cooperation',name:'گروه کوچ',gene:'cooperation',desc:'در کوچ گروهی از هم محافظت می‌کنند و کمتر طعمه شکارچی می‌شوند.'},
 {id:'x707',icon:'metabolism',name:'ذخیره سفر',gene:'metabolism',desc:'پیش از سفر چربی ذخیره می‌کند و در راه دیرتر گرسنه می‌شود.'},
 {id:'x708',icon:'efficiency',name:'مسیرشناس',gene:'efficiency',desc:'کوتاه‌ترین راه به غذا را پیدا می‌کند و انرژی کمتری مصرف می‌کند.'},
 {id:'x709',icon:'mask',name:'مهاجر شبانه',gene:'mask',desc:'شب‌ها مهاجرت می‌کند تا از چشم شکارچیان پنهان بماند.'},
 {id:'x710',icon:'vision',name:'پیشاهنگ کوچ',gene:'vision',desc:'جلوتر از گروه حرکت می‌کند و راه امن را نشان می‌دهد.'},
 {id:'x711',icon:'immunity',name:'بازگشت به لانه',gene:'immunity',desc:'پس از سفر طولانی سریع‌تر بهبود می‌یابد و بیمار نمی‌شود.'},
 {id:'x712',icon:'cooperation',name:'رهبر کوچ',gene:'cooperation',desc:'گله را در مهاجرت رهبری می‌کند و هیچ‌کس جا نمی‌ماند.'},
 {id:'x713',icon:'speed',name:'پرواز مهاجرتی',gene:'speed',desc:'در مهاجرت بالاتر و سریع‌تر از بقیه پرواز می‌کند.'},
 {id:'x714',icon:'efficiency',name:'استراحتگاه‌یاب',gene:'efficiency',desc:'بهترین جای استراحت در مسیر را سریع پیدا می‌کند و انرژی ذخیره می‌کند.'},
 {id:'x715',icon:'lifespan',name:'کوچ دوردست',gene:'lifespan',desc:'مهاجرت‌های بسیار دور را تاب می‌آورد و زنده می‌ماند.'},
 {id:'x716',icon:'speed',name:'شناگر تندرو',gene:'speed',desc:'در آب سریع‌تر از خشکی حرکت می‌کند و زودتر به غذا می‌رسد.'},
 {id:'x717',icon:'lifespan',name:'غواص ژرف',gene:'lifespan',desc:'نفسش را مدت طولانی نگه می‌دارد و در آب عمیق شکار می‌کند.'},
 {id:'x718',icon:'metabolism',name:'آبشش قوی',gene:'metabolism',desc:'از آب اکسیژن بیشتری می‌گیرد و هنگام شنا کمتر خسته می‌شود.'},
 {id:'x719',icon:'coat',name:'پوست آب‌گریز',gene:'coat',desc:'آب به بدنش نمی‌چسبد و در باران و آب سرد گرم می‌ماند.'},
 {id:'x720',icon:'efficiency',name:'صیاد ماهی',gene:'efficiency',desc:'ماهی‌های کوچک را ماهرانه شکار می‌کند و کمتر انرژی هدر می‌دهد.'},
 {id:'x721',icon:'cooperation',name:'شنای گروهی',gene:'cooperation',desc:'دسته‌جمعی شنا می‌کنند و ماهی‌ها را به دام می‌اندازند.'},
 {id:'x722',icon:'coldRes',name:'شنای آب سرد',gene:'coldRes',desc:'در آب سرد هم گرم می‌ماند و به‌راحتی شنا می‌کند.'},
 {id:'x723',icon:'vision',name:'بینایی زیرآب',gene:'vision',desc:'زیر آب هم غذا را واضح می‌بیند و شکارش را گم نمی‌کند.'},
 {id:'x724',icon:'mask',name:'شناور بی‌صدا',gene:'mask',desc:'روی آب بی‌صدا شناور می‌شود و شکارش را غافلگیر می‌کند.'},
 {id:'x725',icon:'speed',name:'دم شناگر',gene:'speed',desc:'با دم قوی‌اش در آب شتاب می‌گیرد و از شکارچی فرار می‌کند.'},
 {id:'x726',icon:'lifespan',name:'نفس غواص',gene:'lifespan',desc:'هنگام غواصی دیرتر به سطح نیاز دارد و بیشتر شکار می‌کند.'},
 {id:'x727',icon:'aggression',name:'شکارچی آب‌های کم‌عمق',gene:'aggression',desc:'در آب کم‌عمق به شکار حمله می‌کند و آن را می‌گیرد.'},
 {id:'x728',icon:'metabolism',name:'خواب روی آب',gene:'metabolism',desc:'روی آب می‌خوابد و انرژی بدنش حفظ می‌شود.'},
 {id:'x729',icon:'efficiency',name:'رودخانه‌نورد',gene:'efficiency',desc:'برخلاف جریان رودخانه هم به‌راحتی شنا می‌کند و جلو می‌رود.'},
 {id:'x730',icon:'fertility',name:'بچه‌های آب‌دوست',gene:'fertility',desc:'بچه‌هایش زود شنا یاد می‌گیرند و بیشتر زنده می‌مانند.'},
 {id:'x731',icon:'speed',name:'پرواز بلند',gene:'speed',desc:'بالاتر از همه پرواز می‌کند و طعمه را زودتر می‌بیند.'},
 {id:'x732',icon:'size',name:'بال‌های بزرگ',gene:'size',desc:'با بال‌های پهنش مدت طولانی در آسمان می‌ماند و خسته نمی‌شود.'},
 {id:'x733',icon:'vision',name:'شاهین آسمان',gene:'vision',desc:'از ارتفاع زیاد کوچک‌ترین حرکت غذا را روی زمین می‌بیند.'},
 {id:'x734',icon:'mask',name:'پرواز بی‌صدا',gene:'mask',desc:'بی‌صدا پرواز می‌کند و شکارش متوجه نزدیک شدنش نمی‌شود.'},
 {id:'x735',icon:'efficiency',name:'اوج‌گیرنده',gene:'efficiency',desc:'با جریان هوای گرم بالا می‌رود و انرژی پرواز ذخیره می‌کند.'},
 {id:'x736',icon:'cooperation',name:'لانه‌ساز بلند',gene:'cooperation',desc:'لانه‌اش را در بلندترین جای امن می‌سازد و بچه‌ها در امان می‌مانند.'},
 {id:'x737',icon:'lifespan',name:'پرواز در طوفان',gene:'lifespan',desc:'در باد و طوفان هم پرواز می‌کند و سقوط نمی‌کند.'},
 {id:'x738',icon:'aggression',name:'شیرجه هوایی',gene:'aggression',desc:'از آسمان شیرجه می‌زند و شکار را پیش از فرار می‌گیرد.'},
 {id:'x739',icon:'metabolism',name:'پرواز دوربرد',gene:'metabolism',desc:'در پروازهای طولانی سوخت بدنش دیر تمام می‌شود و گرسنه نمی‌ماند.'},
 {id:'x740',icon:'speed',name:'چرخ‌زننده آسمان',gene:'speed',desc:'در هوا چرخ می‌زند و شکار را گیج می‌کند تا بگیرتش.'},
 {id:'x741',icon:'fertility',name:'آوازخوان آسمان',gene:'fertility',desc:'با آوازش جفت بیشتری جذب می‌کند و بچه‌های بیشتری دارد.'},
 {id:'x742',icon:'vision',name:'نگاه از بالا',gene:'vision',desc:'از بالا کل زمین را زیر نظر می‌گیرد و غذا را سریع پیدا می‌کند.'},
 {id:'x743',icon:'size',name:'بال‌زدن قوی',gene:'size',desc:'با هر بال‌زدن مسافت بیشتری طی می‌کند و زودتر می‌رسد.'},
 {id:'x744',icon:'cooperation',name:'پرواز هماهنگ',gene:'cooperation',desc:'دسته‌جمعی پرواز می‌کنند و در برابر باد مقاوم‌ترند.'},
 {id:'x745',icon:'immunity',name:'فرود نرم',gene:'immunity',desc:'فرودهای سخت به بدنش آسیب نمی‌زند و زود خوب می‌شود.'},
 {id:'x746',icon:'vision',name:'دید شبانه',gene:'vision',desc:'در تاریکی شب هم غذا را می‌بیند و گرسنه نمی‌ماند.'},
 {id:'x747',icon:'mask',name:'گردنده شب',gene:'mask',desc:'شب‌ها فعال است و در تاریکی از چشم شکارچیان پنهان می‌شود.'},
 {id:'x748',icon:'coat',name:'درخشان در تاریکی',gene:'coat',desc:'بدنش در تاریکی می‌درخشد و جفت را از دور جذب می‌کند.'},
 {id:'x749',icon:'vision',name:'چشم شب‌بین',gene:'vision',desc:'چشم‌هایش نور کم را جمع می‌کند و در تاریکی می‌بیند.'},
 {id:'x750',icon:'metabolism',name:'خواب روزانه',gene:'metabolism',desc:'روز می‌خوابد و شب با انرژی کامل بیدار می‌شود.'},
 {id:'x751',icon:'aggression',name:'شکارچی تاریکی',gene:'aggression',desc:'در تاریکی به شکار حمله می‌کند و آن را غافلگیر می‌کند.'},
 {id:'x752',icon:'mask',name:'پنهان در سایه',gene:'mask',desc:'در سایه پنهان می‌شود و شکارچی او را نمی‌بیند.'},
 {id:'x753',icon:'efficiency',name:'ستاره‌یاب',gene:'efficiency',desc:'با ستاره‌ها مسیرش را پیدا می‌کند و در شب گم نمی‌شود.'},
 {id:'x754',icon:'heatRes',name:'مقاوم به نور تند',gene:'heatRes',desc:'در نور تند آفتاب پوستش آسیب نمی‌بیند و سرحال می‌ماند.'},
 {id:'x755',icon:'lifespan',name:'بیدار شب',gene:'lifespan',desc:'شب‌بیداری به بدنش آسیب نمی‌زند و دیرتر پیر می‌شود.'},
 {id:'x756',icon:'cooperation',name:'ماه‌نگر',gene:'cooperation',desc:'با نور ماه هماهنگ می‌شود و گروه را شب‌ها هدایت می‌کند.'},
 {id:'x757',icon:'coat',name:'شنل تاریکی',gene:'coat',desc:'پوشش تیره‌اش او را در شب نامرئی می‌کند.'},
 {id:'x758',icon:'fertility',name:'غروب‌دوست',gene:'fertility',desc:'غروب‌ها جفت‌گیری می‌کند و بچه‌های بیشتری دارد.'},
 {id:'x759',icon:'speed',name:'بیدار سحر',gene:'speed',desc:'پیش از طلوع آفتاب بیدار می‌شود و زودتر از همه به غذا می‌رسد.'},
 {id:'x760',icon:'metabolism',name:'نورخور',gene:'metabolism',desc:'نور خورشید را به انرژی تبدیل می‌کند و کمتر گرسنه می‌شود.'},
 {id:'x761',icon:'immunity',name:'شفادهنده',gene:'immunity',desc:'زخم‌های خودش و دیگران را سریع‌تر خوب می‌کند.'},
 {id:'x762',icon:'immunity',name:'مقاوم به بیماری',gene:'immunity',desc:'بیماری‌های شایع او را نمی‌گیرند و سالم می‌ماند.'},
 {id:'x763',icon:'immunity',name:'داروگیاه‌شناس',gene:'immunity',desc:'گیاهان دارویی را می‌شناسد و با آن‌ها بیماری‌اش را درمان می‌کند.'},
 {id:'x764',icon:'lifespan',name:'بهبود سریع',gene:'lifespan',desc:'بعد از بیماری سریع برمی‌گردد و عمرش کم نمی‌شود.'},
 {id:'x765',icon:'cooperation',name:'مرهم‌گذار',gene:'cooperation',desc:'زخم‌های هم‌گروهی‌هایش را تمیز می‌کند تا عفونت نکنند.'},
 {id:'x766',icon:'metabolism',name:'سم‌زدا',gene:'metabolism',desc:'سم غذاهای فاسد را از بدنش دفع می‌کند و مسموم نمی‌شود.'},
 {id:'x767',icon:'heatRes',name:'خنک‌کننده بدن',gene:'heatRes',desc:'تب بدنش زود پایین می‌آید و در گرما هم سرحال می‌ماند.'},
 {id:'x768',icon:'immunity',name:'ایمنی مادرزادی',gene:'immunity',desc:'از بدو تولد در برابر بیماری‌ها مقاوم است.'},
 {id:'x769',icon:'cooperation',name:'قرنطینه‌گر',gene:'cooperation',desc:'بیمارها را جدا می‌کند تا بیماری به بقیه گروه سرایت نکند.'},
 {id:'x770',icon:'metabolism',name:'خواب درمانی',gene:'metabolism',desc:'با خواب عمیق بیماری‌اش را شکست می‌دهد و زود خوب می‌شود.'},
 {id:'x771',icon:'immunity',name:'پادتن‌ساز',gene:'immunity',desc:'بدنش سریع پادتن می‌سازد و بیماری را شکست می‌دهد.'},
 {id:'x772',icon:'fertility',name:'مراقب بیمار',gene:'fertility',desc:'از بچه‌های بیمار مراقبت می‌کند و آن‌ها بیشتر زنده می‌مانند.'},
 {id:'x773',icon:'coat',name:'ضدعفونی‌کننده',gene:'coat',desc:'پوستش میکروب‌ها را دفع می‌کند و زخمش عفونت نمی‌کند.'},
 {id:'x774',icon:'aggression',name:'بهبود پس از جنگ',gene:'aggression',desc:'بعد از دعوا سریع خوب می‌شود و دوباره می‌تواند بجنگد.'},
 {id:'x775',icon:'cooperation',name:'پزشک گروه',gene:'cooperation',desc:'بیمارهای گروه را درمان می‌کند و گروه سالم می‌ماند.'},
 {id:'x776',icon:'efficiency',name:'سنگ‌بر',gene:'efficiency',desc:'سنگ را به ابزار تیز تبدیل می‌کند و راحت‌تر غذا را می‌برد.'},
 {id:'x777',icon:'speed',name:'چوب‌تراش',gene:'speed',desc:'با چوب ابزار می‌سازد و سریع‌تر شکار می‌کند.'},
 {id:'x778',icon:'cooperation',name:'ابزارساز ماهر',gene:'cooperation',desc:'به گروه ابزار می‌دهد و همه بهتر شکار می‌کنند.'},
 {id:'x779',icon:'efficiency',name:'کندن با ابزار',gene:'efficiency',desc:'با ابزار زمین را می‌کند و به ریشه‌های خوراکی می‌رسد.'},
 {id:'x780',icon:'aggression',name:'شکستن با سنگ',gene:'aggression',desc:'با سنگ پوست سخت غذاها را می‌شکند و آن‌ها را می‌خورد.'},
 {id:'x781',icon:'aggression',name:'نیزه‌ساز',gene:'aggression',desc:'نیزه می‌سازد و از دور شکار می‌کند.'},
 {id:'x782',icon:'efficiency',name:'دام‌گذار',gene:'efficiency',desc:'تله می‌سازد و بدون دویدن شکار به دام می‌افتد.'},
 {id:'x783',icon:'metabolism',name:'ابزار حمل غذا',gene:'metabolism',desc:'با ابزار غذای بیشتری حمل می‌کند و کمتر گرسنه می‌ماند.'},
 {id:'x784',icon:'fertility',name:'معلم ابزارسازی',gene:'fertility',desc:'ابزارسازی را به بچه‌ها یاد می‌دهد و آن‌ها بیشتر زنده می‌مانند.'},
 {id:'x785',icon:'vision',name:'سنگ‌یاب',gene:'vision',desc:'بهترین سنگ‌های ابزارسازی را از دور پیدا می‌کند.'},
 {id:'x786',icon:'lifespan',name:'تیزکننده ابزار',gene:'lifespan',desc:'ابزارش همیشه تیز است و در کار طولانی دوام می‌آورد.'},
 {id:'x787',icon:'cooperation',name:'سبدباف',gene:'cooperation',desc:'سبد می‌بافد و گروه غذای بیشتری جمع می‌کند.'},
 {id:'x788',icon:'speed',name:'طناب‌ساز',gene:'speed',desc:'طناب می‌سازد و در بالا رفتن سریع‌تر می‌شود.'},
 {id:'x789',icon:'size',name:'ابزار دفاعی',gene:'size',desc:'با ابزار بزرگ‌تر به نظر می‌رسد و دشمن از او فرار می‌کند.'},
 {id:'x790',icon:'mask',name:'مخترع کوچک',gene:'mask',desc:'ابزارهای مخفی می‌سازد و شکارش را غافلگیر می‌کند.'},
 {id:'x791',icon:'aggression',name:'نگهبان قلمرو',gene:'aggression',desc:'از قلمروش با شدت دفاع می‌کند و غریبه‌ها را می‌راند.'},
 {id:'x792',icon:'vision',name:'مرزنشان',gene:'vision',desc:'مرز قلمروش را می‌شناسد و از آن دور نمی‌شود.'},
 {id:'x793',icon:'fertility',name:'لانه‌ساز چیره‌دست',gene:'fertility',desc:'لانه‌ای امن می‌سازد و بچه‌هایش بیشتر زنده می‌مانند.'},
 {id:'x794',icon:'metabolism',name:'خانه‌دار',gene:'metabolism',desc:'در خانه‌اش غذا ذخیره می‌کند و در زمستان گرسنه نمی‌ماند.'},
 {id:'x795',icon:'cooperation',name:'مدافع خانه',gene:'cooperation',desc:'با گروه از خانه دفاع می‌کنند و مهاجم شکست می‌خورد.'},
 {id:'x796',icon:'mask',name:'علامت‌گذار قلمرو',gene:'mask',desc:'با بویش قلمرو را علامت می‌زند و دیگران از آن دور می‌شوند.'},
 {id:'x797',icon:'efficiency',name:'خانه‌یاب',gene:'efficiency',desc:'بهترین جای لانه را سریع پیدا می‌کند و امن می‌ماند.'},
 {id:'x798',icon:'size',name:'قلمرو بزرگ',gene:'size',desc:'قلمروی وسیع‌تری می‌گیرد و غذای بیشتری در آن دارد.'},
 {id:'x799',icon:'lifespan',name:'ساکن دائمی',gene:'lifespan',desc:'در یک جا می‌ماند و عمر طولانی‌تری دارد.'},
 {id:'x800',icon:'cooperation',name:'همسایه خوب',gene:'cooperation',desc:'با همسایه‌ها غذا تقسیم می‌کند و در سختی از آن‌ها کمک می‌گیرد.'},
 /* --- دسته ۸: هنر و نمایش (x801–x814) --- */
 {id:'x801',icon:'coat',name:'نقاش دیواری',gene:'coat',desc:'با رنگ‌های طبیعی بدنش را نقاشی می‌کند و جفت را جذب می‌کند.'},
 {id:'x802',icon:'cooperation',name:'بازیگر ماهر',gene:'cooperation',desc:'با تقلید رفتار دیگران اعتماد گروه را جلب می‌کند.'},
 {id:'x803',icon:'speed',name:'رقصنده چابک',gene:'speed',desc:'با رقص سریع توجه جفت را جلب می‌کند و شکارچی را گیج می‌کند.'},
 {id:'x804',icon:'mask',name:'جادوگر سایه‌ها',gene:'mask',desc:'با حرکت‌های نمایشی شکارچی را فریب می‌دهد و فرار می‌کند.'},
 {id:'x805',icon:'coat',name:'رنگ‌زن بدن',gene:'coat',desc:'رنگ بدنش را برای نمایش عوض می‌کند و جفت پیدا می‌کند.'},
 {id:'x806',icon:'efficiency',name:'بالرین سبک‌بال',gene:'efficiency',desc:'با حرکات نرم و کم‌انرژی از خطر می‌گریزد.'},
 {id:'x807',icon:'cooperation',name:'کارگردان گروه',gene:'cooperation',desc:'حرکت گروه را هماهنگ می‌کند و شکار دسته‌جمعی بهتر می‌شود.'},
 {id:'x808',icon:'cooperation',name:'سخنور گروه',gene:'cooperation',desc:'با صدای بلند گروه را جمع می‌کند و خطر را خبر می‌دهد.'},
 {id:'x809',icon:'vision',name:'خطاط طبیعت',gene:'vision',desc:'نشانه‌ها را روی زمین می‌کشد و مسیر غذا را به گروه نشان می‌دهد.'},
 {id:'x810',icon:'mask',name:'نقاب‌ساز',gene:'mask',desc:'نقاب‌های رنگی می‌سازد و شکارچی را می‌ترساند.'},
 {id:'x811',icon:'size',name:'مجسمه‌ساز گلی',gene:'size',desc:'با گل مجسمه می‌سازد و قلمروش را نشانه می‌گذارد.'},
 {id:'x812',icon:'speed',name:'طناب‌باز ماهر',gene:'speed',desc:'با تعادل شگفت‌انگیز از شاخه‌ها بالا می‌رود و غذا می‌گیرد.'},
 {id:'x813',icon:'coat',name:'رنگین‌کمان‌پوش',gene:'coat',desc:'بدنش رنگ‌های شاد دارد و جفت‌ها به او جذب می‌شوند.'},
 {id:'x814',icon:'vision',name:'نمایشگر نور',gene:'vision',desc:'نور را با بدنش بازتاب می‌دهد و توجه جفت را جلب می‌کند.'},
 /* --- دسته ۹: موسیقی و صدا (x815–x828) --- */
 {id:'x815',icon:'fertility',name:'خواننده صبحگاهی',gene:'fertility',desc:'صبح‌ها آواز می‌خواند و جفت بیشتری جذب می‌کند.'},
 {id:'x816',icon:'cooperation',name:'دهل‌زن گروه',gene:'cooperation',desc:'با ضرب‌آهنگ گروه را برای شکار هماهنگ می‌کند.'},
 {id:'x817',icon:'lifespan',name:'آهنگ‌ساز',gene:'lifespan',desc:'آوازهایش گروه را آرام می‌کند و عمرشان بیشتر می‌شود.'},
 {id:'x818',icon:'metabolism',name:'نوازنده بادی',gene:'metabolism',desc:'با دمیدن طولانی ریه‌اش قوی است و دیر خسته می‌شود.'},
 {id:'x819',icon:'speed',name:'زخمه‌زن',gene:'speed',desc:'انگشتانش سریع است و با صدا شکار را گیج می‌کند.'},
 {id:'x820',icon:'vision',name:'زنگوله‌دار',gene:'vision',desc:'صدای زنگوله‌اش گروه را از خطر خبر می‌کند.'},
 {id:'x821',icon:'cooperation',name:'هم‌خوان گروه',gene:'cooperation',desc:'با گروه هم‌آواز می‌شود و پیوندشان قوی‌تر می‌شود.'},
 {id:'x822',icon:'aggression',name:'فریاد بلند',gene:'aggression',desc:'فریادش شکارچی را می‌ترساند و دور می‌کند.'},
 {id:'x823',icon:'mask',name:'تقلیدکننده صدا',gene:'mask',desc:'صدای دیگران را تقلید می‌کند و شکار را فریب می‌دهد.'},
 {id:'x824',icon:'efficiency',name:'ضرب‌آهنگ‌شناس',gene:'efficiency',desc:'با ریتم منظم حرکت می‌کند و انرژی کمتری می‌سوزاند.'},
 {id:'x825',icon:'vision',name:'نت‌خوان',gene:'vision',desc:'الگوهای صدا را می‌فهمد و مسیر غذا را از صدا پیدا می‌کند.'},
 {id:'x826',icon:'coldRes',name:'آوازخوان باران',gene:'coldRes',desc:'در باران آواز می‌خواند و سرما اذیتش نمی‌کند.'},
 {id:'x827',icon:'fertility',name:'مقلد آواز',gene:'fertility',desc:'آواز دیگران را یاد می‌گیرد و جفت‌ها به او جذب می‌شوند.'},
 {id:'x828',icon:'lifespan',name:'آواز شبانه',gene:'lifespan',desc:'شب‌ها آواز می‌خواند و با جفتش پیوند می‌سازد.'},
 /* --- دسته ۱۰: خواب و استراحت (x829–x842) --- */
 {id:'x829',icon:'metabolism',name:'خواب سنگین',gene:'metabolism',desc:'خواب عمیق انرژی‌اش را ذخیره می‌کند و دیرتر گرسنه می‌شود.'},
 {id:'x830',icon:'lifespan',name:'لانه‌ی خواب نرم',gene:'lifespan',desc:'جای خواب نرمی می‌سازد و خوابش عمیق‌تر و عمرش بیشتر می‌شود.'},
 {id:'x831',icon:'vision',name:'ستاره‌نگر شب',gene:'vision',desc:'شب‌ها بیدار می‌ماند و وقتی دیگران خواب‌اند شکار می‌کند.'},
 {id:'x832',icon:'efficiency',name:'چرت‌زن سریع',gene:'efficiency',desc:'با چرت‌های کوتاه انرژی‌اش برمی‌گردد و زود به شکار می‌رود.'},
 {id:'x833',icon:'coldRes',name:'خوابنده‌ی زمستان',gene:'coldRes',desc:'در زمستان به خواب عمیق می‌رود و سرما را پشت سر می‌گذارد.'},
 {id:'x834',icon:'speed',name:'طلوع‌خیز',gene:'speed',desc:'سپیده‌دم بیدار می‌شود و اولین غذاها را پیدا می‌کند.'},
 {id:'x835',icon:'vision',name:'شامگاه‌خیز',gene:'vision',desc:'غروب بیدار می‌شود و در نور کم شکار می‌کند.'},
 {id:'x836',icon:'lifespan',name:'استراحت‌کننده ماهر',gene:'lifespan',desc:'خوب استراحت می‌کند و بدنش دیرتر فرسوده می‌شود.'},
 {id:'x837',icon:'vision',name:'خواب نیمه‌بیدار',gene:'vision',desc:'خوابش سبک است و با کوچک‌ترین صدا بیدار می‌شود.'},
 {id:'x838',icon:'cooperation',name:'همدم خواب',gene:'cooperation',desc:'کنار گروه می‌خوابد و گرمای هم نگه‌شان می‌دارد.'},
 {id:'x839',icon:'speed',name:'خوابگرد',gene:'speed',desc:'در خواب هم راه می‌رود و از خطر دور می‌شود.'},
 {id:'x840',icon:'metabolism',name:'خمیازه‌زن',gene:'metabolism',desc:'با خمیازه اکسیژن بیشتری می‌گیرد و دیرتر خسته می‌شود.'},
 {id:'x841',icon:'coldRes',name:'لانه‌خواب گرم',gene:'coldRes',desc:'لانه‌اش را گرم می‌کند و شب‌های سرد زنده می‌ماند.'},
 {id:'x842',icon:'efficiency',name:'ساعت درونی دقیق',gene:'efficiency',desc:'همیشه سر وقت بیدار می‌شود و وقت شکار را از دست نمی‌دهد.'},
 /* --- دسته ۱۱: حافظه و یادگیری (x843–x856) --- */
 {id:'x843',icon:'vision',name:'حافظه تصویری',gene:'vision',desc:'جای غذاها را با تصویر به خاطر می‌سپارد و دوباره پیدا می‌کند.'},
 {id:'x844',icon:'efficiency',name:'یادگیرنده سریع',gene:'efficiency',desc:'مهارت تازه را زود یاد می‌گیرد و سریع‌تر شکار می‌کند.'},
 {id:'x845',icon:'vision',name:'نقشه‌خوان ذهنی',gene:'vision',desc:'نقشه‌ی ذهنی سرزمین را دارد و راه برگشت را گم نمی‌کند.'},
 {id:'x846',icon:'fertility',name:'معلم بچه‌ها',gene:'fertility',desc:'به بچه‌ها شکار یاد می‌دهد و آن‌ها بیشتر زنده می‌مانند.'},
 {id:'x847',icon:'speed',name:'تکرارکننده مسیر',gene:'speed',desc:'مسیرهای کوتاه را به خاطر می‌سپارد و سریع‌تر به غذا می‌رسد.'},
 {id:'x848',icon:'vision',name:'حل‌کننده معما',gene:'vision',desc:'راه‌های پیچیده را حل می‌کند و به غذای پنهان می‌رسد.'},
 {id:'x849',icon:'lifespan',name:'خاطره‌نگار',gene:'lifespan',desc:'تجربه‌هایش را به خاطر دارد و اشتباه‌ها را تکرار نمی‌کند.'},
 {id:'x850',icon:'cooperation',name:'چشم‌آموز',gene:'cooperation',desc:'با نگاه کردن از دیگران یاد می‌گیرد و مهارتش بیشتر می‌شود.'},
 {id:'x851',icon:'lifespan',name:'مغز بزرگ',gene:'lifespan',desc:'مغزش بزرگ است و در سختی‌ها راه‌حل پیدا می‌کند.'},
 {id:'x852',icon:'vision',name:'نشانه‌گذار حافظه',gene:'vision',desc:'نشانه می‌گذارد تا جای غذا را بعداً پیدا کند.'},
 {id:'x853',icon:'efficiency',name:'تمرکز بالا',gene:'efficiency',desc:'روی شکار تمرکز می‌کند و با حرکت کمتر موفق می‌شود.'},
 {id:'x854',icon:'vision',name:'کنجکاو یادگیر',gene:'vision',desc:'همه‌چیز را می‌آزماید و خوراکی‌های تازه پیدا می‌کند.'},
 {id:'x855',icon:'lifespan',name:'حافظه بلندمدت',gene:'lifespan',desc:'جای آب و غذا را برای همیشه به خاطر می‌سپارد.'},
 {id:'x856',icon:'fertility',name:'آموزگار خردسالان',gene:'fertility',desc:'از بچه‌ها مراقبت می‌کند و به آن‌ها زندگی یاد می‌دهد.'},
 /* --- دسته ۱۲: خاک و زمین (x857–x871) --- */
 {id:'x857',icon:'metabolism',name:'ریشه‌خوار',gene:'metabolism',desc:'ریشه‌های زمین را می‌خورد و در قحطی سیر می‌ماند.'},
 {id:'x858',icon:'vision',name:'کرم‌یاب',gene:'vision',desc:'کرم‌های زیر خاک را حس می‌کند و غذای پنهان پیدا می‌کند.'},
 {id:'x859',icon:'efficiency',name:'حفار خاک',gene:'efficiency',desc:'خاک را می‌کند و به غذای زیر زمین می‌رسد.'},
 {id:'x860',icon:'speed',name:'بالارونده‌ی کوهستان',gene:'speed',desc:'از کوه بالا می‌رود و به غذاهای دست‌نیافتنی می‌رسد.'},
 {id:'x861',icon:'size',name:'پرتگاه‌نورد',gene:'size',desc:'روی سنگ‌ها راه می‌رود و از دست شکارچی فرار می‌کند.'},
 {id:'x862',icon:'heatRes',name:'خاکسترنشین',gene:'heatRes',desc:'در خاک گرم و خشک زندگی می‌کند و گرما اذیتش نمی‌کند.'},
 {id:'x863',icon:'heatRes',name:'بیابان‌گرد',gene:'heatRes',desc:'در بیابان راه می‌رود و آب کمتری لازم دارد.'},
 {id:'x864',icon:'efficiency',name:'تونل‌کن',gene:'efficiency',desc:'تونل می‌کند و پنهان از شکارچی به غذا می‌رسد.'},
 {id:'x865',icon:'fertility',name:'بذرافشان',gene:'fertility',desc:'بذر می‌کارد و غذای آینده‌ی گروه را می‌سازد.'},
 {id:'x866',icon:'aggression',name:'مورچه‌خوار',gene:'aggression',desc:'مورچه می‌خورد و از لانه‌شان غذا می‌دزدد.'},
 {id:'x867',icon:'vision',name:'خاک‌شناس',gene:'vision',desc:'خاک خوب را می‌شناسد و جای رشد غذا را پیدا می‌کند.'},
 {id:'x868',icon:'lifespan',name:'کوهستان‌نشین',gene:'lifespan',desc:'روی صخره‌های بلند زندگی می‌کند و امن می‌ماند.'},
 {id:'x869',icon:'speed',name:'ریشه‌تراش',gene:'speed',desc:'ریشه‌ها را می‌تراشد و سریع به مغزشان می‌رسد.'},
 {id:'x870',icon:'coldRes',name:'باران‌خاک',gene:'coldRes',desc:'باران خاک را دوست دارد و در هوای سرد فعال می‌ماند.'},
 {id:'x871',icon:'cooperation',name:'گل‌ساز',gene:'cooperation',desc:'با گل خانه می‌سازد و گروه در آن امن می‌ماند.'},
 /* --- دسته ۱۳: فصل‌ها (x872–x886) --- */
 {id:'x872',icon:'fertility',name:'بهارپوش',gene:'fertility',desc:'در بهار زیباتر می‌شود و جفت بیشتری جذب می‌کند.'},
 {id:'x873',icon:'heatRes',name:'تابستان‌دوست',gene:'heatRes',desc:'گرمای تابستان را دوست دارد و فعال می‌ماند.'},
 {id:'x874',icon:'efficiency',name:'پاییزگرد',gene:'efficiency',desc:'در پاییز برگ می‌خورد و انرژی ذخیره می‌کند.'},
 {id:'x875',icon:'coldRes',name:'زمستان‌گذران',gene:'coldRes',desc:'زمستان را با ذخیره‌ی غذا پشت سر می‌گذارد.'},
 {id:'x876',icon:'coldRes',name:'باران‌خواه',gene:'coldRes',desc:'باران را دوست دارد و در هوای بارانی شکار می‌کند.'},
 {id:'x877',icon:'metabolism',name:'خورشیدگیر',gene:'metabolism',desc:'زیر آفتاب گرم می‌شود و انرژی‌اش بیشتر می‌شود.'},
 {id:'x878',icon:'efficiency',name:'خرمن‌چین',gene:'efficiency',desc:'موقع برداشت غذا جمع می‌کند و ذخیره می‌سازد.'},
 {id:'x879',icon:'coat',name:'برگ‌پوش پاییزی',gene:'coat',desc:'بدنش رنگ برگ‌های پاییز می‌شود و دیده نمی‌شود.'},
 {id:'x880',icon:'metabolism',name:'شکوفه‌خوار',gene:'metabolism',desc:'شکوفه‌های بهاری را می‌خورد و نیرو می‌گیرد.'},
 {id:'x881',icon:'coldRes',name:'یخ‌دوست',gene:'coldRes',desc:'سرما را دوست دارد و در برف فعال می‌ماند.'},
 {id:'x882',icon:'heatRes',name:'گرمادوست',gene:'heatRes',desc:'گرما را دوست دارد و تابستان شکار می‌کند.'},
 {id:'x883',icon:'lifespan',name:'ماه‌گرد فصلی',gene:'lifespan',desc:'با چرخه‌ی ماه غذا ذخیره می‌کند و عمرش بیشتر می‌شود.'},
 {id:'x884',icon:'fertility',name:'انگورچین',gene:'fertility',desc:'میوه‌های فصلی را جمع می‌کند و گروه را سیر می‌کند.'},
 {id:'x885',icon:'vision',name:'ابرخوان',gene:'vision',desc:'از روی ابرها باران را پیش‌بینی می‌کند و پناه می‌گیرد.'},
 {id:'x886',icon:'speed',name:'برف‌پیما',gene:'speed',desc:'روی برف سریع می‌دود و از شکارچی فرار می‌کند.'},
 /* --- دسته ۱۴: پنهان‌کاری و استتار (x887–x900) --- */
 {id:'x887',icon:'coat',name:'هم‌رنگ محیط',gene:'coat',desc:'رنگش با محیط یکی می‌شود و شکارچی او را نمی‌بیند.'},
 {id:'x888',icon:'mask',name:'پوشیده در برگ',gene:'mask',desc:'زیر برگ پنهان می‌شود و شکار از کنارش می‌گذرد.'},
 {id:'x889',icon:'mask',name:'سنگ‌مانند',gene:'mask',desc:'مثل سنگ بی‌حرکت می‌ماند و دیده نمی‌شود.'},
 {id:'x890',icon:'coat',name:'مه‌پوش',gene:'coat',desc:'در مه گم می‌شود و شکارچی ردش را نمی‌گیرد.'},
 {id:'x891',icon:'speed',name:'ردپاک‌کن',gene:'speed',desc:'رد پایش را پاک می‌کند و شکارچی او را پیدا نمی‌کند.'},
 {id:'x892',icon:'vision',name:'سایه‌نشین',gene:'vision',desc:'در سایه پنهان می‌شود و شکار را زیر نظر می‌گیرد.'},
 {id:'x893',icon:'mask',name:'خش‌خش‌کن',gene:'mask',desc:'با برگ‌های خشک صدا می‌سازد و شکارچی را گمراه می‌کند.'},
 {id:'x894',icon:'coat',name:'شب‌پوش',gene:'coat',desc:'شب‌ها رنگش تیره می‌شود و در تاریکی گم می‌شود.'},
 {id:'x895',icon:'aggression',name:'مارنما',gene:'aggression',desc:'مثل مار می‌خزد و شکار را غافلگیر می‌کند.'},
 {id:'x896',icon:'coat',name:'آب‌پوش',gene:'coat',desc:'زیر آب پنهان می‌شود و شکارچی از بالاش رد می‌شود.'},
 {id:'x897',icon:'efficiency',name:'تارپوش',gene:'efficiency',desc:'در تارش کمین می‌کند و شکار به دام می‌افتد.'},
 {id:'x898',icon:'mask',name:'علف‌پوش',gene:'mask',desc:'میان علف‌ها قایم می‌شود و غذا را شکار می‌کند.'},
 {id:'x899',icon:'lifespan',name:'گورکن پنهان‌کار',gene:'lifespan',desc:'در سوراخ پنهان می‌شود و خطر را پشت سر می‌گذارد.'},
 {id:'x900',icon:'mask',name:'استاد استتار',gene:'mask',desc:'بهترین استتار را دارد و هیچ شکارچی‌ای او را نمی‌بیند.'},
 {id:'x901',icon:'speed',name:'مسافر دور',gene:'speed',desc:'دورترین مسیرها را می‌پیماید و همیشه به مقصد می‌رسد.'},
 {id:'x902',icon:'vision',name:'نقشه‌دان',gene:'vision',desc:'مسیر مهاجرت را از روی نشانه‌های زمین می‌خواند.'},
 {id:'x903',icon:'lifespan',name:'قو مهاجر',gene:'lifespan',desc:'هر سال هزاران کیلومتر مهاجرت می‌کند و سالم برمی‌گردد.'},
 {id:'x904',icon:'efficiency',name:'جهان‌پیما',gene:'efficiency',desc:'در هر سرزمینی غذا پیدا می‌کند و گرسنه نمی‌ماند.'},
 {id:'x905',icon:'size',name:'نهنگ کوچ‌کننده',gene:'size',desc:'در مهاجرت‌های طولانی بدنش ذخیره‌ی انرژی زیادی دارد.'},
 {id:'x906',icon:'metabolism',name:'پروانه‌ی مهاجر',gene:'metabolism',desc:'با انرژی کم مسافت‌های بلند را پرواز می‌کند.'},
 {id:'x907',icon:'speed',name:'موج‌سوار سفر',gene:'speed',desc:'جریان آب او را سریع‌تر به مقصد می‌رساند.'},
 {id:'x908',icon:'efficiency',name:'بار سبک',gene:'efficiency',desc:'با کمترین بار سفر می‌کند و خسته نمی‌شود.'},
 {id:'x909',icon:'cooperation',name:'اردک مهاجر',gene:'cooperation',desc:'با گله مهاجرت می‌کند و راه را گم نمی‌کند.'},
 {id:'x910',icon:'vision',name:'شب‌پیما',gene:'vision',desc:'شب‌ها سفر می‌کند و ستاره‌ها راهش را نشان می‌دهند.'},
 {id:'x911',icon:'vision',name:'جهت‌یاب درونی',gene:'vision',desc:'بدون نقشه جهت درست را حس می‌کند.'},
 {id:'x912',icon:'speed',name:'شاهین کوچ‌کننده',gene:'speed',desc:'سریع‌ترین مسیر مهاجرت را انتخاب می‌کند.'},
 {id:'x913',icon:'lifespan',name:'لاک‌پشت مسافر',gene:'lifespan',desc:'آهسته ولی پیوسته به مقصد می‌رسد و عمرش طولانی است.'},
 {id:'x914',icon:'efficiency',name:'بادسواری',gene:'efficiency',desc:'از باد کمک می‌گیرد و انرژی‌اش را ذخیره می‌کند.'},
 {id:'x915',icon:'immunity',name:'راه‌یاب کهنه‌کار',gene:'immunity',desc:'در سفرهای سخت بیمار نمی‌شود و دوام می‌آورد.'},
 {id:'x916',icon:'speed',name:'دلفین شناگر',gene:'speed',desc:'در آب سریع‌تر از همه شنا می‌کند.'},
 {id:'x917',icon:'aggression',name:'کوسه‌ی آب‌های عمیق',gene:'aggression',desc:'در آب‌های عمیق بی‌رقیب شکار می‌کند.'},
 {id:'x918',icon:'speed',name:'ماهی تندرو',gene:'speed',desc:'مثل برق در آب حرکت می‌کند.'},
 {id:'x919',icon:'efficiency',name:'غواص ماهر',gene:'efficiency',desc:'مدت طولانی زیر آب می‌ماند و نفسش تمام نمی‌شود.'},
 {id:'x920',icon:'mask',name:'اختاپوس آبزی',gene:'mask',desc:'در آب رنگ عوض می‌کند و ناپدید می‌شود.'},
 {id:'x921',icon:'coat',name:'فک شناور',gene:'coat',desc:'پوست چربش در آب سرد گرمش نگه می‌دارد.'},
 {id:'x922',icon:'metabolism',name:'قطره‌ی آب',gene:'metabolism',desc:'با کمترین آب زنده می‌ماند.'},
 {id:'x923',icon:'size',name:'نهنگ غواص',gene:'size',desc:'به عمیق‌ترین آب‌ها شیرجه می‌زند.'},
 {id:'x924',icon:'cooperation',name:'شنای هماهنگ',gene:'cooperation',desc:'با گروه شنا می‌کند و شکارچی را دور می‌زند.'},
 {id:'x925',icon:'aggression',name:'خرچنگ ساحلی',gene:'aggression',desc:'با چنگال‌هایش در ساحل از خودش دفاع می‌کند.'},
 {id:'x926',icon:'heatRes',name:'باران‌نوش',gene:'heatRes',desc:'زیر باران خنک می‌شود و گرما اذیتش نمی‌کند.'},
 {id:'x927',icon:'coat',name:'ماهی رنگین',gene:'coat',desc:'رنگ‌های روشنش شکارچی را گیج می‌کند.'},
 {id:'x928',icon:'speed',name:'میگوی جهنده',gene:'speed',desc:'با یک جهش از خطر آب می‌گریزد.'},
 {id:'x929',icon:'size',name:'موج‌گذر',gene:'size',desc:'مقابل موج‌های بلند ایستادگی می‌کند.'},
 {id:'x930',icon:'lifespan',name:'صدف‌نشین',gene:'lifespan',desc:'در صدفش امن زندگی می‌کند و عمر طولانی دارد.'},
 {id:'x931',icon:'vision',name:'عقاب بلندپرواز',gene:'vision',desc:'از ارتفاع بالا کوچک‌ترین طعمه را می‌بیند.'},
 {id:'x932',icon:'efficiency',name:'کبوتر پیام‌رسان',gene:'efficiency',desc:'مسیر خانه را از آسمان پیدا می‌کند.'},
 {id:'x933',icon:'vision',name:'جغد شب‌پرواز',gene:'vision',desc:'در تاریکی شب هم پرواز می‌کند و می‌بیند.'},
 {id:'x934',icon:'heatRes',name:'ابرپیما',gene:'heatRes',desc:'بالای ابرها از گرمای زمین در امان است.'},
 {id:'x935',icon:'efficiency',name:'پر سبک',gene:'efficiency',desc:'با پرهای سبک کمترین انرژی را در پرواز مصرف می‌کند.'},
 {id:'x936',icon:'vision',name:'خفاش شبانه',gene:'vision',desc:'با صدا در تاریکی راهش را پیدا می‌کند.'},
 {id:'x937',icon:'speed',name:'طوفان‌سوار',gene:'speed',desc:'در طوفان هم پرواز می‌کند و سقوط نمی‌کند.'},
 {id:'x938',icon:'size',name:'فلامینگوی بلندبال',gene:'size',desc:'بال‌های بلندش او را بالاتر از همه می‌برد.'},
 {id:'x939',icon:'speed',name:'بادبال',gene:'speed',desc:'باد او را سریع‌تر از پرنده‌ها جابه‌جا می‌کند.'},
 {id:'x940',icon:'cooperation',name:'طوطی سخنگو',gene:'cooperation',desc:'صدای دیگران را تقلید می‌کند و با گروه ارتباط می‌گیرد.'},
 {id:'x941',icon:'efficiency',name:'گنجشک پرشتاب',gene:'efficiency',desc:'بین شاخه‌ها سریع جابه‌جا می‌شود و انرژی کمی مصرف می‌کند.'},
 {id:'x942',icon:'coat',name:'رنگین‌پر',gene:'coat',desc:'پرهای رنگینش در آسمان دیده می‌شود.'},
 {id:'x943',icon:'lifespan',name:'ماه‌نورد',gene:'lifespan',desc:'شب‌ها تا طلوع ماه پرواز می‌کند.'},
 {id:'x944',icon:'heatRes',name:'خورشیدبال',gene:'heatRes',desc:'زیر آفتاب داغ هم پرواز می‌کند و خسته نمی‌شود.'},
 {id:'x945',icon:'speed',name:'شاهین تیزپرواز',gene:'speed',desc:'سریع‌ترین شیرجه را از آسمان می‌زند.'},
 {id:'x946',icon:'mask',name:'شب‌زی',gene:'mask',desc:'در تاریکی کامل ناپدید می‌شود.'},
 {id:'x947',icon:'vision',name:'نورساز',gene:'vision',desc:'در تاریکی نور می‌سازد و راهش را روشن می‌کند.'},
 {id:'x948',icon:'vision',name:'ستاره‌چین',gene:'vision',desc:'نور ستاره‌ها را می‌بیند و راه را پیدا می‌کند.'},
 {id:'x949',icon:'heatRes',name:'شمع‌افروز',gene:'heatRes',desc:'شعله‌ی کوچکش گرمایش را در تاریکی نگه می‌دارد.'},
 {id:'x950',icon:'vision',name:'چشم‌شب',gene:'vision',desc:'چشم‌هایش در تاریکی برق می‌زند و همه‌چیز را می‌بیند.'},
 {id:'x951',icon:'coat',name:'ماه‌گرفتگی',gene:'coat',desc:'در سایه‌ی ماه پنهان می‌شود.'},
 {id:'x952',icon:'speed',name:'برق‌آسا',gene:'speed',desc:'مثل برق در تاریکی حرکت می‌کند.'},
 {id:'x953',icon:'mask',name:'سایه‌پوش',gene:'mask',desc:'مثل سایه حرکت می‌کند و دیده نمی‌شود.'},
 {id:'x954',icon:'coat',name:'پرتوافشان',gene:'coat',desc:'پوستش در تاریکی می‌درخشد و جفت را جذب می‌کند.'},
 {id:'x955',icon:'coat',name:'تاریک‌گرد',gene:'coat',desc:'رنگ تیره‌اش در شب او را مخفی می‌کند.'},
 {id:'x956',icon:'cooperation',name:'چراغ‌به‌دست',gene:'cooperation',desc:'نورش راه گروه را روشن می‌کند.'},
 {id:'x957',icon:'vision',name:'کهکشان‌بین',gene:'vision',desc:'حتی در تاریک‌ترین شب ستاره‌ها را می‌بیند.'},
 {id:'x958',icon:'immunity',name:'غارپناه',gene:'immunity',desc:'در تاریکی غار بیمار نمی‌شود و قوی می‌ماند.'},
 {id:'x959',icon:'lifespan',name:'شب‌بان',gene:'lifespan',desc:'شب‌ها فعال است و عمرش در تاریکی طولانی‌تر است.'},
 {id:'x960',icon:'heatRes',name:'گرماگیر',gene:'heatRes',desc:'نور خورشید را جذب می‌کند و انرژی می‌گیرد.'},
 {id:'x961',icon:'vision',name:'ریش‌سفید دانا',gene:'vision',desc:'با تجربه‌اش خطر را زودتر حس می‌کند.'},
 {id:'x962',icon:'fertility',name:'نوزاد تازه',gene:'fertility',desc:'نوزادانش سریع رشد می‌کنند و قوی می‌شوند.'},
 {id:'x963',icon:'metabolism',name:'جوانه‌ی تازه',gene:'metabolism',desc:'سریع رشد می‌کند و انرژی زیادی دارد.'},
 {id:'x964',icon:'lifespan',name:'درخت کهن',gene:'lifespan',desc:'مثل درخت کهن سال‌ها زنده می‌ماند.'},
 {id:'x965',icon:'vision',name:'جوجه‌ی کنجکاو',gene:'vision',desc:'همه‌چیز را زود یاد می‌گیرد و غذا را سریع پیدا می‌کند.'},
 {id:'x966',icon:'cooperation',name:'مادربزرگ مهربان',gene:'cooperation',desc:'از بچه‌ها مراقبت می‌کند و گروه را کنار هم نگه می‌دارد.'},
 {id:'x967',icon:'immunity',name:'پیر خردمند',gene:'immunity',desc:'در برابر بیماری‌های قدیمی مقاوم است.'},
 {id:'x968',icon:'size',name:'جوان نیرومند',gene:'size',desc:'در جوانی قوی‌ترین بدن را دارد.'},
 {id:'x969',icon:'lifespan',name:'برگ پاییزی',gene:'lifespan',desc:'با گذر فصل‌ها آرام‌تر می‌شود ولی دوام می‌آورد.'},
 {id:'x970',icon:'fertility',name:'شکوفه‌ی بهاری',gene:'fertility',desc:'در بهار بچه‌های بیشتری به دنیا می‌آورد.'},
 {id:'x971',icon:'lifespan',name:'زمان‌دار',gene:'lifespan',desc:'عمرش طولانی‌تر از هم‌نوعانش است.'},
 {id:'x972',icon:'fertility',name:'تخم تازه',gene:'fertility',desc:'تخم‌هایش سالم‌ترند و بیشترشان به دنیا می‌آیند.'},
 {id:'x973',icon:'speed',name:'بچه‌ی بازیگوش',gene:'speed',desc:'سریع می‌دود و از همه جا سر درمی‌آورد.'},
 {id:'x974',icon:'cooperation',name:'خانواده‌دار',gene:'cooperation',desc:'خانواده‌اش را دور هم نگه می‌دارد و از آن‌ها محافظت می‌کند.'},
 {id:'x975',icon:'efficiency',name:'پیرِ صبور',gene:'efficiency',desc:'آرام و با صبر انرژی‌اش را ذخیره می‌کند.'},
 {id:'x976',icon:'immunity',name:'درمانگر',gene:'immunity',desc:'زخم‌های خودش را سریع درمان می‌کند.'},
 {id:'x977',icon:'immunity',name:'داروگیاه',gene:'immunity',desc:'گیاه دارویی می‌خورد و بیماری‌اش خوب می‌شود.'},
 {id:'x978',icon:'cooperation',name:'پرستار طبیعت',gene:'cooperation',desc:'به هم‌گروهی‌های بیمارش کمک می‌کند تا خوب شوند.'},
 {id:'x979',icon:'immunity',name:'میکروب‌خوار',gene:'immunity',desc:'میکروب‌ها را می‌خورد و بیمار نمی‌شود.'},
 {id:'x980',icon:'immunity',name:'پادزهرساز',gene:'immunity',desc:'در برابر سم‌ها پادزهر می‌سازد.'},
 {id:'x981',icon:'immunity',name:'عسل‌درمان',gene:'immunity',desc:'عسل می‌خورد و بیماری‌اش زود خوب می‌شود.'},
 {id:'x982',icon:'efficiency',name:'علف‌خور دارویی',gene:'efficiency',desc:'گیاه‌های دارویی را تشخیص می‌دهد و می‌خورد.'},
 {id:'x983',icon:'immunity',name:'تمیزکار',gene:'immunity',desc:'بدنش را تمیز نگه می‌دارد و میکروب نمی‌گیرد.'},
 {id:'x984',icon:'lifespan',name:'زخم‌درمان',gene:'lifespan',desc:'زخم‌هایش سریع بسته می‌شود و خونریزی نمی‌کند.'},
 {id:'x985',icon:'heatRes',name:'آفتاب‌درمان',gene:'heatRes',desc:'نور خورشید بیماری‌اش را خوب می‌کند.'},
 {id:'x986',icon:'metabolism',name:'آب‌درمانی',gene:'metabolism',desc:'با آب تمیز سم بدنش را دفع می‌کند.'},
 {id:'x987',icon:'coldRes',name:'تب‌سوز',gene:'coldRes',desc:'تبش را با سرما پایین می‌آورد و سرما را تحمل می‌کند.'},
 {id:'x988',icon:'cooperation',name:'مورچه‌ی داروساز',gene:'cooperation',desc:'دارو را برای گروه جمع می‌کند و تقسیم می‌کند.'},
 {id:'x989',icon:'size',name:'استخوان‌ساز',gene:'size',desc:'استخوان‌هایش قوی‌ترند و دیر می‌شکنند.'},
 {id:'x990',icon:'immunity',name:'گل شفابخش',gene:'immunity',desc:'بوی گل شفابخش بیمارها را آرام می‌کند.'},
 {id:'x991',icon:'metabolism',name:'عسل‌خور',gene:'metabolism',desc:'عسل انرژی زیادی به او می‌دهد.'},
 {id:'x992',icon:'efficiency',name:'مغزخور',gene:'efficiency',desc:'مغزها را می‌شکند و با کمترین غذا سیر می‌شود.'},
 {id:'x993',icon:'immunity',name:'قارچ‌خور',gene:'immunity',desc:'قارچ‌های سمی را تشخیص می‌دهد و سالم می‌خورد.'},
 {id:'x994',icon:'fertility',name:'توت‌خور',gene:'fertility',desc:'توت‌های شیرین باروری‌اش را بیشتر می‌کند.'},
 {id:'x995',icon:'lifespan',name:'بلوط‌خور',gene:'lifespan',desc:'بلوط ذخیره می‌کند و در زمستان گرسنه نمی‌ماند.'},
 {id:'x996',icon:'aggression',name:'زنبورخور',gene:'aggression',desc:'زنبورها را شکار می‌کند و نیششان اذیتش نمی‌کند.'},
 {id:'x997',icon:'speed',name:'ملخ‌خور',gene:'speed',desc:'ملخ‌ها را با سرعت شکار می‌کند.'},
 {id:'x998',icon:'efficiency',name:'دانه‌چین',gene:'efficiency',desc:'دانه‌ها را جمع می‌کند و ذخیره می‌سازد.'},
 {id:'x999',icon:'metabolism',name:'سیب‌خور',gene:'metabolism',desc:'سیب انرژی‌اش را سریع برمی‌گرداند.'},
 {id:'x1000',icon:'size',name:'شیرخور',gene:'size',desc:'شیر می‌نوشد و بزرگ‌تر و قوی‌تر می‌شود.'},
 {id:'x1001',icon:'efficiency',name:'سنگ‌شکاف',gene:'efficiency',desc:'سنگ را می‌تراشد و ابزار تیز می‌سازد.'},
 {id:'x1002',icon:'efficiency',name:'چوب‌خردکن',gene:'efficiency',desc:'چوب را می‌تراشد و ابزارهای کاربردی می‌سازد.'},
 {id:'x1003',icon:'efficiency',name:'طناب‌باف',gene:'efficiency',desc:'طناب می‌بافد و با آن تله می‌سازد.'},
 {id:'x1004',icon:'aggression',name:'نیزه‌زن',gene:'aggression',desc:'نیزه می‌سازد و شکارش بهتر می‌شود.'},
 {id:'x1005',icon:'size',name:'تبرزن',gene:'size',desc:'تبر می‌سازد و چوب بیشتری جمع می‌کند.'},
 {id:'x1006',icon:'efficiency',name:'سبدساز',gene:'efficiency',desc:'سبد می‌بافد و غذای بیشتری با خود حمل می‌کند.'},
 {id:'x1007',icon:'metabolism',name:'کوزه‌گر',gene:'metabolism',desc:'کوزه می‌سازد و آب را برای روزهای خشک ذخیره می‌کند.'},
 {id:'x1008',icon:'coldRes',name:'آتش‌بان',gene:'coldRes',desc:'آتش روشن می‌کند و در سرما گرم می‌ماند.'},
 {id:'x1009',icon:'size',name:'سنگ‌شکن',gene:'size',desc:'سنگ‌ها را می‌شکند و با آن‌ها پناهگاه می‌سازد.'},
 {id:'x1010',icon:'coldRes',name:'چرم‌دوز',gene:'coldRes',desc:'از پوست چرم می‌دوزد و در سرما گرم می‌ماند.'},
 {id:'x1011',icon:'efficiency',name:'دام‌ساز',gene:'efficiency',desc:'تله می‌سازد و بدون دویدن شکار می‌کند.'},
 {id:'x1012',icon:'speed',name:'گذرگاه‌ساز',gene:'speed',desc:'پل می‌سازد و رود را راحت و سریع رد می‌کند.'},
 {id:'x1013',icon:'speed',name:'قایق‌ساز',gene:'speed',desc:'قایق می‌سازد و روی آب سفر می‌کند.'},
 {id:'x1014',icon:'vision',name:'ابزارشناس',gene:'vision',desc:'ابزارها را خوب می‌شناسد و همیشه از بهترینشان استفاده می‌کند.'},
 {id:'x1015',icon:'size',name:'چکش‌زن',gene:'size',desc:'با چکش ابزار می‌سازد و بازوهایش قوی‌تر می‌شود.'},
 {id:'x1016',icon:'fertility',name:'لانه‌باف',gene:'fertility',desc:'لانه محکمی می‌سازد و بچه‌هایش امن می‌مانند.'},
 {id:'x1017',icon:'aggression',name:'مرزنگهبان',gene:'aggression',desc:'مرز قلمروش را نگه می‌دارد و غریبه‌ها را بیرون می‌کند.'},
 {id:'x1018',icon:'efficiency',name:'خانه‌نگهبان',gene:'efficiency',desc:'خانه‌اش را مرتب نگه می‌دارد و غذا ذخیره می‌کند.'},
 {id:'x1019',icon:'coldRes',name:'غارخواب',gene:'coldRes',desc:'در غار زندگی می‌کند و از سرما و باد در امان است.'},
 {id:'x1020',icon:'vision',name:'درخت‌نشین',gene:'vision',desc:'روی درخت خانه می‌سازد و از شکارچی‌ها دور می‌ماند.'},
 {id:'x1021',icon:'fertility',name:'آشیانه‌ساز',gene:'fertility',desc:'آشیانه بلندی می‌سازد و بچه‌هایش امن می‌مانند.'},
 {id:'x1022',icon:'aggression',name:'قلعه‌بان',gene:'aggression',desc:'قلعه می‌سازد و قلمروش را از همه نگه می‌دارد.'},
 {id:'x1023',icon:'cooperation',name:'مهمان‌نواز',gene:'cooperation',desc:'مهمان‌ها را می‌پذیرد و دوست‌های بیشتری پیدا می‌کند.'},
 {id:'x1024',icon:'speed',name:'کوچ‌رو',gene:'speed',desc:'خانه‌اش را جابه‌جا می‌کند و همیشه نزدیک غذا می‌ماند.'},
 {id:'x1025',icon:'fertility',name:'زمین‌دار',gene:'fertility',desc:'زمین بزرگی دارد و غذای زیادی برداشت می‌کند.'},
 {id:'x1026',icon:'aggression',name:'دروازه‌بان',gene:'aggression',desc:'دروازه قلمرو را نگه می‌دارد و غریبه را راه نمی‌دهد.'},
 {id:'x1027',icon:'coldRes',name:'سقف‌ساز',gene:'coldRes',desc:'سقف محکمی می‌سازد و باران اذیتش نمی‌کند.'},
 {id:'x1028',icon:'metabolism',name:'چاه‌کن',gene:'metabolism',desc:'چاه می‌کند و همیشه آب تازه دارد.'},
 {id:'x1029',icon:'fertility',name:'باغبان',gene:'fertility',desc:'باغ می‌کارد و همیشه غذای تازه دارد.'},
 {id:'x1030',icon:'mask',name:'سنگرنشین',gene:'mask',desc:'سنگر می‌سازد و در جنگ پنهان می‌شود.'},
 {id:'x1031',icon:'speed',name:'مسابقه‌دو',gene:'speed',desc:'در مسابقه دویدن همیشه اول می‌شود.'},
 {id:'x1032',icon:'size',name:'کشتی‌زن',gene:'size',desc:'در کشتی قوی‌تر از همه است.'},
 {id:'x1033',icon:'speed',name:'پرش‌بلند',gene:'speed',desc:'بلندتر از همه می‌پرد.'},
 {id:'x1034',icon:'efficiency',name:'بازی‌ساز',gene:'efficiency',desc:'بازی می‌کند و سریع یاد می‌گیرد.'},
 {id:'x1035',icon:'vision',name:'شطرنج‌باز',gene:'vision',desc:'حریف را خوب می‌خواند و همیشه در شطرنج برنده می‌شود.'},
 {id:'x1036',icon:'vision',name:'توپ‌انداز',gene:'vision',desc:'توپ را دقیق پرت می‌کند و شکار می‌کند.'},
 {id:'x1037',icon:'aggression',name:'رقابت‌طلب',gene:'aggression',desc:'رقابت او را قوی‌تر و تیزتر می‌کند.'},
 {id:'x1038',icon:'efficiency',name:'پیروز',gene:'efficiency',desc:'با کمترین تلاش در هر رقابتی برنده می‌شود.'},
 {id:'x1039',icon:'speed',name:'چابک‌باز',gene:'speed',desc:'در بازی چابک‌تر از همه حرکت می‌کند.'},
 {id:'x1040',icon:'efficiency',name:'طناب‌باز',gene:'efficiency',desc:'روی طناب راه می‌رود و تعادلش عالی است.'},
 {id:'x1041',icon:'vision',name:'هدف‌گیر',gene:'vision',desc:'هدف را با یک ضربه دقیق می‌زند.'},
 {id:'x1042',icon:'efficiency',name:'جایزه‌گیر',gene:'efficiency',desc:'در مسابقه‌ها جایزه می‌برد و غذای بیشتری می‌گیرد.'},
 {id:'x1043',icon:'speed',name:'شنای مسابقه',gene:'speed',desc:'در شنا از همه سریع‌تر است.'},
 {id:'x1044',icon:'speed',name:'پرش‌زن',gene:'speed',desc:'از روی موانع بلند می‌پرد و جلو می‌افتد.'},
 {id:'x1045',icon:'mask',name:'سایه‌خواب',gene:'mask',desc:'در سایه حرکت می‌کند و دیده نمی‌شود.'},
 {id:'x1046',icon:'coat',name:'برگ‌نما',gene:'coat',desc:'رنگ برگ به خود می‌گیرد و در جنگل پنهان می‌شود.'},
 {id:'x1047',icon:'coat',name:'خاک‌پوش',gene:'coat',desc:'رنگ خاک به خود می‌گیرد و در زمین گم می‌شود.'},
 {id:'x1048',icon:'mask',name:'شب‌نورد',gene:'mask',desc:'شب حرکت می‌کند و شکارچی‌ها نمی‌بینندش.'},
 {id:'x1049',icon:'mask',name:'آرام‌پا',gene:'mask',desc:'بی‌صدا راه می‌رود و کسی متوجه‌اش نمی‌شود.'},
 {id:'x1050',icon:'coat',name:'هم‌رنگ',gene:'coat',desc:'با محیط یکی می‌شود و شکارچی گیج می‌شود.'},
 {id:'x1051',icon:'mask',name:'گم‌شونده',gene:'mask',desc:'وقتی خطر نزدیک است ناپدید می‌شود.'},
 {id:'x1052',icon:'coat',name:'رنگ‌گردان',gene:'coat',desc:'رنگش را عوض می‌کند و با هر محیطی جور می‌شود.'},
 {id:'x1053',icon:'mask',name:'زیرخاکی',gene:'mask',desc:'زیر خاک پنهان می‌شود تا خطر رد شود.'},
 {id:'x1054',icon:'mask',name:'مه‌گرد',gene:'mask',desc:'در مه پنهان می‌شود و شکارچی پیدایش نمی‌کند.'},
 {id:'x1055',icon:'coat',name:'صخره‌نما',gene:'coat',desc:'مثل صخره می‌ایستد و دیده نمی‌شود.'},
 {id:'x1056',icon:'mask',name:'ساکت‌نشین',gene:'mask',desc:'ساکت می‌نشیند و شکارچی از کنارش رد می‌شود.'},
 {id:'x1057',icon:'coat',name:'تاریکی‌پوش',gene:'coat',desc:'در تاریکی گم می‌شود و دیده نمی‌شود.'},
 {id:'x1058',icon:'coat',name:'نیزارپوش',gene:'coat',desc:'در نیزار پنهان می‌شود و امن می‌ماند.'},
 {id:'x1059',icon:'efficiency',name:'صبرمند',gene:'efficiency',desc:'صبر می‌کند و بهترین لحظه را برای شکار انتخاب می‌کند.'},
 {id:'x1060',icon:'metabolism',name:'آرام‌نشین',gene:'metabolism',desc:'آرام می‌نشیند و انرژی‌اش را ذخیره می‌کند.'},
 {id:'x1061',icon:'lifespan',name:'مدیتیشن‌گر',gene:'lifespan',desc:'آرام می‌نشیند و با تمرکز ذهنش قوی‌تر می‌شود.'},
 {id:'x1062',icon:'metabolism',name:'کم‌حرف',gene:'metabolism',desc:'کم حرف می‌زند و انرژی‌اش را نگه می‌دارد.'},
 {id:'x1063',icon:'efficiency',name:'انتظارکش',gene:'efficiency',desc:'منتظر می‌ماند و بهترین فرصت را می‌گیرد.'},
 {id:'x1064',icon:'metabolism',name:'آرام‌خور',gene:'metabolism',desc:'آرام غذا می‌خورد و بهتر هضم می‌کند.'},
 {id:'x1065',icon:'lifespan',name:'خواب‌دوست',gene:'lifespan',desc:'زیاد می‌خوابد و انرژی‌اش کامل برمی‌گردد.'},
 {id:'x1066',icon:'efficiency',name:'بی‌عجله',gene:'efficiency',desc:'عجله نمی‌کند و اشتباه نمی‌کند.'},
 {id:'x1067',icon:'mask',name:'ساکت',gene:'mask',desc:'ساکت است و شکارچی‌ها متوجه‌اش نمی‌شوند.'},
 {id:'x1068',icon:'immunity',name:'نفس‌عمیق',gene:'immunity',desc:'نفس عمیق می‌کشد و آرام و سالم می‌ماند.'},
 {id:'x1069',icon:'lifespan',name:'چشم‌بسته',gene:'lifespan',desc:'چشم‌هایش را می‌بندد و خوب استراحت می‌کند.'},
 {id:'x1070',icon:'cooperation',name:'صلح‌ساز',gene:'cooperation',desc:'صلح می‌خواهد و با همه دوست می‌شود.'},
 {id:'x1071',icon:'lifespan',name:'دل‌آرام',gene:'lifespan',desc:'دلش آرام است و دیرتر می‌میرد.'},
 {id:'x1072',icon:'lifespan',name:'تحمل‌گر',gene:'lifespan',desc:'شکیبایی‌اش او را قوی‌تر می‌کند.'},
 {id:'x1073',icon:'cooperation',name:'رهبر گله',gene:'cooperation',desc:'گله را رهبری می‌کند و همه دنبالش می‌روند.'},
 {id:'x1074',icon:'vision',name:'راه‌نشان',gene:'vision',desc:'راه را نشان می‌دهد و گروه گم نمی‌شود.'},
 {id:'x1075',icon:'vision',name:'نگهبان گله',gene:'vision',desc:'از گله نگهبانی می‌کند و خطر را زود می‌بیند.'},
 {id:'x1076',icon:'cooperation',name:'فرمانده',gene:'cooperation',desc:'فرمان می‌دهد و گروه منظم حرکت می‌کند.'},
 {id:'x1077',icon:'speed',name:'پیشتاز',gene:'speed',desc:'جلوتر از همه حرکت می‌کند و راه را باز می‌کند.'},
 {id:'x1078',icon:'cooperation',name:'پشتیبان',gene:'cooperation',desc:'به گروه کمک می‌کند و همه قوی‌تر می‌شوند.'},
 {id:'x1079',icon:'cooperation',name:'هماهنگ‌کننده',gene:'cooperation',desc:'گروه را هماهنگ می‌کند و شکار بهتر می‌شود.'},
 {id:'x1080',icon:'lifespan',name:'پیرگله',gene:'lifespan',desc:'پیر گله است و تجربه‌اش گروه را نجات می‌دهد.'},
 {id:'x1081',icon:'cooperation',name:'سخنران',gene:'cooperation',desc:'حرف می‌زند و گروه را دور هم جمع می‌کند.'},
 {id:'x1082',icon:'cooperation',name:'قاضی',gene:'cooperation',desc:'دعوا را حل می‌کند و گروه آرام می‌ماند.'},
 {id:'x1083',icon:'cooperation',name:'نماینده',gene:'cooperation',desc:'به جای گروه حرف می‌زند و دوست پیدا می‌کند.'},
 {id:'x1084',icon:'aggression',name:'سردسته',gene:'aggression',desc:'سردسته گروه است و همه به او گوش می‌دهند.'},
 {id:'x1085',icon:'cooperation',name:'یاور',gene:'cooperation',desc:'به ضعیف‌ها کمک می‌کند و گروه قوی‌تر می‌شود.'},
 {id:'x1086',icon:'efficiency',name:'سازمان‌دهنده',gene:'efficiency',desc:'کارها را تقسیم می‌کند و گروه بهتر کار می‌کند.'},
 {id:'x1087',icon:'speed',name:'تنهاگرد',gene:'speed',desc:'تنها سفر می‌کند و به کسی نیاز ندارد.'},
 {id:'x1088',icon:'efficiency',name:'مستقل',gene:'efficiency',desc:'تنها زندگی می‌کند و خودش غذا پیدا می‌کند.'},
 {id:'x1089',icon:'mask',name:'گوشه‌نشین',gene:'mask',desc:'گوشه‌ای زندگی می‌کند و کسی مزاحمش نمی‌شود.'},
 {id:'x1090',icon:'efficiency',name:'خودکفا',gene:'efficiency',desc:'خودش همه‌چیز را تأمین می‌کند.'},
 {id:'x1091',icon:'aggression',name:'تنها شکارچی',gene:'aggression',desc:'تنها شکار می‌کند و نیازی به گروه ندارد.'},
 {id:'x1092',icon:'lifespan',name:'بی‌نیاز',gene:'lifespan',desc:'به کسی نیاز ندارد و خودش زنده می‌ماند.'},
 {id:'x1093',icon:'mask',name:'دورافتاده',gene:'mask',desc:'دور از همه زندگی می‌کند و امن است.'},
 {id:'x1094',icon:'speed',name:'تک‌رو',gene:'speed',desc:'تک‌رو است و سریع تصمیم می‌گیرد.'},
 {id:'x1095',icon:'lifespan',name:'انزواطلب',gene:'lifespan',desc:'تنهایی را دوست دارد و آرام زندگی می‌کند.'},
 {id:'x1096',icon:'size',name:'خودساخته',gene:'size',desc:'خودش را ساخته و به هیچ‌کس وابسته نیست.'},
 {id:'x1097',icon:'efficiency',name:'آواره',gene:'efficiency',desc:'سرگردان سفر می‌کند و همه‌جا غذا پیدا می‌کند.'},
 {id:'x1098',icon:'coldRes',name:'کوه‌نشین تنها',gene:'coldRes',desc:'تنها در کوه زندگی می‌کند و قوی شده است.'},
 {id:'x1099',icon:'immunity',name:'جزیره‌نشین',gene:'immunity',desc:'در جزیره تنها زندگی می‌کند و امن است.'},
 {id:'x1100',icon:'speed',name:'آزادگرد',gene:'speed',desc:'آزاد می‌گردد و هیچ قفسی او را نگه نمی‌دارد.'},
 {id:'x1101',icon:'vision',name:'پرسشگرِ کوچک',gene:'vision',desc:'هر چیز تازه را با دقت می‌پاید و زود از آن یاد می‌گیرد.'},
 {id:'x1102',icon:'efficiency',name:'کاوشگرِ تپه‌ها',gene:'efficiency',desc:'تپه‌ها را می‌کاود و پنهان‌گاه‌های تازه‌ی غذا را پیدا می‌کند.'},
 {id:'x1103',icon:'vision',name:'ردیابِ بویِ تازه',gene:'vision',desc:'بوی تازه‌ی غذا را از دور تشخیص می‌دهد و به‌سرعت به آن می‌رسد.'},
 {id:'x1104',icon:'vision',name:'گوش‌به‌زنگِ تازه‌ها',gene:'vision',desc:'به هر صدای تازه گوش می‌دهد و زود از خطر یا غذا باخبر می‌شود.'},
 {id:'x1105',icon:'vision',name:'نقشه‌کشِ ذهنی',gene:'vision',desc:'نقشه‌ی ذهنیِ جهان را می‌سازد و راه غذا را گم نمی‌کند.'},
 {id:'x1106',icon:'speed',name:'پیگیرِ ردپا',gene:'speed',desc:'ردپای حیوانات دیگر را دنبال می‌کند تا به غذا یا آب برسد.'},
 {id:'x1107',icon:'metabolism',name:'آزمایشگرِ خوراک',gene:'metabolism',desc:'خوراک‌های تازه را با احتیاط می‌چشد و خوراکی‌ها را می‌شناسد.'},
 {id:'x1108',icon:'vision',name:'بو‌یابِ غار',gene:'vision',desc:'بوی غارها را دنبال می‌کند و در آن‌ها پناه یا غذا پیدا می‌کند.'},
 {id:'x1109',icon:'speed',name:'راهِ نو‌جوی',gene:'speed',desc:'همیشه راه‌های تازه را می‌آزماید و زودتر به غذا می‌رسد.'},
 {id:'x1110',icon:'efficiency',name:'سرک‌کشِ بوته‌ها',gene:'efficiency',desc:'سر به بوته‌ها می‌کشد و خوراک‌های پنهان را بیرون می‌کشد.'},
 {id:'x1111',icon:'lifespan',name:'دنیای‌نو‌خواه',gene:'lifespan',desc:'به‌دنبال جاهای تازه می‌گردد و عمرش را در کشف می‌گذراند.'},
 {id:'x1112',icon:'efficiency',name:'دست‌کاوِ خاک',gene:'efficiency',desc:'خاک را با دست می‌کاود و ریشه‌ها و دانه‌های پنهان را پیدا می‌کند.'},
 {id:'x1113',icon:'efficiency',name:'سوال‌پرسِ پیگیر',gene:'efficiency',desc:'با پرسش و آزمون، رفتارهای تازه را سریع یاد می‌گیرد.'},
 {id:'x1114',icon:'size',name:'کاوشگرِ صخره‌ها',gene:'size',desc:'از صخره‌ها بالا می‌رود و چشم‌اندازهای تازه را می‌بیند.'},
 {id:'x1115',icon:'vision',name:'چشم‌به‌راهِ ناشناخته',gene:'vision',desc:'به افق خیره می‌شود و ناشناخته‌ها را زودتر از دیگران می‌بیند.'},
 {id:'x1116',icon:'aggression',name:'دلاورِ میدان',gene:'aggression',desc:'در نبرد بر سر غذا بی‌باک جلو می‌رود و رقیب را می‌ترساند.'},
 {id:'x1117',icon:'lifespan',name:'بی‌باکِ طوفان',gene:'lifespan',desc:'از طوفان و صدای رعد نمی‌ترسد و آرام زندگی می‌کند.'},
 {id:'x1118',icon:'cooperation',name:'سپرِ گروه',gene:'cooperation',desc:'جلوی گروه می‌ایستد و از دیگران در برابر خطر محافظت می‌کند.'},
 {id:'x1119',icon:'aggression',name:'غرش‌کنِ شجاع',gene:'aggression',desc:'با غرش رقیب را می‌ترساند و سهم بیش‌تری از غذا می‌گیرد.'},
 {id:'x1120',icon:'aggression',name:'پیش‌قدمِ نبرد',gene:'aggression',desc:'نخستین کسی است که به نبرد می‌رود و شجاعتش گروه را تقویت می‌کند.'},
 {id:'x1121',icon:'speed',name:'ترس‌گریزِ چابک',gene:'speed',desc:'با دیدن خطر به‌سرعت فرار می‌کند و جانش را نجات می‌دهد.'},
 {id:'x1122',icon:'efficiency',name:'لرزانِ محتاط',gene:'efficiency',desc:'با احتیاط از خطر دوری می‌کند و کمتر آسیب می‌بیند.'},
 {id:'x1123',icon:'speed',name:'فراریِ تندپا',gene:'speed',desc:'به‌محض احساس خطر با سرعت می‌گریزد و زنده می‌ماند.'},
 {id:'x1124',icon:'speed',name:'پناه‌جویِ سریع',gene:'speed',desc:'زود پناهگاه امن را پیدا می‌کند و از خطر در امان می‌ماند.'},
 {id:'x1125',icon:'aggression',name:'جسورِ کوچک',gene:'aggression',desc:'با وجود جثه‌ی کوچک، جسورانه از غذای خود دفاع می‌کند.'},
 {id:'x1126',icon:'size',name:'میدان‌دارِ جسور',gene:'size',desc:'با جثه‌ی بزرگ و جسارت، میدان غذا را در دست می‌گیرد.'},
 {id:'x1127',icon:'cooperation',name:'هشداردهنده‌ی خطر',gene:'cooperation',desc:'با صدای هشدار، گروه را از خطر نزدیک باخبر می‌کند.'},
 {id:'x1128',icon:'cooperation',name:'سینه‌سپرِ بچه‌ها',gene:'cooperation',desc:'برای محافظت از بچه‌ها جلوی خطر می‌ایستد و جانش را به خطر می‌اندازد.'},
 {id:'x1129',icon:'size',name:'ایستاده در برابرِ غول',gene:'size',desc:'در برابر موجودات بزرگ‌تر عقب نمی‌نشیند و سهم خود را می‌گیرد.'},
 {id:'x1130',icon:'metabolism',name:'چرت‌زنِ نیمروزی',gene:'metabolism',desc:'نیمروز چرت می‌زند و انرژی‌اش را برای شکار عصر ذخیره می‌کند.'},
 {id:'x1131',icon:'lifespan',name:'خوابِ ژرفِ بهاری',gene:'lifespan',desc:'در بهار عمیق می‌خوابد و با انرژی کامل بیدار می‌شود.'},
 {id:'x1132',icon:'lifespan',name:'آرام‌خوابِ لانه',gene:'lifespan',desc:'در لانه آرام می‌خوابد و عمرش طولانی‌تر می‌شود.'},
 {id:'x1133',icon:'efficiency',name:'بیدارِ سحرخیز',gene:'efficiency',desc:'سحرخیز است و پیش از دیگران به غذا می‌رسد.'},
 {id:'x1134',icon:'metabolism',name:'خوابِ دو‌نوبته',gene:'metabolism',desc:'خوابش را به دو نوبت تقسیم می‌کند و همیشه سرحال است.'},
 {id:'x1135',icon:'efficiency',name:'استراحتِ کوتاهِ تند',gene:'efficiency',desc:'با استراحت‌های کوتاه و تند، سریع انرژی می‌گیرد.'},
 {id:'x1136',icon:'metabolism',name:'خمیازه‌کشِ همیشگی',gene:'metabolism',desc:'زیاد خمیازه می‌کشد و خوابش عمیق و ترمیم‌کننده است.'},
 {id:'x1137',icon:'coat',name:'خوابِ رویِ برگ',gene:'coat',desc:'روی برگ‌های نرم می‌خوابد و استتارش در خواب بهتر است.'},
 {id:'x1138',icon:'heatRes',name:'سایه‌خوابِ ظهر',gene:'heatRes',desc:'ظهر در سایه می‌خوابد و از گرمای کشنده در امان می‌ماند.'},
 {id:'x1139',icon:'coldRes',name:'خوابِ دسته‌جمعیِ گرم',gene:'coldRes',desc:'دسته‌جمعی می‌خوابد و گرمای گروه او را از سرما حفظ می‌کند.'},
 {id:'x1140',icon:'vision',name:'نیمه‌بیدارِ نگهبان',gene:'vision',desc:'نیمه‌بیدار می‌خوابد و کوچک‌ترین صدا را می‌شنود.'},
 {id:'x1141',icon:'efficiency',name:'خوابِ پرنده‌ای',gene:'efficiency',desc:'سبک و کوتاه می‌خوابد و زود بیدار می‌شود.'},
 {id:'x1142',icon:'coat',name:'خوابِ نرمِ علفزار',gene:'coat',desc:'در علفزار نرم می‌خوابد و رنگش با علف‌ها یکی می‌شود.'},
 {id:'x1143',icon:'vision',name:'رویایِ پروازِ شبانه',gene:'vision',desc:'در خواب پرواز می‌بیند و خوابش ژرف و آرام است.'},
 {id:'x1144',icon:'vision',name:'به‌خاطر‌سپارِ راه',gene:'vision',desc:'راه‌های امن را به‌خاطر می‌سپارد و هیچ‌وقت گم نمی‌شود.'},
 {id:'x1145',icon:'efficiency',name:'یادگیرِ تقلیدی',gene:'efficiency',desc:'با تقلید از بزرگ‌ترها مهارت‌های تازه را سریع یاد می‌گیرد.'},
 {id:'x1146',icon:'cooperation',name:'آموزنده‌ی بچه‌ها',gene:'cooperation',desc:'به بچه‌ها یاد می‌دهد کجا غذا هست و چگونه شکار کنند.'},
 {id:'x1147',icon:'vision',name:'فراموش‌ناپذیرِ دیده‌ها',gene:'vision',desc:'هر چه را دیده باشد فراموش نمی‌کند و از تجربه‌اش استفاده می‌کند.'},
 {id:'x1148',icon:'lifespan',name:'تمرین‌کنِ صبور',gene:'lifespan',desc:'با تمرین صبورانه مهارت‌هایش را کامل می‌کند و عمر طولانی‌تری دارد.'},
 {id:'x1149',icon:'efficiency',name:'اشتباه‌نکنِ دوباره',gene:'efficiency',desc:'اشتباه‌های گذشته را تکرار نمی‌کند و زودتر به غذا می‌رسد.'},
 {id:'x1150',icon:'vision',name:'نشانه‌خوانِ ردپا',gene:'vision',desc:'نشانه‌های ردپا را می‌خواند و مسیر غذا و خطر را می‌فهمد.'},
 {id:'x1151',icon:'cooperation',name:'حافظِ لانه‌ی امن',gene:'cooperation',desc:'جای لانه‌ی امن را به‌خاطر دارد و گروه را به آن برمی‌گرداند.'},
 {id:'x1152',icon:'lifespan',name:'یادآورِ فصل‌ها',gene:'lifespan',desc:'تغییر فصل‌ها را به‌خاطر دارد و برای سرما آماده می‌شود.'},
 {id:'x1153',icon:'vision',name:'چشمِ تیزِ مشاهده‌گر',gene:'vision',desc:'همه‌چیز را با دقت مشاهده می‌کند و نکته‌های مهم را به‌خاطر می‌سپارد.'},
 {id:'x1154',icon:'cooperation',name:'گوش‌سپارِ بزرگ‌ترها',gene:'cooperation',desc:'به حرف بزرگ‌ترها گوش می‌دهد و تجربه‌ی آن‌ها را یاد می‌گیرد.'},
 {id:'x1155',icon:'efficiency',name:'دفترِ ذهنیِ کوچک',gene:'efficiency',desc:'ذهنش مثل دفتر است؛ همه‌ی جای غذاها را در آن نوشته است.'},
 {id:'x1156',icon:'efficiency',name:'یادگیرِ شبانه',gene:'efficiency',desc:'شب‌ها یاد می‌گیرد و روزها از یادگرفته‌هایش استفاده می‌کند.'},
 {id:'x1157',icon:'cooperation',name:'خاطره‌سازِ گروه',gene:'cooperation',desc:'خاطره‌های مشترک می‌سازد و گروه را به هم نزدیک‌تر می‌کند.'},
 {id:'x1158',icon:'speed',name:'بالِ دور‌پرواز',gene:'speed',desc:'با بال‌های قوی مسافت‌های دور را می‌پیماید و به غذاهای تازه می‌رسد.'},
 {id:'x1159',icon:'speed',name:'راهِ دراز‌رو',gene:'speed',desc:'راه‌های دراز را خستگی‌ناپذیر می‌پیماید و دیرتر گرسنه می‌شود.'},
 {id:'x1160',icon:'efficiency',name:'کوچِ به‌موقع',gene:'efficiency',desc:'به‌موقع کوچ می‌کند و پیش از تمام‌شدن غذا جای تازه پیدا می‌کند.'},
 {id:'x1161',icon:'efficiency',name:'خانه‌به‌دوشِ سبک',gene:'efficiency',desc:'سبک سفر می‌کند و همه‌جا را خانه‌ی خود می‌داند.'},
 {id:'x1162',icon:'cooperation',name:'راهنمایِ کاروان',gene:'cooperation',desc:'کاروان را راهنمایی می‌کند و گروه را به آب و غذا می‌رساند.'},
 {id:'x1163',icon:'speed',name:'پیماینده‌ی دشت',gene:'speed',desc:'دشت‌ها را پیاده می‌پیماید و در راه غذا پیدا می‌کند.'},
 {id:'x1164',icon:'vision',name:'بازگشت‌کنِ دقیق',gene:'vision',desc:'راه برگشت به خانه را دقیق به‌خاطر دارد و هیچ‌وقت گم نمی‌شود.'},
 {id:'x1165',icon:'metabolism',name:'سفرِ بی‌خستگی',gene:'metabolism',desc:'در سفر کم انرژی مصرف می‌کند و دیر گرسنه می‌شود.'},
 {id:'x1166',icon:'efficiency',name:'جهان‌گردِ کوچک',gene:'efficiency',desc:'جهان را می‌گردد و در هر سرزمین خوراک تازه پیدا می‌کند.'},
 {id:'x1167',icon:'efficiency',name:'گذرنده‌ی پلِ چوبی',gene:'efficiency',desc:'از پل‌های چوبی و گذرگاه‌های باریک به‌آسانی عبور می‌کند.'},
 {id:'x1168',icon:'coldRes',name:'مسافرِ فصلِ سرد',gene:'coldRes',desc:'در فصل سرد سفر می‌کند و به سرما عادت کرده است.'},
 {id:'x1169',icon:'fertility',name:'کوچ‌نشینِ بهار',gene:'fertility',desc:'با بهار کوچ می‌کند و در سرزمین تازه بچه‌های بیش‌تری می‌آورد.'},
 {id:'x1170',icon:'metabolism',name:'بالِ خسته‌ناپذیر',gene:'metabolism',desc:'بال‌هایش خسته نمی‌شوند و پروازهای طولانی را تحمل می‌کند.'},
 {id:'x1171',icon:'vision',name:'ستاره‌یابِ کوچ',gene:'vision',desc:'با ستاره‌ها مسیر کوچ را پیدا می‌کند و هیچ‌وقت گم نمی‌شود.'},
 {id:'x1172',icon:'speed',name:'شناگرِ آبِ آرام',gene:'speed',desc:'در آب آرام ماهرانه شنا می‌کند و ماهی شکار می‌کند.'},
 {id:'x1173',icon:'vision',name:'غواصِ کم‌عمق',gene:'vision',desc:'در آب کم‌عمق غواصی می‌کند و خوراک‌های زیر آب را پیدا می‌کند.'},
 {id:'x1174',icon:'vision',name:'ماهی‌خوارِ تیزچشم',gene:'vision',desc:'با چشمان تیز ماهی‌ها را در آب می‌بیند و شکار می‌کند.'},
 {id:'x1175',icon:'speed',name:'باله‌زنِ تند',gene:'speed',desc:'با باله‌هایش تند شنا می‌کند و از خطرهای آب می‌گریزد.'},
 {id:'x1176',icon:'vision',name:'شیرجه‌زنِ دقیق',gene:'vision',desc:'با شیرجه‌ی دقیق به آب می‌رود و شکار را از دست نمی‌دهد.'},
 {id:'x1177',icon:'efficiency',name:'آب‌نوردِ آرام',gene:'efficiency',desc:'آرام روی آب حرکت می‌کند و انرژی‌اش را هدر نمی‌دهد.'},
 {id:'x1178',icon:'efficiency',name:'حباب‌سازِ بازیگوش',gene:'efficiency',desc:'با حباب‌ها بازی می‌کند و هوای بیش‌تری زیر آب نگه می‌دارد.'},
 {id:'x1179',icon:'speed',name:'موج‌سوارِ کوچک',gene:'speed',desc:'روی موج‌ها سوار می‌شود و سریع در آب جابه‌جا می‌شود.'},
 {id:'x1180',icon:'heatRes',name:'ساحل‌نشینِ آرام',gene:'heatRes',desc:'کنار ساحل آرام زندگی می‌کند و گرمای آفتاب را تحمل می‌کند.'},
 {id:'x1181',icon:'immunity',name:'باران‌دوستِ شناگر',gene:'immunity',desc:'زیر باران شنا می‌کند و از بیماری‌های آب در امان است.'},
 {id:'x1182',icon:'vision',name:'چشمه‌یابِ تشنه',gene:'vision',desc:'چشمه‌های آب را از دور پیدا می‌کند و هیچ‌وقت تشنه نمی‌ماند.'},
 {id:'x1183',icon:'coat',name:'گل‌آلودِ ماهر',gene:'coat',desc:'در گل و لای ماهرانه پنهان می‌شود و شکارچیان او را نمی‌بینند.'},
 {id:'x1184',icon:'cooperation',name:'سدسازِ کوچک',gene:'cooperation',desc:'با کمک گروه سد کوچکی می‌سازد و آب را نگه می‌دارد.'},
 {id:'x1185',icon:'metabolism',name:'آب‌خورِ صرفه‌جو',gene:'metabolism',desc:'آب را صرفه‌جویانه مصرف می‌کند و در خشکی دوام می‌آورد.'},
 {id:'x1186',icon:'efficiency',name:'ماهی‌گیرِ صبور',gene:'efficiency',desc:'با صبر کنار آب می‌نشیند و ماهی‌های بزرگ شکار می‌کند.'},
 {id:'x1187',icon:'vision',name:'چشمِ برقِ ماه',gene:'vision',desc:'در نور ماه همه‌چیز را واضح می‌بیند و شب‌ها شکار می‌کند.'},
 {id:'x1188',icon:'mask',name:'سایه‌دوستِ مهتاب',gene:'mask',desc:'در سایه‌ی مهتاب پنهان می‌شود و دیده نمی‌شود.'},
 {id:'x1189',icon:'vision',name:'نورِ سپیده‌دم',gene:'vision',desc:'با نخستین نور سپیده‌دم بیدار می‌شود و زود به غذا می‌رسد.'},
 {id:'x1190',icon:'vision',name:'تاریکی‌گریزِ سپیده',gene:'vision',desc:'از تاریکی می‌گریزد و به‌دنبال نور سپیده‌دم می‌رود.'},
 {id:'x1191',icon:'efficiency',name:'ستاره‌شمارِ کوچک',gene:'efficiency',desc:'ستاره‌ها را می‌شمارد و با آن‌ها جهت را پیدا می‌کند.'},
 {id:'x1192',icon:'lifespan',name:'ماهتابِ آرام',gene:'lifespan',desc:'زیر نور ماه آرام زندگی می‌کند و عمرش طولانی است.'},
 {id:'x1193',icon:'mask',name:'شب‌تابِ درخشان',gene:'mask',desc:'در تاریکی می‌درخشد و دیگران را به‌دنبال خود می‌کشاند.'},
 {id:'x1194',icon:'cooperation',name:'فانوسِ کوچکِ لانه',gene:'cooperation',desc:'مثل فانوس کوچک، راه لانه را برای گروه روشن می‌کند.'},
 {id:'x1195',icon:'vision',name:'چراغِ راهِ شب',gene:'vision',desc:'در شب مثل چراغ راه را نشان می‌دهد و گروه را هدایت می‌کند.'},
 {id:'x1196',icon:'mask',name:'سایه‌روِ بی‌صدا',gene:'mask',desc:'بی‌صدا در سایه‌ها حرکت می‌کند و شکارچیان او را نمی‌بینند.'},
 {id:'x1197',icon:'heatRes',name:'غروب‌نشینِ طلایی',gene:'heatRes',desc:'در نور طلایی غروب زندگی می‌کند و گرمای آن را دوست دارد.'},
 {id:'x1198',icon:'efficiency',name:'سپیده‌خوانِ سحر',gene:'efficiency',desc:'با خواندن سپیده‌دم گروه را بیدار می‌کند تا زود به غذا برسند.'},
 {id:'x1199',icon:'vision',name:'نورِ پنهانِ چشم',gene:'vision',desc:'در تاریکی چشم‌هایش برق می‌زند و راه را می‌بیند.'},
 {id:'x1200',icon:'vision',name:'تاریکِ روشن‌بین',gene:'vision',desc:'در تاریک‌ترین شب‌ها هم واضح می‌بیند و شکار می‌کند.'},
 {id:'x1201',icon:'coat',name:'نقاشِ خاک',gene:'coat',desc:'با رنگ‌های خاک بدن را می‌آراید تا در نمایش جفت‌یابی بدرخشد.'},
 {id:'x1202',icon:'mask',name:'بازیگرِ تقلیدگر',gene:'mask',desc:'حرکات دیگران را تقلید می‌کند و با نمایش توجه گروه را می‌گیرد.'},
 {id:'x1203',icon:'speed',name:'رقصنده‌ی باران',gene:'speed',desc:'با رقصی چابک پس از باران غذا پیدا می‌کند و گروه را همراه می‌کند.'},
 {id:'x1204',icon:'mask',name:'شعبده‌بازِ برگ',gene:'mask',desc:'با برگ‌ها ترفند نشان می‌دهد و شکارچی را گیج می‌کند.'},
 {id:'x1205',icon:'vision',name:'خط‌کشِ شن',gene:'vision',desc:'روی شن نقش می‌کشد و مسیر غذا را برای دیگران علامت می‌گذارد.'},
 {id:'x1206',icon:'coat',name:'رنگین‌نگارِ گل',gene:'coat',desc:'گل‌های رنگی روی بدنش می‌مالد تا در فصل جفت‌یابی دیده شود.'},
 {id:'x1207',icon:'mask',name:'چهره‌پردازِ برگ',gene:'mask',desc:'با برگ و گل چهره‌اش را می‌پوشاند و بی‌صدا نزدیک شکار می‌شود.'},
 {id:'x1208',icon:'efficiency',name:'رقصنده‌ی مهتاب',gene:'efficiency',desc:'زیر مهتاب می‌رقصد و با کمترین انرژی توجه جفت را جلب می‌کند.'},
 {id:'x1209',icon:'cooperation',name:'صحنه‌سازِ سنگ',gene:'cooperation',desc:'سنگ‌ها را به صحنه نمایش بدل می‌کند و گروه را دور هم جمع می‌کند.'},
 {id:'x1210',icon:'vision',name:'نقاشِ غار',gene:'vision',desc:'روی دیوار غار نقشه‌ی شکار می‌کشد تا دیگران راه را ببینند.'},
 {id:'x1211',icon:'speed',name:'پایکوبِ طوفان',gene:'speed',desc:'در طوفان هم می‌رقصد و سریع‌تر از همه به پناهگاه می‌رسد.'},
 {id:'x1212',icon:'mask',name:'نقاب‌سازِ چوب',gene:'mask',desc:'از چوب نقاب می‌سازد و با آن شکارچی را می‌ترساند.'},
 {id:'x1213',icon:'efficiency',name:'قاب‌سازِ صدف',gene:'efficiency',desc:'صدف‌ها را قاب می‌کند و با کمترین تلاش لانه را زیبا می‌کند.'},
 {id:'x1214',icon:'speed',name:'بندبازِ شاخه',gene:'speed',desc:'روی شاخه‌های نازک راه می‌رود و از جاهایی غذا می‌گیرد که دیگران نمی‌رسند.'},
 {id:'x1215',icon:'coat',name:'آرایشگرِ پر',gene:'coat',desc:'پرهای رنگی را مرتب می‌کند تا در نمایش جفت‌یابی بدرخشد.'},
 {id:'x1216',icon:'fertility',name:'آوازخوانِ سپیده',gene:'fertility',desc:'آواز سپیده‌دمش جفت‌ها را جذب می‌کند و شانس جفت‌یابی را بالا می‌برد.'},
 {id:'x1217',icon:'cooperation',name:'طبل‌زنِ باران',gene:'cooperation',desc:'با طبل زدن گروه را برای شکار دسته‌جمعی فرامی‌خواند.'},
 {id:'x1218',icon:'vision',name:'نغمه‌سازِ باد',gene:'vision',desc:'صدای باد را تقلید می‌کند و از دور محل غذا را پیدا می‌کند.'},
 {id:'x1219',icon:'efficiency',name:'سوت‌زنِ نگهبان',gene:'efficiency',desc:'با سوت خطر را خبر می‌دهد و گروه با کمترین تلفات فرار می‌کند.'},
 {id:'x1220',icon:'lifespan',name:'خواننده‌ی مهتاب',gene:'lifespan',desc:'آواز شبانه‌اش استرس گروه را کم می‌کند و عمرشان را دراز می‌کند.'},
 {id:'x1221',icon:'aggression',name:'طبل‌کوبِ رعد',gene:'aggression',desc:'با کوبیدن طبل رعدآسا دشمن را می‌ترساند و قلمرو را نگه می‌دارد.'},
 {id:'x1222',icon:'cooperation',name:'هم‌آوازِ گروه',gene:'cooperation',desc:'با گروه هم‌آواز می‌شود و هماهنگی شکار دسته‌جمعی را بیشتر می‌کند.'},
 {id:'x1223',icon:'metabolism',name:'نغمه‌خوانِ رود',gene:'metabolism',desc:'کنار رود آواز می‌خواند و با آرامش کمتر غذا می‌سوزاند.'},
 {id:'x1224',icon:'vision',name:'گوشِ تیزِ صدا',gene:'vision',desc:'ضعیف‌ترین صداها را از دور می‌شنود و زودتر از همه غذا را پیدا می‌کند.'},
 {id:'x1225',icon:'fertility',name:'ترانه‌سازِ بچه',gene:'fertility',desc:'برای بچه‌ها ترانه می‌خواند و آن‌ها را آرام می‌کند تا زودتر رشد کنند.'},
 {id:'x1226',icon:'cooperation',name:'طبل‌زنِ جشن',gene:'cooperation',desc:'در جشن‌های گروه طبل می‌زند و پیوند اعضا را محکم‌تر می‌کند.'},
 {id:'x1227',icon:'efficiency',name:'سوت‌زنِ راه',gene:'efficiency',desc:'با سوت مسیر غذا را به دیگران نشان می‌دهد و انرژی گروه را ذخیره می‌کند.'},
 {id:'x1228',icon:'aggression',name:'خواننده‌ی طوفان',gene:'aggression',desc:'در طوفان فریاد می‌زند و دشمن را از قلمرو دور می‌کند.'},
 {id:'x1229',icon:'lifespan',name:'زمزمه‌گرِ خواب',gene:'lifespan',desc:'زمزمه‌اش خواب گروه را عمیق می‌کند و عمرشان را درازتر می‌کند.'},
 {id:'x1230',icon:'vision',name:'پژواک‌خوانِ کوه',gene:'vision',desc:'با پژواک کوه فاصله‌ی شکار را می‌سنجد و دقیق‌تر شکار می‌کند.'},
 {id:'x1231',icon:'size',name:'چکش‌زنِ سنگ',gene:'size',desc:'با سنگ چکش می‌سازد و غذاهای سخت را می‌شکند.'},
 {id:'x1232',icon:'efficiency',name:'تبرسازِ چوب',gene:'efficiency',desc:'تبر چوبی می‌سازد و با کمترین تلاش شاخه‌های میوه‌دار را می‌برد.'},
 {id:'x1233',icon:'vision',name:'قلاب‌سازِ استخوان',gene:'vision',desc:'قلاب استخوانی می‌سازد و ماهی‌های دور از دسترس را صید می‌کند.'},
 {id:'x1234',icon:'aggression',name:'سنگ‌تراشِ تیز',gene:'aggression',desc:'سنگ را تیز می‌کند و در دعوا برنده می‌شود.'},
 {id:'x1235',icon:'efficiency',name:'سبدبافِ برگ',gene:'efficiency',desc:'سبد برگ می‌بافد و در یک بار غذای بیشتری حمل می‌کند.'},
 {id:'x1236',icon:'speed',name:'نیزه‌سازِ نی',gene:'speed',desc:'نیزه‌ی سبک می‌سازد و سریع‌تر از همه شکار می‌کند.'},
 {id:'x1237',icon:'heatRes',name:'آهنگرِ آتش',gene:'heatRes',desc:'کنار آتش ابزار می‌سازد و گرما را بهتر تحمل می‌کند.'},
 {id:'x1238',icon:'cooperation',name:'ریسنده‌ی علف',gene:'cooperation',desc:'از علف طناب می‌ریسد و ابزار گروه را محکم‌تر می‌کند.'},
 {id:'x1239',icon:'vision',name:'چنگک‌سازِ شاخ',gene:'vision',desc:'چنگک شاخی می‌سازد و میوه‌های بلند را پایین می‌کشد.'},
 {id:'x1240',icon:'size',name:'کوبه‌سازِ مهره',gene:'size',desc:'مهره‌های سنگی می‌کوبد و دانه‌های سخت را باز می‌کند.'},
 {id:'x1241',icon:'metabolism',name:'زنبیل‌بافِ نی',gene:'metabolism',desc:'زنبیل می‌بافد و غذا را ذخیره می‌کند تا در قحطی کمتر گرسنه بماند.'},
 {id:'x1242',icon:'efficiency',name:'اره‌سازِ صدف',gene:'efficiency',desc:'با صدف اره می‌سازد و با کمترین انرژی چوب را می‌برد.'},
 {id:'x1243',icon:'coldRes',name:'پتک‌زنِ یخ',gene:'coldRes',desc:'در سرما با پتک یخ می‌شکند و به آب و غذا می‌رسد.'},
 {id:'x1244',icon:'cooperation',name:'گره‌زنِ ماهر',gene:'cooperation',desc:'گره‌های محکم می‌زند و لانه‌ی گروه را در طوفان نگه می‌دارد.'},
 {id:'x1245',icon:'vision',name:'دام‌سازِ طناب',gene:'vision',desc:'دام طنابی می‌سازد و شکار را از دور به تله می‌اندازد.'},
 {id:'x1246',icon:'cooperation',name:'لانه‌سازِ شاخه',gene:'cooperation',desc:'لانه‌ی شاخه‌ای می‌سازد و گروه را در باران خشک نگه می‌دارد.'},
 {id:'x1247',icon:'aggression',name:'مرزبانِ سنگ',gene:'aggression',desc:'مرز قلمرو را با سنگ علامت می‌گذارد و بیگانه را دور می‌کند.'},
 {id:'x1248',icon:'efficiency',name:'خانه‌سازِ گل',gene:'efficiency',desc:'خانه‌ی گلی می‌سازد و با کمترین انرژی از سرما در امان می‌ماند.'},
 {id:'x1249',icon:'vision',name:'درخت‌نشینِ بلند',gene:'vision',desc:'بالای درخت لانه می‌سازد و از دور غذا و خطر را می‌بیند.'},
 {id:'x1250',icon:'size',name:'سنگ‌چینِ مرز',gene:'size',desc:'سنگ‌های بزرگ دور قلمرو می‌چیند و دشمن را عقب می‌راند.'},
 {id:'x1251',icon:'coldRes',name:'سقف‌سازِ برگ',gene:'coldRes',desc:'سقف برگ می‌سازد و لانه را در سرما گرم نگه می‌دارد.'},
 {id:'x1252',icon:'immunity',name:'غارنشینِ امن',gene:'immunity',desc:'در غار زندگی می‌کند و کمتر بیمار می‌شود.'},
 {id:'x1253',icon:'cooperation',name:'نگهبانِ درخت',gene:'cooperation',desc:'از درخت میوه‌دار گروه نگهبانی می‌دهد و سهم همه را می‌رساند.'},
 {id:'x1254',icon:'heatRes',name:'چادرنشینِ باد',gene:'heatRes',desc:'چادر سبک می‌زند و در گرمای بیابان هم خنک می‌ماند.'},
 {id:'x1255',icon:'vision',name:'دیده‌بانِ تپه',gene:'vision',desc:'روی تپه نگهبانی می‌دهد و خطر را زودتر از همه می‌بیند.'},
 {id:'x1256',icon:'metabolism',name:'لانه‌سازِ ماسه',gene:'metabolism',desc:'لانه‌ی ماسه‌ای می‌سازد و غذای ذخیره‌شده را دیرتر مصرف می‌کند.'},
 {id:'x1257',icon:'fertility',name:'خانه‌دارِ باغ',gene:'fertility',desc:'باغ کوچکی دور خانه می‌کارد و بچه‌ها همیشه غذا دارند.'},
 {id:'x1258',icon:'aggression',name:'دروازه‌بانِ قلمرو',gene:'aggression',desc:'دروازه‌ی قلمرو را نگه می‌دارد و در دعوا پیروز می‌شود.'},
 {id:'x1259',icon:'heatRes',name:'سایبان‌سازِ نی',gene:'heatRes',desc:'سایبان نی می‌سازد و در گرما سایه‌ی خنک برای گروه می‌سازد.'},
 {id:'x1260',icon:'coldRes',name:'پناه‌سازِ خاک',gene:'coldRes',desc:'پناهگاه خاکی می‌کند و در سرمای زمستان زنده می‌ماند.'},
 {id:'x1261',icon:'coat',name:'استتارگرِ برگ',gene:'coat',desc:'رنگ بدنش با برگ یکی می‌شود و شکارچی او را نمی‌بیند.'},
 {id:'x1262',icon:'mask',name:'مه‌آلودِ پنهان',gene:'mask',desc:'در مه ناپدید می‌شود و بی‌صدا به شکار نزدیک می‌شود.'},
 {id:'x1263',icon:'coat',name:'رنگ‌عوض‌کنِ ماسه',gene:'coat',desc:'رنگش با ماسه یکی می‌شود و در بیابان دیده نمی‌شود.'},
 {id:'x1264',icon:'mask',name:'برگ‌پوشِ جنگل',gene:'mask',desc:'خود را با برگ می‌پوشاند و در جنگل نامرئی می‌شود.'},
 {id:'x1265',icon:'vision',name:'سایه‌روِ شب',gene:'vision',desc:'در تاریکی مثل سایه حرکت می‌کند و شکار را غافلگیر می‌کند.'},
 {id:'x1266',icon:'coat',name:'پوستِ سنگی',gene:'coat',desc:'پوستش مثل سنگ می‌شود و دشمن او را با سنگ اشتباه می‌گیرد.'},
 {id:'x1267',icon:'mask',name:'دودِ پنهان',gene:'mask',desc:'مثل دود در هوا محو می‌شود و از دست شکارچی فرار می‌کند.'},
 {id:'x1268',icon:'speed',name:'خش‌خشِ برگ',gene:'speed',desc:'بی‌صدا روی برگ راه می‌رود و سریع‌تر از همه فرار می‌کند.'},
 {id:'x1269',icon:'vision',name:'چشمِ جداگانه',gene:'vision',desc:'چشم‌هایش جداگانه می‌چرخند و خطر را از هر سو می‌بینند.'},
 {id:'x1270',icon:'coat',name:'تاریک‌پوشِ غار',gene:'coat',desc:'بدنش در تاریکی غار سیاه می‌شود و کاملاً پنهان می‌ماند.'},
 {id:'x1271',icon:'efficiency',name:'مه‌سازِ صبح',gene:'efficiency',desc:'صبح مه می‌سازد و با کمترین انرژی از دید دشمن پنهان می‌شود.'},
 {id:'x1272',icon:'coat',name:'خاک‌پوشِ بیابان',gene:'coat',desc:'خاک روی بدنش می‌مالد و در بیابان با زمین یکی می‌شود.'},
 {id:'x1273',icon:'lifespan',name:'دمِ جداشونده',gene:'lifespan',desc:'دمش را جدا می‌کند و فرار می‌کند تا زنده بماند.'},
 {id:'x1274',icon:'speed',name:'شب‌روِ بی‌صدا',gene:'speed',desc:'شب بی‌صدا حرکت می‌کند و سریع‌تر از همه به غذا می‌رسد.'},
 {id:'x1275',icon:'mask',name:'غبارِ پنهان',gene:'mask',desc:'در غبار ناپدید می‌شود و شکارچی رد او را گم می‌کند.'},
 {id:'x1276',icon:'cooperation',name:'پرستارِ بچه',gene:'cooperation',desc:'از بچه‌های گروه مراقبت می‌کند و آن‌ها زودتر رشد می‌کنند.'},
 {id:'x1277',icon:'fertility',name:'شیرمادرِ مهربان',gene:'fertility',desc:'بچه‌های بیشتری را شیر می‌دهد و نسل گروه را بیشتر می‌کند.'},
 {id:'x1278',icon:'aggression',name:'نگهبانِ نوزاد',gene:'aggression',desc:'از نوزادان در برابر دشمن دفاع می‌کند و آن‌ها را زنده نگه می‌دارد.'},
 {id:'x1279',icon:'metabolism',name:'غذادهنده‌ی بچه',gene:'metabolism',desc:'غذایش را با بچه‌ها تقسیم می‌کند و آن‌ها کمتر گرسنه می‌مانند.'},
 {id:'x1280',icon:'efficiency',name:'آموزگارِ کوچک',gene:'efficiency',desc:'به بچه‌ها شکار یاد می‌دهد و آن‌ها با کمترین تلاش غذا پیدا می‌کنند.'},
 {id:'x1281',icon:'lifespan',name:'لالایی‌خوانِ بچه',gene:'lifespan',desc:'برای بچه‌ها لالایی می‌خواند و آن‌ها آرام‌تر و سالم‌تر می‌خوابند.'},
 {id:'x1282',icon:'speed',name:'بازی‌سازِ بچه',gene:'speed',desc:'با بچه‌ها بازی می‌کند و آن‌ها چابک‌تر و سریع‌تر رشد می‌کنند.'},
 {id:'x1283',icon:'coldRes',name:'گرم‌کننده‌ی آغوش',gene:'coldRes',desc:'در سرما بچه‌ها را در آغوش گرم می‌کند و آن‌ها زنده می‌مانند.'},
 {id:'x1284',icon:'vision',name:'راهنمایِ اولین قدم',gene:'vision',desc:'اولین قدم‌های بچه را راهنمایی می‌کند و آن‌ها راه غذا را زود یاد می‌گیرند.'},
 {id:'x1285',icon:'immunity',name:'محافظِ تخم',gene:'immunity',desc:'از تخم‌ها نگهبانی می‌دهد و بچه‌های سالم‌تری به دنیا می‌آیند.'},
 {id:'x1286',icon:'cooperation',name:'رهبرِ شکار',gene:'cooperation',desc:'شکار گروه را رهبری می‌کند و سهم غذا برای همه بیشتر می‌شود.'},
 {id:'x1287',icon:'vision',name:'پیشاهنگِ راه',gene:'vision',desc:'جلوتر از گروه راه می‌رود و مسیر غذا را زودتر پیدا می‌کند.'},
 {id:'x1288',icon:'size',name:'پادشاهِ قلمرو',gene:'size',desc:'بزرگ‌ترین عضو گروه است و در دعوا همیشه پیروز می‌شود.'},
 {id:'x1289',icon:'cooperation',name:'میانجیِ دعوا',gene:'cooperation',desc:'دعوای گروه را آرام می‌کند و اعضا کمتر همدیگر را می‌زنند.'},
 {id:'x1290',icon:'fertility',name:'تاج‌دارِ گروه',gene:'fertility',desc:'رهبر گروه است و با جفت‌های بیشتر نسلش را گسترده‌تر می‌کند.'},
 {id:'x1291',icon:'vision',name:'نگهبانِ عقب',gene:'vision',desc:'عقب گروه می‌ماند و خطر را از پشت سر می‌بیند.'},
 {id:'x1292',icon:'cooperation',name:'پیونددهنده‌ی گروه',gene:'cooperation',desc:'اعضای پراکنده را به گروه برمی‌گرداند و گروه قوی‌تر می‌ماند.'},
 {id:'x1293',icon:'aggression',name:'فرمانده‌ی طوفان',gene:'aggression',desc:'در طوفان گروه را فرماندهی می‌کند و دشمن را عقب می‌راند.'},
 {id:'x1294',icon:'efficiency',name:'جستجوگرِ راه',gene:'efficiency',desc:'راه‌های کوتاه غذا را پیدا می‌کند و انرژی گروه را ذخیره می‌کند.'},
 {id:'x1295',icon:'cooperation',name:'سهم‌دهنده‌ی عادل',gene:'cooperation',desc:'غذا را عادلانه تقسیم می‌کند و گروه کمتر دعوا می‌کند.'},
 {id:'x1296',icon:'lifespan',name:'جانشینِ رهبر',gene:'lifespan',desc:'وقتی رهبر می‌میرد جای او را می‌گیرد و گروه بی‌رهبر نمی‌ماند.'},
 {id:'x1297',icon:'vision',name:'دیده‌بانِ گروه',gene:'vision',desc:'از بالای درخت گروه را زیر نظر دارد و خطر را خبر می‌دهد.'},
 {id:'x1298',icon:'cooperation',name:'صلح‌سازِ قبیله',gene:'cooperation',desc:'بین دو گروه صلح می‌کند و جنگ و تلفات را کم می‌کند.'},
 {id:'x1299',icon:'lifespan',name:'پیرِ خردمند',gene:'lifespan',desc:'پیرترین عضو گروه است و تجربه‌اش عمر گروه را درازتر می‌کند.'},
 {id:'x1300',icon:'aggression',name:'پرچم‌دارِ گروه',gene:'aggression',desc:'پرچم گروه را بلند می‌کند و در نبرد اعضا شجاع‌تر می‌جنگند.'},
];
const NAME_A=['آرا','نیلا','کیان','سارا','داریوش','مهسا','آرش','نگار','پارسا','ترانه','رادین','یاسمین','بردیا','آیدا','سهراب','لیلا','کاوه','نازنین','ارشیا','ستاره'];
const NAME_B=['','‌نژاد','‌زاده','‌پور','‌فر','‌کیا'];
const SEASONS=[['بهار',0],['تابستان',91],['پاییز',182],['زمستان',273]];

/* ---------------- وضعیت ---------------- */
const S={
  running:true, speed:1, day:1, timeOfDay:8, // ساعت ۰ تا ۲۴
  view:'iso', // v27: نمای فعال — 'iso' (ایزومتریک سه‌بعدی) یا '2d' (دوبعدی)؛ ترجیح در localStorage
  agents:[], foods:[], parts:[], floaters:[], corpses:[],
  nextId:1, nextLineage:1, births:0, deaths:0, fights:0,
  deathsBy:{'گرسنگی':0,'پیری':0,'جنگ':0,'طاعون':0,'صاعقه':0,'شهاب':0,'خدا':0},
  droughtUntil:0, plagueActive:false, selected:null, follow:false, armed:null,
  customTraits:JSON.parse(localStorage.getItem('godsim-custom')||'[]'),
  historyPop:[], historyTraits:[], historyAllele:[], lastHist:0, elapsed:0, fps:60,
  mateSelected:null, pickMate:false, alleleGene:'speed',
  tribes:[], buildings:[], buildQueue:[], trees:[], stones:[], animals:[],
  families:[], battles:[], nextFamilyId:1, nextTribeId:1, nextBattleId:1, wildSpawnT:0,
  selTribe:0, placing:null, highlightTribe:null, nextBuildId:1, civAcc:0, civRenderT:0, breedT:0,
  selectedBuilding:null, tradeCount:0, tiles:null, roads:null, tileCounts:{},
  mutations:{neutral:0,beneficial:0,harmful:0},
  genetics:{matePref:'none',matePrefStrength:0.6},
  settings:{popCap:120,foodRate:6,foodEnergy:25,hungerRate:1,mutation:0.08,temperature:20,dayLength:60,fertility:1},
};
const WORLD_W=2400, WORLD_H=1800;
let W=WORLD_W,H=WORLD_H,DPR=1, foodAcc=0, statAcc=0, chartAcc=0;
let VW=800, VH=600;
const CAM={x:0,y:0,zoom:1,fitted:false};
const canvas=$('#world'), ctx=canvas.getContext('2d');
const canvas3d=$('#world3d'); // v27: بوم نمای ایزومتریک (Three.js) — جدا از بوم دوبعدی، چون یک بوم نمی‌تواند هم 2d باشد هم WebGL

/* ---------------- کش اسپرایت (پرفورمنس) ----------------
   ظاهر هر موجود (هاله + بدن + چشم‌ها) یک بار در یک بوم آفسکرین رندر می‌شود
   و در هر فریم فقط با drawImage کپی می‌شود — به‌جای ~۸ قوس در هر فریم.
   کلید کش: سطل رنگ (۲۴ سطل) × سطل جثه (۸ سطل) × تیره/روشن. */
const SPRITES=new Map();
let foodSpriteCache=null, bgGrad=null, bgPhase='';
function agentSprite(color,sizeVal,dark){ // v5: رنگ از قبیله می‌آید، نه از تبار — color یک رنگ CSS است (رنگ قبیله یا خاکستری خنثی)
  const sizeB=Math.round(sizeVal*7)/7;
  const key=color+'|'+sizeB+'|'+(dark?1:0);
  let s=SPRITES.get(key); if(s) return s;
  const r=5+sizeB*7, pad=r*1.7+2, px=Math.ceil(pad*2*DPR);
  const c=document.createElement('canvas'); c.width=px; c.height=px;
  const g=c.getContext('2d'); g.scale(DPR,DPR); g.translate(pad,pad);
  g.globalAlpha=0.28; g.fillStyle=dark?'#64748b':color;
  g.beginPath(); g.arc(0,0,r*1.7,0,Math.PI*2); g.fill(); g.globalAlpha=1;
  g.fillStyle=dark?'#1e293b':color;
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
  // v5: سیب واقعی — بدنه‌ی قرمز + ساقه + برگ، نه نقطه‌ی سبز
  g.fillStyle='rgba(239,68,68,.20)'; g.beginPath(); g.arc(0,0,r*2.1,0,Math.PI*2); g.fill();
  g.fillStyle='#ef4444'; g.beginPath(); g.arc(0,1,r,0,Math.PI*2); g.fill();
  g.strokeStyle='#7c2d12'; g.lineWidth=1.2; g.beginPath(); g.moveTo(0,-r+1); g.lineTo(1.5,-r-3.5); g.stroke();
  g.fillStyle='#22c55e'; g.beginPath(); g.ellipse(3.5,-r-1,2.6,1.4,-0.5,0,Math.PI*2); g.fill();
  g.fillStyle='#fecaca'; g.beginPath(); g.arc(-1.5,-0.5,r*0.3,0,Math.PI*2); g.fill();
  foodSpriteCache={c,pad,r}; return foodSpriteCache;
}
function skyGrad(){
  // v3: آسمان همیشه روز است — افکت بصری شب/روز حذف شده؛ فقط متن «شب/روز» و دما عوض می‌شود
  if(!bgGrad||bgPhase!=='day'){ bgPhase='day';
    const g=ctx.createLinearGradient(0,0,0,VH);
    g.addColorStop(0,'#0e2a24'); g.addColorStop(1,'#123a2a');
    bgGrad=g; }
  return bgGrad;
}

/* ---------------- ابزار جهان ---------------- */
function logEvent(text,kind=''){
  // دفتر رویدادها بدون ایموجی نمایش داده می‌شود (آیکون واقعی فقط در UI است)
  text=String(text).replace(/^(?:[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{2190}-\u{21FF}\u{2300}-\u{23FF}\u{25A0}-\u{25FF}\u{203C}\u{2049}\u{00A9}\u{00AE}]\s*)+/u,'');
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
    tribeId:null, job:null, manualJob:false, knowledge:rand(0,0.3),
    familyId:null, sexNeed:rand(0,40), loyalty:rand(30,70), opinion:rand(-1,1), foundCd:0,
    satisf:50, jailedUntil:0, protesting:false, // v5: رضایت از رهبر، زندان، اعتراض
    tribeSince:0, joinCd:0, // v5: مدت عضویت در قبیله، وقفه‌ی درخواست پیوستن
    equip:{weapon:null,shield:null,armor:null}, training:0, battleId:null, battleSide:0,
    inv:{wood:0,stone:0}, goal:'سرگردانی', harvestT:0, workT:0, raidCd:0, tradeT:0, target:null, patrol:null, raidTx:null, raidTy:null,
    energy:rand(55,90),health:100,age:0,lifespan:rand(2.6,4.2)*(0.6+base.lifespan),
    mateCd:rand(2,6),fightCd:0,plague:0,plagueT:0,dead:false,children:0,parentNames:'',
    wanderT:rand(0,2),tx:0,ty:0,targetFood:null};
}
function coatIsDark(a){
  // اپیستازی: ژن mask اگر فنوتیپ بالا داشته باشد، رنگ coat را می‌پوشاند
  return a.genes.mask>=0.6;
}
function spawnInitial(n){
  for(let i=0;i<n;i++){
    const a=makeAgent(rand(60,WORLD_W-60),rand(60,WORLD_H-60));
    a.tribeId=null; a.hue=Math.floor(rand(0,360));
    a.age=rand(0,0.5); // جمعیت اولیه جوان است — وقت کافی برای خانه‌سازی و بچه‌دار شدن پیش از پیری
    S.agents.push(a);
  }
  logEvent(n+' موجود در جهان آفریده شدند — هنوز هیچ قبیله‌ای نیست؛ افراد قوی می‌توانند قبیله بسازند.','good');
}
function spawnFood(x,y){
  S.foods.push({x:x??rand(16,W-16),y:y??rand(16,H-16),energy:S.settings.foodEnergy,pulse:rand(Math.PI*2),r:rand(4,6.5)});
}
function resetWorld(n){
  S.agents=[];S.foods=[];S.parts=[];S.floaters=[];S.corpses=[];S.selected=null;S.follow=false;S.selectedBuilding=null;S.tradeCount=0;
  S.tribes=[];S.families=[];S.battles=[];S.nextFamilyId=1;S.nextTribeId=1;S.nextBattleId=1;S.wildSpawnT=0;
  S.buildings=[];S.buildQueue=[];S.trees=[];S.stones=[];S.animals=[];
  S.tiles=new Int16Array(TW*TH); S.roads=new Uint8Array(TW*TH); S.tileCounts={}; // v5 (tiles): شبکه‌ی مالکیت
  S.nextBuildId=1;S.selTribe=0;S.placing=null;S.highlightTribe=null;S.civAcc=0;S.breedT=0;
  S.day=1;S.timeOfDay=8;S.births=0;S.deaths=0;S.fights=0;S.droughtUntil=0;S.plagueActive=false;
  S.deathsBy={'گرسنگی':0,'پیری':0,'جنگ':0,'طاعون':0,'صاعقه':0,'شهاب':0,'خدا':0};
  S.historyPop=[];S.historyTraits=[];S.historyAllele=[];S.elapsed=0;
  S.mutations={neutral:0,beneficial:0,harmful:0}; S.mateSelected=null; S.pickMate=false;
  createTribes(); spawnResources();
  for(let i=0;i<150;i++) spawnFood();
  spawnInitial(n||S.settings.popCap);
  $('#extinctBox').hidden=true; updateSelected(); updateBuildingCard();
}

/* ---------------- تمدن: قبایل، شغل‌ها، دانش، ساختمان ---------------- */
/* قبیله‌ها از اول وجود ندارند؛ افراد قوی با جمع کردن یار، قبیله می‌سازند */
const TRIBE_CULTURES=['موسیقی و آواز','داستان و اسطوره','رقص و نقاشی','شعر و حکمت','صنایع دستی','شکار و شجاعت'];
function leadershipOf(a){ return clamp(a.genes.aggression*0.3+a.genes.cooperation*0.25+a.genes.size*0.2+a.knowledge*0.25,0,1); }
/* ---------------- v5: دربار، رضایت از رهبر، اعتراض و انقلاب ----------------
   دربار: رهبر از میان اعضا چهار وزیر برمی‌گزیند؛ هر نقش اثر واقعی دارد.
   رضایت: هر عضو از رهبر راضی است یا نه — از اقتصاد و رویدادها تغذیه می‌شود و آهسته حرکت می‌کند.
   اعتراض: رضایت پایینِ ماندگار → معترضان دور خانه جمع می‌شوند و کار نمی‌کنند.
   انقلاب: اگر اوضاع بدتر شود، شورشیان رهبر را برمی‌دارند یا سرکوب می‌شوند. نادر است: وقفه‌های چندروزه. */
const COURT_ROLES={
  advisor:{name:'مشاور', effect:'پژوهش ۲۵٪ سریع‌تر'},
  minister:{name:'وزیر', effect:'برداشت و محصول مزرعه ۱۵٪ بیشتر'},
  general:{name:'سردار', effect:'قدرت جنگی جنگجویان ۱۵٪ بیشتر'},
  treasurer:{name:'خزانه‌دار', effect:'تجارت و فروش به کاروان ۱۰٪ سودآورتر'},
};
function courtMember(t,role){
  if(!t||!t.court) return null;
  const id=t.court[role]; if(!id) return null;
  const a=S.agents.find(x=>x.id===id);
  if(!a||a.dead||a.tribeId!==t.id) return null;
  if(a.jailedUntil&&S.day<a.jailedUntil) return null; // زندانی در دربار نمی‌ماند
  return a;
}
function courtScore(a,role){
  return role==='advisor'?a.knowledge
    : role==='minister'?a.genes.efficiency
    : role==='general'?a.genes.aggression*0.6+a.genes.size*0.4
    : a.genes.cooperation;
}
function appointCourt(t){
  if(!t.court) t.court={advisor:null,minister:null,general:null,treasurer:null};
  const taken=new Set();
  for(const role of Object.keys(COURT_ROLES)){
    const cur=courtMember(t,role);
    if(cur){ taken.add(cur.id); continue; }
    const prev=t.court[role]; t.court[role]=null;
    let best=null,bs=-1;
    for(const a of tribeMembers(t)){
      if(a.id===t.chiefId||taken.has(a.id)||a.age<0.4||a.dead) continue;
      if(a.jailedUntil&&S.day<a.jailedUntil) continue;
      const s=courtScore(a,role); if(s>bs){ bs=s; best=a; }
    }
    if(best){ t.court[role]=best.id; taken.add(best.id);
      if(prev&&prev!==best.id) logEvent(best.name+' '+COURT_ROLES[role].name+' تازه‌ی '+t.name+' شد.','good'); }
  }
}
function replaceCourtMember(t,role){
  if(!t||!t.court) return;
  const cur=courtMember(t,role);
  const taken=new Set(Object.values(t.court).filter(Boolean));
  if(cur) taken.delete(cur.id);
  let best=null,bs=-1;
  for(const a of tribeMembers(t)){
    if(a.id===t.chiefId||taken.has(a.id)||a.age<0.4||a.dead) continue;
    if(a.jailedUntil&&S.day<a.jailedUntil) continue;
    const s=courtScore(a,role); if(s>bs){ bs=s; best=a; }
  }
  if(best){ t.court[role]=best.id; logEvent(best.name+' به‌جای '+(cur?cur.name:'—')+' '+COURT_ROLES[role].name+' '+t.name+' شد.','god'); }
  else logEvent('در '+t.name+' نامزد دیگری برای '+COURT_ROLES[role].name+' نیست.','bad');
  renderCiv();
}
function researchBonus(t){ return courtMember(t,'advisor')?1.25:1; }
function gatherBonus(t){ return courtMember(t,'minister')?1.15:1; }
function warBonus(t){ return courtMember(t,'general')?1.15:1; }
function tradeBonus(t){ return courtMember(t,'treasurer')?1.1:1; }
function avgSatisf(t){ const m=tribeMembers(t); if(!m.length) return 50; return m.reduce((s,a)=>s+(a.satisf??50),0)/m.length; }
function satisfactionTick(t,dt){
  const m=tribeMembers(t); if(!m.length) return;
  const perCap=t.stock.food/m.length;
  let target=50;
  if(t.stock.food<=0) target-=20; else if(perCap>1.5) target+=15; else if(perCap>0.5) target+=5;
  if(t.stock.coins>30) target+=8; else if(t.stock.coins>10) target+=3;
  const net=(t.warWins||0)-(t.warLosses||0); target+=clamp(net*3,-9,9);
  if(S.elapsed<t.festivalUntil) target+=10;
  if(S.elapsed-(t.lastBuiltT||0)<S.settings.dayLength) target+=5;
  target-=Math.min(12,(t.recentDeaths||0)*2);
  if(t.protesting) target-=5;
  target=clamp(target,0,100);
  for(const a of m){ a.satisf=clamp((a.satisf??50)+(target-(a.satisf??50))*0.02,0,100); }
  t.recentDeaths=Math.max(0,(t.recentDeaths||0)-dt*0.01);
  // دربار را هر چند ثانیه تازه کن (مرگ یا ترک عضو = جانشین تازه)
  t.courtT=(t.courtT||0)+dt; if(t.courtT>5){ t.courtT=0; appointCourt(t); }
  // اعتراض و انقلاب — آستانه‌ها پایین و ماندگارند تا قبیله‌ی خوب تقریباً هیچ‌وقت شورش نکند
  t.protestCd=Math.max(0,(t.protestCd||0)-dt); t.revoltCd=Math.max(0,(t.revoltCd||0)-dt);
  const avg=avgSatisf(t);
  if(!t.protesting){
    if(avg<30&&(t.protestCd||0)<=0){ t.protestT=(t.protestT||0)+dt; if(t.protestT>=60) startProtest(t); }
    else t.protestT=0;
  } else {
    if(avg>45) endProtest(t,true);
    else { t.revoltT=(t.revoltT||0)+dt; if(t.revoltT>=90&&avg<20&&(t.revoltCd||0)<=0) startRevolution(t); }
  }
}
function startProtest(t){
  t.protesting=true; t.protestT=0; t.revoltT=0;
  const m=tribeMembers(t).filter(a=>a.id!==t.chiefId&&!a.dead&&a.age>=0.4&&!(a.jailedUntil&&S.day<a.jailedUntil));
  const rebels=m.filter(a=>(a.satisf??50)<35).sort((x,y)=>(x.satisf??50)-(y.satisf??50));
  const n=Math.max(1,Math.min(rebels.length,Math.ceil(m.length*0.4)));
  for(let i=0;i<n;i++) rebels[i].protesting=true;
  logEvent('اعتراض در '+t.name+' آغاز شد — ناراضیان دور خانه جمع شدند و کار را رها کردند.','bad');
}
function endProtest(t,calmed){
  t.protesting=false; t.revoltT=0; t.protestT=0; t.protestCd=3*S.settings.dayLength;
  for(const a of tribeMembers(t)) a.protesting=false;
  if(calmed) logEvent('اعتراض در '+t.name+' با بهتر شدن اوضاع آرام شد.','good');
}
function startRevolution(t){
  const rebels=tribeMembers(t).filter(a=>a.protesting&&!a.dead);
  if(!rebels.length){ endProtest(t,false); return; }
  const chief=chiefOf(t);
  const warriors=tribeMembers(t).filter(a=>!a.protesting&&(a.job==='warrior'||a.job==='guard')&&!a.dead);
  let chiefPower=warriors.length*(1+(warriors.reduce((s,a)=>s+(a.equip&&a.equip.weapon?WEAPONS[a.equip.weapon].atk:0),0)/Math.max(1,warriors.length))*0.2);
  for(const role of Object.keys(COURT_ROLES)){ const cm=courtMember(t,role); if(cm&&cm.loyalty>50) chiefPower+=1.5; }
  if(chief) chiefPower+=leadershipOf(chief)*2;
  const rebelPower=rebels.length*(1+rebels.reduce((s,a)=>s+a.genes.aggression,0)/Math.max(1,rebels.length))*rand(0.8,1.25);
  if(rebelPower>chiefPower*1.2){
    const nc=rebels.slice().sort((x,y)=>leadershipOf(y)-leadershipOf(x))[0];
    const oldChief=chief;
    if(oldChief){
      if(rebelPower>chiefPower*2){ killAgent(oldChief,'انقلاب'); logEvent('رهبر '+t.name+' در انقلاب کشته شد.','bad'); }
      else { oldChief.tribeId=null; oldChief.loyalty=50; oldChief.job=null; oldChief.protesting=false; logEvent('رهبر پیشین '+t.name+' تبعید شد و قبیله را ترک کرد.','bad'); }
    }
    if(nc&&!nc.dead){ t.chiefId=nc.id; t.stance=nc.opinion; nc.loyalty=100; }
    t.court={advisor:null,minister:null,general:null,treasurer:null}; appointCourt(t);
    endProtest(t,false);
    t.revoltCd=5*S.settings.dayLength;
    logEvent('انقلاب در '+t.name+' پیروز شد — '+(nc?nc.name:'—')+' رهبر تازه شد.','bad');
  } else {
    const jailed=[];
    for(const r of rebels.slice(0,Math.max(1,Math.ceil(rebels.length*0.3)))){ r.jailedUntil=S.day+2; r.protesting=false; jailed.push(r); }
    if(rebels.length>5){ const victim=rebels[rebels.length-1]; if(victim&&!jailed.includes(victim)&&!victim.dead) killAgent(victim,'سرکوب اعتراض'); }
    endProtest(t,false);
    t.revoltCd=5*S.settings.dayLength;
    logEvent('انقلاب در '+t.name+' سرکوب شد — '+fa(jailed.length)+' معترض زندانی شدند.','bad');
  }
}
function tribeJobsDefault(){ return {gatherer:6,woodcutter:3,miner:3,farmer:4,builder:3,warrior:3,guard:2,hunter:2,scholar:3,healer:2,trader:2,herder:2,blacksmith:2,cook:1,sexworker:2}; }
function newTribe(founder){
  const used=new Set(S.tribes.map(t=>t.name));
  const nm=TRIBE_NAMES.find(n=>!used.has('قبیله '+n))||('قبیله '+fa(S.nextTribeId));
  const color=TRIBE_COLORS[(S.nextTribeId-1)%TRIBE_COLORS.length];
  const hue=[38,190,150,0,270,25,200,50,140,320][(S.nextTribeId-1)%10];
  const t={id:S.nextTribeId++,name:'قبیله '+nm,color,hue,cultureName:pick(TRIBE_CULTURES),
    chiefId:founder.id,stance:founder.opinion,
    stock:{wood:10,stone:5,food:20,coins:0,meals:0},research:0,researchTarget:null,techs:{},culture:0,festivals:0,festivalUntil:0,
    relations:{},centre:{x:founder.x,y:founder.y},home:{x:founder.x,y:founder.y},relocT:rand(0,20),plantCd:0,plantedLogged:false,
    jobs:tribeJobsDefault(),tradeCd:0,warCd:0,armory:{weapon:{},shield:{},armor:{}},createdDay:S.day,
    /* v4: دیپلماسی و جنگ */
    allies:[], grievance:{}, truce:{}, warFatigue:0, needsBal:{food:0,wood:0,stone:0}, prevStock:null, needsT:0, needsNote:'',
    diplomacyT:rand(0,10), tradeLogT:0, siegeT:0,
    /* v5: دربار، رضایت، اعتراض و انقلاب */
    court:{advisor:null,minister:null,general:null,treasurer:null}, courtT:0,
    warWins:0, warLosses:0, recentDeaths:0, lastBuiltT:0,
    protesting:false, protestT:0, revoltT:0, protestCd:0, revoltCd:0,
    /* v5: فروپاشی قبیله‌ی ناتوان — مهلت یک روزه + هشدار اول */
    collapseT:0, collapseWarned:false, collapseDue:false, collapseReason:'',
    /* v5: طمع زمین، نفرت از زمین، جاده‌های بین‌قبیله‌ای */
    borderTension:{}, contested:{}, landGrudgeT:{}, interRoads:{}, claimCd:0, interRoadT:0};
  for(const o of S.tribes){ t.relations[o.id]=0; o.relations[t.id]=0; }
  return t;
}
function foundTribe(founder){
  if(!founder||founder.dead||founder.tribeId!=null) return null;
  // حداقل اندازه (در خودِ foundTribe هم چک می‌شود تا دکمه‌ی دستی هم نتواند قبیله‌ی کوچک بسازد):
  // رهبر + ۷ پیرو بالغ وفادار نزدیک — روی هم ۸ بزرگسال
  let followers=0;
  for(const o of S.agents){ if(o===founder||o.dead||o.tribeId!=null||o.age<0.4) continue;
    if((o.loyalty??50)>=40&&Math.hypot(o.x-founder.x,o.y-founder.y)<220) followers++; }
  if(followers<MIN_FOUND_ADULTS-1) return null;
  const t=newTribe(founder);
  // v5: قبیله‌ها با فاصله مستقر می‌شوند — خانه‌ی تازه دورترین نقطه‌ی ممکن از خانه‌ی قبیله‌های دیگر است
  const spot=pickTribeHome(founder); t.home={x:spot.x,y:spot.y}; t.centre={x:spot.x,y:spot.y};
  S.tribes.push(t);
  claimArea(t.home.x,t.home.y,3,t.id); // سرزمین اولیه: خانه‌های دور خانه
  founder.tribeId=t.id; founder.loyalty=100; founder.job='warrior'; founder.tribeSince=S.elapsed;
  let joined=0;
  for(const a of S.agents){
    if(a===founder||a.dead||a.tribeId!=null||a.age<0.4) continue;
    if(Math.hypot(a.x-founder.x,a.y-founder.y)<220){ a.tribeId=t.id; a.loyalty=60; a.tribeSince=S.elapsed; joined++; if(joined>=10) break; }
  }
  assignJobs(t);
  logEvent('قبیله «'+t.name+'» به رهبری '+founder.name+' تشکیل شد ('+fa(joined+1)+' عضو).','good');
  toast('قبیله «'+t.name+'» تشکیل شد!');
  return t;
}
const JOBS=[
  {id:'gatherer',icon:'gatherer',name:'جمع‌آور',desc:'چوب و سنگ جمع می‌کند'},
  {id:'woodcutter',icon:'woodcutter',name:'چوب‌بر',desc:'فقط درخت قطع می‌کند؛ چوب بیشتر'},
  {id:'miner',icon:'miner',name:'معدنچی',desc:'فقط سنگ استخراج می‌کند؛ سنگ بیشتر'},
  {id:'farmer',icon:'farm',name:'کشاورز',desc:'در مزرعه کار می‌کند'},
  {id:'builder',icon:'builder',name:'سازنده',desc:'ساختمان می‌سازد'},
  {id:'warrior',icon:'warrior',name:'جنگجو',desc:'گشت می‌زند و حمله می‌کند'},
  {id:'guard',icon:'guard',name:'نگهبان',desc:'از خانه و دیوار قبیله دفاع می‌کند'},
  {id:'hunter',icon:'hunter',name:'شکارچی',desc:'حیوانات وحشی را شکار می‌کند'},
  {id:'scholar',icon:'scholar',name:'دانشمند',desc:'پژوهش می‌کند'},
  {id:'healer',icon:'healer',name:'درمانگر',desc:'بیماران را درمان می‌کند'},
  {id:'trader',icon:'trader',name:'بازرگان',desc:'در بازار خرید و فروش می‌کند'},
  {id:'herder',icon:'herder',name:'دامدار',desc:'از حیوانات نگهداری می‌کند'},
  {id:'blacksmith',icon:'blacksmith',name:'آهنگر',desc:'در کارگاه سلاح و زره می‌سازد'},
  {id:'cook',icon:'cook',name:'آشپز',desc:'غذا را می‌پزد؛ غذای پخته انرژی بیشتری می‌دهد'},
  {id:'sexworker',icon:'sexworker',name:'روسپی',desc:'نیاز جنسی دیگران را برطرف می‌کند؛ گاهی بارداری خارج از خانواده رخ می‌دهد'},
];
const JOB_LIST=['gatherer','woodcutter','miner','farmer','builder','warrior','guard','hunter','scholar','healer','trader','herder','blacksmith','cook','sexworker'];
const BUILDINGS={
  house:{icon:'home',name:'خانه',wood:10,stone:5,desc:'سرپناه؛ شفا و مقاومت در سرما و گرما'},
  tent:{icon:'tent',name:'چادر',wood:2,stone:0,desc:'سرپناه موقت — فقط ۲ روز؛ تا خانه جور شود'},
  farm:{icon:'farm',name:'مزرعه',wood:8,stone:0,tech:'farming',desc:'کشاورز در آن غذا تولید می‌کند'},
  pasture:{icon:'pasture',name:'مرتع',wood:6,stone:0,tech:'herding',desc:'حیوانات اهلی در آن زندگی و غذا می‌دهند'},
  school:{icon:'school',name:'مدرسه',wood:15,stone:10,desc:'بچه‌ها درس می‌خوانند؛ پژوهش بیشتر'},
  university:{icon:'university',name:'دانشگاه',wood:25,stone:20,tech:'writing',desc:'پژوهش بزرگ؛ دانشمندان سریع‌تر یاد می‌گیرند'},
  hospital:{icon:'hospital',name:'بیمارستان',wood:20,stone:15,tech:'medicine',desc:'درمان سریع؛ مرگ طاعون کمتر'},
  market:{icon:'market',name:'بازار',wood:12,stone:8,tech:'money',desc:'بازرگانان اینجا خرید و فروش می‌کنند'},
  workshop:{icon:'workshop',name:'کارگاه',wood:10,stone:4,tech:'tools',desc:'ابزار بهتر؛ جمع‌آوری و ساخت سریع‌تر'},
  wall:{icon:'wall',name:'دیوار',wood:15,stone:8,tech:'wall',desc:'دور خانه‌ی قبیله؛ یورش کمتر موفق می‌شود و غارت کمتر می‌شود'},
  tower:{icon:'tower',name:'برج',wood:20,stone:15,tech:'wall',desc:'از دور به مهاجمان حمله می‌کند؛ دفاع خانه'},
  barracks:{icon:'barracks',name:'سربازخانه',wood:25,stone:15,tech:'woodsword',desc:'جنگجوها اینجا تمرین می‌کنند و قوی‌تر می‌شوند'},
  castle:{icon:'castle',name:'قلعه',wood:40,stone:30,tech:'wall',desc:'دژ مستحکم؛ سرزمین بزرگی دورش مال قبیله می‌شود و قلب آبادی تازه است'},
  command:{icon:'command',name:'مرکز فرماندهی',wood:30,stone:20,tech:'writing',desc:'هماهنگی جنگ و وفاداری بیشتر اعضا'},
  armory:{icon:'armory',name:'اسلحه‌خانه',wood:20,stone:15,tech:'copper',desc:'سلاح و زره ذخیره می‌شود؛ آهنگر اینجا بهتر می‌سازد'},
  /* v4: مغازه‌های شغلی — هر کدام اثر واقعی در شغل مربوطه دارد */
  bakery:{icon:'bakery',name:'نانوایی',wood:12,stone:6,tech:'pottery',desc:'آشپز اینجا دو برابر سریع‌تر می‌پزد؛ غذای پخته +۴۰ انرژی می‌دهد'},
  granary:{icon:'granary',name:'انبار غله',wood:10,stone:8,tech:'pottery',desc:'سقف غذای قبیله را ۱۵۰ تا بالا می‌برد'},
  smithy:{icon:'smithy',name:'آهنگری',wood:15,stone:10,tech:'copper',desc:'آهنگر اینجا دو برابر سریع‌تر می‌سازد'},
  butcher:{icon:'butcher',name:'قصابی',wood:8,stone:4,tech:'herding',desc:'هر شکار +۱۰ غذای بیشتر می‌دهد'},
  library:{icon:'library',name:'کتابخانه',wood:15,stone:10,tech:'writing',desc:'دانشمندان سریع‌تر یاد می‌گیرند؛ پژوهش بیشتر'},
  clinic:{icon:'clinic',name:'درمانگاه',wood:12,stone:8,tech:'medicine',desc:'درمانگر اینجا ۱٫۵ برابر سریع‌تر درمان می‌کند'},
  inn:{icon:'inn',name:'مهمانخانه',wood:10,stone:5,tech:'money',desc:'روسپی اینجا مشتری بیشتری دارد و دستمزد بیشتری می‌گیرد'},
};
/* v4: جان (HP) هر ساختمان — محاصره‌کننده‌ها به ساختمان حمله می‌کنند */
const BUILDING_HP={house:60,tent:20,farm:50,pasture:50,school:70,university:100,hospital:80,market:70,workshop:60,wall:140,tower:100,barracks:100,command:120,armory:100,bakery:60,granary:80,smithy:80,butcher:50,library:70,clinic:70,inn:60,castle:300};
function buildingHP(type,level){ return Math.round((BUILDING_HP[type]||60)*(1+0.5*((level||1)-1))); }
function newBuilding(tribeId,type,x,y,ownerFam){
  const b={id:S.nextBuildId++,type,x:clamp(x,30,WORLD_W-30),y:clamp(y,30,WORLD_H-30),tribeId:tribeId??null,progress:0,growth:0,milkT:0,createdAt:S.elapsed,ownerFamilyId:ownerFam||null,renterFamilyId:null,hp:BUILDING_HP[type]||60,maxHp:BUILDING_HP[type]||60,level:1};
  return b;
}
const TECHS=[
  {id:'fire',icon:'fire',name:'آتش',cost:20,age:0,requires:[],desc:'گرما و نور؛ در سرما کمتر می‌میرند'},
  {id:'tools',icon:'tools',name:'ابزار سنگی',cost:25,age:0,requires:[],desc:'جمع‌آوری چوب و سنگ ۵۰٪ سریع‌تر'},
  {id:'woodsword',icon:'woodsword',name:'شمشیر چوبی',cost:30,age:1,requires:['tools'],desc:'ساختن شمشیر چوبی و نیزه؛ سربازخانه باز می‌شود'},
  {id:'farming',icon:'farm',name:'کشاورزی',cost:40,age:1,requires:['tools'],desc:'ساختن مزرعه باز می‌شود'},
  {id:'herding',icon:'herding',name:'دامداری',cost:35,age:1,requires:[],desc:'ساختن مرتع و اهلی‌کردن حیوان'},
  {id:'pottery',icon:'pottery',name:'سفالگری',cost:30,age:1,requires:['fire'],desc:'انبار غذا؛ گرسنگی کمتر'},
  {id:'wall',icon:'wall',name:'دیوار',cost:45,age:1,requires:['tools'],desc:'ساختن دیوار و برج دفاعی'},
  {id:'copper',icon:'copper',name:'مس',cost:50,age:2,requires:['tools'],desc:'ابزار مسی؛ جنگجویان قوی‌تر'},
  {id:'bronze',icon:'bronze',name:'برنز',cost:70,age:2,requires:['copper'],desc:'جنگجویان و سازندگان قوی‌تر'},
  {id:'bow',icon:'bow',name:'کمان',cost:50,age:2,requires:['tools'],desc:'کمان و تیر؛ حمله از دور'},
  {id:'iron',icon:'iron',name:'آهن',cost:90,age:2,requires:['bronze'],desc:'بهترین ابزار؛ برداشت ۴۰٪ بیشتر'},
  {id:'wheel',icon:'wheel',name:'چرخ',cost:60,age:2,requires:['tools'],desc:'بازرگانان و حمل‌ونقل سریع‌تر'},
  {id:'armor',icon:'armor',name:'زره',cost:60,age:2,requires:['copper'],desc:'ساختن زره و سپر برنزی و آهنی'},
  {id:'writing',icon:'writing',name:'نوشتار',cost:80,age:3,requires:['farming'],desc:'ساختن دانشگاه؛ دانش ماندگار'},
  {id:'money',icon:'money',name:'پول',cost:90,age:3,requires:['writing','wheel'],desc:'ساختن بازار؛ تجارت با سکه'},
  {id:'medicine',icon:'medicine',name:'پزشکی',cost:85,age:3,requires:['writing'],desc:'ساختن بیمارستان؛ مرگ طاعون نصف'},
  {id:'math',icon:'math',name:'ریاضیات',cost:75,age:3,requires:['writing'],desc:'ساختن ۳۰٪ سریع‌تر'},
  {id:'schooling',icon:'schooling',name:'آموزش همگانی',cost:120,age:3,requires:['writing','medicine'],desc:'همه دو برابر سریع‌تر یاد می‌گیرند'},
];
const AGES=['عصر سنگ','عصر کشاورزی','عصر فلز','عصر دانش'];
/* سلاح، سپر و زره — هر ردیف بالاتر، فناوری بهتری می‌خواهد */
const WEAPONS={
  club:{name:'چوب‌دستی',icon:'wood',atk:1,wood:2,stone:0,coins:0,tech:null},
  stoneaxe:{name:'تبر سنگی',icon:'tools',atk:2,wood:2,stone:3,coins:0,tech:'tools'},
  spear:{name:'نیزه',icon:'spear',atk:2,wood:3,stone:1,coins:0,tech:'woodsword'},
  woodsword:{name:'شمشیر چوبی',icon:'woodsword',atk:2,wood:4,stone:0,coins:0,tech:'woodsword'},
  bow:{name:'کمان',icon:'bow',atk:3,wood:4,stone:0,coins:2,tech:'bow',ranged:true},
  copper:{name:'شمشیر مسی',icon:'sword',atk:4,wood:1,stone:0,coins:4,tech:'copper'},
  bronze:{name:'شمشیر برنزی',icon:'sword',atk:6,wood:1,stone:0,coins:8,tech:'bronze'},
  iron:{name:'شمشیر آهنی',icon:'sword',atk:8,wood:1,stone:0,coins:14,tech:'iron'},
};
const WEAPON_ORDER=['club','stoneaxe','spear','woodsword','bow','copper','bronze','iron'];
const SHIELDS={
  wood:{name:'سپر چوبی',icon:'shield',def:1,wood:3,stone:0,coins:0,tech:null},
  bronze:{name:'سپر برنزی',icon:'shield',def:2,wood:0,stone:0,coins:6,tech:'bronze'},
  iron:{name:'سپر آهنی',icon:'shield',def:3,wood:0,stone:0,coins:10,tech:'iron'},
};
const SHIELD_ORDER=['wood','bronze','iron'];
const ARMORS={
  leather:{name:'زره چرمی',icon:'armor',def:1,wood:0,stone:0,coins:3,tech:'herding'},
  bronze:{name:'زره برنزی',icon:'armor',def:2,wood:0,stone:0,coins:8,tech:'armor'},
  iron:{name:'زره آهنی',icon:'armor',def:3,wood:0,stone:0,coins:14,tech:'armor'},
};
const ARMOR_ORDER=['leather','bronze','iron'];
const TRIBE_NAMES=['شیر','عقاب','گرگ','خرس','پلنگ','شاهین','ببر','گوزن','روباه','مار','خورشید','ماه','ستاره','رود','کوه','جنگل','آتش','باد','طوفان','دریا'];
const TRIBE_COLORS=['#f59e0b','#22d3ee','#34d399','#f43f5e','#a78bfa','#fb923c','#38bdf8','#facc15','#4ade80','#f472b6'];
/* v4: سقف‌های نرم انبار پایین‌تر آمد تا انبارش بی‌پایان نباشد؛ انبار غله سقف غذا را بالا می‌برد */
const STOCK_CAP={wood:250,stone:200,food:400};
const COIN_CAP=300;
function foodCap(t){
  if(!t) return STOCK_CAP.food;
  let g=0; for(const b of S.buildings) if(b.tribeId===t.id&&b.type==='granary'&&b.progress>=100) g+=b.level||1;
  return STOCK_CAP.food+150*g;
}
function hasBuilding(t,type){ return S.buildings.some(b=>b.tribeId===t.id&&b.type===type&&b.progress>=100); }
function buildingLevel(t,type){ let l=0; for(const b of S.buildings) if(b.tribeId===t.id&&b.type===type&&b.progress>=100) l=Math.max(l,b.level||1); return l; }

function tribeById(id){ return S.tribes.find(t=>t.id===id); }
function tribeMembers(t){ return S.agents.filter(a=>!a.dead&&a.tribeId===t.id); }
function smallestTribe(){ if(!S.tribes.length) return null; let best=S.tribes[0]; for(const t of S.tribes) if(tribeMembers(t).length<tribeMembers(best).length) best=t; return best; }
function hasTech(t,id){ return !!(t&&t.techs[id]); }
function tribeAge(t){ let a=0; for(const id in t.techs){ const tc=TECHS.find(x=>x.id===id); if(tc) a=Math.max(a,tc.age);} return a; }
function availableTechs(t){ return TECHS.filter(tc=>!t.techs[tc.id]&&tc.requires.every(r=>t.techs[r])); }
function tribeCentre(t){ const m=tribeMembers(t); if(!m.length) return t.centre; let x=0,y=0; for(const a of m){x+=a.x;y+=a.y;} return {x:x/m.length,y:y/m.length}; }
function createTribes(){ S.tribes=[]; } // در ابتدای جهان هیچ قبیله‌ای نیست (قبیله‌ها ساخته می‌شوند)
function spawnResources(){
  S.trees=[];S.stones=[];S.animals=[];
  for(let i=0;i<140;i++) S.trees.push({x:rand(40,WORLD_W-40),y:rand(40,WORLD_H-40),amount:5,kind:'tree'});
  for(let i=0;i<65;i++) S.stones.push({x:rand(40,WORLD_W-40),y:rand(40,WORLD_H-40),amount:4,kind:'stone'});
  for(let i=0;i<18;i++) S.animals.push({x:rand(60,WORLD_W-60),y:rand(60,WORLD_H-60),kind:Math.random()<0.6?'sheep':'cow',tribeId:null,health:100,age:rand(0.2,1),wanderT:rand(0,2),angle:rand(Math.PI*2),dead:false,wild:false});
  for(let i=0;i<9;i++) S.animals.push({x:rand(60,WORLD_W-60),y:rand(60,WORLD_H-60),kind:'wolf',tribeId:null,health:80,age:rand(0.5,2),wanderT:rand(0,2),angle:rand(Math.PI*2),dead:false,wild:true,atkCd:0});
  for(let i=0;i<5;i++) S.animals.push({x:rand(60,WORLD_W-60),y:rand(60,WORLD_H-60),kind:'bear',tribeId:null,health:160,age:rand(0.5,3),wanderT:rand(0,2),angle:rand(Math.PI*2),dead:false,wild:true,atkCd:0});
}
function jobScore(a,job){
  const g=a.genes;
  switch(job){
    case 'gatherer': return g.vision*0.6+g.efficiency*0.4;
    case 'farmer': return g.fertility*0.5+g.cooperation*0.5;
    case 'builder': return g.size*0.5+g.efficiency*0.5;
    case 'warrior': return g.aggression*0.6+g.size*0.4;
    case 'scholar': return g.vision*0.5+a.knowledge*0.5;
    case 'healer': return g.cooperation*0.6+g.immunity*0.4;
    case 'trader': return g.efficiency*0.5+g.cooperation*0.5;
    case 'herder': return g.fertility*0.5+g.vision*0.5;
    case 'woodcutter': return g.size*0.5+g.efficiency*0.5;
    case 'miner': return g.size*0.6+g.efficiency*0.4;
    case 'hunter': return g.vision*0.5+g.speed*0.3+g.aggression*0.2;
    case 'guard': return g.aggression*0.5+g.size*0.3+g.cooperation*0.2;
    case 'blacksmith': return g.efficiency*0.5+g.size*0.3+a.knowledge*0.2;
    case 'cook': return g.cooperation*0.5+g.efficiency*0.5;
    case 'sexworker': return g.cooperation*0.5+g.fertility*0.5;
  } return 0;
}
function assignJobs(t){
  const members=tribeMembers(t).filter(a=>a.age>=0.4&&!a.dead);
  // بازتوزیع کامل در هر فراخوانی (به‌جز شغل دستی کاربر و شغل رهبر): شغل‌ها چسبنده نیستند،
  // چون چسبندگی باعث می‌شد شغل‌های اولِ فهرست همه‌ی اعضا را بگیرند و شغل‌های آخر (آهنگر، آشپز…)
  // با وجود سهمیه و کارگرِ در دسترس همیشه صفر بمانند.
  for(const a of members){ if(!a.manualJob&&a.id!==t.chiefId) a.job=null; }
  const counts={}; JOB_LIST.forEach(j=>counts[j]=0);
  for(const a of members) if(a.job) counts[a.job]=(counts[a.job]||0)+1;
  // اولویت با شغل‌های حیاتی (دانشمند، سازنده) — قبیله‌ی بدون دانشمند هرگز فناوری نمی‌گیرد.
  // آهنگر و آشپز بلافاصله بعد از شغل‌های حیاتی می‌آیند: شغل‌های تولیدی‌اند (سلاح و غذای پخته)
  // و اگر تهِ فهرست باشند، قبیله‌های کوچکِ ۹ تا ۱۲ نفره هیچ‌وقت به آن‌ها نمی‌رسند.
  const PRIORITY=['scholar','builder','farmer','healer','blacksmith','cook','gatherer','woodcutter','miner','warrior','guard','hunter','herder','trader','sexworker'];
  // دوربه‌دور: در هر دور حداکثر یک نفر به هر شغلِ زیر سهمیه می‌رسد (بهترین امتیاز ژن اول)؛
  // پس هیچ شغلی پیش از آنکه همه‌ی شغل‌ها یک نفر گرفته باشند، نفر دوم نمی‌گیرد.
  let progress=true;
  while(progress){
    progress=false;
    for(const job of PRIORITY){
      if(counts[job]>=(t.jobs[job]||0)) continue;
      const pool=members.filter(a=>!a.job);
      if(!pool.length) break;
      // روسپی: اکثراً ماده — امتیاز جنسی فقط همین‌جا اعمال می‌شود، نه در jobScore
      // (وگرنه در انتخاب شغل بی‌قبیله‌ها هم روسپی بر همه‌ی شغل‌ها غلبه می‌کرد)
      const swScore=a=>jobScore(a,job)+(job==='sexworker'?(a.sex==='♀'?0.6:-0.2):0);
      pool.sort((x,y)=>swScore(y)-swScore(x));
      pool[0].job=job; counts[job]++; progress=true;
    }
  }
  for(const a of members) if(!a.job) a.job='gatherer';
}
function moveToward(a,tx,ty,dt,speed){
  const dx=tx-a.x,dy=ty-a.y,d=Math.hypot(dx,dy);
  if(d<8) return true;
  const step=Math.min(d,speed*dt); // هرگز از هدف رد نمی‌شویم — وگرنه دور هدف نوسان می‌کند و هیچ‌وقت نمی‌رسد
  a.x+=dx/d*step; a.y+=dy/d*step; a.angle=Math.atan2(dy,dx);
  return false;
}
function nearestResource(a){
  let best=null,bd=Infinity;
  for(const r of S.trees){ const d=(r.x-a.x)**2+(r.y-a.y)**2; if(d<bd){bd=d;best=r;} }
  for(const r of S.stones){ const d=(r.x-a.x)**2+(r.y-a.y)**2; if(d<bd){bd=d;best=r;} }
  return best;
}
function nearestAnimal(a,maxD){
  let best=null,bd=maxD*maxD;
  for(const an of S.animals){ if(an.dead) continue; const d=(an.x-a.x)**2+(an.y-a.y)**2; if(d<bd){bd=d;best=an;} }
  return best;
}
function killAnimal(an,a){
  an.dead=true; a.energy=clamp(a.energy+25,0,100); a.goal='شکار حیوان';
  burst(an.x,an.y,'#fb7185',10,70); floater(an.x,an.y-14,'شکار','#fda4af');
}
function nearestAgentOfTribe(t,x,y,maxD){
  let best=null,bd=maxD*maxD;
  for(const a of S.agents){ if(a.dead||a.tribeId!==t.id) continue; const d=(a.x-x)**2+(a.y-y)**2; if(d<bd){bd=d;best=a;} }
  return best;
}
function warTarget(t){ for(const o of S.tribes){ if(o.id!==t.id&&!isAlly(t,o)&&!inTruce(t,o)&&(t.relations[o.id]??0)<-50) return o; } return null; }
/* ---------------- v4: دیپلماسی، اتحاد، محاصره و اشغال ---------------- */
function isAlly(t,o){ return !!(t&&o&&(t.allies||[]).includes(o.id)); }
function inTruce(t,o){ return !!(t&&o&&((t.truce||{})[o.id]||0)>S.day); }
function atWarWith(t,o){ return !!(t&&o&&S.battles.some(b=>(b.t1===t.id&&b.t2===o.id)||(b.t1===o.id&&b.t2===t.id))); }
function chiefOf(t){ return t?S.agents.find(a=>a.id===t.chiefId&&!a.dead):null; }
/* v5 (tiles): جهان شبکه‌ی خانه‌های ۵۰ پیکسلی است؛ سرزمین = مجموعه‌ی خانه‌های مالکیت‌دار */
const TILE=50, TW=Math.round(WORLD_W/TILE), TH=Math.round(WORLD_H/TILE);
const MIN_TRIBE_DIST=400; // کمترین فاصله‌ی مطلوب بین خانه‌ی دو قبیله
function tileIndex(tx,ty){ return ty*TW+tx; }
function tileAt(x,y){ return {tx:clamp(Math.floor(x/TILE),0,TW-1), ty:clamp(Math.floor(y/TILE),0,TH-1)}; }
function tileCenter(tx,ty){ return {x:tx*TILE+TILE/2, y:ty*TILE+TILE/2}; }
function tileOwnerAt(x,y){ const t=tileAt(x,y); return (S.tiles&&S.tiles[tileIndex(t.tx,t.ty)])||0; }
function claimTile(tx,ty,tribeId){
  if(tx<0||ty<0||tx>=TW||ty>=TH) return false;
  const i=tileIndex(tx,ty), prev=S.tiles[i];
  if(prev===tribeId) return true;
  if(prev) S.tileCounts[prev]=Math.max(0,(S.tileCounts[prev]||0)-1);
  S.tiles[i]=tribeId;
  if(tribeId) S.tileCounts[tribeId]=(S.tileCounts[tribeId]||0)+1;
  return true;
}
function claimArea(cx,cy,r,tribeId){
  const c=tileAt(cx,cy);
  for(let dy=-r;dy<=r;dy++) for(let dx=-r;dx<=r;dx++){
    if(dx*dx+dy*dy>r*r+1) continue;
    claimTile(c.tx+dx,c.ty+dy,tribeId);
  }
}
/* هر ساختمانِ کامل‌شده چقدر سرزمین می‌گیرد (شعاع به خانه) */
const BUILDING_CLAIM={house:1,tent:0,farm:1,pasture:1,school:1,university:2,hospital:1,market:2,workshop:1,wall:0,tower:2,barracks:1,command:2,armory:1,bakery:1,granary:1,smithy:1,butcher:1,library:1,clinic:1,inn:1,castle:4};
function claimForBuilding(b){
  const r=BUILDING_CLAIM[b.type]||0;
  if(r>0) claimArea(b.x,b.y,r,b.tribeId);
  else { const t=tileAt(b.x,b.y); claimTile(t.tx,t.ty,b.tribeId); }
}
function recomputeTerritory(t){
  if(!t) return;
  S.tileCounts[t.id]=0;
  for(let i=0;i<S.tiles.length;i++) if(S.tiles[i]===t.id) S.tiles[i]=0;
  claimArea(t.home.x,t.home.y,3,t.id);
  for(const b of S.buildings) if(b.tribeId===t.id&&b.progress>=100) claimForBuilding(b);
}
function tribeTiles(t){ return (S.tileCounts&&S.tileCounts[t.id])||0; }
function tileList(t){ const out=[]; for(let i=0;i<S.tiles.length;i++) if(S.tiles[i]===t.id) out.push(i); return out; }
function randomOwnedPoint(t){
  const list=tileList(t); if(!list.length) return null;
  const i=list[Math.floor(Math.random()*list.length)];
  return {x:(i%TW)*TILE+TILE/2+rand(-15,15), y:Math.floor(i/TW)*TILE+TILE/2+rand(-15,15)};
}
function nearestOwnedPoint(t,x,y){
  let best=null,bd=Infinity;
  for(let i=0;i<S.tiles.length;i++){ if(S.tiles[i]!==t.id) continue; const cx=(i%TW)*TILE+TILE/2, cy=Math.floor(i/TW)*TILE+TILE/2; const d=(cx-x)*(cx-x)+(cy-y)*(cy-y); if(d<bd){bd=d;best={x:cx,y:cy};} }
  return best||{x:t.home.x,y:t.home.y};
}
function nearestRival(t){
  let best=null,bd=Infinity;
  for(const o of S.tribes){ if(o.id===t.id) continue; const d=Math.hypot(t.home.x-o.home.x,t.home.y-o.home.y); if(d<bd){bd=d;best=o;} }
  return best?{o:best,d:bd}:null;
}
function territoryDist(t,o){ // کمترین فاصله‌ی لبه‌به‌لبه‌ی سرزمین‌ها (کش‌شده در civTick)
  if(t.terrDist&&t.terrDist[o.id]!=null) return t.terrDist[o.id];
  return Math.hypot(t.home.x-o.home.x,t.home.y-o.home.y);
}
function updateTerritoryDistances(){
  for(const t of S.tribes){
    t.terrDist=t.terrDist||{};
    for(const o of S.tribes){
      if(o.id===t.id) continue;
      const A=tileList(t), B=tileList(o);
      let md=Infinity;
      for(const ia of A){ const ax=(ia%TW)*TILE+TILE/2, ay=Math.floor(ia/TW)*TILE+TILE/2;
        for(const ib of B){ const bx=(ib%TW)*TILE+TILE/2, by=Math.floor(ib/TW)*TILE+TILE/2;
          const d=Math.hypot(ax-bx,ay-by); if(d<md) md=d; } }
      t.terrDist[o.id]=(A.length&&B.length)?Math.max(0,md-TILE):Math.hypot(t.home.x-o.home.x,t.home.y-o.home.y);
    }
  }
}
function distBonus(t){ const nr=nearestRival(t); if(!nr) return 0; const d=territoryDist(t,nr.o); return 0.25*Math.max(0,1-d/1000); } // نزدیکی سرزمین‌ها تا +۰٫۲۵ تمایل به جنگ
/* v5: طمع زمین، نفرت از زمین، جنگ بر سر زمین — قبیله‌ها زمین می‌خواهند، از تصاحب زمین نزدیک مرز خشمگین می‌شوند، و برنده‌ی جنگ زمین می‌گیرد */
function territoryCap(t){ const towers=S.buildings.filter(b=>b.tribeId===t.id&&(b.type==='tower'||b.type==='castle')&&b.progress>=100).length; return 60+tribeMembers(t).length*4+towers*15; } // سقف سرزمین با جمعیت و برج‌ها بالا می‌رود — بی‌نهایت نیست
function claimCostAt(t,x,y){ const d=Math.hypot(x-t.home.x,y-t.home.y); return {wood:1+(d>600?1:0),stone:d>400?1:0}; } // هرچه دورتر از خانه، گران‌تر
function tileDefense(t,x,y){ let d=0; for(const b of S.buildings){ if(b.tribeId!==t.id||b.progress<100) continue; if(b.type==='tower'&&Math.hypot(b.x-x,b.y-y)<250) d+=2; if(b.type==='castle'&&Math.hypot(b.x-x,b.y-y)<300) d+=3; if(b.type==='wall'&&Math.hypot(b.x-x,b.y-y)<150) d+=1; } for(const a of S.agents){ if(a.dead||a.tribeId!==t.id||(a.job!=='warrior'&&a.job!=='guard')) continue; if(Math.hypot(a.x-x,a.y-y)<150) d+=1; } return d; } // دفاع یک خانه از برج و قلعه و دیوار و نگهبانان نزدیکش
function contestedTiles(t,o){ let n=0; for(let i=0;i<S.tiles.length;i++){ if(S.tiles[i]!==0) continue; const tx=i%TW, ty=Math.floor(i/TW); let aT=false,bT=false; for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=tx+dx,ny=ty+dy; if(nx<0||ny<0||nx>=TW||ny>=TH) continue; const ow=S.tiles[ny*TW+nx]; if(ow===t.id) aT=true; if(ow===o.id) bT=true; } if(aT&&bT) n++; } return n; } // خانه‌های بی‌صاحبِ چسبیده به سرزمین هر دو — هر دو می‌خواهندشان
function borderTensionTick(dt){
  for(const t of S.tribes){
    t.borderTension=t.borderTension||{}; t.contested=t.contested||{}; t.landGrudgeT=t.landGrudgeT||{};
    for(const o of S.tribes){
      if(o.id===t.id) continue;
      const d=territoryDist(t,o), cont=contestedTiles(t,o);
      t.contested[o.id]=cont;
      let ten=t.borderTension[o.id]||0;
      if(d<50) ten+=dt*2; else if(d<100) ten+=dt*0.8; else if(d>300) ten-=dt*1; else ten-=dt*0.2;
      ten+=cont*dt*0.15; // هر خانه‌ی مورد مناقشه تنش را بالا می‌برد
      t.borderTension[o.id]=clamp(ten,0,100);
      // کینه‌ی زمین: هر روزِ تنشِ بالای ۵۰، +۲ کینه
      if(t.borderTension[o.id]>50){ t.landGrudgeT[o.id]=(t.landGrudgeT[o.id]||0)+dt; if(t.landGrudgeT[o.id]>=S.settings.dayLength){ t.landGrudgeT[o.id]=0; addGrievance(t,o,2); logEvent('تنش مرزی '+t.name+' و '+o.name+' بالا گرفت — هر دو بر سر زمین با هم دشمن‌اند.','bad'); } }
      else t.landGrudgeT[o.id]=0;
    }
  }
}
function landProvocation(claimer,x,y){
  // تصاحب زمین چسبیده به سرزمین رقیبِ غیر دوست، تحریک است — کینه +۳ (با وقفه، تا اسپم نشود)
  for(const o of S.tribes){
    if(o.id===claimer.id||isAlly(claimer,o)||(claimer.relations[o.id]||0)>0) continue;
    let near=false;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ if(tileOwnerAt(x+dx*TILE,y+dy*TILE)===o.id){ near=true; break; } }
    if(!near) continue;
    claimer.landProvT=claimer.landProvT||{};
    if(S.elapsed-(claimer.landProvT[o.id]||0)<30) continue;
    claimer.landProvT[o.id]=S.elapsed;
    addGrievance(o,claimer,3);
    logEvent(claimer.name+' زمینی چسبیده به مرز '+o.name+' را تصاحب کرد — '+o.name+' خشمگین شد!','bad');
  }
}
function transferWarSpoils(win,lose){
  if(!win||!lose) return 0;
  let taken=0;
  const takeTile=i=>{ S.tiles[i]=win.id; S.tileCounts[win.id]=(S.tileCounts[win.id]||0)+1; S.tileCounts[lose.id]=Math.max(0,(S.tileCounts[lose.id]||0)-1); taken++; };
  // اول: خانه‌های بازنده که چسبیده به سرزمین برنده‌اند (نوار مرزی) — ولی نه آن‌هایی که خوب دفاع می‌شوند
  for(const i of tileList(lose)){
    const tx=i%TW, ty=Math.floor(i/TW);
    let adj=false;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=tx+dx,ny=ty+dy; if(nx>=0&&ny>=0&&nx<TW&&ny<TH&&S.tiles[ny*TW+nx]===win.id){ adj=true; break; } }
    if(!adj) continue;
    if(tileDefense(lose,tx*TILE+TILE/2,ty*TILE+TILE/2)>=4) continue; // سنگر خوب دفاع‌شده نمی‌افتد
    takeTile(i);
  }
  // بعد: تا ۱۲ خانه‌ی دیگرِ بازنده، نزدیک‌ترین‌ها به خانه‌ی برنده
  if(taken<12){
    const rest=tileList(lose).map(i=>({i,d:Math.hypot((i%TW)*TILE+TILE/2-win.home.x,Math.floor(i/TW)*TILE+TILE/2-win.home.y)})).sort((x,y)=>x.d-y.d);
    for(const r of rest){ if(taken>=12) break; if(tileDefense(lose,(r.i%TW)*TILE+TILE/2,Math.floor(r.i/TW)*TILE+TILE/2)>=4) continue; takeTile(r.i); }
  }
  if(taken>0){
    addGrievance(lose,win,10); // باختن زمین کینه‌ی انتقام می‌سازد
    logEvent('قبیله «'+win.name+'» در جنگ زمین‌های قبیله «'+lose.name+'» را تصاحب کرد ('+fa(taken)+' خانه).','bad');
  }
  return taken;
}
function foreignTerritoryAt(x,y,ownId){
  const owner=tileOwnerAt(x,y);
  if(!owner||owner===ownId) return null;
  return tribeById(owner);
}
function pickTribeHome(founder){
  // بیشینه‌ی کمترین فاصله تا خانه‌ی قبیله‌های دیگر (max-min)؛ نزدیک بنیان‌گذار می‌مانیم (حداکثر ~۲۸۰ پیکسل)
  // حلقه‌ی دور هم نمونه می‌گیریم (۳۰۰ تا ۷۰۰ پیکسل): اگر نزدیک بنیان‌گذار جای کافی نیست، خانه دورتر ساخته می‌شود
  // تا قبیله‌ی تازه دست‌کم ۳۵۰ پیکسل از قبیله‌های دیگر فاصله بگیرد
  let best={x:founder.x,y:founder.y}, bestD=-1;
  const cands=[{x:founder.x,y:founder.y}];
  for(let i=0;i<24;i++){ const ang=rand(Math.PI*2), rr=60+rand(0,220);
    cands.push({x:clamp(founder.x+Math.cos(ang)*rr,60,WORLD_W-60), y:clamp(founder.y+Math.sin(ang)*rr,60,WORLD_H-60)}); }
  for(let i=0;i<24;i++){ const ang=rand(Math.PI*2), rr=300+rand(0,400);
    cands.push({x:clamp(founder.x+Math.cos(ang)*rr,60,WORLD_W-60), y:clamp(founder.y+Math.sin(ang)*rr,60,WORLD_H-60)}); }
  for(const c of cands){
    let md=Infinity;
    for(const o of S.tribes){ const d=Math.hypot(c.x-o.home.x,c.y-o.home.y); if(d<md) md=d; }
    if(md>bestD){ bestD=md; best=c; }
  }
  return best;
}
function warAppetite(t){
  const chief=chiefOf(t);
  const agg=chief?chief.genes.aggression:0.4;
  const op=chief?chief.opinion:(t.stance||0);
  let gr=0; for(const k in (t.grievance||{})) gr+=t.grievance[k]||0;
  let app=agg*0.6+((op+1)/2)*0.25+Math.min(0.3,gr/40);
  if(t.stock.food<20) app+=0.15; // گرسنگی هم جنگ‌طلب می‌کند
  app+=distBonus(t); // v5: نزدیکی رقیب — اصطکاک مرزی
  // v5: تنش مرزی و خانه‌های مورد مناقشه هم تمایل به جنگ را بالا می‌برند
  const nr2=nearestRival(t);
  if(nr2){ app+=Math.min(0.2,((t.borderTension||{})[nr2.o.id]||0)/500); app+=Math.min(0.1,((t.contested||{})[nr2.o.id]||0)*0.02); }
  return clamp(app,0,1);
}
function addGrievance(t,o,n){
  if(!t||!o||t.id===o.id) return;
  t.grievance=t.grievance||{}; t.grievance[o.id]=(t.grievance[o.id]||0)+n;
  t.relations[o.id]=clamp((t.relations[o.id]||0)-n,-100,100);
  o.relations[t.id]=clamp((o.relations[t.id]||0)-Math.round(n/2),-100,100);
}
function tryAlly(t,o){
  if(!t||!o||t.id===o.id||isAlly(t,o)||atWarWith(t,o)) return false;
  if((t.relations[o.id]||0)<60) return false;
  t.allies=t.allies||[]; o.allies=o.allies||[];
  t.allies.push(o.id); o.allies.push(t.id);
  t.relations[o.id]=clamp((t.relations[o.id]||0)+5,-100,100); o.relations[t.id]=clamp((o.relations[t.id]||0)+5,-100,100);
  logEvent(t.name+' و '+o.name+' پیمان اتحاد بستند — حالا از هم دفاع می‌کنند و تجارتشان بهتر است.','good');
  return true;
}
function breakAlliance(t,o){
  if(!t||!o) return;
  t.allies=(t.allies||[]).filter(id=>id!==o.id); o.allies=(o.allies||[]).filter(id=>id!==t.id);
  t.relations[o.id]=clamp((t.relations[o.id]||0)-20,-100,100); o.relations[t.id]=clamp((o.relations[t.id]||0)-20,-100,100);
  logEvent('اتحاد '+t.name+' و '+o.name+' شکست — رابطه‌شان سرد شد.','bad');
}
function offerPeace(t1,t2,byTribute){
  if(!t1||!t2) return;
  for(const b of [...S.battles]){
    if((b.t1===t1.id&&b.t2===t2.id)||(b.t1===t2.id&&b.t2===t1.id)){
      for(const id of [...b.s1,...b.s2]){ const a=S.agents.find(x=>x.id===id); if(a){ a.battleId=null; a.battleSide=0; } }
      S.battles.splice(S.battles.indexOf(b),1);
    }
  }
  t1.relations[t2.id]=10; t2.relations[t1.id]=10;
  t1.truce=t1.truce||{}; t2.truce=t2.truce||{};
  t1.truce[t2.id]=S.day+3; t2.truce[t1.id]=S.day+3;
  t1.warFatigue=10; t2.warFatigue=10;
  t1.warCd=45; t2.warCd=45;
  logEvent(t1.name+' و '+t2.name+(byTribute?' با پرداخت باج':' پس از مذاکره')+' صلح کردند — تا ۳ روز آتش‌بس است.','good');
}
function payTribute(t,o){
  if(!t||!o||!atWarWith(t,o)) return false;
  if(t.stock.coins>=15){ t.stock.coins-=15; o.stock.coins=Math.min(COIN_CAP,(o.stock.coins||0)+15); logEvent(t.name+' به '+o.name+' ۱۵ سکه باج داد تا جنگ تمام شود.','good'); offerPeace(t,o,true); return true; }
  if(t.stock.food>=20){ t.stock.food-=20; o.stock.food=Math.min(foodCap(o),o.stock.food+20); logEvent(t.name+' به '+o.name+' ۲۰ غذا باج داد تا جنگ تمام شود.','good'); offerPeace(t,o,true); return true; }
  toast('برای باج نه سکه‌ی کافی هست نه غذا');
  return false;
}
function attackBuilding(a,b,dt){
  const dps=4+fightPower(a)*6;
  b.hp=(b.hp??(BUILDING_HP[b.type]||60))-dps*dt;
  a.goal='حمله به '+BUILDINGS[b.type].name;
  burst(b.x,b.y,'#f43f5e',2,40);
  if(b.hp<=0) destroyBuilding(b,tribeById(a.tribeId));
}
function collapseBuilding(b){
  const t=tribeById(b.tribeId), def=BUILDINGS[b.type];
  logEvent('«'+def.name+'» در '+(t?t.name:'بی‌صاحب')+' به خاطر عدم تعمیر فرو ریخت!'+(b.type==='house'?' خانواده‌ای بی‌خانه شد.':''),'bad');
  destroyBuilding(b,null,'decay'); // ویرانیِ ساختمان سرزمین دورش را پس می‌گیرد و خانواده‌اش بی‌خانه می‌شود
}
function destroyBuilding(b,byTribe,reason){
  const t=tribeById(b.tribeId);
  const def=BUILDINGS[b.type];
  const bi=S.buildings.indexOf(b); if(bi>=0) S.buildings.splice(bi,1);
  const qi=S.buildQueue.findIndex(q=>q.buildingId===b.id); if(qi>=0) S.buildQueue.splice(qi,1);
  if(S.selectedBuilding===b){ S.selectedBuilding=null; updateBuildingCard(); }
  if(b.ownerFamilyId){ const fam=familyById(b.ownerFamilyId); if(fam){ fam.houseId=null; fam.houselessSince=S.elapsed; } }
  if(b.renterFamilyId){ const fam=familyById(b.renterFamilyId); if(fam) fam.renterFamilyId=null; }
  if(t) recomputeTerritory(t); // v5 (tiles): با ویرانی ساختمان، سرزمین دور آن پس گرفته می‌شود
  if(t&&byTribe&&byTribe.id!==t.id){ addGrievance(t,byTribe,8); logEvent('«'+def.name+'» در '+t.name+' به دست '+byTribe.name+' ویران شد!'+(b.type==='house'?' خانواده‌ای بی‌خانه شد.':''),'bad'); }
  else if(t&&reason!=='decay'){ logEvent('«'+def.name+'» در '+t.name+' ویران شد.','bad'); }
  if(t) checkTribeCollapse(t,byTribe);
}
function checkTribeCollapse(t,winner){
  if(!t||!tribeById(t.id)) return;
  const mem=tribeMembers(t);
  const built=S.buildings.filter(b=>b.tribeId===t.id&&b.progress>=100).length;
  const collapsed=mem.length<=2||(built===0&&t.stock.food<=0&&mem.length<5);
  if(!collapsed) return;
  dissolveTribe(t,winner);
}
function dissolveTribe(t,winner){
  if(!t||!tribeById(t.id)) return;
  const mem=tribeMembers(t);
  if(winner&&tribeById(winner.id)){
    winner.stock.wood+=t.stock.wood; winner.stock.stone+=t.stock.stone;
    winner.stock.food=Math.min(foodCap(winner),winner.stock.food+t.stock.food);
    winner.stock.coins=Math.min(COIN_CAP,(winner.stock.coins||0)+(t.stock.coins||0));
    for(const b of S.buildings) if(b.tribeId===t.id) b.tribeId=winner.id;
    for(const a of mem){ a.tribeId=winner.id; a.loyalty=40; a.job=null; a.tribeSince=S.elapsed; }
    // v5 (tiles): سرزمین قبیله‌ی سقوط‌کرده به برنده می‌رسد
    for(let i=0;i<S.tiles.length;i++) if(S.tiles[i]===t.id){ S.tiles[i]=winner.id; S.tileCounts[winner.id]=(S.tileCounts[winner.id]||0)+1; }
    S.tileCounts[t.id]=0;
    assignJobs(winner);
    logEvent('قبیله «'+t.name+'» سقوط کرد! سرزمین، انبار و بازماندگانش به '+winner.name+' رسید.','bad');
  } else {
    for(const a of mem){ a.tribeId=null; a.loyalty=50; a.job=null; }
    logEvent('قبیله «'+t.name+'» از بین رفت و بازماندگانش بی‌قبیله شدند.','bad');
  }
  for(const o of S.tribes){ if(o.id!==t.id){ o.allies=(o.allies||[]).filter(id=>id!==t.id); if(o.truce) delete o.truce[t.id]; if(o.grievance) delete o.grievance[t.id]; } }
  S.tribes.splice(S.tribes.indexOf(t),1);
  for(const b of [...S.battles]){ if(b.t1===t.id||b.t2===t.id){ for(const id of [...b.s1,...b.s2]){ const a=S.agents.find(x=>x.id===id); if(a){ a.battleId=null; a.battleSide=0; } } S.battles.splice(S.battles.indexOf(b),1); } }
}
/* v5: قبیله‌ی خیلی کوچک یا ناتوان از هم می‌پاشد — ولی تدریجی و منصفانه:
   اول هشدار، بعد یک روز کاملِ شکستِ ماندگار. فروپاشیِ آنیِ جنگ (checkTribeCollapse) سر جایش است. */
const MIN_TRIBE_ADULTS=4;
function collapseReason(t){
  const mem=tribeMembers(t);
  const adults=mem.filter(a=>a.age>=0.4);
  if(adults.length<MIN_TRIBE_ADULTS) return 'نیروی کار کافی نداشت';
  if(t.stock.food<=0){
    const hasFarm=S.buildings.some(b=>b.tribeId===t.id&&(b.type==='farm'||b.type==='pasture')&&b.progress>=100);
    let wildFood=0; for(const f of S.foods){ if((f.x-t.home.x)**2+(f.y-t.home.y)**2<400*400) wildFood++; }
    if(!hasFarm&&wildFood===0) return 'غذای کافی نداشت';
  }
  const guards=mem.filter(a=>a.job==='warrior'||a.job==='guard').length;
  if(guards===0){
    const nearWild=S.animals.some(an=>!an.dead&&an.wild&&Math.hypot(an.x-t.home.x,an.y-t.home.y)<300);
    const threat=S.tribes.some(o=>o.id!==t.id&&(t.relations[o.id]||0)<-20)||nearWild||S.battles.some(b=>b.t1===t.id||b.t2===t.id);
    if(threat) return 'نیروی دفاعی نداشت';
  }
  return null;
}
function collapseTick(t,dt){
  const reason=collapseReason(t);
  if(!reason){ t.collapseT=0; t.collapseWarned=false; t.collapseDue=false; t.collapseReason=''; return; }
  t.collapseT=(t.collapseT||0)+dt; t.collapseReason=reason;
  if(!t.collapseWarned){ t.collapseWarned=true; logEvent('قبیله «'+t.name+'» در آستانه‌ی فروپاشی است — '+reason+'.','bad'); }
  if(t.collapseT>=S.settings.dayLength) t.collapseDue=true; // انحلال بعد از حلقه‌ی قبیله‌ها انجام می‌شود تا حلقه به‌هم نریزد
}
function collapseTribe(t,reason){
  if(!t||!tribeById(t.id)) return;
  // برنده: دشمنِ در حال جنگ، وگرنه نزدیک‌ترین قبیله‌ی دیگر (تا ۸۰۰ پیکسل)؛ اگر هیچ‌کس نیست، قبیله بی‌برنده می‌پاشد
  const enemy=S.tribes.find(o=>o.id!==t.id&&S.battles.some(b=>(b.t1===t.id&&b.t2===o.id)||(b.t2===t.id&&b.t1===o.id)));
  const nearest=S.tribes.filter(o=>o.id!==t.id).sort((x,y)=>Math.hypot(x.home.x-t.home.x,x.home.y-t.home.y)-Math.hypot(y.home.x-t.home.x,y.home.y-t.home.y))[0];
  const winner=enemy||(nearest&&Math.hypot(nearest.home.x-t.home.x,nearest.home.y-t.home.y)<800?nearest:null);
  if(winner){ logEvent('قبیله «'+t.name+'» چون '+reason+' از هم پاشید.','bad'); dissolveTribe(t,winner); return; }
  // بی‌برنده: اعضا به قبیله‌ی دوستِ نزدیک می‌پیوندند یا بی‌قبیله می‌شوند؛ ساختمان‌ها بی‌صاحب و سرزمین بی‌صاحب می‌شود
  const mem=tribeMembers(t);
  const joined=new Set();
  for(const a of mem){
    const friendly=S.tribes.find(o=>o.id!==t.id&&(t.relations[o.id]||0)>30&&Math.hypot(o.home.x-a.x,o.home.y-a.y)<500);
    if(friendly){ a.tribeId=friendly.id; a.loyalty=55; a.job=null; a.tribeSince=S.elapsed; joined.add(friendly.id); }
    else { a.tribeId=null; a.loyalty=50; a.job=null; }
  }
  for(const id of joined){ const ft=tribeById(id); if(ft) assignJobs(ft); }
  for(const b of S.buildings) if(b.tribeId===t.id){ b.tribeId=null; b.ruin=true; }
  for(let i=0;i<S.tiles.length;i++) if(S.tiles[i]===t.id){ S.tiles[i]=0; }
  S.tileCounts[t.id]=0;
  for(const o of S.tribes){ if(o.id!==t.id){ o.allies=(o.allies||[]).filter(id=>id!==t.id); if(o.truce) delete o.truce[t.id]; if(o.grievance) delete o.grievance[t.id]; } }
  S.tribes.splice(S.tribes.indexOf(t),1);
  for(const b of [...S.battles]){ if(b.t1===t.id||b.t2===t.id){ for(const id of [...b.s1,...b.s2]){ const a=S.agents.find(x=>x.id===id); if(a){ a.battleId=null; a.battleSide=0; } } S.battles.splice(S.battles.indexOf(b),1); } }
  logEvent('قبیله «'+t.name+'» چون '+reason+' از هم پاشید — بازماندگان بی‌قبیله شدند و سرزمینش بی‌صاحب ماند.','bad');
}
function diplomacyTick(t,dt){
  t.diplomacyT=(t.diplomacyT||0)-dt; if(t.diplomacyT>0) return; t.diplomacyT=15+rand(0,10);
  for(const o of S.tribes){
    if(o.id===t.id||isAlly(t,o)||atWarWith(t,o)) continue;
    const r=t.relations[o.id]||0;
    if(r>60&&Math.random()<0.5){ tryAlly(t,o); return; }
    if(r>0&&r<60&&t.stock.food>150&&Math.random()<0.4){
      t.stock.food-=10; o.stock.food=Math.min(foodCap(o),o.stock.food+10);
      t.relations[o.id]=clamp(r+10,-100,100); o.relations[t.id]=clamp((o.relations[t.id]||0)+10,-100,100);
      logEvent(t.name+' به '+o.name+' ۱۰ غذا هدیه داد — رابطه بهتر شد.','good');
      return;
    }
  }
  if((t.warFatigue||0)>50){
    const enemy=S.tribes.find(o=>o.id!==t.id&&atWarWith(t,o));
    if(enemy){ offerPeace(t,enemy); return; }
  }
}
function needsTick(t,dt){
  t.needsT=(t.needsT||0)-dt; if(t.needsT>0) return; t.needsT=5;
  const prev=t.prevStock||{wood:t.stock.wood,stone:t.stock.stone,food:t.stock.food};
  const dayFrac=5/(S.settings.dayLength||60);
  t.needsBal={
    food:Math.round((t.stock.food-prev.food)/dayFrac),
    wood:Math.round((t.stock.wood-prev.wood)/dayFrac),
    stone:Math.round((t.stock.stone-prev.stone)/dayFrac),
  };
  t.prevStock={wood:t.stock.wood,stone:t.stock.stone,food:t.stock.food,coins:t.stock.coins,meals:t.stock.meals||0};
  const memN=tribeMembers(t).length;
  let note='';
  if(t.needsBal.food<0&&t.stock.food<80){
    if((t.jobs.farmer||0)<8){ t.jobs.farmer=(t.jobs.farmer||0)+1; note='کمبود غذا — کشاورز بیشتر شد'; }
    else if(hasTech(t,'farming')&&S.buildings.filter(b=>b.tribeId===t.id&&b.type==='farm').length<4&&!S.buildQueue.some(q=>q.tribeId===t.id&&q.type==='farm')&&t.stock.wood>=8){ queueBuilding(t,'farm',t.home.x+rand(-90,90),t.home.y+rand(-90,90),true); note='کمبود غذا — مزرعه‌ی تازه ساخته شد'; }
  } else if(t.needsBal.wood<0&&t.stock.wood<60){
    if((t.jobs.woodcutter||0)<6){ t.jobs.woodcutter=(t.jobs.woodcutter||0)+1; note='کمبود چوب — چوب‌بر بیشتر شد'; }
  } else if(t.needsBal.stone<0&&t.stock.stone<40){
    if((t.jobs.miner||0)<6){ t.jobs.miner=(t.jobs.miner||0)+1; note='کمبود سنگ — معدنچی بیشتر شد'; }
  } else if(t.stock.food>300&&(t.jobs.farmer||0)>2){
    t.jobs.farmer--; t.jobs.scholar=Math.min(8,(t.jobs.scholar||0)+1); note='غذای اضافه — کارگر به پژوهش رفت';
  } else if(t.stock.wood>200&&(t.jobs.woodcutter||0)>2){
    t.jobs.woodcutter--; t.jobs.blacksmith=Math.min(6,(t.jobs.blacksmith||0)+1); note='چوب اضافه — کارگر به صنعت رفت';
  }
  if(note){ t.needsNote=note; logEvent(t.name+': '+note+'.','good'); assignJobs(t); }
}
/* قدرت جنگ: جثه و پرخاشگری + سلاح + تمرین (سربازخانه)؛ دفاع از سپر و زره */
function fightPower(a){
  const w=a.equip&&a.equip.weapon?WEAPONS[a.equip.weapon]:null;
  const base=a.genes.size*0.6+a.genes.aggression*0.4+(w?w.atk*0.25:0)+(a.training||0)*0.3+rand(0.2);
  const t=a.tribeId?tribeById(a.tribeId):null; // سردار دربار: قدرت جنگی جنگجویان قبیله ۱۵٪ بیشتر
  return base*(t?warBonus(t):1);
}
function defenseOf(a){
  const s=a.equip&&a.equip.shield?SHIELDS[a.equip.shield]:null;
  const ar=a.equip&&a.equip.armor?ARMORS[a.equip.armor]:null;
  return (s?s.def:0)+(ar?ar.def:0);
}
function raidFight(a,b){
  const pa=fightPower(a), pb=fightPower(b);
  const win=pa>=pb?a:b, lose=win===a?b:a;
  // آسیب با قدرت مهاجم بالا می‌رود تا سلاح‌های بهتر واقعاً کشنده‌تر باشند؛
  // بازنده تا چند ثانیه در نبرد است و در این مدت نه خودبه‌خود بهبود می‌یابد و نه درمانگر می‌تواند او را درمان کند
  const dmg=Math.max(10,Math.round(18+pa*10-defenseOf(lose)*4));
  lose.health-=dmg; lose.energy=Math.max(0,lose.energy-10); lose.combatT=8;
  burst(lose.x,lose.y,'#f43f5e',10,90); floater(lose.x,lose.y-18,'نبرد','#fda4af');
  if(lose.health<=0){ killAgent(lose,'جنگ'); const lt=tribeById(lose.tribeId), wt=tribeById(win.tribeId); if(lt&&wt) addGrievance(lt,wt,5); }
}
function nearestResourceKind(a,kind){
  let best=null,bd=Infinity;
  const list=kind==='tree'?S.trees:S.stones;
  for(const r of list){ if(r.sapling) continue; // نهال هنوز قابل برداشت نیست — باید بالغ شود
    const d=(r.x-a.x)**2+(r.y-a.y)**2; if(d<bd){bd=d;best=r;} }
  return best;
}
/* v5: برداشت منابع از سرزمین قبیله‌ی دیگر کینه می‌سازد */
function foreignHarvestTension(a,t,x,y){
  if(!t||Math.random()>0.03) return;
  const fo=foreignTerritoryAt(x,y,t.id); if(!fo) return;
  addGrievance(fo,t,1);
  if(Math.random()<0.3) logEvent('جمع‌آور '+t.name+' از سرزمین '+fo.name+' منابع برداشت — کینه ساخته شد.','bad');
}
function gatherStep(a,t,dt,speed,know){
  if(a.inv.wood+a.inv.stone>=6){
    if(t){
      a.goal='بردن منابع به انبار';
      if(moveToward(a,t.centre.x,t.centre.y,dt,speed)){
        t.stock.wood+=a.inv.wood; t.stock.stone+=a.inv.stone;
        const fam=a.familyId?S.families.find(f=>f.id===a.familyId):null;
        if(fam) fam.wealth=Math.round((fam.wealth||0)+(a.inv.wood+a.inv.stone)*0.5);
        a.inv.wood=0; a.inv.stone=0;
      }
    } else {
      // بی‌قبیله: منابع به خانواده می‌رسد، یا برای خانه‌ی شخصی کنار گذاشته می‌شود
      const fam=a.familyId?S.families.find(f=>f.id===a.familyId):null;
      if(fam){ fam.mats=fam.mats||{wood:0,stone:0}; fam.mats.wood+=a.inv.wood; fam.mats.stone+=a.inv.stone; a.inv.wood=0; a.inv.stone=0; a.goal='بردن منابع به خانواده'; }
      else if(a.inv.wood>=10&&a.inv.stone>=5){
        a.inv.wood-=10; a.inv.stone-=5;
        const b=newBuilding(null,'house',a.x+rand(-30,30),a.y+rand(-30,30),null);
        S.buildings.push(b); S.buildQueue.push({tribeId:null,type:'house',buildingId:b.id});
        a.goal='ساختن خانه‌ی شخصی'; floater(a.x,a.y-16,'خانه‌ی شخصی','#fde68a');
      } else { a.goal='جمع‌آوری برای خود'; return false; }
    }
    return true;
  }
  // سقف نرم انبار: وقتی انبار پر است، آن منبع را جمع نمی‌کنیم
  const woodFull=t&&t.stock.wood>=STOCK_CAP.wood, stoneFull=t&&t.stock.stone>=STOCK_CAP.stone;
  if(!a.target||a.target.amount<=0||(a.target.kind==='tree'&&woodFull)||(a.target.kind==='stone'&&stoneFull)){
    a.target=null;
    const treeT=woodFull?null:nearestResourceKind(a,'tree');
    const stoneT=stoneFull?null:nearestResourceKind(a,'stone');
    if(treeT&&stoneT){ const d2=(treeT.x-a.x)**2+(treeT.y-a.y)**2, ds=(stoneT.x-a.x)**2+(stoneT.y-a.y)**2; a.target=d2<ds?treeT:stoneT; }
    else a.target=treeT||stoneT;
  }
  const tgt=a.target;
  if(!tgt){ a.goal='جست‌وجوی منابع'; return false; }
  a.goal=tgt.kind==='tree'?'قطع درخت':'استخراج سنگ';
  if(!moveToward(a,tgt.x,tgt.y,dt,speed)) return true;
  const rate=(t&&hasTech(t,'tools')?1.5:1)*(t&&hasTech(t,'iron')?1.4:1)*know;
  a.harvestT+=dt*rate;
  if(a.harvestT>=3){
    a.harvestT=0; tgt.amount--;
    if(tgt.kind==='tree'){ a.inv.wood+=2; burst(tgt.x,tgt.y,'#34d399',4,40); }
    else { a.inv.stone+=2; burst(tgt.x,tgt.y,'#94a3b8',4,40); }
    foreignHarvestTension(a,t,tgt.x,tgt.y); // برداشت از سرزمین دیگری کینه می‌سازد
    if(tgt.amount<=0){ if(tgt.kind==='tree'){ const i=S.trees.indexOf(tgt); if(i>=0) S.trees.splice(i,1);
        if(Math.random()<0.4&&S.trees.length<165) S.trees.push({x:tgt.x+rand(-40,40),y:tgt.y+rand(-40,40),amount:1,kind:'tree',sapling:true}); // جمع‌آور هم گاهی نهال می‌کارد
      } else { const i=S.stones.indexOf(tgt); if(i>=0) S.stones.splice(i,1); } a.target=null; }
  }
  return true;
}
/* چوب‌بر و معدنچی: فقط یک نوع منبع، کمی سریع‌تر */
function harvestKindStep(a,t,dt,speed,know,kind){
  const capFull=t&&(kind==='tree'?t.stock.wood>=STOCK_CAP.wood:t.stock.stone>=STOCK_CAP.stone);
  if(capFull) return false; // انبار پر است؛ کار دیگری بکن
  if(a.inv.wood+a.inv.stone>=6) return gatherStep(a,t,dt,speed,know);
  if(!a.target||a.target.amount<=0||a.target.kind!==kind){ a.target=nearestResourceKind(a,kind); }
  const tgt=a.target;
  if(!tgt){ a.goal='جست‌وجوی '+(kind==='tree'?'درخت':'سنگ'); return false; }
  a.goal=kind==='tree'?'قطع درخت':'استخراج سنگ';
  if(!moveToward(a,tgt.x,tgt.y,dt,speed)) return true;
  const rate=(t&&hasTech(t,'tools')?1.5:1)*(t&&hasTech(t,'iron')?1.4:1)*know*1.3*(t?gatherBonus(t):1); // وزیر دربار: برداشت ۱۵٪ سریع‌تر
  a.harvestT+=dt*rate;
  if(a.harvestT>=2.4){
    a.harvestT=0; tgt.amount--;
    if(kind==='tree'){ a.inv.wood+=2; burst(tgt.x,tgt.y,'#34d399',4,40); }
    else { a.inv.stone+=2; burst(tgt.x,tgt.y,'#94a3b8',4,40); }
    foreignHarvestTension(a,t,tgt.x,tgt.y); // برداشت از سرزمین دیگری کینه می‌سازد
    if(tgt.amount<=0){ const arr=kind==='tree'?S.trees:S.stones; const i=arr.indexOf(tgt); if(i>=0) arr.splice(i,1);
      if(kind==='tree'&&Math.random()<0.6&&S.trees.length<165){ S.trees.push({x:tgt.x+rand(-40,40),y:tgt.y+rand(-40,40),amount:1,kind:'tree',sapling:true}); } // چوب‌بر نهال می‌کارد
      a.target=null; }
  }
  return true;
}
function woodcutterStep(a,t,dt,speed,know){ return harvestKindStep(a,t,dt,speed,know,'tree'); }
function minerStep(a,t,dt,speed,know){ return harvestKindStep(a,t,dt,speed,know,'stone'); }
function hunterStep(a,t,dt,speed,know){
  let prey=null,bd=500*500;
  for(const an of S.animals){ if(an.dead||!an.wild) continue; const d=(an.x-a.x)**2+(an.y-a.y)**2; if(d<bd){bd=d;prey=an;} }
  if(!prey) return gatherStep(a,t,dt,speed,know);
  a.goal='شکار '+(prey.kind==='wolf'?'گرگ':'خرس');
  if(!moveToward(a,prey.x,prey.y,dt,speed)) return true;
  const pw=fightPower(a), aw=prey.kind==='bear'?0.9:0.55;
  if(pw+rand(0.3)>=aw){
    prey.health-=35; burst(prey.x,prey.y,'#f43f5e',8,70);
    if(prey.health<=0){ prey.dead=true; const gain=(prey.kind==='bear'?30:20)+(t&&hasBuilding(t,'butcher')?10:0); // قصابی: +۱۰ غذا از هر شکار
      if(t) t.stock.food=Math.min(foodCap(t),t.stock.food+gain); else a.energy=clamp(a.energy+gain,0,100);
      floater(prey.x,prey.y-14,'شکار شد! +'+fa(gain)+' غذا','#fda4af');
      logEvent(a.name+' یک '+(prey.kind==='bear'?'خرس':'گرگ')+' را شکار کرد.','good');
    }
  } else {
    a.health-=12; a.energy=Math.max(0,a.energy-8); floater(a.x,a.y-14,'حیوان حمله کرد!','#fda4af');
    if(a.health<=0) killAgent(a,'حیوان وحشی');
  }
  return true;
}
function guardStep(a,t,dt,speed,know){
  if(!t){ a.goal='نگهبانی از خود'; return gatherStep(a,t,dt,speed,know); }
  let raider=null,bd=160*160;
  for(const o of S.agents){ if(o.dead||o.tribeId===t.id||o.job!=='warrior') continue; const d=(o.x-t.home.x)**2+(o.y-t.home.y)**2; if(d<bd){bd=d;raider=o;} }
  if(raider){ a.goal='دفاع در برابر مهاجم'; if(!moveToward(a,raider.x,raider.y,dt,speed)) return true; raidFight(a,raider); return true; }
  a.goal='نگهبانی از دیوار';
  if(!a.patrol||Math.hypot(a.patrol.x-a.x,a.patrol.y-a.y)<20){ a.patrol=randomOwnedPoint(t)||{x:t.home.x+Math.cos(rand(Math.PI*2))*170,y:t.home.y+Math.sin(rand(Math.PI*2))*170}; } // v5 (tiles): نگهبان در سرزمین خودش گشت می‌زند
  moveToward(a,a.patrol.x,a.patrol.y,dt,speed*0.7);
  return true;
}
function bestCraftable(t,kind){
  const list=kind==='weapon'?WEAPON_ORDER:kind==='shield'?SHIELD_ORDER:ARMOR_ORDER;
  const defs=kind==='weapon'?WEAPONS:kind==='shield'?SHIELDS:ARMORS;
  let best=null;
  for(const id of list){ const d=defs[id];
    if(d.tech&&!hasTech(t,d.tech)) continue;
    if(t.stock.wood<(d.wood||0)||t.stock.stone<(d.stone||0)||t.stock.coins<(d.coins||0)) continue;
    best=id;
  }
  return best;
}
function blacksmithStep(a,t,dt,speed,know){
  const ws=!t?null:S.buildings.find(b=>b.tribeId===t.id&&(b.type==='armory'||b.type==='workshop'||b.type==='smithy')&&b.progress>=100);
  if(!t||!ws) return gatherStep(a,t,dt,speed,know);
  // چیزی برای ساختن نیست (نه چوب/سنگ/سکه‌ی کافی): به‌جای ایستادن کنار کارگاه، جمع‌آوری کند
  if(!bestCraftable(t,'weapon')&&!bestCraftable(t,'shield')&&!bestCraftable(t,'armor')) return gatherStep(a,t,dt,speed,know);
  a.goal='آهنگری در '+(ws.type==='armory'?'اسلحه‌خانه':ws.type==='smithy'?'آهنگری':'کارگاه');
  if(!moveToward(a,ws.x,ws.y,dt,speed)) return true;
  a.workT=(a.workT||0)+dt*(ws.type==='smithy'?2:ws.type==='armory'?1.5:1)*know; // آهنگری: دو برابر سریع‌تر
  if(a.workT>=8){
    a.workT=0;
    const kind=pick(['weapon','weapon','shield','armor']);
    const id=bestCraftable(t,kind);
    if(id){ const d=(kind==='weapon'?WEAPONS:kind==='shield'?SHIELDS:ARMORS)[id];
      t.stock.wood-=d.wood||0; t.stock.stone-=d.stone||0; t.stock.coins-=d.coins||0;
      t.armory[kind][id]=(t.armory[kind][id]||0)+1;
      floater(ws.x,ws.y-16,d.name+' ساخته شد','#fde68a');
    }
    else return gatherStep(a,t,dt,speed,know); // مواد وسط کار تمام شد؛ برو جمع‌آوری
  }
  return true;
}
function cookStep(a,t,dt,speed,know){
  if(!t) return gatherStep(a,t,dt,speed,know);
  if(t.stock.food<2) return gatherStep(a,t,dt,speed,know); // غذایی برای پختن نیست — نایستد
  const bakery=S.buildings.find(b=>b.tribeId===t.id&&b.type==='bakery'&&b.progress>=100);
  a.goal=bakery?'پخت نان در نانوایی':'آشپزی';
  if(!moveToward(a,bakery?bakery.x:t.centre.x,bakery?bakery.y:t.centre.y,dt,speed)) return true;
  a.workT=(a.workT||0)+dt*(bakery?2:1); // نانوایی: دو برابر سریع‌تر
  if(a.workT>=8){ a.workT=0; if(t.stock.food>=2){ t.stock.food-=2; t.stock.meals=(t.stock.meals||0)+3; floater(t.centre.x,t.centre.y-16,'غذای پخته +۳','#fde68a'); } }
  return true;
}
function sexworkerStep(a,t,dt,speed,know){
  const inn=t&&hasBuilding(t,'inn');
  const range=inn?240:160; // مهمانخانه: مشتری از دورتر هم می‌آید
  let client=null,bd=range*range;
  for(const o of S.agents){ if(o===a||o.dead||o.age<0.4||(o.sexNeed||0)<60) continue; const d=(o.x-a.x)**2+(o.y-a.y)**2; if(d<bd){bd=d;client=o;} }
  if(!client){ a.goal='در انتظار مشتری'; return gatherStep(a,t,dt,speed,know); }
  a.goal='برطرف کردن نیاز جنسی';
  if(!moveToward(a,client.x,client.y,dt,speed)) return true;
  a.sexNeed=0; client.sexNeed=0;
  const famA=a.familyId?S.families.find(f=>f.id===a.familyId):null;
  if(famA) famA.wealth=(famA.wealth||0)+(inn?3:2); // دستمزد (مهمانخانه: +۱ بیشتر)
  if(Math.random()<0.06){ // بارداری خارج از خانواده — احتمال کم
    reproduce(a,client,true);
    logEvent('بارداری خارج از خانواده رخ داد.','bad');
  }
  return true;
}
function farmerStep(a,t,dt,speed,know){
  const farms=S.buildings.filter(b=>b.tribeId===t.id&&b.type==='farm'&&b.progress>=100);
  if(!farms.length) return gatherStep(a,t,dt,speed,know);
  let f=null,bd=Infinity;
  for(const b of farms){ if(b.growth<100){ const d=(b.x-a.x)**2+(b.y-a.y)**2; if(d<bd){bd=d;f=b;} } }
  if(!f) return gatherStep(a,t,dt,speed,know);
  a.goal='کار در مزرعه';
  if(!moveToward(a,f.x,f.y,dt,speed)) return true;
  f.growth=clamp(f.growth+dt*6*know,0,100);
  if(f.growth>=100){ f.growth=0; const yld=Math.round((12+Math.round(5*know))*(1+0.5*((f.level||1)-1))*(t?gatherBonus(t):1)); t.stock.food=Math.min(foodCap(t),t.stock.food+yld); burst(f.x,f.y,'#fbbf24',8,60); floater(f.x,f.y-14,'+'+fa(yld)+' غذا','#fde68a'); } // وزیر دربار: محصول مزرعه ۱۵٪ بیشتر
  return true;
}
/* v5 (tiles): برج‌ها و قلعه‌ها از سرزمین دفاع می‌کنند — مهاجم بیگانه درون قلمرو تیر می‌خورد */
function territoryDefenseTick(dt){
  S.defT=(S.defT||0)-dt; if(S.defT>0) return; S.defT=1;
  for(const b of S.buildings){
    if(b.progress<100||(b.type!=='tower'&&b.type!=='castle')) continue;
    const t=tribeById(b.tribeId); if(!t) continue;
    const range=b.type==='castle'?180:150, dmg=b.type==='castle'?8:5;
    let foe=null,bd=range*range;
    for(const a of S.agents){
      if(a.dead||a.tribeId===t.id||(a.job!=='warrior'&&a.job!=='guard')) continue;
      const d=(a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y); if(d<bd){bd=d;foe=a;}
    }
    if(foe){ foe.health-=dmg; foe.combatT=8; burst(foe.x,foe.y,'#fbbf24',3,40); if(foe.health<=0) killAgent(foe,'جنگ'); }
  }
}
/* v5 (tiles): جاده‌سازی — سازنده خانه‌به‌خانه از مرز سرزمین جلو می‌رود؛ هر خانه ۲ چوب و ۲٫۵ ثانیه */
function roadStep(a,t,dt,speed){
  if(!t||t.stock.wood<2||tribeTiles(t)>=160) return false;
  t.roadCd=Math.max(0,(t.roadCd||0)-dt);
  if(t.roadCd>0) return false;
  if(a.roadIdx==null){
    const ang=(t.roadAng=(t.roadAng||0)+Math.PI/3);
    let best=null,bd=Infinity;
    for(let i=0;i<S.tiles.length;i++){
      if(S.tiles[i]!==0||(S.roads&&S.roads[i])) continue;
      const cx=(i%TW)*TILE+TILE/2, cy=Math.floor(i/TW)*TILE+TILE/2;
      const dHome=Math.hypot(cx-t.home.x,cy-t.home.y);
      if(dHome>600) continue;
      const tx=i%TW, ty=Math.floor(i/TW);
      let adj=false;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=tx+dx, ny=ty+dy; if(nx>=0&&ny>=0&&nx<TW&&ny<TH&&S.tiles[ny*TW+nx]===t.id){ adj=true; break; } }
      if(!adj) continue;
      let dAng=Math.abs(Math.atan2(cy-t.home.y,cx-t.home.x)-ang); if(dAng>Math.PI) dAng=2*Math.PI-dAng;
      const score=dHome+dAng*120;
      if(score<bd){bd=score;best={x:cx,y:cy,idx:i};}
    }
    if(!best) return false;
    a.roadTx=best.x; a.roadTy=best.y; a.roadIdx=best.idx;
  }
  a.goal='جاده‌سازی';
  if(!moveToward(a,a.roadTx,a.roadTy,dt,speed)) return true;
  if(S.tiles[a.roadIdx]!==0){ a.roadTx=null; a.roadTy=null; a.roadIdx=null; return true; } // یکی دیگر زودتر ساخت
  a.workT=(a.workT||0)+dt;
  if(a.workT>=2.5){
    a.workT=0; t.stock.wood-=2; t.roadCd=15;
    claimTile(a.roadIdx%TW,Math.floor(a.roadIdx/TW),t.id); S.roads[a.roadIdx]=1;
    landProvocation(t,a.roadTx,a.roadTy); // جاده چسبیده به مرز رقیب هم تحریک است
    floater(a.x,a.y-16,'جاده ساخته شد','#d6a860');
    a.roadTx=null; a.roadTy=null; a.roadIdx=null;
  }
  return true;
}
/* v5: جاده‌های بین‌قبیله‌ای — دو قبیله‌ی دوست با جاده به هم وصل می‌شوند؛ جاده خنثی است (مال هیچ‌کدام نیست)، سرعت روی آن ۱٫۳ برابر است، تجارت بینشان بیشتر می‌شود و رابطه‌شان آهسته بهتر می‌شود. با شروع جنگ جاده قطع می‌شود. */
function hasInterRoad(t,o){ return !!((t.interRoads||{})[o.id]&&t.interRoads[o.id].done); }
function interRoadPath(a,b){
  const A=tileList(a), B=tileList(b);
  if(!A.length||!B.length) return null;
  let best=null,bd=Infinity;
  for(const ia of A){ const ax=(ia%TW)*TILE+TILE/2, ay=Math.floor(ia/TW)*TILE+TILE/2;
    for(const ib of B){ const bx=(ib%TW)*TILE+TILE/2, by=Math.floor(ib/TW)*TILE+TILE/2;
      const d=(ax-bx)*(ax-bx)+(ay-by)*(ay-by); if(d<bd){bd=d;best={ia,ib};} } }
  if(!best) return null;
  const x0=best.ia%TW, y0=Math.floor(best.ia/TW), x1=best.ib%TW, y1=Math.floor(best.ib/TW);
  const path=[]; let x=x0, y=y0; const dx=Math.abs(x1-x0), dy=-Math.abs(y1-y0), sx=x0<x1?1:-1, sy=y0<y1?1:-1; let err=dx+dy;
  let guard=0;
  while(guard++<500){ path.push(y*TW+x); if(x===x1&&y===y1) break; const e2=2*err; if(e2>=dy){ err+=dy; x+=sx; } if(e2<=dx){ err+=dx; y+=sy; } }
  return path;
}
function interRoadTick(t,dt){
  t.interRoadT=(t.interRoadT||0)-dt; if(t.interRoadT>0) return; t.interRoadT=20;
  // شریک: اول متحد، بعد رابطه‌ی خوب و نزدیک؛ جنگ یا رابطه‌ی منفی یعنی جاده نه
  const cands=S.tribes.filter(o=>o.id!==t.id&&!atWarWith(t,o)&&!inTruce(t,o)&&(t.relations[o.id]||0)>0&&!(t.interRoads||{})[o.id]&&!(o.interRoads||{})[t.id]);
  if(!cands.length) return;
  cands.sort((x,y)=>((isAlly(t,y)?1:0)-(isAlly(t,x)?1:0))||((t.relations[y.id]||0)-(t.relations[x.id]||0))||(territoryDist(t,x)-territoryDist(t,y)));
  const o=cands[0];
  if(territoryDist(t,o)>600) return; // خیلی دور — جاده نمی‌صرفد
  const path=interRoadPath(t,o);
  if(!path||path.length<3) return;
  if(t.stock.wood<10) return; // شروع پروژه چوب می‌خواهد — سازنده‌اش را قبیله‌ی آغازگر می‌پردازد
  t.interRoads=t.interRoads||{}; t.interRoads[o.id]={path,next:0,done:false};
  logEvent(t.name+' ساخت جاده به '+o.name+' را شروع کرد.','good');
}
function interRoadStep(a,t,dt,speed){
  if(!t) return false;
  const proj=Object.values(t.interRoads||{}).find(p=>p&&!p.done);
  if(!proj) return false;
  while(proj.next<proj.path.length){ const idx=proj.path[proj.next]; if(S.roads&&S.roads[idx]){ proj.next++; continue; } if(S.tiles[idx]!==0){ proj.next++; continue; } break; }
  if(proj.next>=proj.path.length){
    proj.done=true;
    const pid=Object.keys(t.interRoads).find(k=>t.interRoads[k]===proj); const o=tribeById(+pid);
    if(o){ o.interRoads=o.interRoads||{}; o.interRoads[t.id]={path:proj.path,next:proj.path.length,done:true}; }
    logEvent('جاده‌ای بین '+t.name+' و '+(o?o.name:'؟')+' کشیده شد — تجارت و رفت‌وآمد سریع‌تر شد.','good');
    return false;
  }
  const idx=proj.path[proj.next], cx=(idx%TW)*TILE+TILE/2, cy=Math.floor(idx/TW)*TILE+TILE/2;
  if(t.stock.wood<1) return false;
  a.goal='جاده‌سازی بین قبیله‌ها';
  if(!moveToward(a,cx,cy,dt,speed)) return true;
  a.workT=(a.workT||0)+dt;
  if(a.workT>=2){ a.workT=0; t.stock.wood-=1; S.roads[idx]=1; proj.next++; }
  return true;
}
function cutInterRoad(t1,t2){
  let cut=0;
  for(const t of [t1,t2]){
    if(!t||!t.interRoads) continue;
    const other=t===t1?t2:t1;
    const rec=t.interRoads[other.id]; if(!rec) continue;
    for(const idx of rec.path){ if(S.roads&&S.roads[idx]){ S.roads[idx]=0; cut++; } }
    delete t.interRoads[other.id];
  }
  if(cut>0) logEvent('جاده‌ی بین '+t1.name+' و '+t2.name+' در جنگ قطع شد — تا صلح، جاده‌ای نیست.','bad');
  return cut;
}
/* v5: طمع زمین — سازنده‌ی بیکار، وقتی چوبِ مازاد هست، خانه‌های بی‌صاحبِ چسبیده به سرزمین را می‌گیرد؛ به‌سمت منابع و رقیب، و دورتر از خانه گران‌تر */
function claimStep(a,t,dt,speed){
  if(!t||t.stock.wood<5||tribeTiles(t)>=territoryCap(t)) return false;
  t.claimCd=Math.max(0,(t.claimCd||0)-dt);
  if(t.claimCd>0) return false;
  if(a.claimIdx==null){
    const rival=nearestRival(t);
    const frontier=[];
    for(let i=0;i<S.tiles.length;i++){
      if(S.tiles[i]!==0) continue;
      const tx=i%TW, ty=Math.floor(i/TW);
      let adj=false;
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=tx+dx,ny=ty+dy; if(nx>=0&&ny>=0&&nx<TW&&ny<TH&&S.tiles[ny*TW+nx]===t.id){ adj=true; break; } }
      if(adj) frontier.push(i);
    }
    let best=null,bd=-Infinity;
    for(const i of frontier){
      const tx=i%TW, ty=Math.floor(i/TW), cx=tx*TILE+TILE/2, cy=ty*TILE+TILE/2;
      const dHome=Math.hypot(cx-t.home.x,cy-t.home.y);
      if(dHome>800) continue;
      let res=0; for(const tr of S.trees){ if((tr.x-cx)*(tr.x-cx)+(tr.y-cy)*(tr.y-cy)<100*100) res++; } for(const st of S.stones){ if((st.x-cx)*(st.x-cx)+(st.y-cy)*(st.y-cy)<100*100) res++; } for(const f of S.foods){ if((f.x-cx)*(f.x-cx)+(f.y-cy)*(f.y-cy)<100*100) res++; }
      let toward=0; if(rival){ const vx=rival.o.home.x-t.home.x, vy=rival.o.home.y-t.home.y, vl=Math.hypot(vx,vy)||1; toward=((cx-t.home.x)*vx+(cy-t.home.y)*vy)/vl; }
      const score=res*40+toward*0.15-dHome*0.05;
      if(score>bd){ bd=score; best={x:cx,y:cy,idx:i}; }
    }
    if(!best) return false;
    a.claimTx=best.x; a.claimTy=best.y; a.claimIdx=best.idx;
  }
  a.goal='تصاحب زمین';
  if(!moveToward(a,a.claimTx,a.claimTy,dt,speed)) return true;
  if(S.tiles[a.claimIdx]!==0){ a.claimTx=null; a.claimTy=null; a.claimIdx=null; return true; }
  const cost=claimCostAt(t,a.claimTx,a.claimTy);
  if(t.stock.wood<cost.wood||t.stock.stone<cost.stone){ a.claimTx=null; a.claimTy=null; a.claimIdx=null; return false; }
  a.workT=(a.workT||0)+dt;
  if(a.workT>=2){
    a.workT=0; t.stock.wood-=cost.wood; t.stock.stone-=cost.stone; t.claimCd=10;
    claimTile(a.claimIdx%TW,Math.floor(a.claimIdx/TW),t.id);
    landProvocation(t,a.claimTx,a.claimTy);
    a.claimTx=null; a.claimTy=null; a.claimIdx=null;
  }
  return true;
}
/* v5: فرسودگی ساختمان‌ها — سازنده‌ها آسیب‌دیده‌ترین ساختمان قبیله (زیر ۵۰٪) را اول تعمیر می‌کنند؛ تعمیر از ساختن تازه ارزان‌تر است */
const DECAY_RATE={tent:0.1,house:0.03,farm:0.04,pasture:0.04,school:0.02,university:0.015,hospital:0.02,market:0.025,workshop:0.03,wall:0.012,tower:0.012,barracks:0.02,command:0.015,armory:0.02,bakery:0.03,granary:0.025,smithy:0.03,butcher:0.035,library:0.02,clinic:0.02,inn:0.03,castle:0.008};
function decayRate(b){ let r=DECAY_RATE[b.type]||0.025; if(!b.tribeId||b.ruin) r*=2.5; return r; } // بی‌صاحب ۲٫۵ برابر سریع‌تر می‌پوسد
function repairStep(a,t,dt,speed){
  if(!t) return false;
  let worst=null,worstFrac=1;
  for(const b of S.buildings){
    if(b.tribeId!==t.id||b.progress<100) continue;
    const frac=(b.hp??b.maxHp)/(b.maxHp||60);
    if(frac<0.5&&frac<worstFrac){ worst=b; worstFrac=frac; }
  }
  if(!worst) return false;
  if(t.stock.wood<2||t.stock.stone<1) return false; // مصالح نیست — تعمیر نمی‌شود
  a.goal='تعمیر '+BUILDINGS[worst.type].name;
  if(!moveToward(a,worst.x,worst.y,dt,speed)) return true;
  a.workT=(a.workT||0)+dt;
  if(a.workT>=2){
    a.workT=0;
    if(t.stock.wood<2||t.stock.stone<1) return true;
    t.stock.wood-=2; t.stock.stone-=1;
    worst.hp=Math.min(worst.maxHp,(worst.hp??worst.maxHp)+Math.round(worst.maxHp*0.25));
    if(worst.hp>=worst.maxHp*0.5) floater(worst.x,worst.y-16,'تعمیر شد','#a7f3d0');
  }
  return true;
}
function builderStep(a,t,dt,speed,know){
  if(t&&repairStep(a,t,dt,speed)) return true; // v5: تعمیر اول — ساختمان آسیب‌دیده اولویت دارد
  const job=S.buildQueue.find(q=>q.tribeId===(t?t.id:null));
  if(!job){ if(t&&roadStep(a,t,dt,speed)) return true; if(t&&interRoadStep(a,t,dt,speed)) return true; if(t&&claimStep(a,t,dt,speed)) return true; return gatherStep(a,t,dt,speed,know); }
  const b=S.buildings.find(x=>x.id===job.buildingId);
  if(!b){ S.buildQueue.splice(S.buildQueue.indexOf(job),1); return true; }
  a.goal='ساختن '+BUILDINGS[b.type].name;
  if(!moveToward(a,b.x,b.y,dt,speed)) return true;
  b.progress=clamp(b.progress+dt*(10+10*know)*(t&&hasTech(t,'math')?1.3:1),0,100);
  if(b.progress>=100){
    const qi=S.buildQueue.findIndex(q=>q.buildingId===b.id); if(qi>=0) S.buildQueue.splice(qi,1);
    claimForBuilding(b); // v5 (tiles): ساختمان کامل‌شده سرزمین می‌گیرد
    if(t) t.lastBuiltT=S.elapsed; // ساختمان تازه رضایت از رهبر را بالا می‌برد
    if(t) logEvent(t.name+' یک «'+BUILDINGS[b.type].name+'» ساخت!','good');
    else logEvent('یک «'+BUILDINGS[b.type].name+'» ساخته شد!','good');
    floater(b.x,b.y-20,'ساخته شد!','#fde68a');
    if(t&&b.type==='school') logEvent('اولین مدرسه‌ی '+t.name+' ساخته شد — بچه‌ها حالا درس می‌خوانند!','good');
    if(t&&b.type==='market') logEvent('بازار '+t.name+' باز شد — تجارت با سکه شروع شد!','good');
  }
  return true;
}
function warriorStep(a,t,dt,speed,know){
  if(!t){ // بی‌قبیله: فقط دور خودش گشت می‌زند
    a.goal='گشت‌زنی';
    if(!a.patrol||Math.hypot(a.patrol.x-a.x,a.patrol.y-a.y)<20){ a.patrol={x:a.x+rand(-120,120),y:a.y+rand(-120,120)}; }
    moveToward(a,a.patrol.x,a.patrol.y,dt,speed*0.7);
    return true;
  }
  a.raidCd=Math.max(0,(a.raidCd||0)-dt);
  const enemy=warTarget(t);
  if(enemy&&a.raidCd<=0){
    a.goal='حمله به '+enemy.name;
    if(a.raidTx==null){ a.raidTx=enemy.centre.x+rand(-40,40); a.raidTy=enemy.centre.y+rand(-40,40); }
    if(moveToward(a,a.raidTx,a.raidTy,dt,speed)){
      a.raidCd=30; a.raidTx=null; a.raidTy=null;
      // دیوار و برج دفاعی: غارت کمتر می‌شود و برج به مهاجم آسیب می‌زند
      const walls=S.buildings.filter(b=>b.tribeId===enemy.id&&b.type==='wall'&&b.progress>=100).length;
      const towers=S.buildings.filter(b=>b.tribeId===enemy.id&&b.type==='tower'&&b.progress>=100).length;
      if(towers>0){ a.health-=10*towers; a.combatT=8; floater(a.x,a.y-18,'برج دفاعی حمله کرد!','#fda4af'); if(a.health<=0){ killAgent(a,'جنگ'); return true; } }
      const steal=Math.max(0,Math.min(8,enemy.stock.food)-walls);
      enemy.stock.food-=steal; t.stock.food+=steal;
      S.fights++;
      const def=nearestAgentOfTribe(enemy,a.x,a.y,60);
      if(def) raidFight(a,def);
      if(Math.random()<0.5) logEvent('جنگجوی '+t.name+' به '+enemy.name+' حمله کرد و '+fa(steal)+' غذا دزدید!','bad');
      addGrievance(enemy,t,2); // دزدی کینه می‌سازد
    }
    return true;
  }
  // محاصره: نزدیک خانه‌ی دشمن، جنگجو به نزدیک‌ترین ساختمان دشمن حمله می‌کند
  if(enemy&&Math.hypot(a.x-enemy.home.x,a.y-enemy.home.y)<320){
    let b=null,bd=Infinity;
    for(const bb of S.buildings){ if(bb.tribeId!==enemy.id||bb.progress<100) continue; const d=(bb.x-a.x)**2+(bb.y-a.y)**2; if(d<bd){bd=d;b=bb;} }
    if(b){
      // برج‌های دشمن به محاصره‌کننده شلیک می‌کنند
      for(const tw of S.buildings){
        if(tw.tribeId===enemy.id&&tw.type==='tower'&&tw.progress>=100&&Math.hypot(tw.x-a.x,tw.y-a.y)<150){
          a.health-=5*(1+0.5*((tw.level||1)-1))*dt; a.combatT=8;
          if(a.health<=0){ killAgent(a,'جنگ'); return true; }
        }
      }
      a.goal='محاصره‌ی '+BUILDINGS[b.type].name;
      if(Math.hypot(b.x-a.x,b.y-a.y)<30){ attackBuilding(a,b,dt); return true; }
      moveToward(a,b.x,b.y,dt,speed); return true;
    }
  }
  a.goal='گشت‌زنی';
  if(!a.patrol||Math.hypot(a.patrol.x-a.x,a.patrol.y-a.y)<20){ a.patrol={x:t.centre.x+rand(-150,150),y:t.centre.y+rand(-150,150)}; }
  moveToward(a,a.patrol.x,a.patrol.y,dt,speed*0.7);
  // تمرین در سربازخانه
  if(S.buildings.some(b=>b.tribeId===t.id&&b.type==='barracks'&&b.progress>=100)) a.training=clamp((a.training||0)+dt*0.01,0,1);
  return true;
}
function scholarStep(a,t,dt,speed,know){
  if(!t){ a.goal='اندیشیدن'; a.knowledge=clamp(a.knowledge+dt*0.008,0,1); return true; }
  const uni=S.buildings.find(b=>b.tribeId===t.id&&b.type==='university'&&b.progress>=100);
  const sch=uni||S.buildings.find(b=>b.tribeId===t.id&&b.type==='school'&&b.progress>=100);
  const lib=hasBuilding(t,'library');
  let rp=0.8*(lib?1.5:1); // کتابخانه: پژوهش ۱٫۵ برابر
  if(sch){
    a.goal=uni?'پژوهش در دانشگاه':'آموزش در مدرسه';
    if(!moveToward(a,sch.x,sch.y,dt,speed)) return true;
    rp=(uni?2.2:1.4)*(lib?1.5:1); a.knowledge=clamp(a.knowledge+dt*0.02*(lib?1.5:1),0,1);
  } else {
    // مدرسه نیست: به‌جای ایستادن سر جا، آهسته پرسه می‌زند و فکر می‌کند
    a.goal='اندیشیدن و پرسه زدن';
    a.wanderT-=dt; if(a.wanderT<=0){a.wanderT=rand(2,4);a.angle=rand(Math.PI*2);}
    a.x+=Math.cos(a.angle)*speed*0.35*dt; a.y+=Math.sin(a.angle)*speed*0.35*dt;
  }
  t.research+=rp*know*researchBonus(t)*dt; a.knowledge=clamp(a.knowledge+dt*0.008,0,1); t.culture+=0.02*dt; // مشاور دربار: پژوهش ۲۵٪ سریع‌تر
  return true;
}
function healerStep(a,t,dt,speed,know){
  if(!t) return gatherStep(a,t,dt,speed,know); // بی‌قبیله درمانگر ندارد — خودش جمع‌آوری می‌کند
  let sick=null,bd=300*300;
  for(const o of S.agents){ if(o.dead||o===a) continue; if(o.combatT>0) continue; // در میانه‌ی نبرد نمی‌شود درمانش کرد
    if(o.tribeId!==t.id) continue; // درمانگر فقط هم‌قبیله‌ای‌ها را درمان می‌کند — بی‌قبیله‌ها از درمان قبیله بی‌بهره‌اند
    if(o.health<60||o.plague>0){ const d=(o.x-a.x)**2+(o.y-a.y)**2; if(d<bd){bd=d;sick=o;} } }
  if(!sick){
    // بیمار نیست: به‌جای ایستادن کنار مرکز، آهسته دور خانه گشت می‌زند
    a.goal='گشت درمان';
    if(t){
      if(!a.patrol||Math.hypot(a.patrol.x-a.x,a.patrol.y-a.y)<20){ const ang=rand(Math.PI*2); a.patrol={x:t.home.x+Math.cos(ang)*120,y:t.home.y+Math.sin(ang)*120}; }
      moveToward(a,a.patrol.x,a.patrol.y,dt,speed*0.5);
    }
    return true;
  }
  a.goal='درمان '+sick.name;
  if(!moveToward(a,sick.x,sick.y,dt,speed)) return true;
  const med=(t&&hasTech(t,'medicine'))?1.6:1;
  const clinic=t&&hasBuilding(t,'clinic')?1.5:1; // درمانگاه: ۱٫۵ برابر سریع‌تر
  sick.health=clamp(sick.health+9*med*clinic*dt,0,100);
  if(sick.plague>0){ sick.plagueT+=dt*2*med; if(sick.plagueT>14){ sick.plague=0; sick.health=clamp(sick.health+20,0,100); } }
  return true;
}
/* v4: قیمت با کمیابی کالا در مقصد بالا می‌رود؛ متحدان ۱۰٪ بهتر می‌خرند */
function tradePrice(seller,buyer,good){
  const cap=good==='food'?foodCap(buyer):STOCK_CAP[good];
  const scarcity=1-((buyer.stock[good]||0)/cap);
  let p=2*(1+scarcity);
  if(isAlly(seller,buyer)) p*=1.1;
  p*=tradeBonus(seller); // خزانه‌دار دربار: تجارت ۱۰٪ سودآورتر
  return Math.max(1,Math.round(p));
}
function traderStep(a,t,dt,speed,know){
  const market=S.buildings.find(b=>b.tribeId===t.id&&b.type==='market'&&b.progress>=100);
  if(!market||!hasTech(t,'money')) return gatherStep(a,t,dt,speed,know);
  a.tradeT=(a.tradeT||0)-dt;
  // اگر مقصد تجاری دارد، اول به بازار مقصد برود
  if(a.tradeDest){
    const dest=tribeById(a.tradeDest);
    const dm=dest?S.buildings.find(b=>b.tribeId===dest.id&&b.type==='market'&&b.progress>=100):null;
    if(!dest||!dm||dest.id===t.id){ a.tradeDest=null; }
    else {
      a.goal='تجارت با '+dest.name;
      if(!moveToward(a,dm.x,dm.y,dt,speed)) return true;
      const good=a.tradeGood, amt=5;
      if(good&&t.stock[good]>=amt){
        const price=tradePrice(t,dest,good);
        const coins=amt*price;
        let done=false;
        if((dest.stock.coins||0)>=coins){
          t.stock[good]-=amt;
          dest.stock[good]=Math.min(good==='food'?foodCap(dest):STOCK_CAP[good],dest.stock[good]+amt);
          dest.stock.coins-=coins; t.stock.coins=Math.min(COIN_CAP,(t.stock.coins||0)+coins);
          done=true;
          if(S.elapsed-(t.tradeLogT||0)>30){ t.tradeLogT=S.elapsed; logEvent('بازرگان '+t.name+' به بازار '+dest.name+' رفت و '+fa(amt)+' '+(good==='food'?'غذا':good==='wood'?'چوب':'سنگ')+' را '+fa(coins)+' سکه فروخت.','good'); }
        } else {
          // تهاتر: کالا با کالا، وقتی مقصد سکه ندارد
          const back=dest.stock.wood>40&&t.stock.wood<40?'wood':dest.stock.stone>40&&t.stock.stone<40?'stone':dest.stock.food>60&&t.stock.food<40?'food':null;
          if(back&&dest.stock[back]>=amt){
            t.stock[good]-=amt; dest.stock[good]=Math.min(good==='food'?foodCap(dest):STOCK_CAP[good],dest.stock[good]+amt);
            dest.stock[back]-=amt; t.stock[back]=Math.min(back==='food'?foodCap(t):STOCK_CAP[back],t.stock[back]+amt);
            done=true;
            if(S.elapsed-(t.tradeLogT||0)>30){ t.tradeLogT=S.elapsed; logEvent('بازرگان '+t.name+' با '+dest.name+' تهاتر کرد: '+fa(amt)+' '+(good==='food'?'غذا':good==='wood'?'چوب':'سنگ')+' در برابر '+fa(amt)+' '+(back==='food'?'غذا':back==='wood'?'چوب':'سنگ')+'.','good'); }
          }
        }
        if(done) S.tradeCount=(S.tradeCount||0)+1;
      }
      a.tradeDest=null; a.tradeT=hasInterRoad(t,dest)?6:12; return true; // v5: با جاده‌ی مشترک، بازرگان زودتر برمی‌گردد — تجارت بیشتر
    }
  }
  const arr=moveToward(a,market.x,market.y,dt,speed);
  if(!arr){ a.goal='رفتن به بازار'; return true; }
  if(a.tradeT>0){ a.goal='در بازار'; return true; }
  a.goal='تجارت در بازار';
  a.tradeT=8;
  // اول: تجارت بین‌قبیله‌ای با قبیله‌ای که کالا را لازم دارد یا سکه دارد — قبیله‌ی جاده‌دار اول است
  const tradeCands=[...S.tribes].sort((x,y)=>((hasInterRoad(t,y)?1:0)-(hasInterRoad(t,x)?1:0)));
  for(const o of tradeCands){
    if(o.id===t.id||!hasTech(o,'money')) continue;
    const r=t.relations[o.id]||0;
    if(r<=0&&!isAlly(t,o)) continue;
    const om=S.buildings.find(b=>b.tribeId===o.id&&b.type==='market'&&b.progress>=100);
    if(!om) continue;
    const surplus=t.stock.food>60?'food':t.stock.wood>60?'wood':t.stock.stone>40?'stone':null;
    if(!surplus) break;
    const need=o.stock.food<20?'food':o.stock.wood<20?'wood':o.stock.stone<15?'stone':null;
    const theyHaveCoins=(o.stock.coins||0)>=10;
    if((need&&need===surplus)||theyHaveCoins){ a.tradeDest=o.id; a.tradeGood=surplus; a.goal='رفتن به بازار '+o.name; return true; }
  }
  // تجارت داخلی: فروش مازاد و خرید کمبود (سقف سکه رعایت می‌شود)
  if(t.stock.food>40&&(t.stock.coins||0)<COIN_CAP){ t.stock.food-=10; t.stock.coins+=12; floater(market.x,market.y-16,'+۱۲ سکه','#fde68a'); }
  else if(t.stock.wood>40&&(t.stock.coins||0)<COIN_CAP){ t.stock.wood-=10; t.stock.coins+=10; floater(market.x,market.y-16,'+۱۰ سکه','#fde68a'); }
  else if(t.stock.food<20&&(t.stock.coins||0)>=10){ t.stock.coins-=10; t.stock.food=Math.min(foodCap(t),t.stock.food+12); floater(market.x,market.y-16,'خرید غذا','#a7f3d0'); }
  return true;
}
function herderStep(a,t,dt,speed,know){
  const past=S.buildings.find(b=>b.tribeId===t.id&&b.type==='pasture'&&b.progress>=100);
  if(!past){
    let an=null,bd=400*400;
    for(const x of S.animals){ if(!x.tribeId&&!x.wild&&(x.kind==='sheep'||x.kind==='cow')){ const d=(x.x-a.x)**2+(x.y-a.y)**2; if(d<bd){bd=d;an=x;} } }
    if(!an) return gatherStep(a,t,dt,speed,know);
    a.goal='اهلی‌کردن حیوان';
    if(!moveToward(a,an.x,an.y,dt,speed)) return true;
    an.tribeId=t.id; floater(an.x,an.y-14,'اهلی شد!','#a7f3d0');
    return true;
  }
  a.goal='دامداری';
  if(!moveToward(a,past.x,past.y,dt,speed)) return true;
  past.milkT=(past.milkT||0)+dt;
  if(past.milkT>6){ past.milkT=0; const herd=S.animals.filter(x=>x.tribeId===t.id); if(herd.length){ const gain=2*herd.length; t.stock.food=Math.min(foodCap(t),t.stock.food+gain); floater(past.x,past.y-16,'+'+fa(gain)+' غذا','#fde68a'); } }
  return true;
}
function jobStep(a,dt,speed){
  const t=tribeById(a.tribeId);
  if(t&&a.energy<45&&t.stock.food>0){
    a.goal='رفتن به انبار برای غذا';
    if(moveToward(a,t.centre.x,t.centre.y,dt,speed)){
      if((t.stock.meals||0)>0){ t.stock.meals-=1; a.energy=clamp(a.energy+(hasBuilding(t,'bakery')?40:30),0,100); a.goal='خوردن غذای پخته'; }
      else if(t.stock.food>=1){ t.stock.food-=1; a.energy=clamp(a.energy+18,0,100); a.goal='خوردن از انبار'; }
    }
    return true;
  }
  // انبار خالی است؟ خانواده با ثروتش از بازار غذا می‌خرد
  if(t&&a.energy<45&&t.stock.food<=0){
    const market=S.buildings.find(b=>b.tribeId===t.id&&b.type==='market'&&b.progress>=100);
    const fam=agentFamily(a);
    if(market&&fam&&(fam.wealth||0)>=3){
      a.goal='خرید غذا از بازار';
      if(moveToward(a,market.x,market.y,dt,speed)){ fam.wealth-=3; a.energy=clamp(a.energy+18,0,100); a.goal='خرید غذا از بازار'; }
      return true;
    }
  }
  const know=1+a.knowledge*0.5;
  // v5: بی‌سرپناهی اولویت اول است — بزرگسالِ خانواده‌ی بی‌خانه (چادر هم خانه نیست) اول مصالح جمع می‌کند تا سرپناه جور شود؛
  // سازنده‌ها مستثنا هستند چون خودشان دارند خانه/چادر را می‌سازند — وگرنه هیچ خانه‌ای کامل نمی‌شد و همه برای همیشه بی‌خانه می‌ماندند
  if(a.age>=0.4&&a.job!=='builder'&&needsHouse(a)&&!a.protesting&&!(a.jailedUntil&&S.day<a.jailedUntil)){
    const r=gatherStep(a,t,dt,speed,know); a.goal='به دست آوردن سرپناه'; return r;
  }
  switch(a.job){
    case 'gatherer': return gatherStep(a,t,dt,speed,know);
    case 'woodcutter': return woodcutterStep(a,t,dt,speed,know);
    case 'miner': return minerStep(a,t,dt,speed,know);
    case 'farmer': return t?farmerStep(a,t,dt,speed,know):gatherStep(a,t,dt,speed,know);
    case 'builder': return builderStep(a,t,dt,speed,know);
    case 'warrior': return warriorStep(a,t,dt,speed,know);
    case 'guard': return guardStep(a,t,dt,speed,know);
    case 'hunter': return hunterStep(a,t,dt,speed,know);
    case 'scholar': return scholarStep(a,t,dt,speed,know);
    case 'healer': return healerStep(a,t,dt,speed,know);
    case 'trader': return t?traderStep(a,t,dt,speed,know):gatherStep(a,t,dt,speed,know);
    case 'herder': return t?herderStep(a,t,dt,speed,know):gatherStep(a,t,dt,speed,know);
    case 'blacksmith': return blacksmithStep(a,t,dt,speed,know);
    case 'cook': return cookStep(a,t,dt,speed,know);
    case 'sexworker': return sexworkerStep(a,t,dt,speed,know);
  }
  return false;
}

/* ---------------- مرگ و تولد ---------------- */
function killAgent(a,cause,silent){
  if(a.dead) return; a.dead=true; S.deaths++; S.deathsBy[cause]=(S.deathsBy[cause]||0)+1;
  { const tr=tribeById(a.tribeId); if(tr) tr.recentDeaths=(tr.recentDeaths||0)+1; } // مرگ اعضا رضایت از رهبر را کم می‌کند
  if(cause==='جنگ'){ const tr=tribeById(a.tribeId); if(tr) tr.warFatigue=clamp((tr.warFatigue||0)+4,0,100); } // خستگی از جنگ بالا می‌رود
  S.corpses.push({x:a.x,y:a.y,r:a.genes.size*7+6,life:14,energy:14});
  burst(a.x,a.y,cause==='گرسنگی'?'#94a3b8':'#fb7185',12,80);
  floater(a.x,a.y-14,cause,'#fda4af');
  if(S.selected===a){S.selected=null;S.follow=false;updateSelected();}
  if(S.agents.length<10&&!silent) logEvent('جمعیت به زیر ۱۰ رسید! جهان در خطر انقراض است.','bad');
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
      if(Math.random()<0.25) logEvent('جهش مفید در ژن «'+GENE_LABELS[key]+'» — فنوتیپ بهتر شد.','good'); }
    else { S.mutations.harmful++;
      if(Math.random()<0.25) logEvent('جهش مضر در ژن «'+GENE_LABELS[key]+'» — فنوتیپ ضعیف‌تر شد.','bad'); }
  }
  return al;
}
/* ---------------- خانواده ----------------
   خانواده = گروهی از اعضا با ثروت مشترک؛ فرزند به خانواده‌ی والدین می‌پیوندد.
   تولد در خانواده‌ی دارای خانه با نرخ کامل است؛ خانواده‌ی بی‌خانه نمی‌تواند
   بچه‌دار شود (مگر بعد از مدتی طولانی، با نرخ خیلی کم)؛ تولد خارج از خانواده
   (مثلاً از راه روسپی) با نرخ کمتر ممکن است. */
function familyById(id){ return S.families.find(f=>f.id===id); }
function agentFamily(a){ return a.familyId?familyById(a.familyId):null; }
function familyHouse(f){ if(!f) return null; const id=f.houseId||f.renterHouseId; if(!id) return null; const b=S.buildings.find(x=>x.id===id); return b&&b.progress>=100?b:null; }
function isHoused(a){ const f=agentFamily(a); return !!familyHouse(f); }
/* v5: سرپناه — خانه، چادر موقت (۲ روز)، یا بی‌سرپناه. «single» یعنی هنوز خانواده‌ای ندارد (سرپناه به خانواده تعلق دارد). */
function familyTent(f){ if(!f) return null; const b=S.buildings.find(x=>x.type==='tent'&&x.progress>=100&&x.ownerFamilyId===f.id); return b||null; }
function familyShelter(f){ if(!f) return null; if(familyHouse(f)) return 'house'; if(familyTent(f)) return 'tent'; return null; }
function agentShelter(a){ const f=agentFamily(a); if(!f) return 'single'; const s=familyShelter(f); return s||'none'; }
function isHomelessFamily(a){ return agentShelter(a)==='none'; }
function needsHouse(a){ const f=agentFamily(a); if(!f||familyHouse(f)) return false; if(S.buildings.some(b=>b.ownerFamilyId===f.id&&b.progress<100)) return false; return true; } // خانه ندارد و خانه/چادر هم در حال ساخت نیست — چادر هم خانه نیست؛ اولویتش هنوز خانه است
/* v5: تبارها نام دارند، نه شماره — نام از شناسه‌ی تبار به‌صورت قطعی ساخته می‌شود تا بعد از بارگذاری هم همان بماند */
const LINEAGE_A=['آریا','پارس','ماد','سکا','کاسپی','هخا','اشک','ساسان','رستم','کیان','آرش','سیاوش','تهمتن','فریدون','جمشید','بهمن','دارا','کوروش','سهراب','بیژن'];
const LINEAGE_B=['زاد','وند','پور','نژاد','تبار','یان','گان','آباد','دل','رخش','مهر','یار'];
const LINEAGE_C=['کوه','دشت','رود','جنگل','کویر','دریا','شمال','سپید'];
function lineageName(id){
  let s=((+id||0)*2654435761)>>>0;
  const r=()=>{ s=((s*1103515245+12345)>>>0); return s/4294967296; };
  return LINEAGE_A[Math.floor(r()*LINEAGE_A.length)]+LINEAGE_B[Math.floor(r()*LINEAGE_B.length)]+LINEAGE_C[Math.floor(r()*LINEAGE_C.length)];
}
/* v5: رنگ موجود فقط رنگ قبیله‌اش است؛ بی‌قبیله‌ها یک رنگ خنثی دارند. تبار (نژاد) دیگر هیچ‌جا رنگ نمی‌سازد. */
function agentColor(a){ const t=a.tribeId?tribeById(a.tribeId):null; return t?t.color:'#9ca3af'; }
function createFamily(members){
  const f={id:S.nextFamilyId++,members:[],houseId:null,renterHouseId:null,wealth:0,mats:{wood:0,stone:0},rentIncome:0,foundedDay:S.day,houselessSince:S.elapsed};
  S.families.push(f);
  for(const m of members){ if(m&&!m.dead){ m.familyId=f.id; if(!f.members.includes(m.id)) f.members.push(m.id); } }
  return f;
}
function ensureCoupleFamily(a,b){
  const fa=agentFamily(a), fb=agentFamily(b);
  if(fa&&fb&&fa.id===fb.id) return fa;
  if(fa&&!fb){ b.familyId=fa.id; fa.members.push(b.id); return fa; }
  if(fb&&!fa){ a.familyId=fb.id; fb.members.push(a.id); return fb; }
  if(fa&&fb) return fa; // خانواده‌های جدا می‌مانند — تولد خارج از خانواده
  return createFamily([a,b]);
}
function housingFactor(a,b){
  const fa=agentFamily(a), fb=agentFamily(b);
  const shared=fa&&fb&&fa.id===fb.id;
  if(shared){
    if(familyHouse(fa)) return 1;
    if(S.elapsed-(fa.houselessSince||0)>60) return 0.15; // ناامید: بعد از مدتی بی‌خانگی، تولد کم‌احتمال
    return 0; // خانواده‌ی بی‌خانه نمی‌تواند بچه‌دار شود — اول باید خانه بسازد، بخرد یا اجاره کند
  }
  return 0.25; // خارج از چارچوب خانواده — احتمال کمتر
}
function reproduce(a,b,outOfFamily){
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
  c.tribeId=a.tribeId; c.job=null; c.manualJob=false; c.knowledge=rand(0,0.1);
  c.inbreedF=F;
  a.sexNeed=0; b.sexNeed=0;
  if(F>0){ // افسردگی هم‌خونی: سلامتی و عمر کمتر، گاهی مرگ در بدو تولد
    c.health=clamp(100-F*140,15,100); c.lifespan*=(1-F*0.7);
    if(F>=0.25&&Math.random()<0.35){
      S.deaths++; S.deathsBy['هم‌خونی']=(S.deathsBy['هم‌خونی']||0)+1;
      logEvent('فرزند '+a.name+' و '+b.name+' به‌خاطر هم‌خونی (F=٪'+fa(Math.round(F*100))+') در بدو تولد مرد.','bad');
      a.children++;b.children++;a.energy-=18;b.energy-=18;a.mateCd=9;b.mateCd=9; return;
    }
    if(Math.random()<0.4) logEvent('فرزند هم‌خون متولد شد (ضریب هم‌خونی ٪'+fa(Math.round(F*100))+') — ضعیف‌تر از معمول.','bad');
  }
  a.children++;b.children++;a.energy-=18;b.energy-=18;a.mateCd=9;b.mateCd=9;
  // خانواده: فرزند به خانواده‌ی والدین می‌پیوندد (خارج از خانواده: خانواده‌ی تک‌والد)
  const fam=outOfFamily?(agentFamily(a)||createFamily([a])):ensureCoupleFamily(a,b);
  c.familyId=fam.id; if(!fam.members.includes(c.id)) fam.members.push(c.id);
  S.agents.push(c); S.births++;
  burst(c.x,c.y,'#fbbf24',10,70); floater(c.x,c.y-16,'نوزاد نسل '+fa(c.gen),'#fde68a');
  if(c.gen>=5&&Math.random()<.3) logEvent(c.name+' از نسل '+fa(c.gen)+' متولد شد ('+c.parentNames+').','good');
}

/* ---------------- ساخت‌وساز، پژوهش، حیوانات، دوربین، رابط تمدن ---------------- */
function queueBuilding(t,type,x,y,auto,ownerFam){
  const def=BUILDINGS[type];
  if(def.tech&&!hasTech(t,def.tech)){ if(!auto) toast('اول باید فناوری «'+TECHS.find(z=>z.id===def.tech).name+'» را کشف کنی'); return false; }
  if(t.stock.wood<def.wood||t.stock.stone<def.stone){ if(!auto) toast('منابع کافی نیست: '+fa(def.wood)+' چوب و '+fa(def.stone)+' سنگ لازم است'); return false; }
  t.stock.wood-=def.wood; t.stock.stone-=def.stone;
  // v5 (tiles): ساخت‌وساز قبیله فقط درون سرزمین خودش — بیرون از قلمرو، به نزدیک‌ترین خانه‌ی سرزمین کشیده می‌شود
  if(t&&t.home){ const owner=tileOwnerAt(x,y); if(owner!==t.id){ const p=nearestOwnedPoint(t,x,y); x=p.x; y=p.y; } }
  const b=newBuilding(t.id,type,x,y,ownerFam);
  S.buildings.push(b);
  S.buildQueue.push({tribeId:t.id,type,buildingId:b.id});
  if(!auto) logEvent(t.name+' ساخت «'+def.name+'» را شروع کرد.','good');
  return b;
}
function animalsTick(dt){
  for(const an of S.animals){
    if(an.dead) continue;
    an.wanderT-=dt; if(an.wanderT<=0){ an.wanderT=rand(2,5); an.angle=rand(Math.PI*2); }
    const past=an.tribeId!=null?S.buildings.find(b=>b.tribeId===an.tribeId&&b.type==='pasture'&&b.progress>=100):null;
    if(past&&Math.hypot(an.x-past.x,an.y-past.y)>130){ an.angle=Math.atan2(past.y-an.y,past.x-an.x); }
    const sp=an.tribeId!=null?10:16;
    an.x+=Math.cos(an.angle)*sp*dt; an.y+=Math.sin(an.angle)*sp*dt;
    an.x=clamp(an.x,20,WORLD_W-20); an.y=clamp(an.y,20,WORLD_H-20);
    an.age+=dt/60;
  }
  S.animals=S.animals.filter(x=>!x.dead);
  S.breedT=(S.breedT||0)+dt;
  if(S.breedT>8){ S.breedT=0;
    if(S.animals.length<30){
      const adults=S.animals.filter(x=>!x.dead&&x.age>0.5);
      if(adults.length>=2){
        const a1=pick(adults);
        const a2=adults.find(x=>x!==a1&&x.kind===a1.kind&&Math.hypot(x.x-a1.x,x.y-a1.y)<80);
        if(a2) S.animals.push({x:a1.x+rand(-20,20),y:a1.y+rand(-20,20),kind:a1.kind,tribeId:a1.tribeId,health:100,age:0,wanderT:rand(0,2),angle:rand(Math.PI*2),dead:false});
      }
    }
  }
}
function civTick(dt){
  /* v5 (tiles): فاصله‌ی سرزمین‌ها هر ۵ ثانیه کش می‌شود؛ برج‌ها و قلعه‌ها از قلمرو دفاع می‌کنند */
  S.terrDistT=(S.terrDistT||0)-dt; if(S.terrDistT<=0){ S.terrDistT=5; updateTerritoryDistances(); }
  S.borderT=(S.borderT||0)-dt; if(S.borderT<=0){ S.borderT=5; borderTensionTick(5); } // v5: تنش مرزی و خانه‌های مورد مناقشه هر ۵ ثانیه
  territoryDefenseTick(dt);
  /* v4: رویش درخت متعادل‌تر — آهسته‌تر، با نهال که باید بالغ شود؛ چوب واقعاً محدود می‌شود */
  if(S.trees.length<165&&Math.random()<dt*0.12) S.trees.push({x:rand(40,WORLD_W-40),y:rand(40,WORLD_H-40),amount:1,kind:'tree',sapling:true});
  if(S.stones.length<65&&Math.random()<dt*0.3) S.stones.push({x:rand(40,WORLD_W-40),y:rand(40,WORLD_H-40),amount:4,kind:'stone'});
  animalsTick(dt);
  wildTick(dt);
  for(const t of S.tribes){
    if(!t.home) t.home={x:t.centre.x,y:t.centre.y}; // خانه‌ی ثابت قبیله؛ مرکز قبیله دیگر با میانگین اعضا جابه‌جا نمی‌شود
    const schools=S.buildings.filter(b=>b.tribeId===t.id&&b.type==='school'&&b.progress>=100).length;
    const unis=S.buildings.filter(b=>b.tribeId===t.id&&b.type==='university'&&b.progress>=100).length;
    const libs=S.buildings.filter(b=>b.tribeId===t.id&&b.type==='library'&&b.progress>=100).length;
    t.research+=(schools*0.15+unis*0.4+libs*0.3)*researchBonus(t)*dt; // مشاور دربار: پژوهش ۲۵٪ سریع‌تر
    t.culture+=(schools*0.05+unis*0.1)*dt;
    if(t.culture>=50*(t.festivals+1)){ t.festivals++; t.festivalUntil=S.elapsed+20; logEvent('جشنواره‌ی '+t.name+' برگزار شد! فرهنگ بالا رفت — اعضا شادتر و بارورتر شدند.','good'); }
    if(!t.researchTarget||t.techs[t.researchTarget]){ const av=availableTechs(t); t.researchTarget=av.length?av.sort((a,b)=>a.cost-b.cost)[0].id:null; }
    const target=t.researchTarget?TECHS.find(x=>x.id===t.researchTarget):null;
    if(target&&t.research>=target.cost){
      t.research-=target.cost; t.techs[target.id]=true; t.researchTarget=null;
      logEvent(t.name+' فناوری «'+target.name+'» را کشف کرد! ('+AGES[target.age]+')','good');
      if(target.id==='money') logEvent('پول اختراع شد! حالا می‌توان بازار ساخت و با سکه تجارت کرد.','good');
      if(target.id==='writing') logEvent('نوشتار کشف شد — حالا می‌شود دانشگاه ساخت.','good');
      if(target.id==='medicine') logEvent('پزشکی کشف شد — حالا می‌شود بیمارستان ساخت.','good');
    }
    /* v4: دوستی آهسته فراموش می‌شود، کینه خیلی آهسته‌تر — دشمنی‌ها می‌مانند */
    for(const o of S.tribes){ if(o.id!==t.id){ const r=t.relations[o.id]||0; const rate=r>=0?0.001:0.0002;
      // v5 (tiles): اصطکاک مرزی — وقتی سرزمین‌ها به هم می‌رسند، رابطه به‌جای صفر به سمت ۲۵- می‌رود
      const overlap=territoryDist(t,o)<60;
      let target=overlap?-25:0;
      if(hasInterRoad(t,o)) target=Math.max(target,5); // جاده‌ی مشترک اعتماد می‌سازد — رابطه به سمت ۵+ می‌رود
      t.relations[o.id]=r+(target-r)*rate*dt; } }
    t.warFatigue=clamp((t.warFatigue||0)-dt*0.1,0,100);
    diplomacyTick(t,dt);
    interRoadTick(t,dt); // v5: جاده‌ی بین‌قبیله‌ای با قبیله‌ی دوست
    needsTick(t,dt);
    satisfactionTick(t,dt); // دربار، رضایت، اعتراض و انقلاب
    collapseTick(t,dt); // قبیله‌ی خیلی کوچک یا ناتوان — با مهلت یک‌روزه
    const memN=tribeMembers(t).length;
    const houseN=S.buildings.filter(b=>b.tribeId===t.id&&b.type==='house').length+S.buildQueue.filter(q=>q.tribeId===t.id&&q.type==='house').length;
    const houseWant=Math.min(3,1+Math.floor(memN/30));
    if(houseN<houseWant&&t.stock.wood>=10&&t.stock.stone>=5){
      queueBuilding(t,'house',t.centre.x+rand(-60,60),t.centre.y+rand(-60,60),true);
    }
    const farmN=S.buildings.filter(b=>b.tribeId===t.id&&b.type==='farm').length+S.buildQueue.filter(q=>q.tribeId===t.id&&q.type==='farm').length;
    const farmWant=hasTech(t,'farming')?Math.min(4,1+Math.floor(memN/40)):0;
    if(farmN<farmWant&&t.stock.wood>=8){
      queueBuilding(t,'farm',t.centre.x+rand(-90,90),t.centre.y+rand(-90,90),true);
    }
    // مازاد منابع به زیرساخت می‌رسد: دیوار، برج، سربازخانه، مرکز فرماندهی، اسلحه‌خانه
    autoInfra(t);
    // کاشتن درخت نزدیک خانه وقتی درخت‌های اطراف کم شده‌اند (کار است، نه خرج غذا)
    t.plantCd=Math.max(0,(t.plantCd||0)-dt);
    if(t.plantCd<=0){
      let near=0; for(const tr of S.trees){ if((tr.x-t.home.x)**2+(tr.y-t.home.y)**2<300*300) near++; }
      if(near<4){ t.plantCd=12;
        S.trees.push({x:t.home.x+rand(-130,130),y:t.home.y+rand(-130,130),amount:1,kind:'tree',sapling:true});
        if(!t.plantedLogged){ t.plantedLogged=true; logEvent(t.name+' یاد گرفت نزدیک خانه درخت بکارد — منابع محلی تجدید می‌شوند.','good'); }
      }
    }
    // جابه‌جایی خانه فقط وقتی منابع اطراف صفر شده و راه تولید غذا نیست
    t.relocT=(t.relocT||0)+dt;
    if(t.relocT>30){ t.relocT=0; checkRelocate(t); }
  }
  // انحلال قبیله‌هایی که مهلت یک‌روزه‌شان تمام شده (بعد از حلقه، تا حلقه به‌هم نریزد)
  for(const t of [...S.tribes]) if(t.collapseDue){ const r=t.collapseReason||'نیروی کار/غذای کافی نداشت'; t.collapseDue=false; collapseTribe(t,r); }
  // قبیله‌سازی از افراد قوی بی‌قبیله، وفاداری و ترک قبیله، خانواده، جنگ، تجهیز
  tryFoundTribes();
  seekTribeTick(dt); // بی‌قبیله‌ها دنبال قبیله می‌گردند و می‌پیوندند
  loyaltyTick(dt);
  familyTick(dt);
  battlesTick(dt);
  S.equipT=(S.equipT||0)+dt; if(S.equipT>5){ S.equipT=0; equipTick(); }
  for(const t of [...S.tribes]) if(!tribeMembers(t).length){ S.tribes.splice(S.tribes.indexOf(t),1); logEvent('قبیله «'+t.name+'» چون عضوی نداشت از بین رفت.','bad'); }
  S.tribeLessT=(S.tribeLessT||0)+dt; if(S.tribeLessT>5){ S.tribeLessT=0; assignTribelessJobs(); }
  // نهال‌ها آهسته رشد می‌کنند (حدود ۸۰ ثانیه تا بلوغ)؛ ساختمان نیمه‌کاره‌ی رها شده منابعش را پس می‌دهد
  for(const tr of S.trees) if(tr.sapling&&tr.amount<5){ tr.amount=Math.min(5,tr.amount+dt*0.05); if(tr.amount>=5) tr.sapling=false; }
  for(const b of [...S.buildings]){
    // v5: فرسودگی — ساختمانِ کامل‌شده آهسته جان می‌دهد (چوبی سریع‌تر از سنگی، بی‌صاحب سریع‌تر)؛ اگر به صفر برسد، فرو می‌ریزد
    if(b.progress>=100&&b.type!=='tent'){
      b.hp=Math.max(0,(b.hp??b.maxHp)-decayRate(b)*dt);
      if(b.hp<=0){ collapseBuilding(b); continue; }
    }
    // v5: چادر فقط ۲ روز عمر می‌کند — بعدش فرسوده می‌شود و خانواده دوباره بی‌سرپناه است (مگر خانه گرفته باشد)
    if(b.type==='tent'&&b.progress>=100&&S.elapsed-(b.createdAt||0)>2*S.settings.dayLength){
      S.buildings.splice(S.buildings.indexOf(b),1);
      const qi=S.buildQueue.findIndex(q=>q.buildingId===b.id); if(qi>=0) S.buildQueue.splice(qi,1);
      logEvent('چادر خانواده‌ای بعد از ۲ روز فرسوده شد — باید خانه بسازند.','bad');
      continue;
    }
    if(b.progress<100&&S.elapsed-(b.createdAt||0)>150){
    const t=tribeById(b.tribeId), def=BUILDINGS[b.type];
    if(t){ t.stock.wood+=def.wood; t.stock.stone+=def.stone; }
    if(b.ownerFamilyId){ const fam=familyById(b.ownerFamilyId); if(fam){ if(!t){ fam.mats.wood=(fam.mats.wood||0)+def.wood; fam.mats.stone=(fam.mats.stone||0)+def.stone; } if(fam.houseId===b.id) fam.houseId=null; } }
    if(b.renterFamilyId){ const fam=familyById(b.renterFamilyId); if(fam&&fam.renterHouseId===b.id) fam.renterHouseId=null; }
    S.buildings.splice(S.buildings.indexOf(b),1);
    const qi=S.buildQueue.findIndex(q=>q.buildingId===b.id); if(qi>=0) S.buildQueue.splice(qi,1);
    if(t) logEvent('ساخت «'+def.name+'» در '+t.name+' نیمه‌کاره ماند؛ منابع برگشت و می‌شود دوباره ساخت.','bad');
  }}
  S.civAcc=(S.civAcc||0)+dt;
  if(S.civAcc>5){ S.civAcc=0; for(const t of S.tribes){ assignJobs(t); } }
}
function localResources(t){ let n=0; for(const r of S.trees){ if((r.x-t.home.x)**2+(r.y-t.home.y)**2<300*300) n++; } for(const r of S.stones){ if((r.x-t.home.x)**2+(r.y-t.home.y)**2<300*300) n++; } return n; }
function checkRelocate(t){
  if(!t.home) t.home={x:t.centre.x,y:t.centre.y};
  if(S.day<2) return; // اول بگذار قبیله جا بیفتد
  const res=localResources(t);
  const prod=S.buildings.some(b=>b.tribeId===t.id&&(b.type==='farm'||b.type==='pasture')&&b.progress>=100);
  let foodNear=0; for(const f of S.foods){ if((f.x-t.home.x)**2+(f.y-t.home.y)**2<400*400){ foodNear++; if(foodNear>=5) break; } }
  // خشکی باید مداوم باشد؛ یکی‌دو درخت یا غذای پراکنده که تازه رسیده‌اند، خشکی نیست
  if(res<=1&&!prod&&t.stock.food<=0&&foodNear<3){
    t.exhaustT=(t.exhaustT||0)+30; // این بررسی هر ۳۰ ثانیه یک بار است
    if(t.exhaustT<120) return; // فقط بعد از ۲ دقیقه خشکی مداوم
  } else {
    if(res>=3||prod||t.stock.food>5||foodNear>=5) t.exhaustT=0;
    return;
  }
  let best=null,bestScore=0;
  for(let i=0;i<24;i++){ const x=rand(150,WORLD_W-150),y=rand(150,WORLD_H-150); let sc=0;
    for(const r of S.trees){ if((r.x-x)**2+(r.y-y)**2<300*300) sc++; }
    for(const r of S.stones){ if((r.x-x)**2+(r.y-y)**2<300*300) sc++; }
    // v5: جابه‌جایی هم با فاصله — نزدیک خانه‌ی قبیله‌ی دیگر نرو
    for(const o of S.tribes){ if(o.id!==t.id&&Math.hypot(x-o.home.x,y-o.home.y)<MIN_TRIBE_DIST) sc*=0.1; }
    if(sc>bestScore){ bestScore=sc; best={x,y}; } }
  if(best&&bestScore>0){ t.home={x:best.x,y:best.y}; t.centre={x:best.x,y:best.y}; t.exhaustT=0; recomputeTerritory(t); // v5 (tiles): سرزمین تازه دور خانه‌ی تازه
    logEvent(t.name+' چون منابع اطراف خانه تمام شده بود و راه تولید غذا نداشت، به خانه‌ای تازه و پرمنبع جابه‌جا شد.','good');
    toast(t.name+' جابه‌جا شد'); }
}
/* ---------------- قبیله‌سازی، وفاداری، خانواده، جنگ ---------------- */
/* v5: حداقل اندازه‌ی قبیله — قبیله‌ی خیلی کوچک ساخته نمی‌شود: رهبر به ۷ پیرو بالغِ وفادارِ نزدیک نیاز دارد (روی هم ۸ بزرگسال) */
const MIN_FOUND_ADULTS=8;
function tryFoundTribes(){
  if(S.tribes.length>=6) return;
  for(const a of S.agents){
    if(a.dead||a.tribeId!=null||a.age<0.4||(a.foundCd||0)>0) continue;
    if(leadershipOf(a)<0.60) { a.foundCd=20; continue; }
    let near=0;
    for(const o of S.agents){ if(o===a||o.dead||o.tribeId!=null||o.age<0.4) continue;
      if((o.loyalty??50)>=40&&Math.hypot(o.x-a.x,o.y-a.y)<220) near++; if(near>=MIN_FOUND_ADULTS-1) break; }
    if(near>=MIN_FOUND_ADULTS-1){ foundTribe(a); return; }
    a.foundCd=20;
  }
}
/* v5: تعلق — زندگی قبیله‌ای بهتر است و بی‌قبیله‌ها دنبال قبیله می‌گردند.
   مزایا فقط برای اعضاست: انبار، محافظت نگهبانان، درمان درمانگر و بیمارستان، خانه و مزرعه‌ی مشترک، بازار.
   بی‌قبیله‌ی بالغ به نزدیک‌ترین قبیله نزدیک می‌شود و درخواست پیوستن می‌دهد؛ قبیله تا وقتی ظرفیت (خانه‌ها) و نیاز به نیروی کار دارد، راحت می‌پذیرد. */
function tribeCap(t){
  const houses=S.buildings.filter(b=>b.tribeId===t.id&&b.type==='house'&&b.progress>=100).length;
  return 12+houses*4; // ظرفیت با خانه بیشتر می‌شود
}
function jobQuotaSum(t){ return Object.values(t.jobs||{}).reduce((s,v)=>s+(v||0),0); }
function seekTribeTick(dt){
  S.seekT=(S.seekT||0)-dt; if(S.seekT>0) return; S.seekT=1;
  for(const a of S.agents){
    if(a.dead||a.tribeId!=null||a.age<0.4) continue;
    a.joinCd=Math.max(0,(a.joinCd||0)-1);
    if(a.joinCd>0) continue;
    let best=null,bd=Infinity;
    for(const t of S.tribes){ const d=Math.hypot(t.home.x-a.x,t.home.y-a.y); if(d<bd){bd=d;best=t;} }
    if(!best) continue;
    if(bd<150){
      const memN=tribeMembers(best).length, cap=tribeCap(best), need=jobQuotaSum(best)-memN;
      if(memN<cap||(need>=5&&memN<cap+5)){
        a.tribeId=best.id; a.loyalty=55; a.job=null; a.tribeSince=S.elapsed; a.wanderGoal=null;
        logEvent(a.name+' به '+best.name+' پیوست.','good'); assignJobs(best);
      } else { a.joinCd=20; } // ظرفیت پر است — قبیله فعلاً عضو تازه نمی‌پذیرد
    } else if(bd<600&&a.energy>35){
      a.wanderGoal={x:best.home.x+rand(-40,40),y:best.home.y+rand(-40,40)}; a.goal='رفتن به سوی قبیله';
    }
  }
}
function loyaltyTick(dt){
  for(const t of S.tribes){
    let chief=S.agents.find(a=>a.id===t.chiefId&&!a.dead);
    if(!chief&&tribeMembers(t).length){
      const next=tribeMembers(t).sort((x,y)=>leadershipOf(y)-leadershipOf(x))[0];
      t.chiefId=next.id; t.stance=next.opinion; chief=next;
      logEvent('رهبر '+t.name+' مرد؛ '+next.name+' رهبر تازه شد.','bad');
    }
    if(chief) t.stance=chief.opinion;
    const cmd=S.buildings.some(b=>b.tribeId===t.id&&b.type==='command'&&b.progress>=100);
    // جذب افراد بی‌قبیله‌ی نزدیک خانه توسط رهبر قوی
    if(chief&&leadershipOf(chief)>0.8&&Math.random()<dt*0.01){
      const cand=S.agents.find(o=>!o.dead&&o.tribeId==null&&o.age>=0.4&&Math.hypot(o.x-t.home.x,o.y-t.home.y)<150);
      if(cand){ cand.tribeId=t.id; cand.loyalty=55; cand.tribeSince=S.elapsed; logEvent(cand.name+' به '+t.name+' پیوست.','good'); }
    }
    for(const a of tribeMembers(t)){
      if(a.id===t.chiefId){ a.loyalty=100; continue; }
      let d=0;
      if(t.stock.food>20) d+=1; else if(t.stock.food<=0) d-=2;
      if(S.elapsed<t.festivalUntil) d+=1;
      if(cmd) d+=0.5;
      if(a.plague>0) d-=1;
      const dd=d<0?d*0.25:d; // وفاداری خیلی آهسته‌تر کم می‌شود — ترک قبیله کار آسانی نیست
      a.loyalty=clamp(a.loyalty+dd*dt*0.2,0,100);
      // ترک قبیله فقط با فشار قوی و پایدار: رضایت خیلی پایین (یا اختلاف شدید با رهبر) که مدتی ادامه داشته باشد،
      // و وفاداری هم به زیر ۱۵ رسیده باشد — یک روز بد باعث رفتن نمی‌شود؛ ماه‌ها نارضایتی می‌خواهد
      const veryUnhappy=(a.satisf??50)<25, strongGap=Math.abs(a.opinion-t.stance)>0.8&&(a.satisf??50)<40;
      if(veryUnhappy||strongGap) a.unhappyT=(a.unhappyT||0)+dt; else a.unhappyT=Math.max(0,(a.unhappyT||0)-dt*2);
      const fleeingCollapse=(t.collapseT||0)>0&&a.loyalty<40;
      if(a.loyalty<15&&(a.unhappyT||0)>240&&(veryUnhappy||strongGap)&&Math.random()<dt*0.01) leaveTribe(a,t);
      else if(fleeingCollapse&&Math.random()<dt*0.02) leaveTribe(a,t);
    }
  }
}
function leaveTribe(a,t){
  a.tribeId=null; a.job=null; a.loyalty=50;
  logEvent(a.name+' از '+t.name+' جدا شد (با عقیده‌ی رهبر مخالف بود).','bad');
  const other=S.tribes.find(o=>o.id!==t.id&&Math.hypot(o.home.x-a.x,o.home.y-a.y)<400);
  if(other&&Math.random()<0.5){ a.tribeId=other.id; a.loyalty=55; a.tribeSince=S.elapsed; logEvent(a.name+' به '+other.name+' پیوست.','good'); }
}
function familyTick(dt){
  S.families=S.families.filter(f=>f.members.some(id=>{ const a=S.agents.find(x=>x.id===id); return a&&!a.dead; }));
  for(const f of S.families){
    // اجاره: هر روز ۱ سکه به مالک خانه می‌رسد؛ اگر مستأجر نتواند بپردازد، بیرون می‌شود
    f.rentT=(f.rentT||0)+dt;
    if(f.rentT>=S.settings.dayLength&&f.renterHouseId){
      f.rentT=0;
      const rb=S.buildings.find(x=>x.id===f.renterHouseId);
      if(f.wealth>=1){ f.wealth-=1; if(rb&&rb.ownerFamilyId){ const own=familyById(rb.ownerFamilyId); if(own){ own.wealth=(own.wealth||0)+1; own.rentIncome=(own.rentIncome||0)+1; } } }
      else { if(rb) rb.renterFamilyId=null; f.renterHouseId=null; logEvent('خانواده‌ای چون اجاره نداشت، از خانه بیرون شد.','bad'); }
    }
    // مالکِ چند خانه: خانواده‌ی ثروتمندِ خانه‌دار می‌تواند خانه‌ی اضافه بخرد تا اجاره دهد (حداکثر ۳ خانه)
    if(familyHouse(f)&&f.wealth>=60){
      const ownedN=S.buildings.filter(b=>b.type==='house'&&b.progress>=100&&b.ownerFamilyId===f.id).length;
      if(ownedN<3){
        const freeInv=S.buildings.find(b=>b.type==='house'&&b.progress>=100&&!b.ownerFamilyId&&!b.renterFamilyId);
        if(freeInv){ f.wealth-=25; freeInv.ownerFamilyId=f.id; logEvent('خانواده‌ای ثروتمند خانه‌ی دیگری خرید تا اجاره دهد.','good'); }
      }
    }
    if(familyHouse(f)) continue; // خانه دارد
    // اگر houseId به ساختمانی اشاره می‌کند که دیگر نیست (برگشت خورده)، پاکش کن
    if(f.houseId&&!S.buildings.some(b=>b.id===f.houseId)) f.houseId=null;
    if(f.renterHouseId&&!S.buildings.some(b=>b.id===f.renterHouseId)) f.renterHouseId=null;
    // چادر موقت اول: اگر چادر ندارد و چادری هم در حال ساخت نیست و مصالح چادر هست، اول چادر بزند — سرپناه ۲ روزه تا خانه جور شود
    // (با سکه فقط وقتی چادر می‌خرد که خانه‌ای برای اجاره نباشد — اجاره‌ی ۳ سکه‌ای بهتر از چادر ۴ سکه‌ای است)
    // نگهبانِ چادرِ در حال ساخت: بدون آن، هر تیک یک چادر تازه در صف می‌رفت و همه‌ی چوبِ قبیله را می‌بلعید
    if(!familyTent(f)&&!S.buildings.some(b=>b.type==='tent'&&b.ownerFamilyId===f.id&&b.progress<100)){
      const member0=S.agents.find(a=>a.familyId===f.id&&!a.dead);
      const t0=member0?tribeById(member0.tribeId):null;
      const rentable=S.buildings.some(b=>b.type==='house'&&b.progress>=100&&!b.renterFamilyId&&b.ownerFamilyId!==f.id);
      if(t0&&t0.stock.wood>=2){ const b=queueBuilding(t0,'tent',t0.home.x+rand(-80,80),t0.home.y+rand(-80,80),true,f.id); if(b) logEvent('خانواده‌ای بی‌خانه چادر زد (۲ روز مهلت تا خانه بسازد).','good'); }
      else if(f.mats&&f.mats.wood>=2){ f.mats.wood-=2; const m=member0||{x:1200,y:900}; const b=newBuilding(null,'tent',m.x+rand(-40,40),m.y+rand(-40,40),f.id); S.buildings.push(b); S.buildQueue.push({tribeId:null,type:'tent',buildingId:b.id}); logEvent('خانواده‌ای بی‌خانه چادر زد (۲ روز مهلت تا خانه بسازد).','good'); }
      else if(!t0&&f.wealth>=4&&!rentable){ f.wealth-=4; const m=member0||{x:1200,y:900}; const b=newBuilding(null,'tent',m.x+rand(-40,40),m.y+rand(-40,40),f.id); S.buildings.push(b); S.buildQueue.push({tribeId:null,type:'tent',buildingId:b.id}); logEvent('خانواده‌ای بی‌خانه با ۴ سکه چادر خرید.','good'); }
    }
    // خانه‌ای در صف ساخت برای این خانواده هست؟ صبر کن — دوباره در صف نگذار
    if(S.buildings.some(b=>b.ownerFamilyId===f.id&&b.progress<100)) continue;
    const free=S.buildings.find(b=>b.type==='house'&&b.progress>=100&&!b.ownerFamilyId&&!b.renterFamilyId);
    // خانه‌ی مالک‌دارِ خالی برای اجاره/خرید — ولی نه خانه‌ای که خود مالک در آن زندگی می‌کند
    const rentedHouse=S.buildings.find(b=>{ if(b.type!=='house'||b.progress<100||!b.ownerFamilyId||b.ownerFamilyId===f.id||b.renterFamilyId) return false; const own=familyById(b.ownerFamilyId); return !own||own.houseId!==b.id; });
    // خرید: اول خانه‌ی بی‌صاحب، بعد خانه‌ی مالک‌دارِ خالی (۲۵ سکه به مالک می‌رسد)
    if(f.wealth>=25){
      if(free){ f.wealth-=25; free.ownerFamilyId=f.id; f.houseId=free.id; f.houselessSince=S.elapsed; logEvent('خانواده‌ای خانه‌ای خرید (۲۵ سکه).','good'); continue; }
      if(rentedHouse){ f.wealth-=25; const own=familyById(rentedHouse.ownerFamilyId); if(own) own.wealth=(own.wealth||0)+25; rentedHouse.ownerFamilyId=f.id; f.houseId=rentedHouse.id; f.houselessSince=S.elapsed; logEvent('خانواده‌ای خانه‌ی مالکی را خرید (۲۵ سکه).','good'); continue; }
    }
    // اجاره: اول خانه‌ی مالک‌دار (۳ سکه‌ی اول + ۱ سکه در روز به مالک می‌رسد)، بعد خانه‌ی بی‌صاحب
    if(f.wealth>=3){
      if(rentedHouse){ f.wealth-=3; const own=familyById(rentedHouse.ownerFamilyId); if(own){ own.wealth=(own.wealth||0)+3; own.rentIncome=(own.rentIncome||0)+3; } f.renterHouseId=rentedHouse.id; rentedHouse.renterFamilyId=f.id; f.houselessSince=S.elapsed; continue; }
      if(free){ f.wealth-=3; f.renterHouseId=free.id; free.renterFamilyId=f.id; f.houselessSince=S.elapsed; continue; }
    }
    const member=S.agents.find(a=>a.familyId===f.id&&!a.dead);
    if(!member) continue;
    const t=tribeById(member.tribeId);
    if(t&&t.stock.wood>=10&&t.stock.stone>=5){
      const b=queueBuilding(t,'house',t.home.x+rand(-80,80),t.home.y+rand(-80,80),true,f.id);
      if(b){ f.houseId=b.id; f.houselessSince=S.elapsed; }
    } else if(!t&&f.wealth>=20){
      f.wealth-=20;
      const b=newBuilding(null,'house',member.x+rand(-40,40),member.y+rand(-40,40),f.id);
      S.buildings.push(b); S.buildQueue.push({tribeId:null,type:'house',buildingId:b.id}); f.houseId=b.id; f.houselessSince=S.elapsed;
    } else if(f.mats&&f.mats.wood>=10&&f.mats.stone>=5){
      f.mats.wood-=10; f.mats.stone-=5;
      const b=newBuilding(null,'house',member.x+rand(-40,40),member.y+rand(-40,40),f.id);
      S.buildings.push(b); S.buildQueue.push({tribeId:null,type:'house',buildingId:b.id}); f.houseId=b.id; f.houselessSince=S.elapsed;
    }
  }
}
/* v4: انبار دیگر بی‌پایان نمی‌ماند — مازاد مداوم و دیده‌شده خرج می‌شود:
   اول زیرساخت پایه، بعد ارتقای ساختمان‌ها، بعد خانه/مزرعه‌ی بیشتر، بعد فروش مازاد به کاروان‌ها.
   دلیل انبارش قبلی: autoInfra قدیمی فقط وقتی چوب≥۲۰۰ و سنگ≥۱۰۰ بود یک ساختمان می‌ساخت و
   وقتی هر ۶ زیرساخت ساخته می‌شد، هیچ سینکی نمی‌ماند — چوب/سنگ تا سقف می‌رفتند و می‌ماندند. */
function autoInfra(t){
  const has=(type)=>S.buildings.some(b=>b.tribeId===t.id&&b.type===type)||S.buildQueue.some(q=>q.tribeId===t.id&&q.type===type);
  const count=(type)=>S.buildings.filter(b=>b.tribeId===t.id&&b.type===type).length+S.buildQueue.filter(q=>q.tribeId===t.id&&q.type===type).length;
  const memN=tribeMembers(t).length;
  const logSpend=(txt)=>logEvent(t.name+' '+txt+' — انبار دارد خرج می‌شود.','good');
  // ۱) زیرساخت پایه — هر کدام به محض اینکه منابعش هست (نه فقط وقتی انبار پر است)
  const walls=count('wall');
  if(walls<8&&hasTech(t,'wall')){ const b=queueBuilding(t,'wall',t.home.x+Math.cos(walls*(Math.PI*2/8))*190,t.home.y+Math.sin(walls*(Math.PI*2/8))*190,true); if(b){ logSpend('دیوار ساخت (۱۵ چوب، ۸ سنگ)'); return; } }
  if(!has('tower')&&hasTech(t,'wall')){ const b=queueBuilding(t,'tower',t.home.x+rand(-120,120),t.home.y+rand(-120,120),true); if(b){ logSpend('برج ساخت (۲۰ چوب، ۱۵ سنگ)'); return; } }
  if(!has('castle')&&hasTech(t,'wall')&&memN>=15){ const b=queueBuilding(t,'castle',t.home.x+rand(-140,140),t.home.y+rand(-140,140),true); if(b){ logSpend('قلعه ساخت (۴۰ چوب، ۳۰ سنگ)'); return; } }
  if(!has('barracks')&&hasTech(t,'woodsword')){ const b=queueBuilding(t,'barracks',t.home.x+rand(-100,100),t.home.y+rand(-100,100),true); if(b){ logSpend('سربازخانه ساخت (۲۵ چوب، ۱۵ سنگ)'); return; } }
  if(!has('workshop')&&hasTech(t,'tools')){ const b=queueBuilding(t,'workshop',t.home.x+rand(-100,100),t.home.y+rand(-100,100),true); if(b){ logSpend('کارگاه ساخت (۱۰ چوب، ۴ سنگ)'); return; } }
  if(!has('command')&&hasTech(t,'writing')){ const b=queueBuilding(t,'command',t.home.x+rand(-100,100),t.home.y+rand(-100,100),true); if(b){ logSpend('مرکز فرماندهی ساخت (۳۰ چوب، ۲۰ سنگ)'); return; } }
  if(!has('armory')&&hasTech(t,'copper')){ const b=queueBuilding(t,'armory',t.home.x+rand(-100,100),t.home.y+rand(-100,100),true); if(b){ logSpend('اسلحه‌خانه ساخت (۲۰ چوب، ۱۵ سنگ)'); return; } }
  // ۲) مغازه‌های شغلی — به محض کشف فناوری‌شان
  const shops=[['bakery','pottery'],['granary','pottery'],['smithy','copper'],['butcher','herding'],['library','writing'],['clinic','medicine'],['inn','money']];
  for(const [type,tech] of shops){
    if(!has(type)&&hasTech(t,tech)){ const b=queueBuilding(t,type,t.home.x+rand(-110,110),t.home.y+rand(-110,110),true); if(b){ logSpend('«'+BUILDINGS[type].name+'» ساخت ('+fa(BUILDINGS[type].wood)+' چوب، '+fa(BUILDINGS[type].stone)+' سنگ)'); return; } }
  }
  if(t.stock.wood>=120&&t.stock.stone>=60){
    // ۳) ارتقای ساختمان‌ها — سینک مداوم مازاد
    const up=S.buildings.filter(b=>b.tribeId===t.id&&b.progress>=100&&(b.level||1)<3).sort((a,b)=>(a.level||1)-(b.level||1))[0];
    if(up){
      const def=BUILDINGS[up.type], cw=Math.round(def.wood*0.8*(up.level||1)), cs=Math.round(def.stone*0.8*(up.level||1));
      if(t.stock.wood>=cw&&t.stock.stone>=cs){ t.stock.wood-=cw; t.stock.stone-=cs; up.level=(up.level||1)+1; up.maxHp=buildingHP(up.type,up.level); up.hp=up.maxHp; logSpend('«'+def.name+'» را به سطح '+fa(up.level)+' ارتقا داد ('+fa(cw)+' چوب، '+fa(cs)+' سنگ)'); return; }
    }
    // ۴) خانه و مزرعه‌ی بیشتر با رشد جمعیت
    const houses=count('house'), houseWant=Math.min(6,1+Math.floor(memN/12));
    if(houses<houseWant){ queueBuilding(t,'house',t.home.x+rand(-90,90),t.home.y+rand(-90,90),true); logSpend('خانه‌ی تازه ساخت (۱۰ چوب، ۵ سنگ)'); return; }
    const farms=count('farm'), farmWant=hasTech(t,'farming')?Math.min(6,1+Math.floor(memN/25)):0;
    if(farms<farmWant){ queueBuilding(t,'farm',t.home.x+rand(-110,110),t.home.y+rand(-110,110),true); logSpend('مزرعه‌ی تازه ساخت (۸ چوب)'); return; }
  }
  // ۴) فروش مازاد به کاروان‌های عبوری — سکه می‌شود، نه انبار (خزانه‌دار: ۲ سکه بیشتر)
  const carav=tradeBonus(t)>1?2:0;
  if(t.stock.wood>220){ t.stock.wood-=20; t.stock.coins=Math.min(COIN_CAP,(t.stock.coins||0)+12+carav); logSpend('۲۰ چوب اضافه را '+(12+carav)+' سکه فروخت'); return; }
  if(t.stock.stone>180){ t.stock.stone-=20; t.stock.coins=Math.min(COIN_CAP,(t.stock.coins||0)+10+carav); logSpend('۲۰ سنگ اضافه را '+(10+carav)+' سکه فروخت'); return; }
  if(t.stock.food>foodCap(t)-20&&(t.stock.coins||0)<COIN_CAP){ t.stock.food-=15; t.stock.coins=Math.min(COIN_CAP,(t.stock.coins||0)+10+carav); logSpend('۱۵ غذای اضافه را '+(10+carav)+' سکه فروخت'); return; }
}
function equipTick(){
  for(const t of S.tribes){
    if(!t.armory) t.armory={weapon:{},shield:{},armor:{}};
    for(const a of tribeMembers(t)){
      if(a.job!=='warrior'&&a.job!=='guard'&&a.id!==t.chiefId) continue;
      const curW=a.equip&&a.equip.weapon?WEAPONS[a.equip.weapon].atk:0;
      for(let i=WEAPON_ORDER.length-1;i>=0;i--){ const id=WEAPON_ORDER[i];
        if(WEAPONS[id].atk>curW&&(t.armory.weapon[id]||0)>0){ if(a.equip.weapon) t.armory.weapon[a.equip.weapon]=(t.armory.weapon[a.equip.weapon]||0)+1; t.armory.weapon[id]--; a.equip.weapon=id; break; } }
      const curS=a.equip&&a.equip.shield?SHIELDS[a.equip.shield].def:0;
      for(let i=SHIELD_ORDER.length-1;i>=0;i--){ const id=SHIELD_ORDER[i];
        if(SHIELDS[id].def>curS&&(t.armory.shield[id]||0)>0){ if(a.equip.shield) t.armory.shield[a.equip.shield]=(t.armory.shield[a.equip.shield]||0)+1; t.armory.shield[id]--; a.equip.shield=id; break; } }
      const curA=a.equip&&a.equip.armor?ARMORS[a.equip.armor].def:0;
      for(let i=ARMOR_ORDER.length-1;i>=0;i--){ const id=ARMOR_ORDER[i];
        if(ARMORS[id].def>curA&&(t.armory.armor[id]||0)>0){ if(a.equip.armor) t.armory.armor[a.equip.armor]=(t.armory.armor[a.equip.armor]||0)+1; t.armory.armor[id]--; a.equip.armor=id; break; } }
    }
  }
}
function declareWar(t1,t2,big){
  if(!t1||!t2||t1.id===t2.id) return null;
  if(isAlly(t1,t2)){ logEvent(t1.name+' و '+t2.name+' متحدند — نمی‌توانند با هم بجنگند.','good'); return null; }
  if(inTruce(t1,t2)){ logEvent('آتش‌بس بین '+t1.name+' و '+t2.name+' هنوز تمام نشده است.','good'); return null; }
  if(S.battles.some(b=>(b.t1===t1.id&&b.t2===t2.id)||(b.t1===t2.id&&b.t2===t1.id))) return null;
  const w1=tribeMembers(t1).filter(a=>a.job==='warrior'||a.job==='guard');
  const w2=tribeMembers(t2).filter(a=>a.job==='warrior'||a.job==='guard');
  if(w1.length<1||w2.length<1){ logEvent('جنگ اعلام شد ولی یکی از قبایل جنگجوی کافی ندارد — فقط یورش‌های کوچک ادامه دارد.','bad'); return null; }
  t1.relations[t2.id]=-60; t2.relations[t1.id]=-60;
  cutInterRoad(t1,t2); // v5: با شروع جنگ، جاده‌ی بین دو قبیله قطع می‌شود
  const size=big?Math.min(12,Math.max(3,Math.min(w1.length,w2.length))):Math.min(5,Math.max(2,Math.min(w1.length,w2.length)));
  const bx=(t1.home.x+t2.home.x)/2, by=(t1.home.y+t2.home.y)/2;
  const b={id:S.nextBattleId++,t1:t1.id,t2:t2.id,x:bx,y:by,big:!!big,s1:[],s2:[],t:0,state:'march'};
  for(const a of w1.slice(0,size)){ a.battleId=b.id; a.battleSide=1; b.s1.push(a.id); }
  for(const a of w2.slice(0,size)){ a.battleId=b.id; a.battleSide=2; b.s2.push(a.id); }
  S.battles.push(b);
  logEvent('جنگ '+(big?'بزرگ':'کوچک')+' بین '+t1.name+' و '+t2.name+' شروع شد — '+fa(b.s1.length)+' جنگجو در برابر '+fa(b.s2.length)+' جنگجو در میدان نبرد!','bad');
  // پیمان دفاعی: متحدانِ مدافع ممکن است به کمک بیایند
  for(const aid of (t2.allies||[])){
    const ally=tribeById(aid); if(!ally||ally.id===t1.id) continue;
    if(Math.random()<0.6){
      const rw=tribeMembers(ally).filter(a=>a.job==='warrior'||a.job==='guard').slice(0,3);
      for(const a of rw){ a.battleId=b.id; a.battleSide=2; b.s2.push(a.id); }
      if(rw.length){
        ally.relations[t1.id]=clamp((ally.relations[t1.id]||0)-30,-100,100);
        addGrievance(ally,t1,10);
        logEvent(ally.name+' به کمک متحدش '+t2.name+' شتافت و '+fa(rw.length)+' جنگجو فرستاد!','bad');
      }
    }
  }
  return b;
}
function endBattle(b,winnerId){
  const t1=tribeById(b.t1), t2=tribeById(b.t2);
  const win=winnerId===1?t1:t2, lose=winnerId===1?t2:t1;
  if(win&&lose){
    win.warWins=(win.warWins||0)+1; lose.warLosses=(lose.warLosses||0)+1; // برد و باخت جنگ روی رضایت از رهبر اثر می‌گذارد
    const lootF=Math.min(20,lose.stock.food), lootW=Math.min(15,lose.stock.wood), lootC=Math.min(10,lose.stock.coins);
    lose.stock.food-=lootF; lose.stock.wood-=lootW; lose.stock.coins-=lootC;
    win.stock.food+=lootF; win.stock.wood+=lootW; win.stock.coins+=lootC;
    win.relations[lose.id]=clamp((win.relations[lose.id]||0)-15,-100,100);
    lose.relations[win.id]=clamp((lose.relations[win.id]||0)-15,-100,100);
    logEvent(win.name+' در نبرد پیروز شد و '+fa(lootF)+' غذا و '+fa(lootW)+' چوب غنیمت گرفت.','bad');
    transferWarSpoils(win,lose); // v5: برنده‌ی جنگ زمین هم می‌گیرد — نوار مرزی + چند خانه‌ی بازنده
    for(const a of tribeMembers(win)) a.loyalty=clamp(a.loyalty+3,0,100);
    for(const a of tribeMembers(lose)) a.loyalty=clamp(a.loyalty-3,0,100);
  }
  for(const id of [...b.s1,...b.s2]){ const a=S.agents.find(x=>x.id===id); if(a){ a.battleId=null; a.battleSide=0; } }
  S.battles.splice(S.battles.indexOf(b),1);
}
function battlesTick(dt){
  for(const b of [...S.battles]){
    b.t+=dt;
    const alive1=b.s1.filter(id=>{ const a=S.agents.find(x=>x.id===id); return a&&!a.dead; });
    const alive2=b.s2.filter(id=>{ const a=S.agents.find(x=>x.id===id); return a&&!a.dead; });
    if(!alive1.length&&!alive2.length){ S.battles.splice(S.battles.indexOf(b),1); continue; }
    if(!alive1.length){ endBattle(b,2); continue; }
    if(!alive2.length){ endBattle(b,1); continue; }
    if(b.t>120){ endBattle(b,alive1.length>=alive2.length?1:2); continue; }
    // خستگی از جنگ: تلفات و طولانی‌شدن جنگ، هر دو طرف را به صلح می‌کشاند
    b.peaceT=(b.peaceT||0)+dt;
    if(b.peaceT>15){
      b.peaceT=0;
      const f1=(tribeById(b.t1)||{warFatigue:0}).warFatigue||0, f2=(tribeById(b.t2)||{warFatigue:0}).warFatigue||0;
      if(((f1>45&&f2>30)||(f2>45&&f1>30)||b.t>150)&&Math.random()<0.5){
        const t1=tribeById(b.t1), t2=tribeById(b.t2);
        if(t1&&t2) offerPeace(t1,t2);
        continue;
      }
    }
  }
  // اعلام جنگ خودکار: تمایل رهبر + کینه + جنگجو — آستانه پایین‌تر، وقفه کوتاه‌تر
  for(const t of S.tribes){
    t.warCd=Math.max(0,(t.warCd||0)-dt);
    if(t.warCd>0) continue;
    const enemy=warTarget(t);
    if(!enemy) continue;
    const app=warAppetite(t);
    const w1=tribeMembers(t).filter(a=>a.job==='warrior'||a.job==='guard').length;
    const w2=tribeMembers(enemy).filter(a=>a.job==='warrior'||a.job==='guard').length;
    const armed1=tribeMembers(t).filter(a=>(a.job==='warrior'||a.job==='guard')&&a.equip&&a.equip.weapon).length;
    const armed2=tribeMembers(enemy).filter(a=>(a.job==='warrior'||a.job==='guard')&&a.equip&&a.equip.weapon).length;
    if(((armed1>=1&&armed2>=1)||(app>0.6&&w1>=2&&w2>=2))&&w1>=1&&w2>=1){ t.warCd=45; enemy.warCd=45; declareWar(t,enemy,app>0.7&&w1>=10&&w2>=10); }
  }
}
function wildTick(dt){
  for(const an of S.animals){
    if(an.dead||!an.wild) continue;
    an.atkCd=Math.max(0,(an.atkCd||0)-dt);
    let prey=null,bd=90*90;
    for(const a of S.agents){ if(a.dead) continue; const d=(a.x-an.x)**2+(a.y-an.y)**2; if(d<bd){bd=d;prey=a;} }
    if(prey){
      const dist=Math.hypot(prey.x-an.x,prey.y-an.y);
      if(dist>8){ an.angle=Math.atan2(prey.y-an.y,prey.x-an.x); an.x+=Math.cos(an.angle)*22*dt; an.y+=Math.sin(an.angle)*22*dt; }
      if(an.atkCd<=0&&dist<26){
        an.atkCd=3;
        const pw=fightPower(prey), aw=an.kind==='bear'?0.9:0.55;
        if(pw+rand(0.3)>=aw){
          an.health-=30; burst(an.x,an.y,'#f43f5e',8,70);
          if(an.health<=0){ an.dead=true; prey.energy=clamp(prey.energy+20,0,100); logEvent(prey.name+' از حمله‌ی '+(an.kind==='bear'?'خرس':'گرگ')+' جان سالم به در برد و آن را کشت.','good'); }
        } else {
          prey.health-=an.kind==='bear'?30:18; prey.energy=Math.max(0,prey.energy-10); prey.combatT=8;
          floater(prey.x,prey.y-14,'حمله‌ی حیوان وحشی!','#fda4af');
          if(prey.health<=0) killAgent(prey,'حیوان وحشی');
        }
      }
    }
  }
  S.wildSpawnT=(S.wildSpawnT||0)+dt;
  const wildN=S.animals.filter(x=>!x.dead&&x.wild).length;
  if(S.wildSpawnT>45&&wildN<9){ S.wildSpawnT=0;
    const kind=Math.random()<0.65?'wolf':'bear';
    S.animals.push({x:rand(60,WORLD_W-60),y:rand(60,WORLD_H-60),kind,tribeId:null,health:kind==='bear'?160:80,age:rand(0.5,2),wanderT:rand(0,2),angle:rand(Math.PI*2),dead:false,wild:true,atkCd:0});
  }
}
function assignTribelessJobs(){
  const pool=['gatherer','woodcutter','miner','hunter','builder','scholar','cook','blacksmith','sexworker']; // بی‌قبیله درمانگر ندارد — درمان از مزایای قبیله است
  for(const a of S.agents){
    if(a.dead||a.tribeId!=null||a.age<0.4||a.job) continue;
    let best=null,bs=-1,second=null,s2=-1;
    for(const j of pool){ const s=jobScore(a,j)+rand(0.15); if(s>bs){s2=bs;second=best;bs=s;best=j;} else if(s>s2){s2=s;second=j;} }
    // روسپی: اکثراً ماده — نر فقط با احتمال ۵۰٪ می‌پذیرد، وگرنه دومین شغل برتر را می‌گیرد
    // (با رد ۸۰٪، تعداد کل روسپی‌ها آن‌قدر کم می‌شد که نیاز جنسی خیلی‌ها بی‌پاسخ می‌ماند)
    if(best==='sexworker'&&a.sex==='♂'&&second&&Math.random()<0.5) best=second;
    a.job=best;
  }
}
/* دوربین */
function screenToWorld(sx,sy){ return {x:CAM.x+sx/CAM.zoom, y:CAM.y+sy/CAM.zoom}; }
function worldToScreen(wx,wy){ return {x:(wx-CAM.x)*CAM.zoom, y:(wy-CAM.y)*CAM.zoom}; }
/* v27: رندر ایزومتریک — false یعنی دوبعدی کشیده شود */
function isoDraw(){
  try{
    if(typeof Iso3D==='undefined'||!Iso3D.init()) return false;
    return !!Iso3D.render();
  }catch(e){ return false; }
}
function isoPick(sx,sy){ // v27: در نمای ایزومتریک، نقطه‌ی صفحه را با ری‌کست به مختصات جهان تبدیل کن
  if(S.view!=='iso'||typeof Iso3D==='undefined') return null;
  try{ return Iso3D.screenToWorld(sx,sy); }catch(e){ return null; }
}
function clampCam(){
  const vw=VW/CAM.zoom, vh=VH/CAM.zoom;
  CAM.x = vw>=WORLD_W ? (WORLD_W-vw)/2 : clamp(CAM.x,-40,WORLD_W-vw+40);
  CAM.y = vh>=WORLD_H ? (WORLD_H-vh)/2 : clamp(CAM.y,-40,WORLD_H-vh+40);
}
function fitCamera(){ CAM.zoom=clamp(Math.min(VW/WORLD_W,VH/WORLD_H),0.5,3); CAM.x=(WORLD_W-VW/CAM.zoom)/2; CAM.y=(WORLD_H-VH/CAM.zoom)/2; CAM.fitted=true; clampCam(); }
function zoomAt(sx,sy,f){ const b=screenToWorld(sx,sy); CAM.zoom=clamp(CAM.zoom*f,0.5,3); const a=screenToWorld(sx,sy); CAM.x+=b.x-a.x; CAM.y+=b.y-a.y; clampCam(); }
function drawMinimap(){
  const mm=$('#minimap'); if(!mm) return;
  const mc=mm.getContext('2d'); if(!mc) return;
  const mw=mm.width, mh=mm.height, sx=mw/WORLD_W, sy=mh/WORLD_H;
  mc.fillStyle='#0a1030'; mc.fillRect(0,0,mw,mh);
  mc.fillStyle='#34d399'; for(const tr of S.trees) mc.fillRect(tr.x*sx-1,tr.y*sy-1,2,2);
  mc.fillStyle='#94a3b8'; for(const st of S.stones) mc.fillRect(st.x*sx-1,st.y*sy-1,2,2);
  for(const tr of S.tribes){
    mc.fillStyle=tr.color; mc.beginPath();
    mc.arc(tr.centre.x*sx,tr.centre.y*sy,Math.max(3,Math.sqrt(tribeMembers(tr).length)*1.2),0,Math.PI*2); mc.fill();
  }
  mc.fillStyle='#fff'; for(const b of S.buildings) mc.fillRect(b.x*sx-1.5,b.y*sy-1.5,3,3);
  mc.strokeStyle='rgba(255,255,255,.9)'; mc.lineWidth=1.5;
  mc.strokeRect(CAM.x*sx,CAM.y*sy,VW/CAM.zoom*sx,VH/CAM.zoom*sy);
}
function renderCiv(){
  const listEl=$('#tribeList'); if(!listEl) return;
  if(!S.tribes.length){
    const tribeless=S.agents.filter(a=>!a.dead&&!a.tribeId).length;
    listEl.innerHTML='<p class="note">هنوز هیچ قبیله‌ای نیست — همه‌ی '+fa(tribeless)+' موجود بی‌قبیله‌اند. افراد قوی به‌زودی قبیله می‌سازند؛ یا روی یک موجود بزن و «تشکیل قبیله» را امتحان کن.</p>';
    $('#tribeDetail').innerHTML='<p class="note">خانواده‌ها: '+fa(S.families.length)+' • نبردهای جاری: '+fa(S.battles.length)+'</p>';
    $('#techTree').innerHTML='<p class="note">فناوری وقتی معنا دارد که قبیله‌ای باشد.</p>';
    $('#buildList').innerHTML='<p class="note">ساختن قبیله‌ای هنوز ممکن نیست — اول باید قبیله‌ای شکل بگیرد.</p>';
    return;
  }
  const t=tribeById(S.selTribe)||S.tribes[0]; if(!t) return; S.selTribe=t.id;
  listEl.innerHTML=S.tribes.map(tr=>{
    const m=tribeMembers(tr).length;
    return '<div class="tribe-row'+(tr.id===t.id?' sel':'')+'" data-civ="tribe:'+tr.id+'">'
      +'<span class="tribe-dot" style="background:'+tr.color+'"></span>'
      +'<div class="tribe-info"><b>'+tr.name+'</b><small>'+AGES[tribeAge(tr)]+' • '+fa(m)+' نفر • '+icon('gene')+' '+fa(Object.keys(tr.techs).length)+' فناوری • '+icon('star')+' فرهنگ '+fa(Math.round(tr.culture))+((tr.allies||[]).length?' • '+icon('alliance')+' '+fa(tr.allies.length)+' متحد':'')+'</small></div>'
      +'<span class="tribe-stock">'+icon('wood')+fa(tr.stock.wood)+' '+icon('stone')+fa(tr.stock.stone)+' '+icon('food')+fa(tr.stock.food)+' '+icon('coin')+fa(tr.stock.coins)+'</span></div>';
  }).join('');
  const members=tribeMembers(t);
  const avgHealth=members.length?members.reduce((s,a)=>s+a.health,0)/members.length:0;
  const target=t.researchTarget?TECHS.find(x=>x.id===t.researchTarget):null;
  const av=availableTechs(t);
  const cur=target||(av.length?av.slice().sort((a,b)=>a.cost-b.cost)[0]:null);
  const jobCounts={}; JOB_LIST.forEach(j=>jobCounts[j]=0);
  for(const a of members) if(a.job) jobCounts[a.job]=(jobCounts[a.job]||0)+1;
  const fest=S.elapsed<t.festivalUntil;
  const chief=S.agents.find(x=>x.id===t.chiefId&&!x.dead);
  const avgLoy=members.length?members.reduce((s,a)=>s+(a.loyalty||0),0)/members.length:0;
  const fams=S.families.filter(f=>f.members.some(id=>{ const a=S.agents.find(x=>x.id===id); return a&&!a.dead&&a.tribeId===t.id; })).length;
  const arm=t.armory||{weapon:{},shield:{},armor:{}};
  const armTxt=[...Object.entries(arm.weapon||{}),...Object.entries(arm.shield||{}),...Object.entries(arm.armor||{})].filter(([,n])=>n>0).map(([id,n])=>{ const w=WEAPONS[id]||SHIELDS[id]||ARMORS[id]; return w?w.name+' ×'+fa(n):''; }).join(' • ')||'خالی است — آهنگر باید بسازد';
  const battlesHtml=S.battles.filter(b=>b.t1===t.id||b.t2===t.id).map(b=>{
    const o=tribeById(b.t1===t.id?b.t2:b.t1);
    return '<div class="rel-row"><span>'+icon('battle')+' '+(b.big?'جنگ بزرگ':'نبرد کوچک')+' با '+(o?o.name:'؟')+'</span><b>'+fa(b.s1.length)+' در برابر '+fa(b.s2.length)+' جنگجو</b></div>';
  }).join('');
  $('#tribeDetail').innerHTML=
    '<div class="stock-grid">'
    +'<div>'+icon('wood')+' چوب<b>'+fa(t.stock.wood)+'</b></div><div>'+icon('stone')+' سنگ<b>'+fa(t.stock.stone)+'</b></div>'
    +'<div>'+icon('food')+' غذا<b>'+fa(t.stock.food)+'</b></div><div>'+icon('coin')+' سکه<b>'+fa(t.stock.coins)+'</b></div>'
    +'<div>'+icon('gene')+' پژوهش<b>'+fa(Math.round(t.research))+(cur?' / '+fa(cur.cost):'')+'</b></div><div>'+icon('heart')+' سلامت<b>٪'+fa(Math.round(avgHealth))+'</b></div>'
    +'</div>'
    +'<p class="note">'+t.name+' در '+AGES[tribeAge(t)]+' است • فرهنگ '+t.cultureName+' ('+fa(Math.round(t.culture))+' امتیاز)'+(fest?' • '+icon('star')+' جشنواره در جریان است!':'')+' • مرکز قبیله روی نقشه با پرچم مشخص است.</p>'
    +'<h4>'+icon('chief')+' رهبری</h4>'
    +'<p class="note">'+icon('crown')+' رهبر: <b>'+(chief?chief.name:'—')+'</b> • گرایش رهبر: '+(t.stance>0.33?'جنگ‌طلب':t.stance<-0.33?'صلح‌طلب':'میانه‌رو')+' • میانگین وفاداری: ٪'+fa(Math.round(avgLoy))+' • خانواده‌ها: '+fa(fams)+'</p>'
    +'<p class="note">'+icon('crown')+' رضایت از رهبر: <b>٪'+fa(Math.round(avgSatisf(t)))+'</b>'+(avgSatisf(t)<30?' — مردم ناراضی‌اند!':avgSatisf(t)>70?' — مردم راضی‌اند':'')+(t.protesting?' • <b>در حال اعتراض!</b>':'')+'</p>'
    +'<h4>'+icon('crown')+' دربار</h4>'
    +'<div class="court">'+Object.keys(COURT_ROLES).map(role=>{ const cm=courtMember(t,role); return '<div class="job-row"><span>'+COURT_ROLES[role].name+' <small>('+COURT_ROLES[role].effect+')</small></span><b>'+(cm?cm.name:'—')+'</b><button class="btn btn-glass" type="button" data-civ="court:'+role+'">جایگزین</button></div>'; }).join('')+'</div>'
    +'<p class="note">'+icon('users')+' مزایای زندگی قبیله‌ای: خوردن از انبار مشترک وقتی گرسنه‌ای، محافظت نگهبانان و جنگجویان، درمان درمانگر و بهبود سریع‌تر با بیمارستان، خانه و مزرعه‌ی مشترک، تجارت در بازار. بی‌قبیله‌ها هیچ‌کدام را ندارند — خودشان همه‌چیز را جمع می‌کنند. ظرفیت پذیرش: '+fa(tribeCap(t))+' نفر (با خانه بیشتر می‌شود).</p>'
    +'<h4>'+icon('land')+' سرزمین</h4>'
    +'<p class="note">'+icon('land')+' سرزمین: <b>'+fa(tribeTiles(t))+' خانه</b> از سقف '+fa(territoryCap(t))+' خانه — سازنده‌ها وقتی چوبِ مازاد هست زمین می‌گیرند (به‌سمت منابع و رقیب)؛ هرچه دورتر از خانه، گران‌تر. سرزمینِ قبیله‌ی سقوط‌کرده به برنده می‌رسد. ساختمان‌ها فقط درون سرزمین خودشان ساخته می‌شوند.'+(function(){ const nr=nearestRival(t); if(!nr) return ''; const ten=(t.borderTension||{})[nr.o.id]||0, cont=(t.contested||{})[nr.o.id]||0; return ' تنش مرزی با <b>'+nr.o.name+'</b>: ٪'+fa(Math.round(ten))+(cont?' — '+fa(cont)+' خانه‌ی مورد مناقشه':'')+(hasInterRoad(t,nr.o)?' — جاده‌ای بینشان هست':''); })()+'</p>'
    +'<h4>'+icon('war')+' جنگ و دیپلماسی</h4>'
    +'<p class="note">تمایل به جنگ: ٪'+fa(Math.round(warAppetite(t)*100))+(warAppetite(t)>0.6?' — رهبر جنگ‌طلب است و کینه‌ها را فراموش نمی‌کند':warAppetite(t)<0.35?' — رهبر صلح‌طلب است':' — رهبر میانه‌رو است')+' • خستگی از جنگ: ٪'+fa(Math.round(t.warFatigue||0))+((t.warFatigue||0)>45?' — قبیله خسته از جنگ است و به صلح تمایل دارد':'')+(function(){ const nr=nearestRival(t); if(!nr) return ' • هنوز رقیبی نیست'; return ' • نزدیک‌ترین رقیب: <b>'+nr.o.name+'</b> — فاصله‌ی سرزمین‌ها '+fa(Math.round(territoryDist(t,nr.o)))+' پیکسل'+(distBonus(t)>0?' — نزدیکی مرز +٪'+fa(Math.round(distBonus(t)*100))+' تمایل به جنگ':''); })()+'</p>'
    +'<p class="note">متحدان: '+((t.allies||[]).map(id=>{ const at=tribeById(id); return at?at.name:'؟'; }).join('، ')||'هیچ متحدی نیست — رابطه بالای ۶۰ یعنی می‌شود پیمان بست')+'</p>'
    +'<p class="note">'+icon('scale')+' تراز نیازها در روز: غذا '+(t.needsBal.food>=0?'+':'')+fa(t.needsBal.food)+' • چوب '+(t.needsBal.wood>=0?'+':'')+fa(t.needsBal.wood)+' • سنگ '+(t.needsBal.stone>=0?'+':'')+fa(t.needsBal.stone)+(t.needsNote?' — '+t.needsNote:'')+'</p>'
    +'<h4>'+icon('armory')+' اسلحه‌خانه</h4>'
    +'<p class="note">'+armTxt+'</p>'
    +(battlesHtml?'<h4>'+icon('battle')+' نبردهای جاری</h4>'+battlesHtml:'')
    +(cur?'<div class="research-row">'+icon('gene')+' در حال پژوهش: <b>'+icon(cur.icon)+' '+cur.name+'</b> — '+fa(Math.round(t.research))+' از '+fa(cur.cost)+' امتیاز</div>':'<p class="note">همه‌ی فناوری‌های ممکن کشف شده‌اند!</p>')
    +'<h4>'+icon('users')+' شغل‌ها <span class="sub">سهمیه هر شغل را کم و زیاد کن</span></h4>'
    +'<div class="jobs">'+JOBS.map(j=>'<div class="job-row"><span>'+icon(j.icon)+' '+j.name+'</span><b>'+fa(jobCounts[j.id]||0)+' نفر</b><span class="quota"><button class="btn btn-glass" type="button" data-civ="job:'+j.id+':-1">−</button><b>'+fa(t.jobs[j.id]||0)+'</b><button class="btn btn-glass" type="button" data-civ="job:'+j.id+':1">＋</button></span></div>').join('')+'</div>'
    +'<h4>'+icon('users')+' روابط با قبایل دیگر</h4>'
    +S.tribes.filter(o=>o.id!==t.id).map(o=>{ const r=t.relations[o.id]||0;
      const allied=isAlly(t,o), truce=inTruce(t,o), atWar=atWarWith(t,o);
      return '<div class="rel-row"><span><span class="tribe-dot" style="background:'+o.color+'"></span>'+o.name+'</span>'
      +'<div class="bar" style="flex:1"><i style="width:'+((r+100)/2)+'%;background:'+(r<-50?'#fb7185':r>50?'#34d399':'#f59e0b')+'"></i></div>'
      +'<b>'+(r>0?'+':'')+fa(Math.round(r))+'</b>'
      +(((t.borderTension||{})[o.id]||0)>0?'<span class="sub">تنش مرزی ٪'+fa(Math.round((t.borderTension||{})[o.id]))+(((t.contested||{})[o.id]||0)?' • '+fa((t.contested||{})[o.id])+' خانه‌ی مورد مناقشه':'')+'</span>':'')
      +(hasInterRoad(t,o)?'<span class="sub">جاده‌ی مشترک</span>':'')
      +(truce?'<span class="sub">آتش‌بس تا روز '+fa(t.truce[o.id])+'</span>':'')
      +(allied?'<span class="sub">'+icon('alliance')+' متحد</span>':'')
      +'<button class="btn btn-danger" type="button" data-civ="rel:'+o.id+':war">'+icon('war')+' جنگ</button>'
      +'<button class="btn btn-glass" type="button" data-civ="rel:'+o.id+':peace">'+icon('peace')+' صلح</button>'
      +'<button class="btn btn-glass" type="button" data-civ="rel:'+o.id+':gift">'+icon('gift')+' هدیه</button>'
      +(allied?'<button class="btn btn-glass" type="button" data-civ="rel:'+o.id+':unally">لغو اتحاد</button>':(r>60&&!atWar?'<button class="btn btn-glass" type="button" data-civ="rel:'+o.id+':ally">'+icon('alliance')+' اتحاد</button>':''))
      +(atWar?'<button class="btn btn-glass" type="button" data-civ="rel:'+o.id+':tribute">'+icon('coin')+' باج (۱۵ سکه)</button>':'')
      +'</div>'; }).join('')
    +'<h4>'+icon('builder')+' ساختمان‌های '+t.name+'</h4>'
    +'<div class="build-owned">'+(S.buildings.filter(b=>b.tribeId===t.id).map(b=>'<span class="pill">'+icon(BUILDINGS[b.type].icon)+' '+BUILDINGS[b.type].name+' '+((b.level||1)>1?'سطح '+fa(b.level)+' ':'')+(b.progress>=100?((b.hp!=null&&b.hp<b.maxHp)?'آسیب‌دیده ':'')+icon('check'):'٪'+fa(Math.round(b.progress)))+'</span>').join('')||'<span style="color:var(--muted);font-size:12px">هنوز ساختمانی نیست — از پایین یکی بساز.</span>')+'</div>'
    +(function(){ const needRep=S.buildings.filter(b=>b.tribeId===t.id&&b.progress>=100&&(b.hp??b.maxHp)<(b.maxHp||60)*0.5); return needRep.length?'<p class="note">نیاز به تعمیر: '+needRep.map(b=>BUILDINGS[b.type].name+' (٪'+fa(Math.round(((b.hp??b.maxHp)/(b.maxHp||60))*100))+' جان)').join('، ')+' — سازنده‌ها خودشان می‌روند سراغشان؛ یا روی ساختمان بزن و «تعمیر» را بزن.</p>':''; })();
  $('#techTree').innerHTML=TECHS.map(tc=>{
    const done=!!t.techs[tc.id];
    const avail=!done&&tc.requires.every(r=>t.techs[r]);
    const reqNames=tc.requires.map(r=>TECHS.find(x=>x.id===r).name).join(' و ');
    return '<div class="tech-card'+(done?' done':avail?' avail':' locked')+'" '+(avail?'data-civ="tech:'+tc.id+'"':'')+'>'
      +'<b>'+icon(tc.icon)+' '+tc.name+'</b><span>'+AGES[tc.age]+' • '+icon('gene')+' '+fa(tc.cost)+'</span>'
      +'<small>'+tc.desc+'</small>'
      +'<small>'+(done?icon('check')+' کشف شده':avail?(t.researchTarget===tc.id?icon('target')+' در اولویت — در حال پژوهش':'بزن تا در اولویت پژوهش قرار گیرد'):icon('lock')+' نیازمند: '+reqNames)+'</small></div>';
  }).join('');
  $('#buildList').innerHTML=Object.entries(BUILDINGS).map(([type,def])=>{
    const locked=def.tech&&!hasTech(t,def.tech);
    const afford=t.stock.wood>=def.wood&&t.stock.stone>=def.stone;
    return '<div class="build-card'+(locked?' locked':'')+'">'
      +'<b>'+icon(def.icon)+' '+def.name+'</b><span>'+icon('wood')+fa(def.wood)+' '+icon('stone')+fa(def.stone)+'</span><small>'+def.desc+'</small>'
      +'<small>'+(locked?icon('lock')+' نیازمند فناوری «'+TECHS.find(x=>x.id===def.tech).name+'»':afford?'':'منابع کافی نیست')+'</small>'
      +'<button class="btn btn-primary" type="button" data-civ="build:'+type+'"'+(locked?' disabled':'')+'>'+(S.placing===type?icon('close')+' لغو انتخاب':icon('builder')+' ساختن')+'</button></div>';
  }).join('');
}
function onCivClick(b){
  const parts=b.dataset.civ.split(':');
  const kind=parts[0], arg=parts[1], arg2=parts[2];
  const t=tribeById(S.selTribe); if(!t) return;
  if(kind==='tribe'){
    S.selTribe=+arg; S.highlightTribe=+arg;
    const tr=tribeById(S.selTribe);
    CAM.x=tr.centre.x-VW/CAM.zoom/2; CAM.y=tr.centre.y-VH/CAM.zoom/2; clampCam();
    renderCiv();
  }
  else if(kind==='court'){
    replaceCourtMember(t,arg);
  }
  else if(kind==='tech'){
    const tc=TECHS.find(x=>x.id===arg);
    if(tc&&availableTechs(t).some(x=>x.id===arg)){ t.researchTarget=arg; logEvent(t.name+' حالا روی «'+tc.name+'» تمرکز می‌کند.','god'); renderCiv(); }
  }
  else if(kind==='build'){
    if(S.placing===arg){ S.placing=null; updatePlacingHint(); }
    else { S.placing=arg; toast('«'+BUILDINGS[arg].name+'» را انتخاب کردی — حالا روی نقشه بزن'); updatePlacingHint(); }
    renderCiv();
  }
  else if(kind==='job'){
    t.jobs[arg]=clamp((t.jobs[arg]||0)+(+arg2),0,40); assignJobs(t); renderCiv();
  }
  else if(kind==='rel'){
    const o=tribeById(+arg); if(!o) return;
    if(arg2==='war'){ const b=declareWar(t,o,false); if(!b){ t.relations[o.id]=-60; o.relations[t.id]=-60; logEvent(t.name+' به '+o.name+' اعلام جنگ کرد!','bad'); } }
    else if(arg2==='peace'){ offerPeace(t,o); }
    else if(arg2==='ally'){ if(tryAlly(t,o)) toast('پیمان اتحاد بسته شد!'); else toast('برای اتحاد رابطه باید بالای ۶۰ باشد و در جنگ نباشید'); }
    else if(arg2==='unally'){ breakAlliance(t,o); }
    else if(arg2==='tribute'){ payTribute(t,o); }
    else if(arg2==='gift'){
      if(t.stock.food>=10){ t.stock.food-=10; o.stock.food+=10;
        t.relations[o.id]=clamp((t.relations[o.id]||0)+20,-100,100); o.relations[t.id]=clamp((o.relations[t.id]||0)+20,-100,100);
        logEvent(t.name+' به '+o.name+' ۱۰ غذا هدیه داد — رابطه بهتر شد.','good');
      } else toast('غذای کافی در انبار نیست');
    }
    renderCiv();
  }
}
function updatePlacingHint(){
  const h=$('#hint'); if(!h) return;
  if(S.placing){ const t=tribeById(S.selTribe); h.textContent='ساختن «'+BUILDINGS[S.placing].name+'» برای '+(t?t.name:'')+' — روی نقشه بزن تا جایش را انتخاب کنی (دوباره دکمه را بزن تا لغو شود)'; }
  else h.textContent='بکش تا نقشه جابه‌جا شود • پینچ یا چرخ موس = زوم • روی موجود بزن تا انتخابش کنی • دو بار بزن = باران غذا';
}
function buildCiv(){
  $('#tab-civ').addEventListener('click',e=>{ const b=e.target.closest('[data-civ]'); if(b) onCivClick(b); });
  $('#btnZoomIn').addEventListener('click',()=>zoomAt(VW/2,VH/2,1.3));
  $('#btnZoomOut').addEventListener('click',()=>zoomAt(VW/2,VH/2,1/1.3));
  $('#btnCenter').addEventListener('click',()=>{ fitCamera(); toast('نقشه به مرکز برگشت'); });
  const mm=$('#minimap');
  if(mm) mm.addEventListener('pointerdown',e=>{ const r=mm.getBoundingClientRect(); const wx=(e.clientX-r.left)/r.width*WORLD_W, wy=(e.clientY-r.top)/r.height*WORLD_H; CAM.x=wx-VW/CAM.zoom/2; CAM.y=wy-VH/CAM.zoom/2; clampCam(); });
  const sj=$('#selJob');
  if(sj){
    sj.innerHTML='<option value="">— بدون شغل —</option>'+JOBS.map(j=>'<option value="'+j.id+'">'+j.name+'</option>').join('');
    sj.addEventListener('change',()=>{ const a=S.selected; if(a&&sj.value){ a.job=sj.value; a.manualJob=true; logEvent('شغل '+a.name+' شد «'+(JOBS.find(j=>j.id===sj.value)||{}).name+'».','god'); updateSelected(); } });
  }
  renderCiv();
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
  for(const o of S.agents){ if(o===a||o.dead||o.sex===a.sex||o.energy<50||o.mateCd>0||o.age<0.35) continue;
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
  logEvent(label+': جمعیت از '+fa(keep.length+killed)+' به '+fa(n)+' نفر رسید. فرکانس آلل A در ژن «'+GENE_LABELS[S.alleleGene]+'» از ٪'+fa(Math.round(beforeP*100))+' به ٪'+fa(Math.round(afterP*100))+' جهید — این رانش ژنتیکی است، نه انتخاب!','bad');
  toast(label+' — فرکانس آلل‌ها تصادفی جابه‌جا شد');
}
function addMigrants(n){
  const hueBase=Math.floor(rand(0,360));
  for(let i=0;i<n;i++){
    // مهاجرها از جمعیت دیگری می‌آیند: فرکانس آلل متفاوت (p≈۰٫۸۵ برای سرعت و جثه)
    const gt=randomGenotypeAll(0.5);
    gt.speed=randomGenotype('speed',0.85); gt.size=randomGenotype('size',0.85); gt.vision=randomGenotype('vision',0.3);
    const a=makeAgent(rand(30,W-30),rand(30,H-30),null,1,null,hueBase,gt);
    a.tribeId=null; a.hue=Math.floor(rand(0,360)); // مهاجرها بی‌قبیله می‌آیند
    a.age=rand(0.5,1.5); // مهاجران بالغ می‌آیند تا بتوانند کار و تولیدمثل کنند
    a.name='مهاجر-'+fa(a.id); S.agents.push(a);
  }
  logEvent(fa(n)+' مهاجر با ژن‌های متفاوت وارد جهان شدند — جریان ژنی شروع شد.','god');
  toast('مهاجرها آمدند');
}
function tick(dt){
  S.elapsed+=dt;
  const dayLen=S.settings.dayLength;
  S.timeOfDay+=dt*24/dayLen; if(S.timeOfDay>=24){S.timeOfDay-=24;S.day++;
    if(S.day%10===0) logEvent('روز '+fa(S.day)+' رسید — '+seasonOf(S.day)+'، جمعیت '+fa(S.agents.length)+' موجود.');
  }
  // خشکسالی
  const drought=S.elapsed<S.droughtUntil;
  if(!drought){ foodAcc+=S.settings.foodRate*dt; while(foodAcc>=1){foodAcc--; if(S.foods.length<800) spawnFood();} }
  // لاشه‌ها → کمی غذا
  for(const c of S.corpses){ c.life-=dt; if(c.life<10&&Math.random()<dt*.3&&S.foods.length<800) spawnFood(c.x+rand(-14,14),c.y+rand(-14,14)); }
  S.corpses=S.corpses.filter(c=>c.life>0);

  const temp=tempNow(), cold=temp<2, hot=temp>33;
  // داده‌های آماده‌ی قبیله برای این تیک (خانه‌ها و مدرسه‌ها و بیمارستان‌ها)
  const tribeHouse={}, tribeSchools={}, tribeHospital={};
  for(const t of S.tribes){
    tribeHouse[t.id]=S.buildings.filter(b=>b.tribeId===t.id&&b.type==='house'&&b.progress>=100).length;
    tribeSchools[t.id]=S.buildings.filter(b=>b.tribeId===t.id&&(b.type==='school'||b.type==='university')&&b.progress>=100);
    tribeHospital[t.id]=S.buildings.some(b=>b.tribeId===t.id&&b.type==='hospital'&&b.progress>=100);
  }
  const crowded=S.agents.length/S.settings.popCap;
  const fertFactor=crowded<=0.9?1:crowded>=1.3?0.05:1-(crowded-0.9)/0.4*0.95; // تا نزدیک سقف جمعیت باروری کامل است، بعد به‌آرامی کم می‌شود

  for(const a of S.agents){
    if(a.dead) continue;
    a.age+=dt/dayLen; a.mateCd=Math.max(0,a.mateCd-dt); a.fightCd=Math.max(0,a.fightCd-dt); a.foundCd=Math.max(0,(a.foundCd||0)-dt);
    if(a.combatT>0) a.combatT-=dt; // در نبرد: تا چند ثانیه بعد از ضربه، بهبود خودبه‌خودی متوقف است
    // نیاز جنسی هر دو جنس با گذشت زمان بالا می‌رود؛ برطرف‌نشدنش سلامت را کم می‌کند
    a.sexNeed=clamp((a.sexNeed||0)+dt*0.9,0,100);
    if(a.sexNeed>75) a.health=clamp(a.health-0.15*dt,0,100);
    // مصرف انرژی: حرکت + جثه + دما
    const shelterNow=agentShelter(a); // v5: سرپناه — خانه، چادر، بی‌سرپناه، یا single (بدون خانواده)
    const drain=S.settings.hungerRate*(0.55+a.genes.size*0.5)*(1.15-a.genes.metabolism*0.55)*(1.15-a.genes.efficiency*0.35)*dt*1.4;
    let extra=0;
    if(cold) extra=(1-a.genes.coldRes)*(2-temp)*0.35*dt;
    if(hot) extra=(1-a.genes.heatRes)*(temp-33)*0.3*dt;
    if(tribeHouse[a.tribeId]>0) extra*=0.5;
    if(shelterNow==='tent') extra*=0.75; else if(shelterNow==='none') extra*=1.5; // چادر کمی محافظت می‌کند؛ بی‌سرپناه سرما و گرما سخت‌تر می‌زند
    a.energy=clamp(a.energy-drain-extra,0,100);
    if(a.energy<=0){ a.health-=14*dt; if(a.health<=0){killAgent(a,'گرسنگی');continue;} }
    else if(a.energy>40&&!(a.combatT>0)&&shelterNow!=='none') a.health=clamp(a.health+(4+(tribeHouse[a.tribeId]>0?2:0)+(tribeHospital[a.tribeId]?3:0))*dt,0,100); // بی‌سرپناه خودبه‌خود بهبود نمی‌یابد
    // v5: بی‌سرپناهی درد دارد — خانواده‌ی بی‌خانه و بی‌چادر آهسته سلامت از دست می‌دهد
    if(shelterNow==='none'){ a.health-=0.35*dt; if(a.health<=0){ killAgent(a,'بی‌سرپناهی'); continue; } } // بیمارستان قبیله: بهبود سریع‌تر — بی‌قبیله‌ها ندارند
    if(a.age>=a.lifespan){ killAgent(a,'پیری'); continue; }
    // طاعون
    if(a.plague>0){ a.plagueT+=dt; a.health-=9*dt*(1-a.genes.immunity*0.7)*(tribeById(a.tribeId)&&hasTech(tribeById(a.tribeId),'medicine')?0.5:1);
      if(Math.random()<dt*0.25){ for(const o of S.agents){ if(o===a||o.dead||o.plague>0) continue;
        const dx=o.x-a.x,dy=o.y-a.y; if(dx*dx+dy*dy<45*45&&Math.random()<(1-o.genes.immunity*0.85)*0.5){o.plague=1;o.plagueT=0;} } }
      if(a.plagueT>14){ a.plague=0; a.health=clamp(a.health+20,0,100); floater(a.x,a.y-14,'بهبود','#86efac'); }
      if(a.health<=0){ killAgent(a,'طاعون'); continue; }
    }
    // یادگیری در مدرسه/دانشگاه نزدیک
    const mySchools=tribeSchools[a.tribeId]||[];
    for(const sch of mySchools){ if(Math.abs(sch.x-a.x)<110&&Math.abs(sch.y-a.y)<110){ a.knowledge=clamp(a.knowledge+dt*0.02,0,1); break; } }
    // شکار حیوان وقتی خیلی گرسنه است
    if(a.energy<40){ const an=nearestAnimal(a,26); if(an){ killAnimal(an,a); } }
    // رفتار: اول شغل و نیازهای تمدن، بعد جفت و غذا
    const onRoad=S.roads&&S.roads[tileIndex(tileAt(a.x,a.y).tx,tileAt(a.x,a.y).ty)]?1.3:1; // v5 (tiles): جاده سریع‌تر است
    const speed=(34+a.genes.speed*78)*(a.energy<25?1.25:1)*(a.plague>0?0.6:1)*onRoad;
    let mx=0,my=0,moving=false;
    const myTribe=tribeById(a.tribeId);
    const fest=myTribe&&S.elapsed<myTribe.festivalUntil;
    // جفت‌یابی یک نیاز است، نه چیزی که بعد از شغل بماند: موجود بالغ و سیر،
    // وقتی جفت نزدیک است، اول سراغ جفت می‌رود (شغل منتظر می‌ماند)
    let busy=false;
    // v5: اگر بیکاریِ اجباری برایش تعیین شده، اول به آن نقطه برود (نبرد اولویت دارد)
    if(a.wanderGoal&&!a.battleId&&!a.protesting&&!(a.jailedUntil&&S.day<a.jailedUntil)){
      if(moveToward(a,a.wanderGoal.x,a.wanderGoal.y,dt,speed)){ a.wanderGoal=null; }
      busy=true;
    }
    // نبرد: جنگجوهای درگیر به میدان می‌روند و می‌جنگند (شغل منتظر می‌ماند)
    if(a.battleId){
      const bt=S.battles.find(x=>x.id===a.battleId);
      const foes=bt?(a.battleSide===1?bt.s2:bt.s1).map(id=>S.agents.find(x=>x.id===id)).filter(x=>x&&!x.dead):[];
      if(!bt||!foes.length){ a.battleId=null; a.battleSide=0; }
      else {
        let foe=null,bd=Infinity;
        for(const f of foes){ const d=(f.x-a.x)**2+(f.y-a.y)**2; if(d<bd){bd=d;foe=f;} }
        const d=Math.sqrt(bd);
        if(d<40){ if(a.fightCd<=0){ a.fightCd=3; S.fights++; raidFight(a,foe); } a.goal='نبرد در میدان جنگ'; }
        else { mx=(foe.x-a.x)/d; my=(foe.y-a.y)/d; moving=true; a.goal='رفتن به میدان نبرد'; }
        busy=true;
      }
    }
    if(a.age>=0.35&&a.energy>50&&a.mateCd<=0){
      const mate=nearestMate(a);
      if(mate){ const dx=mate.x-a.x,dy=mate.y-a.y,d=Math.hypot(dx,dy);
        if(d<40){
          // خانواده و خانه شرط تولد است: خانواده‌ی دارای خانه نرخ کامل،
          // خانواده‌ی بی‌خانه مسدود، تولد خارج از خانواده با احتمال کمتر
          const hf=housingFactor(a,mate);
          if(hf>0){
            const geneF=0.5+(a.genes.fertility+mate.genes.fertility)/2;
            const rate=0.10*(S.settings.fertility||1)*geneF*fertFactor*(fest?1.3:1)*hf;
            if(Math.random()<rate*dt){ reproduce(a,mate); }
            busy=true;
          } else {
            a.goal='نیاز به خانه برای بچه‌دار شدن';
          }
        } else if(d<140){ mx=dx/d; my=dy/d; moving=true; busy=true; }
      }
    }
    // v5: زندانی و معترض کار نمی‌کنند — زندانی کنار خانه می‌ماند، معترض دور خانه جمع می‌شود؛
    // وقتی خیلی گرسنه شدند busy نمی‌شوند تا از انبار غذا بخورند (وگرنه در اعتراض از گرسنگی می‌میرند)
    if(a.jailedUntil&&S.day<a.jailedUntil){
      a.goal='زندانی';
      if(myTribe){ const dx=myTribe.home.x-a.x,dy=myTribe.home.y-a.y,d=Math.hypot(dx,dy); if(d>60){ mx=dx/d; my=dy/d; moving=true; } }
      busy=busy||a.energy>30;
    } else if(a.protesting){
      a.goal='اعتراض';
      if(myTribe){ const px=myTribe.home.x+Math.cos(a.id*1.7)*70, py=myTribe.home.y+Math.sin(a.id*1.7)*70;
        const dx=px-a.x,dy=py-a.y,d=Math.hypot(dx,dy); if(d>12){ mx=dx/d; my=dy/d; moving=true; } }
      busy=busy||a.energy>30;
    }
    const jobDone=(!busy&&a.energy>45&&a.age>=0.4)?jobStep(a,dt,speed):false;
    // غذای انبار وقتی خیلی گرسنه است (انبار پر بود ولی تا حالا هیچ‌کس از آن نمی‌خورد)
    let ateStock=false;
    if(!busy&&!jobDone&&a.energy<40&&myTribe&&myTribe.stock.food>0){
      const dx=myTribe.centre.x-a.x,dy=myTribe.centre.y-a.y,d=Math.hypot(dx,dy);
      if(d<34){ if((myTribe.stock.meals||0)>0){ myTribe.stock.meals-=1; a.energy=clamp(a.energy+(hasBuilding(myTribe,'bakery')?40:30),0,100); a.goal='خوردن غذای پخته'; } else { myTribe.stock.food-=1; a.energy=clamp(a.energy+18,0,100); a.goal='خوردن از انبار'; } ateStock=true; }
      else { mx=dx/d; my=dy/d; moving=true; ateStock=true; }
    }
    if(!busy&&!jobDone&&!ateStock) {
      const f=a.targetFood&&!a.targetFood.eaten? a.targetFood : (a.targetFood=nearestFood(a));
      if(f){ const dx=f.x-a.x,dy=f.y-a.y,d=Math.hypot(dx,dy);
        if(d<a.genes.size*7+9){
          // جنگ سر غذا؟
          const rival=S.agents.find(o=>o!==a&&!o.dead&&o.targetFood===f&&o.fightCd<=0&&a.fightCd<=0&&a.genes.aggression>0.35&&o.genes.aggression>0.3&&a.energy<75&&o.energy<75);
          if(rival&&a.genes.cooperation<0.6&&rival.genes.cooperation<0.6){
            S.fights++; a.fightCd=3; rival.fightCd=3;
            const pa=a.genes.size*0.6+a.genes.aggression*0.4+rand(.2), pr=rival.genes.size*0.6+rival.genes.aggression*0.4+rand(.2);
            const win=pa>=pr?a:rival, lose=win===a?rival:a;
            lose.health-=26; lose.energy=Math.max(0,lose.energy-10); lose.combatT=8;
            lose.x+= (lose.x-win.x)*0.6; lose.y+=(lose.y-win.y)*0.6;
            burst(f.x,f.y,'#f43f5e',10,90); floater(f.x,f.y-18,'نبرد!','#fda4af');
            if(lose.health<=0) killAgent(lose,'جنگ');
          } else if(rival&& (a.genes.cooperation>=0.6||rival.genes.cooperation>=0.6)){
            // همکاری: نصف‌نصف
            a.energy=clamp(a.energy+f.energy*0.55,0,100); rival.energy=clamp(rival.energy+f.energy*0.45,0,100);
            f.eaten=true; a.targetFood=null; rival.targetFood=null;
            floater(f.x,f.y-14,'تقسیم','#a7f3d0');
          } else { a.energy=clamp(a.energy+f.energy,0,100); f.eaten=true; a.targetFood=null;
            burst(f.x,f.y,'#34d399',6,50); }
        } else {mx=dx/d;my=dy/d;moving=true;}
      } else { a.wanderT-=dt; if(a.wanderT<=0){a.wanderT=rand(1,3);a.angle=rand(Math.PI*2);} mx=Math.cos(a.angle);my=Math.sin(a.angle);moving=true; }
    }
    if(moving){ a.x+=mx*speed*dt; a.y+=my*speed*dt; a.angle=Math.atan2(my,mx); }
    // v5: ردیاب بیکاری — اگر ۱۰ ثانیه سر جایش ماند و مشغول کارِ درجا نیست، پرسه بزند
    const moved=Math.hypot(a.x-(a._lx??a.x),a.y-(a._ly??a.y));
    if(moved<1) a._stillT=(a._stillT||0)+dt; else a._stillT=0;
    a._lx=a.x; a._ly=a.y;
    const legitStill=(a.harvestT||0)>0.05||(a.workT||0)>0.05||busy||a.battleId
      ||(a.goal||'').startsWith('اعتراض')||(a.goal||'').startsWith('زندانی')
      ||(a.goal||'').startsWith('ساختن')||(a.goal||'').startsWith('کار در مزرعه')||(a.goal||'').startsWith('دامداری')
      ||(a.goal||'').startsWith('پژوهش در')||(a.goal||'').startsWith('آموزش در')||(a.goal||'').startsWith('درمان ')
      ||(a.goal||'').startsWith('آهنگری')||(a.goal||'').startsWith('پخت نان')||(a.goal||'').startsWith('آشپزی')
      ||(a.goal||'').startsWith('خوردن')||(a.goal||'').startsWith('خرید غذا');
    if((a._stillT||0)>10&&!legitStill&&a.age>=0.4&&!a.wanderGoal&&!a.protesting&&!(a.jailedUntil&&S.day<a.jailedUntil)){
      a._stillT=0; a.wanderGoal={x:clamp(a.x+rand(-160,160),20,WORLD_W-20),y:clamp(a.y+rand(-160,160),20,WORLD_H-20)};
      a.goal='پرسه زدن';
    }
    a.x=clamp(a.x,12,W-12); a.y=clamp(a.y,12,H-12);
  }
  civTick(dt);
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
  if(S.agents.length===0){ if(!S.extinctShown){ S.extinctShown=true; $('#extinctBox').hidden=false; logEvent('انقراض! همه‌ی موجودات مردند.','bad'); } }
  else { $('#extinctBox').hidden=true; S.extinctShown=false; }
}

/* ---------------- رندر ---------------- */
function resize(){
  const r=$('#stage').getBoundingClientRect();
  DPR=Math.min(1.5,window.devicePixelRatio||1);
  VW=Math.max(320,r.width); VH=Math.max(320,r.height);
  canvas.width=VW*DPR; canvas.height=VH*DPR; canvas.style.width=VW+'px'; canvas.style.height=VH+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  bgGrad=null; SPRITES.clear(); foodSpriteCache=null; // کش‌ها با اندازه‌ی تازه بازسازی می‌شوند
  if(!CAM.fitted) fitCamera(); else clampCam();
}
/* v5: تاج طلایی رهبر — شکل برداری، بدون ایموجی */
function drawCrown(x,y,s){
  ctx.save(); ctx.translate(x,y);
  ctx.fillStyle='#fbbf24'; ctx.strokeStyle='#b45309'; ctx.lineWidth=1;
  ctx.beginPath();
  ctx.moveTo(-s,s*0.5); ctx.lineTo(-s,-s*0.4); ctx.lineTo(-s*0.5,s*0.1); ctx.lineTo(0,-s*0.9); ctx.lineTo(s*0.5,s*0.1); ctx.lineTo(s,-s*0.4); ctx.lineTo(s,s*0.5); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(0,s*0.1,s*0.22,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
function draw(){
  // v27: نمای ایزومتریک سه‌بعدی — اگر در دسترس/سالم نباشد، خودکار به دوبعدی برمی‌گردیم
  if(S.view==='iso'){
    if(isoDraw()){ drawMinimap(); return; }
    S.view='2d'; applyView();
  }
  // آسمان / زمین — همیشه روز (افکت تاریکی شب حذف شده؛ شب/روز فقط در ساعت و دما معلوم است)
  ctx.fillStyle=skyGrad(); ctx.fillRect(0,0,VW,VH);
  ctx.save();
  ctx.scale(CAM.zoom,CAM.zoom); ctx.translate(-CAM.x,-CAM.y);
  // تپه‌های نرم
  ctx.fillStyle='rgba(255,255,255,.045)';
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(WORLD_W*(0.2+i*0.3),WORLD_H+40,WORLD_W*0.45,90,0,Math.PI,0);ctx.fill();}
  // مرز جهان
  ctx.strokeStyle='rgba(255,255,255,.14)'; ctx.lineWidth=2/CAM.zoom; ctx.strokeRect(2,2,WORLD_W-4,WORLD_H-4);
  // قلمرو قبایل (v5 tiles: خانه‌های مالکیت‌دار + مرز جایی که مالکیت عوض می‌شود؛ جاده‌ها تیره‌تر)
  for(let i=0;i<S.tiles.length;i++){
    const owner=S.tiles[i]; if(!owner) continue;
    const tr=tribeById(owner); if(!tr) continue;
    const tx=(i%TW)*TILE, ty=Math.floor(i/TW)*TILE;
    ctx.fillStyle=tr.color+'26';
    ctx.fillRect(tx,ty,TILE,TILE);
    if(S.roads&&S.roads[i]){ ctx.fillStyle='rgba(120,90,40,.45)'; ctx.fillRect(tx+9,ty+9,TILE-18,TILE-18); }
  }
  ctx.lineWidth=1;
  for(let i=0;i<S.tiles.length;i++){
    const owner=S.tiles[i]; if(!owner) continue;
    const tr=tribeById(owner); if(!tr) continue;
    const tx=i%TW, ty=Math.floor(i/TW);
    ctx.strokeStyle=tr.color+'55';
    if(tx+1<TW&&S.tiles[i+1]!==owner){ ctx.beginPath(); ctx.moveTo((tx+1)*TILE,ty*TILE); ctx.lineTo((tx+1)*TILE,(ty+1)*TILE); ctx.stroke(); }
    if(ty+1<TH&&S.tiles[i+TW]!==owner){ ctx.beginPath(); ctx.moveTo(tx*TILE,(ty+1)*TILE); ctx.lineTo((tx+1)*TILE,(ty+1)*TILE); ctx.stroke(); }
  }
  // پرچم قبیله‌ها
  for(const t of S.tribes){
    if(CAM.zoom>=0.7){
      // پرچم قبیله (برداری): میله + مثلث
      ctx.strokeStyle=t.color; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(t.centre.x,t.centre.y-178); ctx.lineTo(t.centre.x,t.centre.y-208); ctx.stroke();
      ctx.fillStyle=t.color;
      ctx.beginPath(); ctx.moveTo(t.centre.x,t.centre.y-208); ctx.lineTo(t.centre.x+16,t.centre.y-201); ctx.lineTo(t.centre.x,t.centre.y-194); ctx.closePath(); ctx.fill();
      ctx.font='bold 15px Vazirmatn, sans-serif'; ctx.textAlign='center';
      ctx.fillText(t.name,t.centre.x+24,t.centre.y-192);
    }
  }
  // دیوارها (حلقه‌ی دفاعی) — اول کشیده می‌شوند تا زیر بقیه باشند
  for(const b of S.buildings){ if(b.type!=='wall') continue;
    ctx.fillStyle='#94a3b8'; ctx.strokeStyle='#64748b'; ctx.lineWidth=1;
    ctx.fillRect(b.x-10,b.y-5,20,10); ctx.strokeRect(b.x-10,b.y-5,20,10);
    ctx.fillStyle='#64748b';
    for(let k=-1;k<=1;k++) ctx.fillRect(b.x+k*7-2,b.y-9,4,4);
  }
  // درخت‌ها و سنگ‌ها (برداری)
  for(const tr of S.trees){
    ctx.fillStyle='#7c4a21'; ctx.fillRect(tr.x-1.5,tr.y-2,3,6); // تنه
    ctx.fillStyle=tr.sapling?'#4ade80':'#16a34a';
    ctx.beginPath(); ctx.moveTo(tr.x,tr.y-14); ctx.lineTo(tr.x-7,tr.y-1); ctx.lineTo(tr.x+7,tr.y-1); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#22c55e';
    ctx.beginPath(); ctx.moveTo(tr.x,tr.y-19); ctx.lineTo(tr.x-5,tr.y-8); ctx.lineTo(tr.x+5,tr.y-8); ctx.closePath(); ctx.fill();
  }
  for(const st of S.stones){
    ctx.fillStyle='#94a3b8'; ctx.strokeStyle='#64748b'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(st.x-7,st.y+4); ctx.lineTo(st.x-4,st.y-5); ctx.lineTo(st.x+3,st.y-7); ctx.lineTo(st.x+8,st.y+1); ctx.lineTo(st.x+4,st.y+5); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  // ساختمان‌ها (برداری — شکل هر نوع فرق می‌کند)
  for(const b of S.buildings){
    if(b.type==='wall') continue; // دیوارها بالاتر کشیده شدند
    drawBuilding(b);
    if(b.progress<100){ ctx.fillStyle='rgba(0,0,0,.5)'; ctx.fillRect(b.x-16,b.y+8,32,5); ctx.fillStyle='#f59e0b'; ctx.fillRect(b.x-16,b.y+8,32*b.progress/100,5); }
    else if(b.type==='farm'){ ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(b.x-16,b.y+8,32,4); ctx.fillStyle='#4ade80'; ctx.fillRect(b.x-16,b.y+8,32*(b.growth||0)/100,4); }
    // v4: نوار سلامت ساختمان آسیب‌دیده + حلقه‌ی طلایی ساختمان انتخاب‌شده
    if(b.progress>=100&&b.hp!=null&&b.maxHp&&b.hp<b.maxHp){ ctx.fillStyle='rgba(0,0,0,.5)'; ctx.fillRect(b.x-16,b.y+13,32,4); ctx.fillStyle='#f43f5e'; ctx.fillRect(b.x-16,b.y+13,32*clamp(b.hp/b.maxHp,0,1),4); }
    if(S.selectedBuilding===b){ ctx.strokeStyle='#fbbf24'; ctx.lineWidth=2; ctx.setLineDash([5,4]); ctx.beginPath(); ctx.arc(b.x,b.y,26,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]); }
  }
  // میدان‌های نبرد — حلقه‌ی قرمز ضربان‌دار + دو خط ضربدری
  for(const bt of S.battles){
    const pulse=1+Math.sin(S.elapsed*4)*0.15;
    ctx.strokeStyle='rgba(244,63,94,.8)'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(bt.x,bt.y,26*pulse,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='#f43f5e'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(bt.x-10,bt.y-10); ctx.lineTo(bt.x+10,bt.y+10); ctx.moveTo(bt.x+10,bt.y-10); ctx.lineTo(bt.x-10,bt.y+10); ctx.stroke();
    ctx.font='bold 12px Vazirmatn, sans-serif'; ctx.textAlign='center'; ctx.fillStyle='#fda4af';
    ctx.fillText('نبرد',bt.x,bt.y-32);
  }
  // حیوانات (سیلوئت برداری)
  for(const an of S.animals){ if(an.dead) continue; drawAnimal(an); }
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
    if(S.highlightTribe!=null&&a.tribeId===S.highlightTribe){
      const tr=tribeById(a.tribeId); ctx.strokeStyle=tr?tr.color:'#fff'; ctx.lineWidth=2; ctx.globalAlpha=.8;
      ctx.beginPath(); ctx.arc(a.x,a.y,r+6,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1;
    }
    // هاله‌ی بینایی موقع انتخاب
    if(sel){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.setLineDash([5,5]);ctx.beginPath();
      ctx.arc(a.x,a.y,60+a.genes.vision*200,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle='#fbbf24';ctx.lineWidth=2;ctx.beginPath();ctx.arc(a.x,a.y,r+7+Math.sin(S.elapsed*5)*2,0,Math.PI*2);ctx.stroke();ctx.lineWidth=1;}
    if(a.plague>0){ctx.fillStyle='rgba(132,204,22,.3)';ctx.beginPath();ctx.arc(a.x,a.y,r+5,0,Math.PI*2);ctx.fill();}
    const darkCoat=coatIsDark(a);
    const spr=agentSprite(agentColor(a),a.genes.size,darkCoat);
    ctx.save(); ctx.translate(a.x,a.y); ctx.rotate(a.angle);
    ctx.drawImage(spr.c,-spr.pad,-spr.pad,spr.pad*2,spr.pad*2); ctx.restore();
    // v5: تاج طلایی رهبر — رهبر در یک نگاه دیده می‌شود
    if(a.tribeId){ const tr=tribeById(a.tribeId); if(tr&&tr.chiefId===a.id) drawCrown(a.x,a.y-r-11,7); }
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
  ctx.restore();
  // (v3: تاریکی شب حذف شده — هیچ لایه‌ی تیره‌ای روی صفحه نمی‌نشیند)
  drawMinimap();
}
/* شکل برداری ساختمان‌ها روی نقشه */
function drawBuilding(b){
  const x=b.x, y=b.y;
  const body={
    house:['#b45309','#92400e'],farm:['#16a34a','#14532d'],pasture:['#a16207','#713f12'],
    school:['#2563eb','#1e3a8a'],university:['#7c3aed','#4c1d95'],hospital:['#f8fafc','#94a3b8'],
    market:['#f59e0b','#92400e'],workshop:['#78716c','#44403c'],tower:['#64748b','#334155'],
    barracks:['#b91c1c','#7f1d1d'],command:['#0ea5e9','#075985'],armory:['#475569','#1e293b'],
    bakery:['#d97706','#92400e'],granary:['#eab308','#854d0e'],smithy:['#475569','#1e293b'],
    butcher:['#991b1b','#450a0a'],library:['#4f46e5','#1e1b4b'],clinic:['#f8fafc','#94a3b8'],inn:['#0d9488','#134e4a'],
    castle:['#7c2d12','#450a0a'],tent:['#d97706','#92400e'],
  }[b.type]||['#94a3b8','#475569'];
  ctx.fillStyle=body[0]; ctx.strokeStyle=body[1]; ctx.lineWidth=1.5;
  if(b.type==='tent'){ // چادر: مثلث کوچک با در — سرپناه موقت، متمایز از خانه
    ctx.beginPath(); ctx.moveTo(x,y-14); ctx.lineTo(x-12,y+8); ctx.lineTo(x+12,y+8); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle=body[1]; ctx.beginPath(); ctx.moveTo(x,y-2); ctx.lineTo(x-5,y+8); ctx.lineTo(x+5,y+8); ctx.closePath(); ctx.fill();
  } else if(b.type==='tower'){
    ctx.fillRect(x-6,y-16,12,28); ctx.strokeRect(x-6,y-16,12,28);
    ctx.fillStyle=body[1];
    for(let k=-1;k<=1;k++) ctx.fillRect(x+k*5-2,y-20,4,5);
  } else if(b.type==='castle'){
    ctx.fillRect(x-15,y-12,30,24); ctx.strokeRect(x-15,y-12,30,24);
    ctx.fillStyle=body[1];
    for(let k=-2;k<=2;k++) ctx.fillRect(x+k*6-2,y-17,4,6);
    ctx.fillStyle='#fbbf24'; ctx.fillRect(x-2,y-4,4,6);
  } else if(b.type==='farm'){
    ctx.fillRect(x-13,y-6,26,14); ctx.strokeRect(x-13,y-6,26,14);
    ctx.strokeStyle='#86efac'; ctx.lineWidth=1;
    for(let k=-1;k<=1;k++){ ctx.beginPath(); ctx.moveTo(x-11,y+k*4); ctx.lineTo(x+11,y+k*4); ctx.stroke(); }
  } else if(b.type==='pasture'){
    ctx.strokeStyle=body[0]; ctx.lineWidth=2;
    ctx.strokeRect(x-13,y-9,26,18);
    ctx.fillStyle='#86efac'; ctx.fillRect(x-11,y-7,22,14);
  } else {
    ctx.fillRect(x-11,y-8,22,18); ctx.strokeRect(x-11,y-8,22,18);
    ctx.fillStyle=body[1];
    ctx.beginPath(); ctx.moveTo(x-13,y-8); ctx.lineTo(x,y-17); ctx.lineTo(x+13,y-8); ctx.closePath(); ctx.fill();
    if(b.type==='hospital'){ ctx.fillStyle='#ef4444'; ctx.fillRect(x-2,y-4,4,10); ctx.fillRect(x-5,y-1,10,4); }
    if(b.type==='clinic'){ ctx.fillStyle='#22c55e'; ctx.fillRect(x-2,y-4,4,10); ctx.fillRect(x-5,y-1,10,4); }
    if(b.type==='bakery'){ ctx.fillStyle='#fde68a'; ctx.beginPath(); ctx.arc(x,y+1,4,0,Math.PI*2); ctx.fill(); }
    if(b.type==='granary'){ ctx.strokeStyle='#fde68a'; ctx.lineWidth=1.5; for(let k=-1;k<=1;k++){ ctx.beginPath(); ctx.moveTo(x+k*6,y-4); ctx.lineTo(x+k*6,y+6); ctx.stroke(); } }
    if(b.type==='smithy'){ ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x-6,y+6); ctx.lineTo(x+6,y-6); ctx.moveTo(x+6,y+6); ctx.lineTo(x-6,y-6); ctx.stroke(); }
    if(b.type==='butcher'){ ctx.fillStyle='#ef4444'; ctx.fillRect(x-5,y-2,10,3); }
    if(b.type==='library'){ ctx.fillStyle='#c7d2fe'; ctx.fillRect(x-8,y-2,5,8); ctx.fillRect(x-2,y-2,5,8); ctx.fillRect(x+4,y-2,5,8); }
    if(b.type==='inn'){ ctx.fillStyle='#5eead4'; ctx.fillRect(x-8,y+2,16,4); ctx.fillRect(x-8,y-4,5,6); }
    if(b.type==='market'){ ctx.fillStyle='#fde68a'; ctx.fillRect(x-11,y-2,22,4); }
    if(b.type==='school'||b.type==='university'){ ctx.fillStyle='#fde047'; ctx.fillRect(x-1,y-17,2,8); ctx.beginPath(); ctx.moveTo(x+1,y-17); ctx.lineTo(x+8,y-15); ctx.lineTo(x+1,y-13); ctx.closePath(); ctx.fill(); }
    if(b.type==='armory'){ ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x-6,y+6); ctx.lineTo(x+6,y-6); ctx.moveTo(x+6,y+6); ctx.lineTo(x-6,y-6); ctx.stroke(); }
    if(b.type==='command'){ ctx.fillStyle='#fde047'; ctx.beginPath(); ctx.arc(x,y+1,3,0,Math.PI*2); ctx.fill(); }
    if(b.type==='barracks'){ ctx.fillStyle='#1f2937'; ctx.fillRect(x-4,y+1,8,9); }
  }
  // v5: ساختمانِ آسیب‌دیده روی نقشه معلوم است — تیره‌تر + ترک کهربایی
  const frac=(b.hp??b.maxHp)/(b.maxHp||60);
  if(b.progress>=100&&frac<0.5){
    ctx.fillStyle='rgba(0,0,0,0.28)'; ctx.fillRect(x-13,y-18,26,30);
    ctx.strokeStyle='#fbbf24'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x-6,y-12); ctx.lineTo(x-2,y-4); ctx.lineTo(x-6,y+4); ctx.moveTo(x+4,y-10); ctx.lineTo(x+7,y-2); ctx.lineTo(x+3,y+6); ctx.stroke();
  }
}
/* سیلوئت برداری حیوانات */
function drawAnimal(an){
  const x=an.x, y=an.y;
  ctx.save(); ctx.translate(x,y); ctx.rotate(an.angle||0);
  if(an.kind==='sheep'){
    ctx.fillStyle='#f8fafc'; ctx.beginPath(); ctx.ellipse(0,0,9,6,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(9,-2,3.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1f2937'; ctx.beginPath(); ctx.arc(10,-2,2,0,Math.PI*2); ctx.fill();
  } else if(an.kind==='cow'){
    ctx.fillStyle='#92400e'; ctx.beginPath(); ctx.ellipse(0,0,11,7,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(11,-2,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#f8fafc'; ctx.beginPath(); ctx.arc(13,0,2.5,0,Math.PI*2); ctx.fill();
  } else if(an.kind==='wolf'){
    ctx.fillStyle='#64748b'; ctx.beginPath(); ctx.ellipse(0,0,10,5.5,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(9,-3); ctx.lineTo(15,0); ctx.lineTo(9,3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-9,-2); ctx.lineTo(-16,-6); ctx.lineTo(-14,2); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#1f2937'; ctx.beginPath(); ctx.arc(7,-2,1.5,0,Math.PI*2); ctx.fill();
  } else if(an.kind==='bear'){
    ctx.fillStyle='#78350f'; ctx.beginPath(); ctx.ellipse(0,0,12,8,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(11,-3,5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(8,-7,2.5,0,Math.PI*2); ctx.arc(14,-7,2.5,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

/* ---------------- قدرت‌های خدا ---------------- */
const POWERS=[
 {id:'food',icon:'food',name:'باران غذا',desc:'۲۵ غذا همان‌جا می‌ریزد',armed:true},
 {id:'lightning',icon:'lightning',name:'صاعقه',desc:'نزدیک‌ترین موجود را می‌کشد',armed:true},
 {id:'meteor',icon:'meteor',name:'شهاب',desc:'همه را در شعاع ۷۰ می‌کشد',armed:true},
 {id:'plague',icon:'plague',name:'طاعون',desc:'از یک موجود شروع، سرایت می‌کند',armed:true},
 {id:'bless',icon:'bless',name:'برکت',desc:'همه را سیر و سالم می‌کند',armed:false},
 {id:'drought',icon:'drought',name:'خشکسالی',desc:'۲۰ ثانیه غذا نمی‌روید',armed:false},
];
const PRESETS=[
 {id:'paradise',icon:'paradise',name:'بهشت غذا',desc:'غذای فراوان، زندگی آرام',apply(){setSetting('foodRate',8);setSetting('hungerRate',0.6);setSetting('temperature',22);}},
 {id:'famine',icon:'famine',name:'قحطی',desc:'غذا کم، گرسنگی زیاد',apply(){setSetting('foodRate',0.6);setSetting('hungerRate',1.7);}},
 {id:'ice',icon:'ice',name:'عصر یخبندان',desc:'سرمای کشنده −۱۲ درجه',apply(){setSetting('temperature',-12);setSetting('foodRate',1.2);setSetting('hungerRate',1.4);}},
 {id:'heat',icon:'heat',name:'موج گرما',desc:'گرمای ۳۸ درجه',apply(){setSetting('temperature',38);setSetting('foodRate',1.5);setSetting('hungerRate',1.3);}},
 {id:'war',icon:'war',name:'جنگ همه‌علیه‌همه',desc:'پرخاشگری به نیمی از جمعیت',apply(){setSetting('foodRate',1);setSetting('hungerRate',1.2);injectTrait(TRAITS[3],50,true);}},
 {id:'calm',icon:'calm',name:'بهشت آرام',desc:'همکاری به نیمی از جمعیت',apply(){setSetting('foodRate',4);setSetting('hungerRate',0.7);injectTrait(TRAITS[6],50,true);}},
];
const SLIDERS=[
 {k:'popCap',label:'ظرفیت جمعیت',desc:'بیشتر از این، باروری کم می‌شود',min:50,max:500,step:10,fmt:v=>fa(v)+' موجود'},
 {k:'fertility',label:'میل باروری',desc:'موجودها چقدر مشتاق بچه‌دار شدن باشند',min:0.2,max:3,step:0.1,fmt:v=>'×'+fa1(v)},
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
  $('#presetGrid').innerHTML=PRESETS.map((p,i)=>`<button class="preset" type="button" data-i="${i}"><b>${icon(p.icon)} ${p.name}</b><span>${p.desc}</span></button>`).join('');
  $$('#presetGrid .preset').forEach(b=>b.addEventListener('click',()=>{
    const p=PRESETS[+b.dataset.i]; p.apply(); logEvent('سناریوی «'+p.name+'» اجرا شد.','god'); toast('سناریوی «'+p.name+'» اجرا شد');
  }));
}
function buildPowers(){
  $('#powerGrid').innerHTML=POWERS.map((p,i)=>`<button class="power" type="button" data-i="${i}"><b>${icon(p.icon)} ${p.name}</b><span>${p.desc}</span></button>`).join('');
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
  if(id==='food'){ for(let i=0;i<25;i++) spawnFood(x+rand(-90,90),y+rand(-90,90)); burst(x,y,'#4ade80',18,140); logEvent('باران غذا بارید.','god'); }
  else if(id==='lightning'){ const a=nearestAgent(x,y,120);
    burst(x,y,'#fde047',22,180); floater(x,y-20,'صاعقه!','#fde047');
    if(a){killAgent(a,'صاعقه'); logEvent('صاعقه '+a.name+' را زد.','god');} else logEvent('صاعقه به زمین خورد و کسی نمرد.','god'); }
  else if(id==='meteor'){ burst(x,y,'#fb923c',30,220); let n=0;
    for(const a of [...S.agents]){const dx=a.x-x,dy=a.y-y; if(dx*dx+dy*dy<70*70){killAgent(a,'شهاب');n++;}}
    logEvent('شهاب فرود آمد و '+fa(n)+' موجود را کشت.','god'); }
  else if(id==='plague'){ const a=nearestAgent(x,y,120)||pick(S.agents);
    if(a){a.plague=1;a.plagueT=0;S.plagueActive=true;burst(a.x,a.y,'#84cc16',14,100);
      logEvent('طاعون از '+a.name+' شروع شد!','bad'); toast('طاعون شروع شد — ببین چه‌کسی زنده می‌ماند');} }
  else if(id==='bless'){ for(const a of S.agents){a.energy=100;a.health=100;a.plague=0;} burst(W/2,H/2,'#fbbf24',30,260);
    logEvent('برکت خدا: همه سیر و سالم شدند.','god'); toast('برکت بر همه فرود آمد'); }
  else if(id==='drought'){ S.droughtUntil=S.elapsed+20; logEvent('خشکسالی ۲۰ ثانیه‌ای شروع شد — غذا نمی‌روید.','god'); toast('خشکسالی شروع شد'); }
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
  if(!silent){ logEvent('ویژگی «'+t.name+'» به '+fa(pct)+'٪ جمعیت ('+fa(chosen.length)+' موجود) تزریق شد — ژنوتیپ AA گرفتند و به فرزندانشان هم می‌رسد.','god');
    toast('«'+t.name+'» به '+fa(pct)+'٪ تزریق شد'); }
  return chosen.length;
}
function removeTrait(t){
  let n=0; for(const a of S.agents){ if(a.genes[t.gene]>=0.72){setGenotypeLow(a,t.gene);n++;} }
  logEvent('ویژگی «'+t.name+'» از '+fa(n)+' موجود حذف شد (ژن به aa برگشت).','god'); toast('ویژگی «'+t.name+'» حذف شد');
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
    <div class="trait-head"><span class="trait-ico">${icon(t.icon)}</span><div><b>${t.name}</b><small>${t.desc}</small></div>
    <div class="trait-freq"><b id="tf-${t.id}">٪۰</b><span>فراوانی</span></div></div>
    <div class="freq-bar"><i id="tb-${t.id}" style="width:0%"></i></div>
    <div class="trait-btns">
      <button class="btn inject" type="button" data-act="i10">تزریق ۱۰٪</button>
      <button class="btn inject" type="button" data-act="i25">تزریق ۲۵٪</button>
      <button class="btn inject" type="button" data-act="i50">تزریق ۵۰٪</button>
      <button class="btn inject" type="button" data-act="i100">تزریق همه</button>
      <button class="btn remove" type="button" data-act="rm">${icon('clear')} حذف</button>
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
  $('#customTraitList').innerHTML=S.customTraits.map((t,i)=>`<span class="pill">${icon('sparkle')} ${t.name} <button data-i="${i}" data-a="inj" type="button" style="border:0;background:none;color:#fff">＋۲۵٪</button> <button data-i="${i}" data-a="del" type="button" style="border:0;background:none;color:#fff">✕</button></span>`).join('')||'<span style="color:var(--muted);font-size:12px">هنوز ویژگی دلخواهی نساخته‌ای.</span>';
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
  let totWood=0,totCoins=0; for(const t of S.tribes){ totWood+=t.stock.wood; totCoins+=t.stock.coins; }
  const sw=$('#statWood'); if(sw) sw.textContent=fa(totWood);
  const sc=$('#statCoins'); if(sc) sc.textContent=fa(totCoins);
  S.civRenderT=(S.civRenderT||0)+0.25;
  if(S.civRenderT>=1){ S.civRenderT=0; if($('#tab-civ')&&$('#tab-civ').classList.contains('active')) renderCiv(); }
  $('#clockDay').textContent='روز '+fa(S.day);
  $('#clockSeason').textContent=seasonOf(S.day);
  $('#clockTemp').textContent=fa(Math.round(tempNow()))+'°C';
  const hh=Math.floor(S.timeOfDay), mm=Math.floor((S.timeOfDay-hh)*60);
  $('#clockTime').textContent=fa(String(hh).padStart(2,'0'))+':'+fa(String(mm).padStart(2,'0'));
  const cp=$('#clockPhase'); if(cp) cp.textContent=(S.timeOfDay>=6&&S.timeOfDay<19)?'روز':'شب';
  $('#footFps').textContent=fa(Math.round(S.fps))+' فریم';
  // فراوانی ویژگی‌ها
  for(const t of TRAITS){const f=traitFreq(t);
    const el=$('#tf-'+t.id); if(el) el.textContent='٪'+fa(Math.round(f));
    const bar=$('#tb-'+t.id); if(bar) bar.style.width=f+'%';}
  // تبارها — رنگ نقطه فقط رنگ راهنمای جدول است، نه رنگ تبار؛ تبارها نام دارند، نه شماره
  const byLin={}; for(const a of S.agents){(byLin[a.lineage]=byLin[a.lineage]||{n:0}).n++;}
  const topLin=Object.entries(byLin).sort((a,b)=>b[1].n-a[1].n).slice(0,5);
  const LIN_PALETTE=['#f59e0b','#38bdf8','#34d399','#f472b6','#a78bfa','#fb923c','#4ade80','#facc15'];
  $('#lineageList').innerHTML=topLin.map(([id,v],i)=>`<div class="lin-row"><span><span class="lin-dot" style="background:${LIN_PALETTE[i%LIN_PALETTE.length]}"></span>تبار «${lineageName(id)}»</span><b>${fa(v.n)} موجود</b></div>`).join('')||'<p class="note">هنوز موجودی نیست.</p>';
  const allFreq=TRAITS.map(t=>({t,f:traitFreq(t)})).sort((a,b)=>b.f-a.f);
  $('#topTraitsNote').textContent='برترین ویژگی‌ها حالا: '+allFreq.slice(0,3).map(x=>x.t.name+' ٪'+fa(Math.round(x.f))).join(' • ');
  $('#freqList').innerHTML=allFreq.slice(0,15).map(x=>`<div class="freq-row"><span>${icon(x.t.icon)} ${x.t.name}</span><div class="bar"><i style="width:${x.f}%"></i></div><b>٪${fa(Math.round(x.f))}</b></div>`).join('');
  $('#deathList').innerHTML=Object.entries(S.deathsBy).map(([k,v])=>`<div class="death-row"><span>${icon('death')} ${k}</span><b>${fa(v)}</b></div>`).join('');
  const avg=geneAvg();
  $('#avgGenes').innerHTML=Object.entries(GENE_LABELS).map(([k,label])=>`<div class="avg-row"><span>${label}</span><b>${avg[k]!=null?'٪'+fa(Math.round(avg[k]*100)):'—'}</b></div>`).join('');
  // هاردی–واینبرگ + رانش برای ژن انتخاب‌شده
  const hwEl=$('#hwBox');
  if(hwEl&&S.agents.length>0){
    const hw=hardyWeinberg(S.alleleGene), gk=S.alleleGene;
    const status=hw.deviation<0.02?'<span class="hw-ok">در تعادل است ✓</span>':'<span class="hw-warn">از تعادل منحرف است — فشار انتخاب یا رانش در کار است!</span>';
    hwEl.innerHTML=`<b>${icon('gene')} تعادل هاردی–واینبرگ — ژن «${GENE_LABELS[gk]}»</b><br>`+
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
  $('#selDot').style.background=agentColor(a); $('#selDot').style.color=agentColor(a);
  $('#selName').textContent=a.name;
  $('#selMeta').textContent='نسل '+fa(a.gen)+' • تبار «'+lineageName(a.lineage)+'» • سن '+fa1(a.age)+' روز';
  $('#selSex').textContent=a.sex==='♀'?'♀ ماده':'♂ نر';
  $('#selHunger').style.width=a.energy+'%'; $('#selHungerTxt').textContent='٪'+fa(Math.round(a.energy));
  $('#selHealth').style.width=a.health+'%'; $('#selHealthTxt').textContent='٪'+fa(Math.round(a.health));
  const agePct=clamp(a.age/a.lifespan*100,0,100);
  $('#selAge').style.width=agePct+'%'; $('#selAgeTxt').textContent=fa1(a.age)+' / '+fa1(a.lifespan)+' روز';
  $('#selGenes').innerHTML=Object.entries(GENE_LABELS).map(([k,label])=>`<div class="g"><span>${label}</span><b>٪${fa(Math.round(a.genes[k]*100))}</b></div>`).join('');
  const F=a.inbreedF||0;
  $('#selInbreed').style.width=(F*100)+'%'; $('#selInbreedTxt').textContent='٪'+fa(Math.round(F*100))+(F>=0.125?' هم‌خون':'');
  $('#selGenotype').innerHTML=Object.entries(GENE_LABELS).map(([k,label])=>{
    const gt=a.genotype[k], str=genotypeString(k,gt), poly=GEN_RULES[k].mode==='polygenic';
    const hidden=!poly&&GEN_RULES[k].dominant&&str==='Aa';
    return `<span class="gtype${poly?' poly':''}">${label}: <b>${str}</b>${hidden?' <span class="hidden-allele">حامل پنهان</span>':''}${poly?' (چندژنی)':''}</span>`;
  }).join('');
  const traitPills=TRAITS.filter(t=>a.genes[t.gene]>=0.72);
  const pillsHtml=traitPills.slice(0,8).map(t=>`<span class="pill">${icon(t.icon)} ${t.name}</span>`).join('')+(traitPills.length>8?` <span class="pill more">+${fa(traitPills.length-8)} ویژگی دیگر</span>`:'');
  $('#selTraits').innerHTML=pillsHtml||'<span style="color:var(--muted)">ویژگی برجسته‌ای ندارد — هنوز معمولی است.</span>';
  $('#selFamily').textContent=(a.parentNames?'والدین: '+a.parentNames+' • ':'')+'فرزندان: '+fa(a.children)+' • '+(a.plague>0?'بیمار است!':'سالم است')+(coatIsDark(a)?' • پوشش تیره (اپیستازی)':'');
  const tr=tribeById(a.tribeId);
  const isChief=tr&&tr.chiefId===a.id;
  const civEl=$('#selCiv'); if(civEl) civEl.innerHTML=(tr?(icon('civ')+' '+tr.name+' • '+(isChief?icon('crown')+' رهبر قبیله • ':'')):'')+icon('users')+' '+(a.job?(JOBS.find(j=>j.id===a.job)||{}).name:'کودک — هنوز شغلی ندارد')+' • '+icon('knowledge')+' دانش ٪'+fa(Math.round(a.knowledge*100));
  const gEl=$('#selGoal'); if(gEl) gEl.textContent=a.goal||'—';
  const kEl=$('#selKnow'); if(kEl) kEl.style.width=(a.knowledge*100)+'%';
  const kt=$('#selKnowTxt'); if(kt) kt.textContent='٪'+fa(Math.round(a.knowledge*100));
  const sj=$('#selJob'); if(sj) sj.value=a.job||'';
  // نیاز جنسی (هر دو جنس)
  const sn=$('#selSexNeed'); if(sn) sn.style.width=(a.sexNeed||0)+'%';
  const snt=$('#selSexNeedTxt'); if(snt) snt.textContent='٪'+fa(Math.round(a.sexNeed||0));
  // خانواده: خانه دارد؟ چادر دارد؟ بی‌سرپناه است؟ مالک چند خانه است؟
  const fam=agentFamily(a), fi=$('#selFamilyInfo');
  if(fi){
    if(!fam) fi.textContent='خانواده‌ای ندارد — هنوز تنها زندگی می‌کند.';
    else {
      const housed=familyHouse(fam);
      const tent=familyTent(fam);
      const rent=fam.renterHouseId?' (اجاره‌ای — هر روز ۱ سکه)':'';
      const ownedN=S.buildings.filter(b=>b.type==='house'&&b.progress>=100&&b.ownerFamilyId===fam.id).length;
      const shelterTxt=housed?'خانه دارد':tent?('چادر دارد (موقت — تا روز '+fa(Math.round(S.day+2-(S.elapsed-(tent.createdAt||0))/S.settings.dayLength))+')'):'بی‌سرپناه — سلامت کم می‌شود!';
      fi.textContent='خانواده‌ی '+fa(fam.members.length)+' نفره • '+shelterTxt+rent+' • ثروت خانواده: '+fa(Math.round(fam.wealth||0))+' سکه'+(ownedN>1?' • خانه‌های مالک: '+fa(ownedN)+' • اجاره‌ی دریافتی: '+fa(Math.round(fam.rentIncome||0))+' سکه':'');
    }
  }
  // تجهیزات جنگی
  const eq=$('#selEquip');
  if(eq){
    const w=a.equip&&a.equip.weapon?WEAPONS[a.equip.weapon].name:null;
    const sh=a.equip&&a.equip.shield?SHIELDS[a.equip.shield].name:null;
    const ar=a.equip&&a.equip.armor?ARMORS[a.equip.armor].name:null;
    eq.textContent='تجهیزات: '+(w||'بدون سلاح')+(sh?' • '+sh:'')+(ar?' • '+ar:'')+((a.training||0)>0?' • تمرین: ٪'+fa(Math.round(a.training*100)):'');
  }
  // وفاداری و عقیده (نسبت به رهبر قبیله)
  const lo=$('#selLoyalty');
  if(lo){
    if(!tr) lo.textContent='بی‌قبیله — وفاداری به کسی ندارد.';
    else {
      const chief=S.agents.find(x=>x.id===tr.chiefId);
      const gap=Math.abs(a.opinion-tr.stance);
      lo.textContent='وفاداری به '+tr.name+': ٪'+fa(Math.round(a.loyalty||0))+' • عقیده: '+(a.opinion>0.33?'جنگ‌طلب':a.opinion<-0.33?'صلح‌طلب':'میانه‌رو')+' • اختلاف با رهبر'+(chief?' ('+chief.name+')':'')+': '+fa1(gap)+(a.loyalty<30&&gap>0.8?' — ممکن است قبیله را ترک کند!':'');
    }
  }
  // رضایت از رهبر، اعتراض و زندان
  const st=$('#selSatisf');
  if(st){
    if(!tr) st.textContent='بی‌قبیله — رضایتی ندارد.';
    else {
      const roles=Object.keys(COURT_ROLES).filter(role=>tr.court&&tr.court[role]===a.id).map(role=>COURT_ROLES[role].name);
      st.textContent='رضایت از رهبر: ٪'+fa(Math.round(a.satisf??50))+(roles.length?' • دربار: '+roles.join('، '):'')+(a.protesting?' • در حال اعتراض!':'')+(a.jailedUntil&&S.day<a.jailedUntil?' • زندانی تا روز '+fa(Math.round(a.jailedUntil)):'');
    }
  }
  // دکمه‌ها و انتخاب قبیله‌ی مقصد
  const bf=$('#btnFoundTribe'); if(bf) bf.disabled=!!a.tribeId||a.age<0.4||leadershipOf(a)<0.60;
  const bl=$('#btnLeaveTribe'); if(bl) bl.disabled=!a.tribeId;
  const js=$('#joinTribeSel');
  if(js){
    const opts=S.tribes.filter(t=>t.id!==a.tribeId).map(t=>'<option value="'+t.id+'">'+t.name+'</option>').join('');
    js.innerHTML=opts||'<option value="">— قبیله‌ای نیست —</option>';
    const bj=$('#btnJoinTribe'); if(bj) bj.disabled=!S.tribes.some(t=>t.id!==a.tribeId);
  }
  $('#btnFollow').innerHTML=S.follow?icon('eye')+' در حال دنبال‌کردن — لغو':icon('eye')+' دنبال‌کردن';
  renderPunnettMini();
}

/* ---------------- v4: کارت ساختمان — با کلیک روی ساختمان باز می‌شود ---------------- */
function nearestBuilding(x,y,maxD){
  let best=null,bd=maxD*maxD;
  for(const b of S.buildings){ const dx=b.x-x,dy=b.y-y,d=dx*dx+dy*dy; if(d<bd){bd=d;best=b;} }
  return best;
}
function selectBuilding(b){
  S.selectedBuilding=b||null;
  if(b) S.selected=null;
  updateBuildingCard();
}
function buildingContents(b){
  const t=tribeById(b.tribeId);
  switch(b.type){
    case 'farm': return 'رشد محصول: ٪'+fa(Math.round(b.growth||0))+' — هر برداشت غذا می‌دهد (با ارتقا بیشتر)';
    case 'pasture': { const herd=S.animals.filter(x=>x.tribeId===b.tribeId); return 'حیوانات قبیله: '+fa(herd.length)+' رأس — هر ۶ ثانیه '+fa(2*herd.length)+' غذا'; }
    case 'market': return t?('انبار قبیله: '+fa(t.stock.food)+' غذا • '+fa(t.stock.wood)+' چوب • '+fa(t.stock.coins)+' سکه'):'—';
    case 'workshop': case 'smithy': case 'armory': {
      const arm=t?(t.armory||{weapon:{},shield:{},armor:{}}):null;
      if(!arm) return '—';
      const txt=[...Object.entries(arm.weapon||{}),...Object.entries(arm.shield||{}),...Object.entries(arm.armor||{})].filter(([,n])=>n>0).map(([id,n])=>{ const w=WEAPONS[id]||SHIELDS[id]||ARMORS[id]; return w?w.name+' ×'+fa(n):''; }).join(' • ');
      return 'ذخیره‌ی اسلحه‌خانه: '+(txt||'خالی است');
    }
    case 'house': {
      const fam=b.ownerFamilyId?familyById(b.ownerFamilyId):b.renterFamilyId?familyById(b.renterFamilyId):null;
      return fam?('خانواده‌ی '+fa(fam.members.length)+' نفره • ثروت: '+fa(Math.round(fam.wealth||0))+' سکه'+(b.renterFamilyId?' (اجاره‌ای)':'')):'خانه‌ی خالی — خانواده‌ای می‌تواند بخرد یا اجاره کند';
    }
    case 'tent': { const daysLeft=Math.max(0,2-(S.elapsed-(b.createdAt||0))/S.settings.dayLength); return 'چادر موقت — '+fa(daysLeft.toFixed(1))+' روز دیگر می‌ماند، بعد فرسوده می‌شود؛ خانواده باید تا آن موقع خانه بگیرد'; }
    case 'granary': return 'سقف غذای قبیله +۱۵۰ تا (با ارتقا بیشتر)';
    case 'school': case 'university': case 'library': return 'پژوهش: مدرسه ۰٫۱۵، دانشگاه ۰٫۴، کتابخانه ۰٫۳ امتیاز در ثانیه';
    case 'hospital': case 'clinic': return 'درمان سریع؛ مرگ طاعون کمتر';
    case 'barracks': { const w=t?tribeMembers(t).filter(a=>a.job==='warrior'||a.job==='guard').length:0; return 'جنگجو و نگهبان قبیله: '+fa(w)+' نفر — اینجا تمرین می‌کنند'; }
    case 'command': return 'هماهنگی جنگ و وفاداری بیشتر اعضا';
    case 'tower': return 'دفاع خانه: به مهاجمان نزدیک شلیک می‌کند';
    case 'wall': return 'دیوار دفاعی — محاصره‌کننده اول باید آن را بشکند';
    case 'bakery': return t?('غذای پخته در انبار: '+fa(t.stock.meals||0)+' وعده (+۴۰ انرژی)'):'—';
    case 'butcher': return 'هر شکار +۱۰ غذای بیشتر';
    case 'inn': return 'روسپی‌ها اینجا مشتری بیشتری دارند و دستمزد بیشتری می‌گیرند';
    default: return BUILDINGS[b.type].desc;
  }
}
function updateBuildingCard(){
  const card=$('#buildingCard'), b=S.selectedBuilding;
  if(!b||!S.buildings.includes(b)){ card.hidden=true; return; }
  card.hidden=false;
  const def=BUILDINGS[b.type], t=tribeById(b.tribeId);
  $('#bldDot').style.background=t?t.color:'#94a3b8'; $('#bldDot').style.color=t?t.color:'#94a3b8';
  $('#bldName').textContent=def.name+((b.level||1)>1?' — سطح '+fa(b.level):'');
  $('#bldMeta').textContent=(t?t.name:'بی‌قبیله')+' • '+def.desc;
  const hp=b.hp??b.maxHp, max=b.maxHp||60;
  $('#bldHp').style.width=clamp(hp/max*100,0,100)+'%';
  $('#bldHpTxt').textContent=fa(Math.round(hp))+' / '+fa(max);
  const pr=$('#bldProgRow'); if(pr) pr.style.display=b.progress>=100?'none':'grid';
  $('#bldProg').style.width=(b.progress||0)+'%';
  $('#bldProgTxt').textContent='٪'+fa(Math.round(b.progress||0));
  $('#bldInfo').textContent='وضعیت: '+(b.progress>=100?'ساخته شده':'در حال ساخت ('+fa(Math.round(b.progress||0))+'٪)')+' • سطح '+fa(b.level||1)+' از ۳'+(b.progress>=100&&hp<max*0.5?' • نیاز به تعمیر! سازنده‌ها خودشان می‌آیند':'');
  $('#bldContent').textContent=buildingContents(b);
  const fam=b.ownerFamilyId?familyById(b.ownerFamilyId):b.renterFamilyId?familyById(b.renterFamilyId):null;
  $('#bldOwner').textContent=fam?('مالک: خانواده‌ی '+fa(fam.members.length)+' نفره'+(b.renterFamilyId?' (اجاره‌ای)':'')):('مالک: '+(t?t.name:'—'));
  const rep=$('#btnBuildRepair'); if(rep) rep.disabled=!(t&&hp<max&&t.stock.wood>=5&&t.stock.stone>=3);
  const up=$('#btnBuildUpgrade');
  if(up){ const cw=Math.round(def.wood*0.8*(b.level||1)), cs=Math.round(def.stone*0.8*(b.level||1)); up.textContent='ارتقا به سطح '+fa((b.level||1)+1)+' ('+fa(cw)+' چوب، '+fa(cs)+' سنگ)'; up.disabled=!(t&&(b.level||1)<3&&b.progress>=100&&t.stock.wood>=cw&&t.stock.stone>=cs); }
  const dm=$('#btnBuildDemolish'); if(dm) dm.disabled=!t&&!b.ownerFamilyId;
}

/* ---------------- جدول پانت + آزمایشگاه ژنتیک ---------------- */
function punnettHTML(a,b){
  if(!a||!b) return '<p class="note">هنوز دو والد انتخاب نشده‌اند.</p>';
  let rows=Object.keys(GENE_LABELS).map(k=>{
    const pu=punnettFor(a,b,k), ph=phenotypeProb(a,b,k);
    return `<div class="p-row"><span>${GENE_LABELS[k]} — ${a.name} × ${b.name}</span><span>AA ٪${fa(pu.AA)} • Aa ٪${fa(pu.Aa)} • aa ٪${fa(pu.aa)} • فنوتیپ بالا ٪${fa(ph)}</span></div>`;
  }).join('');
  return `<b>${icon('heart')} ${a.name} × ${b.name}</b><div style="margin-top:6px">${rows}</div>`;
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
    el.querySelector('.gr-dom').addEventListener('change',e=>{ GEN_RULES[k].dominant=e.target.value==='A'; applyRulesToAll(); logEvent('قانون ژن «'+GENE_LABELS[k]+'» عوض شد: حالا آلل '+(GEN_RULES[k].dominant?'A':'a')+' غالب است.','god'); });
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
 {t:'وراثت مندلی',ic:'gene',d:'هر ویژگی دو نسخه (آلل) دارد؛ یکی از پدر، یکی از مادر. ژنوتیپ AA یعنی هر دو آلل بزرگ، Aa یعنی یکی بزرگ یکی کوچک، aa یعنی هر دو کوچک.',ex:'مثال: اگر سرعت AA باشد سریع است، Aa هم سریع است چون A غالب است، ولی aa کند است. Aa حامل پنهان آلل کوچک است و می‌تواند به بچه‌اش بدهد.'},
 {t:'جدول پانت',ic:'stats',d:'جدول پانت همه‌ی ترکیب‌های ممکن آلل‌های پدر و مادر را نشان می‌دهد و احتمال ژنوتیپ بچه را حساب می‌کند.',ex:'مثال: Aa × Aa می‌شود ۲۵٪ AA، ۵۰٪ Aa و ۲۵٪ aa. یعنی یک‌چهارم بچه‌ها ویژگی مغلوب را نشان می‌دهند.'},
 {t:'چندژنی (Polygenic)',ic:'gene',d:'بعضی ویژگی‌ها مثل سرعت، بینایی و جثه را یک ژن تعیین نمی‌کند؛ جمع چند ژن + کمی اثر محیط است، پس مقدارشان پیوسته و متنوع است.',ex:'مثال: سرعت حاصل ۳ جایگاه ژنی است؛ هرچه آلل A بیشتر باشد، سریع‌تر است. به‌همین دلیل سرعت‌ها پله‌پله نیستند.'},
 {t:'جهش',ic:'sparkle',d:'گاهی هنگام تولد یک آلل برعکس می‌شود. بیشتر جهش‌ها خنثی‌اند (فنوتیپ عوض نمی‌شود)، بعضی مفید و بعضی مضرند.',ex:'مثال: جهش Aa به AA وقتی A غالب است خنثی است؛ ولی جهش AA به aa می‌تواند یک موجود سریع را کند کند.'},
 {t:'رانش ژنتیکی و گلوگاه',ic:'users',d:'وقتی جمعیت کوچک می‌شود، فرکانس آلل‌ها تصادفی جابه‌جا می‌شود، حتی بدون هیچ انتخابی. این رانش است.',ex:'مثال: دکمه گلوگاه جمعیت را به ۱۰ نفر می‌رساند؛ ببین فرکانس آلل A چطور ناگهان از ۵۰٪ به ۲۰٪ یا ۸۰٪ می‌پرد.'},
 {t:'اثر بنیان‌گذار',ic:'flag',d:'اگر چند نفر جدا شوند و جمعیت تازه‌ای بسازند، ژن‌های آن چند نفر، ژن کل نسل‌های بعد می‌شود.',ex:'مثال: ۵ بنیان‌گذار که تصادفی بیشترشان آلل a دارند، جمعیتی می‌سازند که نسل‌ها a در آن زیاد است.'},
 {t:'انتخاب طبیعی و جنسی',ic:'heart',d:'موجود سازگارتر بیشتر زنده می‌ماند و بچه‌دار می‌شود (انتخاب طبیعی). ماده‌ها هم ممکن است نر خاصی را ترجیح دهند (انتخاب جنسی).',ex:'مثال: در قحطی، متابولیسم کند برنده است. اگر ترجیح جنسی روی «سریع‌تر» باشد، نرهای سریع حتی اگر کمی گرسنه‌تر باشند، بیشتر جفت می‌گیرند.'},
 {t:'جریان ژنی',ic:'users',d:'مهاجرت ژن‌های تازه وارد جمعیت می‌کند و تنوع را برمی‌گرداند.',ex:'مثال: ۸ مهاجر با ژن سرعت متفاوت وارد کن؛ ببین چطور در چند نسل آلل‌هایشان در کل جمعیت پخش می‌شود.'},
 {t:'افسردگی هم‌خونی',ic:'heart',d:'تولیدمثل خویشاوندان نزدیک، آلل‌های مغلوب مضر را کنار هم می‌آورد؛ فرزند ضعیف‌تر می‌شود یا می‌میرد.',ex:'مثال: خواهر و برادر (F=۲۵٪) بچه‌دار شوند، بچه ۳۵٪ شانس مرگ در بدو تولد دارد و عمرش کوتاه‌تر است.'},
 {t:'تعادل هاردی–واینبرگ',ic:'gene',d:'اگر هیچ انتخاب، جهش، مهاجرت و رانشی نباشد، فرکانس ژنوتیپ‌ها ثابت می‌ماند: AA=p² ، Aa=2pq ، aa=q².',ex:'مثال: اگر p=۰٫۶ باشد، انتظار داریم ۳۶٪ AA، ۴۸٪ Aa و ۱۶٪ aa ببینیم. هرچه مشاهده‌شده از این دورتر باشد، یعنی انتخاب یا رانش در کار است.'},
 {t:'اپیستازی',ic:'mask',d:'یک ژن می‌تواند اثر ژن دیگر را کاملاً بپوشاند؛ مثل اینکه یک کلید، چراغ دیگری را خاموش کند.',ex:'مثال: ژن «پوشش تیره» اگر ظاهر شود، بدن تیره می‌شود، هرچقدر هم ژن «رنگ پوشش» روشن باشد. رنگ روشن زیر پوشش تیره پنهان می‌ماند ولی به بچه‌ها منتقل می‌شود.'},
 {t:'قبایل',ic:'civ',d:'جهان با هیچ قبیله‌ای شروع نمی‌شود؛ افراد قوی با رهبری بالا قبیله می‌سازند و بقیه به آن‌ها می‌پیوندند. هر قبیله انبار، فناوری و فرهنگ خودش را دارد؛ نوزاد قبیله‌ی پدر و مادرش را می‌گیرد.',ex:'مثال: در تب «تمدن» روی یک قبیله بزن تا اعضای آن روی نقشه حلقه‌دار شوند و دوربین روی مرکزشان برود. روی یک فرد بزن تا «تشکیل قبیله» یا «ترک قبیله» را ببینی.'},
 {t:'شغل‌ها',ic:'users',d:'هر موجود بالغ یک شغل دارد: جمع‌آور، چوب‌بر، معدنچی، کشاورز، سازنده، جنگجو، نگهبان، شکارچی، دانشمند، درمانگر، بازرگان، دامدار، آهنگر، آشپز یا روسپی. شغل از روی ژن‌ها و سهمیه‌ی قبیله تعیین می‌شود.',ex:'مثال: موجودی را انتخاب کن و از کارتش شغلش را عوض کن؛ یا در تب تمدن سهمیه‌ی جنگجوها را زیاد کن تا قبیله‌ات قوی‌تر شود.'},
 {t:'فناوری و عصرها',ic:'gene',d:'دانشمندان و مدرسه‌ها امتیاز پژوهش می‌سازند و قبیله فناوری‌های تازه کشف می‌کند: از آتش و ابزار سنگی تا پول و پزشکی. عصر قبیله از فناوری‌هایش مشخص می‌شود.',ex:'مثال: «کشاورزی» مزرعه را باز می‌کند، «پول» بازار را، «پزشکی» بیمارستان را. روی یک فناوری در دسترس بزن تا در اولویت پژوهش قرار گیرد.'},
 {t:'پول و تجارت',ic:'coin',d:'بعد از کشف «پول» و ساختن بازار، بازرگانان غذای اضافه را می‌فروشند و سکه می‌گیرند؛ بازرگانان به بازار قبیله‌های دوست هم سفر می‌کنند و کالا را با سکه یا با کالای دیگر مبادله می‌کنند. قیمت با کمیابی بالا می‌رود و متحدان بهتر می‌خرند. وقتی انبار غذا خالی است، خانواده‌ها با ثروتشان از بازار غذا می‌خرند.',ex:'مثال: به قبیله‌ای که با تو دشمن نیست «هدیه غذا» بده؛ رابطه +۲۰ می‌شود و شاید به اتحاد برسید. بازرگان‌هایشان را در نقشه دنبال کن.'},
 {t:'جنگ و صلح',ic:'war',d:'رابطه‌ی دو قبیله از ۱۰۰- تا ۱۰۰+ است. دوستی آهسته فراموش می‌شود، ولی کینه خیلی آهسته‌تر — دشمنی‌ها می‌مانند. زیر ۵۰- یعنی جنگ: جنگجوها در میدانی بین دو قبیله می‌جنگند و برنده غنیمت می‌گیرد؛ یورش‌های کوچک هم غذا می‌دزدند و کینه می‌سازند. تمایل رهبر به جنگ (پرخاشگری + عقیده + کینه‌ها) در تب تمدن دیده می‌شود.',ex:'مثال: از تب تمدن روی «اعلام جنگ» بزن و ببین جنگجوها چطور دسته‌ای حمله می‌کنند؛ با «صلح کن» جنگ تمام می‌شود و ۳ روز آتش‌بس برقرار است.'},
 {t:'اتحاد قبایل',ic:'alliance',d:'وقتی رابطه‌ی دو قبیله بالای ۶۰ شد، می‌توانند پیمان اتحاد ببندند (دکمه‌ی «اتحاد» در تب تمدن، یا خود رهبرها پیشنهاد می‌دهند). متحدان هرگز به هم حمله نمی‌کنند، تجارتشان ۱۰٪ بهتر است، و اگر یکی حمله شود، دیگری جنگجو به کمک می‌فرستد.',ex:'مثال: دو قبیله‌ی دوست را پیدا کن، رابطه‌شان را با هدیه بالا ببر، بعد «اتحاد» را بزن؛ بعد به یکی‌شان اعلام جنگ کن و ببین متحدش چطور به کمک می‌آید.'},
 {t:'محاصره و اشغال',ic:'siege',d:'در جنگ، جنگجوها فقط در میدان نمی‌جنگند؛ به خانه‌ی دشمن می‌روند و ساختمان‌هایش را می‌زنند. هر ساختمان جان (HP) دارد؛ دیوار اول می‌شکند، بعد خانه و مزرعه. خانه‌ی ویران یعنی خانواده‌ای بی‌خانه. اگر قبیله‌ای همه‌ی ساختمان‌هایش را از دست بدهد یا فقط ۲ نفر بماند، سقوط می‌کند: انبار و سرزمینش به برنده می‌رسد و بازماندگان به برنده می‌پیوندند.',ex:'مثال: روی یک ساختمان بزن تا جان و سطحش را ببینی؛ ساختمان آسیب‌دیده را می‌شود تعمیر یا ارتقا داد.'},
 {t:'سرزمین و مالکیت زمین',ic:'land',d:'جهان شبکه‌ی خانه‌های ۵۰ پیکسلی است و سرزمین هر قبیله، مجموعه‌ی خانه‌هایی است که مالکش است. قبیله با خانه‌های دور خانه‌اش شروع می‌کند و با ساختن ساختمان (هر ساختمان کامل‌شده خانه‌های دور خودش را می‌گیرد)، جاده (سازنده خانه‌به‌خانه از مرز جلو می‌رود و حرکت روی جاده سریع‌تر است)، برج (خانه‌های دورش + دفاع از سرزمین) و قلعه (شعاع بزرگ + قلب آبادی تازه) گسترش می‌یابد. ساختمان‌ها فقط درون سرزمین خودشان ساخته می‌شوند و برداشت منابع از سرزمین قبیله‌ی دیگر کینه می‌سازد. هرچه سرزمین دو قبیله به هم نزدیک‌تر باشد، تمایلشان به جنگ بیشتر است.',ex:'مثال: در تب «تمدن» شمار خانه‌های سرزمین و فاصله‌ی سرزمین‌ها تا نزدیک‌ترین رقیب را ببین؛ دو قبیله‌ی همسایه زودتر با هم درگیر می‌شوند.'},
 {t:'طمع زمین و جنگ بر سر زمین',ic:'land',d:'قبیله‌ها زمین می‌خواهند: وقتی چوبِ مازاد هست، سازنده‌های بیکار خانه‌های بی‌صاحبِ چسبیده به سرزمین را می‌گیرند — به‌سمت منابع (درخت، سنگ، غذا) و به‌سمت رقیب؛ هرچه دورتر از خانه، گران‌تر (چوب بیشتر، سنگ اضافه). سرزمین سقف هم دارد: با جمعیت و برج‌ها بالا می‌رود، پس یک قبیله نمی‌تواند نقشه را رایگان رنگ کند. وقتی سرزمین دو قبیله به هم می‌رسد، تنش مرزی بالا می‌رود (در تب تمدن دیده می‌شود) و خانه‌های مورد مناقشه کینه می‌سازند؛ تصاحب زمین چسبیده به مرز رقیب، تحریک است (+۳ کینه). تنش بالا تمایل به جنگ را بیشتر می‌کند و برنده‌ی جنگ، نوار مرزی و چند خانه‌ی بازنده را می‌گیرد — و بازنده کینه‌ی انتقام می‌گیرد.',ex:'مثال: دو قبیله‌ی همسایه را تماشا کن؛ تنش مرزی‌شان در تب تمدن بالا می‌رود و اگر جنگ شود، برنده زمین می‌گیرد.'},
 {t:'فرسودگی ساختمان‌ها و تعمیر',ic:'home',d:'هر ساختمان آهسته فرسوده می‌شود — چوبی‌ها سریع‌تر از سنگی‌ها، دیوار و برج کمی بیشتر سایش می‌برند، و ساختمانِ بی‌صاحب ۲٫۵ برابر سریع‌تر می‌پوسد. سازنده‌ها وقتی ساختمانی زیر نصف جانش باشد، خودشان اول می‌روند سراغ تعمیر (۲ چوب و ۱ سنگ برای ۲۵٪ جان — خیلی ارزان‌تر از ساختن تازه). ساختمانِ آسیب‌دیده روی نقشه تیره‌تر است و ترک کهربایی دارد، و در تب تمدن فهرست «نیاز به تعمیر» معلوم است. اگر جان ساختمان به صفر برسد، فرو می‌ریزد: اگر خانه بود، خانواده‌اش بی‌خانه می‌شود و دنبال خانه می‌گردد؛ اگر برج یا قلعه بود، سرزمین دورش پس گرفته می‌شود.',ex:'مثال: روی یک ساختمان آسیب‌دیده بزن — در کارتش «نیاز به تعمیر!» را ببین و دکمه‌ی تعمیر را بزن (۵ چوب و ۳ سنگ، +۶۰٪ جان).'},
 {t:'جاده‌های بین‌قبیله‌ای',ic:'trade',d:'دو قبیله‌ی دوست (رابطه بالای صفر) — به‌ویژه متحدان و شریک‌های تجاری — جاده‌ای بین سرزمین‌هایشان می‌کشند: سازنده‌های قبیله‌ی آغازگر خانه‌به‌خانه جاده می‌سازند (هر خانه ۱ چوب) تا دو سرزمین به هم وصل شوند. روی جاده حرکت ۱٫۳ برابر سریع‌تر است، بازرگانان بینشان بیشتر رفت‌وآمد می‌کنند و خودِ جاده آهسته رابطه را بهتر می‌کند. قبیله‌های دشمن جاده نمی‌سازند؛ و وقتی جنگ شروع شود، جاده‌ی بینشان قطع می‌شود و تا صلح دوباره ساخته نمی‌شود.',ex:'مثال: دو قبیله‌ی دوستِ نزدیک را پیدا کن و جاده‌ی بینشان را در نقشه تماشا کن؛ بعد به یکی‌شان اعلام جنگ کن و ببین جاده چطور قطع می‌شود.'},
 {t:'چرا زندگی قبیله‌ای؟',ic:'users',d:'زندگی قبیله‌ای بهتر است چون مزایایش واقعی است: عضو قبیله وقتی گرسنه است از انبار مشترک غذا می‌خورد، نگهبانان و جنگجویان از او محافظت می‌کنند، درمانگر فقط هم‌قبیله‌ای‌ها را درمان می‌کند و بیمارستان بهبود را سریع‌تر می‌کند، خانه و مزرعه و مدرسه و بازار مشترک است. بی‌قبیله‌ها هیچ‌کدام را ندارند و خودشان همه‌چیز را جمع می‌کنند — برای همین بزرگسالان بی‌قبیله خودشان به نزدیک‌ترین قبیله می‌روند و درخواست پیوستن می‌دهند، و قبیله تا وقتی ظرفیت (با خانه بیشتر می‌شود) و نیاز به نیروی کار دارد، راحت می‌پذیرد. ترک قبیله هم آسان نیست: وفاداری آهسته کم می‌شود و فقط نارضایتی خیلی زیاد یا اختلاف شدید با رهبر کسی را بیرون می‌کشد — مگر اینکه قبیله در حال فروپاشی باشد.',ex:'مثال: یک بی‌قبیله را دنبال کن؛ خودش به سوی نزدیک‌ترین قبیله می‌رود و می‌پیوندد. در کارت هر فرد، مدت عضویتش در قبیله را ببین.'},
 {t:'دربار، رضایت، اعتراض و انقلاب',ic:'crown',d:'رهبر قبیله روی نقشه تاج طلایی دارد. رهبر از میان اعضا چهار وزیر برمی‌گزیند: مشاور (پژوهش ۲۵٪ سریع‌تر)، وزیر (برداشت و محصول مزرعه ۱۵٪ بیشتر)، سردار (قدرت جنگی جنگجویان ۱۵٪ بیشتر) و خزانه‌دار (تجارت و فروش به کاروان ۱۰٪ سودآورتر). وزیرِ مرده یا رفته خودبه‌خود جایگزین می‌شود و خدا هم از تب تمدن می‌تواند هر نقش را با دکمه‌ی «جایگزین» عوض کند. رضایت اعضا از رهبر از غذا و سکه و برد و باخت جنگ و جشنواره و ساختمان تازه و مرگ‌ها تغذیه می‌شود و آهسته حرکت می‌کند. اگر رضایت میانگین مدت‌ها پایین بماند، اعتراض شروع می‌شود (معترضان دور خانه جمع می‌شوند و کار نمی‌کنند) و اگر بدتر شود، انقلاب: شورشیان با جنگجویان وفادار و دربار رهبر می‌سنجند — یا رهبر تازه‌ای می‌آید و رهبر پیشین تبعید یا کشته می‌شود، یا انقلاب سرکوب می‌شود و بعضی معترضان زندانی یا کشته می‌شوند. قبیله‌ی خوب تقریباً هیچ‌وقت شورش نمی‌کند.',ex:'مثال: به قبیله‌ای قحطی بده (خشکسالی یا باران غذا را قطع کن) و رضایتش را در تب تمدن تماشا کن؛ اگر خیلی پایین بماند، اعتراض شروع می‌شود.'},
 {t:'فروپاشی قبیله',ic:'death',d:'قبیله با کمتر از ۸ بزرگسال وفادار نزدیک ساخته نمی‌شود — رهبر تنها با ۲–۳ پیرو قبیله نمی‌سازد. و قبیله‌ای که کوچک شود (کمتر از ۴ بزرگسال) یا مدت‌ها غذای کافی نداشته باشد (انبار خالی، بدون مزرعه و بدون غذای وحشی نزدیک خانه) یا بی‌دفاع بماند (نه جنگجو نه نگهبان، در حالی که دشمن یا حیوان وحشی هست) اول هشدار «در آستانه‌ی فروپاشی» می‌گیرد و اگر یک روز کامل اوضاع درست نشد، از هم می‌پاشد: اگر دشمن در حال جنگ یا نزدیک‌ترین قبیله باشد، سرزمین و انبار و بازماندگان به او می‌رسد؛ وگرنه بازماندگان به قبیله‌ی دوست نزدیک می‌پیوندند یا بی‌قبیله می‌شوند، ساختمان‌ها بی‌صاحب می‌مانند و سرزمین بی‌صاحب می‌شود.',ex:'مثال: اعضای یک قبیله را با صاعقه کم کن و ببین اول هشدار می‌آید و بعد از یک روز قبیله از هم می‌پاشد.'},
 {t:'سرپناه، چادر و مالکان',ic:'home',d:'خانه نیاز بقاست، نه تجمل: خانواده‌ی بی‌خانه و بی‌چادر آهسته سلامت از دست می‌دهد، خودبه‌خود بهبود نمی‌یابد و سرما و گرما سخت‌تر می‌زند؛ و تا خانه نگیرد نمی‌تواند بچه‌دار شود. بزرگسالان چنین خانواده‌ای اول مصالح جمع می‌کنند تا سرپناه جور شود. اگر خانه جور نشد، خانواده چادر می‌زند (۲ چوب، سریع) — سرپناه موقت با محافظت کم که فقط ۲ روز می‌ماند و بعد فرسوده می‌شود؛ در چادر هم اولویت خانواده هنوز خانه است. خانواده‌ی ثروتمند (۶۰ سکه یا بیشتر) می‌تواند تا ۳ خانه بخرد و خانه‌های اضافه را اجاره دهد: مستأجر ۳ سکه‌ی اول + ۱ سکه در روز می‌پردازد و این پول به مالک می‌رسد؛ اگر نتواند بپردازد، بیرون می‌شود. وضعیت سرپناه هر فرد در کارتش معلوم است: خانه / چادر / بی‌سرپناه.',ex:'مثال: روی یک موجود بزن و در کارتش ببین خانواده‌اش خانه دارد یا چادر یا بی‌سرپناه است؛ چادر روی نقشه مثلث کوچک نارنجی است.'},
 {t:'رنگ قبیله و نام تبار',ic:'users',d:'رنگ هر موجود رنگ قبیله‌اش است و بی‌قبیله‌ها همه خاکستری‌اند — رنگ دیگر از تبار (نژاد) نمی‌آید؛ تبار فقط ژنتیک است. تبارها هم شماره ندارند: هر تبار یک نام فارسی دارد که از شناسه‌اش ساخته می‌شود و همیشه همان می‌ماند؛ نام تبار در کارت هر فرد، در فهرست تبارها در تب آمار و در گزارش‌ها معلوم است.',ex:'مثال: در تب آمار فهرست تبارها را ببین — هر تبار نام خودش را دارد؛ وقتی قبیله عوض می‌شود، رنگ موجود هم عوض می‌شود.'},
 {t:'مذاکره و صلح',ic:'peace',d:'جنگ خسته‌کننده است: هر کشته خستگی قبیله را بالا می‌برد و جنگ طولانی هر دو طرف را به صلح می‌کشاند. رهبر خسته خودش پیشنهاد صلح می‌دهد؛ یا می‌شود با پرداخت باج (۱۵ سکه یا ۲۰ غذا) جنگ را تمام کرد. صلح یعنی رابطه +۱۰ و ۳ روز آتش‌بس — تا آتش‌بس تمام نشود نمی‌شود دوباره اعلام جنگ کرد.',ex:'مثال: وقتی جنگ طولانی شد، به تب تمدن نگاه کن: خستگی از جنگ بالای ۴۵ یعنی صلح نزدیک است.'},
 {t:'ساختمان‌ها را لمس کن',ic:'home',d:'روی هر ساختمان روی نقشه بزن تا کارتش باز شود: نام، قبیله، جان (HP)، سطح، پیشرفت ساخت و محتوایش را می‌بینی — مثلاً رشد مزرعه، حیوانات مرتع، ذخیره‌ی اسلحه‌خانه یا خانواده‌ی ساکن خانه. ساختمان آسیب‌دیده را می‌شود تعمیر کرد، تا سطح ۳ ارتقا داد یا تخریب کرد (نیمی از منابع برمی‌گردد).',ex:'مثال: روی یک مزرعه بزن و رشدش را ببین؛ روی یک خانه بزن و ببین کدام خانواده در آن زندگی می‌کند.'},
 {t:'مغازه‌های شغلی',ic:'market',d:'هر شغل یک ساختمان مخصوص دارد: نانوایی (آشپز دو برابر سریع‌تر می‌پزد)، انبار غله (سقف غذای قبیله +۱۵۰)، آهنگری (آهنگر دو برابر سریع‌تر می‌سازد)، قصابی (هر شکار +۱۰ غذا)، کتابخانه (پژوهش ۱٫۵ برابر)، درمانگاه (درمان ۱٫۵ برابر سریع‌تر) و مهمانخانه (روسپی مشتری بیشتر و دستمزد بیشتر دارد).',ex:'مثال: وقتی «سفالگری» کشف شد، نانوایی و انبار غله بساز؛ وقتی «پول» آمد، مهمانخانه بساز.'},
 {t:'نیازها و توسعه',ic:'scale',d:'هر قبیله تراز نیازهایش را می‌سنجد: غذا، چوب و سنگ در روز چقدر کم یا زیاد می‌شوند. کمبود غذا کشاورز و مزرعه می‌آورد، کمبود چوب چوب‌بر، کمبود سنگ معدنچی؛ مازاد، کارگرها را به پژوهش و صنعت می‌برد. تراز را در تب تمدن ببین.',ex:'مثال: قبیله‌ای که غذایش منفی است، سهمیه‌ی کشاورزش خودبه‌خود بالا می‌رود؛ اگر مزرعه ندارد، مزرعه می‌سازد.'},
 {t:'انبار و خرج کردن',ic:'trade',d:'قبیله‌ها دیگر مازاد را انبار نمی‌کنند: وقتی چوب و سنگ زیاد شد، اول زیرساخت می‌سازند، بعد ساختمان‌ها را ارتقا می‌دهند، بعد خانه و مزرعه‌ی بیشتر، و اگر باز هم اضافه ماند، مازاد را به کاروان‌های عبوری می‌فروشند و سکه می‌گیرند. همه‌ی این خرج‌ها در دفتر رویدادها ثبت می‌شود.',ex:'مثال: در دفتر رویدادها دنبال «انبار دارد خرج می‌شود» بگرد تا ببینی هر قبیله مازادش را کجا خرج کرده است.'},
 {t:'حرکت و زوم نقشه',ic:'map',d:'جهان ۲۴۰۰ در ۱۸۰۰ است و بزرگ‌تر از صفحه است: با کشیدن انگشت یا موس نقشه جابه‌جا می‌شود، با پینچ دو انگشت یا چرخ موس زوم می‌شود.',ex:'مثال: دکمه‌های ＋ و － و مرکز بالای نقشه را بزن؛ روی مینی‌مپ پایین نقشه بزن تا دوربین همان‌جا بپرد. وقتی موجودی را دنبال می‌کنی، دوربین روی او قفل می‌شود.'},
 {t:'نمای ایزومتریک',ic:'cube',d:'جهان را می‌توانی سه‌بعدی و ایزومتریک ببینی: زمین مربعی، خانه‌ها با سقف شیب‌دار، درخت‌ها مخروطی، و تاج طلایی رهبر بالای سرش. دکمه‌ی «نما» پایین صفحه بین ایزومتریک و دوبعدی جابه‌جا می‌شود و انتخابت ذخیره می‌شود. همه‌ی کارها — کشیدن نقشه، زوم، کلیک روی موجود و ساختمان، قدرت‌های خدا — در هر دو نما یکسان کار می‌کنند. اگر مرورگرت WebGL نداشته باشد، بازی خودکار دوبعدی می‌ماند و هیچ‌چیز خراب نمی‌شود.',ex:'مثال: در نمای ایزومتریک روی یک قبیله زوم کن؛ قلعه، برج‌ها و سرزمین رنگی‌اش را سه‌بعدی ببین، بعد با دکمه‌ی نما به دوبعدی برگرد.'},
];
function buildGuide(){
  const box=$('#guideList'); if(!box) return;
  box.innerHTML=GUIDE.map(g=>`<div class="guide-card"><h4>${icon(g.ic||'guide')} ${g.t}</h4><p>${g.d}</p><p class="ex">${g.ex}</p></div>`).join('');
}

/* ---------------- ورودی لمسی / موس + دوربین ---------------- */
let lastTap=0,lastTapX=0,lastTapY=0,downX=0,downY=0;
const pointers=new Map();
let panning=false, pinchPrevD=0, pinchMid=null;
function canvasPos(e){ const r=e.currentTarget.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}; }
/* v27: ورودی لمسی/موس روی هر دو بوم (دوبعدی و ایزومتریک) بسته می‌شود —
   فقط یکی دیده می‌شود؛ مختصات با e.currentTarget حساب می‌شود. */
function bindWorldInput(cv){
cv.addEventListener('pointerdown',e=>{
  cv.setPointerCapture(e.pointerId);
  const p=canvasPos(e); pointers.set(e.pointerId,p);
  if(pointers.size===1){ downX=p.x; downY=p.y; panning=false; }
  else if(pointers.size===2){ const pts=[...pointers.values()]; pinchPrevD=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y); pinchMid={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2}; panning=true; }
});
cv.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId)) return;
  const prev=pointers.get(e.pointerId); const p=canvasPos(e); pointers.set(e.pointerId,p);
  if(pointers.size===1){
    const dx=p.x-prev.x, dy=p.y-prev.y;
    if(!panning&&Math.hypot(p.x-downX,p.y-downY)>8) panning=true;
    if(panning){ CAM.x-=dx/CAM.zoom; CAM.y-=dy/CAM.zoom; clampCam(); }
  } else if(pointers.size===2){
    const pts=[...pointers.values()];
    const d=Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
    const mid={x:(pts[0].x+pts[1].x)/2,y:(pts[0].y+pts[1].y)/2};
    if(pinchPrevD>0){ zoomAt(mid.x,mid.y,d/pinchPrevD); CAM.x-=(mid.x-pinchMid.x)/CAM.zoom; CAM.y-=(mid.y-pinchMid.y)/CAM.zoom; clampCam(); }
    pinchPrevD=d; pinchMid=mid;
  }
});
cv.addEventListener('pointerup',e=>{
  const wasPinch=pointers.size>=2;
  pointers.delete(e.pointerId);
  if(pointers.size===1){ const p=[...pointers.values()][0]; downX=p.x; downY=p.y; panning=false; }
  if(wasPinch||panning){ if(pointers.size===0) panning=false; return; }
  const p=canvasPos(e); if(Math.hypot(p.x-downX,p.y-downY)>12) return; // کشیدن بود، نه ضربه
  const w=isoPick(p.x,p.y)||screenToWorld(p.x,p.y); // v27: در نمای ایزومتریک، ری‌کست سه‌بعدی
  const now=Date.now();
  if(now-lastTap<350&&Math.hypot(p.x-lastTapX,p.y-lastTapY)<45){
    for(let i=0;i<12;i++) spawnFood(w.x+rand(-70,70),w.y+rand(-70,70));
    burst(w.x,w.y,'#4ade80',16,120); toast('باران غذا!'); lastTap=0; return;
  }
  lastTap=now; lastTapX=p.x; lastTapY=p.y;
  if(S.placing){ const t=tribeById(S.selTribe); if(t&&queueBuilding(t,S.placing,w.x,w.y)){ toast('«'+BUILDINGS[S.placing].name+'» در صف ساخت قرار گرفت'); renderCiv(); } S.placing=null; updatePlacingHint(); return; }
  if(S.armed){ execPower(S.armed,w.x,w.y); return; }
  const a=nearestAgent(w.x,w.y,30/CAM.zoom+8);
  if(a){
    if(S.pickMate){ S.mateSelected=a; S.pickMate=false; toast('والد دوم: '+a.name+' — جدول پانت را در تب ژنتیک ببین'); renderPunnettBox(); updateSelected(); return; }
    S.selected=a; S.selectedBuilding=null; updateBuildingCard(); updateSelected();
  }
  else {
    const b=nearestBuilding(w.x,w.y,26/CAM.zoom+10);
    if(b){ selectBuilding(b); updateSelected(); }
    else { S.selected=null; S.follow=false; S.selectedBuilding=null; updateBuildingCard(); updateSelected(); }
  }
});
cv.addEventListener('pointercancel',e=>{ pointers.delete(e.pointerId); if(pointers.size===0) panning=false; });
cv.addEventListener('wheel',e=>{ e.preventDefault(); const p=canvasPos(e); zoomAt(p.x,p.y,e.deltaY<0?1.15:1/1.15); },{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
}
bindWorldInput(canvas);
bindWorldInput(canvas3d);

/* ---------------- سیم‌کشی دکمه‌ها ---------------- */
/* v27: جابه‌جایی نما بین ایزومتریک و دوبعدی — ترجیح در localStorage می‌ماند */
function updateViewBtn(){ const b=$('#btnView'); if(!b) return; b.innerHTML=(S.view==='iso'?icon('cube')+' ایزومتریک':icon('grid')+' دوبعدی'); }
function applyView(){
  if(S.view==='iso'&&!(typeof Iso3D!=='undefined'&&Iso3D.available())) S.view='2d';
  const iso=S.view==='iso';
  canvas.style.display=iso?'none':'block';
  if(canvas3d) canvas3d.style.display=iso?'block':'none';
  updateViewBtn();
}
function switchView(v){
  const next=v||(S.view==='iso'?'2d':'iso');
  if(next==='iso'&&!(typeof Iso3D!=='undefined'&&Iso3D.available())){ toast('نمای سه‌بعدی در این مرورگر در دسترس نیست'); return; }
  S.view=next;
  try{ localStorage.setItem('godsim-view',next); }catch(e){}
  applyView();
  toast(next==='iso'?'نمای ایزومتریک':'نمای دوبعدی');
}
function setRunning(v){
  S.running=v; $('#btnPlay').innerHTML=v?icon('pause')+' توقف':icon('play')+' ادامه';
}
$('#btnPlay').addEventListener('click',()=>setRunning(!S.running));
$('#btnView').addEventListener('click',()=>switchView());
$('#btnSpeed').addEventListener('click',()=>{
  S.speed=S.speed===1?2:S.speed===2?4:S.speed===4?8:1;
  $('#btnSpeed').innerHTML=icon('lightning')+' سرعت ×'+fa(S.speed);
});
$('#btnStep').addEventListener('click',()=>{ if(S.running) setRunning(false); tick(0.5); draw(); updateStats(); });
function nwPopVal(){ const v=parseInt($('#nwPopNum').value,10); return clamp(isNaN(v)?120:v,10,500); }
function nwPopSync(v){
  v=clamp(Math.round(v)||120,10,500);
  $('#nwPopNum').value=v;
  $('#nwPopVal').textContent=fa(v)+' موجود';
}
$('#nwPopRange').addEventListener('input',()=>{ const v=clamp(+$('#nwPopRange').value||120,10,500); $('#nwPopRange').value=v; nwPopSync(v); });
$('#nwPopNum').addEventListener('input',()=>nwPopSync(+$('#nwPopNum').value));
$('#nwPopNum').addEventListener('focus',e=>{ if(e.target.select) e.target.select(); });
$('#btnReset').addEventListener('click',()=>{ nwPopSync(nwPopVal()); $('#confirmBox').hidden=false; });
$('#btnConfirmReset').addEventListener('click',()=>{
  $('#confirmBox').hidden=true;
  const n=nwPopVal();
  S.settings.popCap=Math.max(n,S.settings.popCap);
  const sl=$('#sl-popCap'); if(sl&&sl.value!==undefined) sl.value=S.settings.popCap;
  const slv=$('#slv-popCap'); if(slv) slv.textContent=fa(S.settings.popCap)+' موجود';
  resetWorld(n);
  logEvent('دنیای تازه با '+fa(n)+' موجود آفریده شد.','god');
  toast('دنیای تازه با '+fa(n)+' موجود آفریده شد');
});
$('#btnCancelReset').addEventListener('click',()=>{ $('#confirmBox').hidden=true; });
$('#confirmBox').addEventListener('click',e=>{ if(e.target.id==='confirmBox') $('#confirmBox').hidden=true; });
$('#btnRebirth').addEventListener('click',()=>{ resetWorld(); toast('آفرینش دوباره!'); });
$('#btnPanel').addEventListener('click',()=>$('#panel').classList.toggle('open'));
$('#panelHandle').addEventListener('click',()=>$('#panel').classList.toggle('open'));
$$('.tab').forEach(t=>t.addEventListener('click',()=>{
  $$('.tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
  $$('.tab-page').forEach(p=>p.classList.remove('active'));
  $('#tab-'+t.dataset.tab).classList.add('active');
  $('#panel').classList.add('open');
  t.scrollIntoView({behavior:'smooth',inline:'nearest',block:'nearest'}); // v5: تب فعال همیشه دیده شود
}));
// v5: چرخ موس روی ردیف تب‌ها آن را افقی می‌چرخاند (روی دسکتاپ که اسکرول‌بار باریک دیده می‌شود)؛
// اگر تب‌ها به انتها رسیده باشند، چرخ به پنل می‌رسد و آن را عمودی می‌چرخاند. در RTL جهت scrollLeft برعکس است.
const tabsEl=document.querySelector('.tabs');
if(tabsEl) tabsEl.addEventListener('wheel',e=>{
  if(Math.abs(e.deltaY)<=Math.abs(e.deltaX)||tabsEl.scrollWidth<=tabsEl.clientWidth) return;
  const rtl=getComputedStyle(tabsEl).direction==='rtl';
  const max=tabsEl.scrollWidth-tabsEl.clientWidth;
  const pos=rtl?-tabsEl.scrollLeft:tabsEl.scrollLeft; // ۰ تا max در هر دو جهت
  if((e.deltaY>0&&pos>=max)||(e.deltaY<0&&pos<=0)) return; // به انتها رسیده — بگذار پنل بچرخد
  tabsEl.scrollLeft+=(rtl?-1:1)*e.deltaY; e.preventDefault();
},{passive:false});
$('#btnDisarm').addEventListener('click',disarm);
$('#btnAdd10').addEventListener('click',()=>{ for(let i=0;i<10;i++) S.agents.push(makeAgent()); logEvent('۱۰ موجود تازه آفریده شدند.','god'); toast('۱۰ موجود اضافه شد'); });
$('#btnAddFood').addEventListener('click',()=>{ for(let i=0;i<25;i++) spawnFood(); toast('۲۵ غذا ریخته شد'); });
$('#btnKill10').addEventListener('click',()=>{
  const victims=[...S.agents].sort(()=>Math.random()-.5).slice(0,10);
  victims.forEach(a=>killAgent(a,'خدا')); logEvent('خدا ۱۰ موجود را کشت.','god');
});
$('#btnCloseSelected').addEventListener('click',()=>{S.selected=null;S.follow=false;updateSelected();});
$('#btnCloseBuilding').addEventListener('click',()=>{S.selectedBuilding=null;updateBuildingCard();});
$('#btnBuildRepair').addEventListener('click',()=>{
  const b=S.selectedBuilding; if(!b) return; const t=tribeById(b.tribeId); if(!t) return;
  if(t.stock.wood<5||t.stock.stone<3){ toast('چوب یا سنگ کافی نیست'); return; }
  t.stock.wood-=5; t.stock.stone-=3; b.hp=Math.min(b.maxHp,(b.hp??b.maxHp)+Math.round(b.maxHp*0.6));
  logEvent('«'+BUILDINGS[b.type].name+'» در '+t.name+' تعمیر شد.','good'); updateBuildingCard();
});
$('#btnBuildUpgrade').addEventListener('click',()=>{
  const b=S.selectedBuilding; if(!b) return; const t=tribeById(b.tribeId); if(!t) return;
  const def=BUILDINGS[b.type], cw=Math.round(def.wood*0.8*(b.level||1)), cs=Math.round(def.stone*0.8*(b.level||1));
  if((b.level||1)>=3||b.progress<100){ toast('دیگر قابل ارتقا نیست'); return; }
  if(t.stock.wood<cw||t.stock.stone<cs){ toast('منابع کافی نیست'); return; }
  t.stock.wood-=cw; t.stock.stone-=cs; b.level=(b.level||1)+1; b.maxHp=buildingHP(b.type,b.level); b.hp=b.maxHp;
  logEvent('«'+def.name+'» در '+t.name+' به سطح '+fa(b.level)+' ارتقا یافت!','good'); updateBuildingCard();
});
$('#btnBuildDemolish').addEventListener('click',()=>{
  const b=S.selectedBuilding; if(!b) return; const t=tribeById(b.tribeId);
  const def=BUILDINGS[b.type];
  if(t){ t.stock.wood+=Math.round(def.wood/2); t.stock.stone+=Math.round(def.stone/2); }
  const bi=S.buildings.indexOf(b); if(bi>=0) S.buildings.splice(bi,1);
  const qi=S.buildQueue.findIndex(q=>q.buildingId===b.id); if(qi>=0) S.buildQueue.splice(qi,1);
  if(b.ownerFamilyId){ const fam=familyById(b.ownerFamilyId); if(fam){ fam.houseId=null; fam.houselessSince=S.elapsed; } }
  if(b.renterFamilyId){ const fam=familyById(b.renterFamilyId); if(fam) fam.renterFamilyId=null; }
  if(t) recomputeTerritory(t); // v5 (tiles): با تخریب ساختمان، سرزمین دور آن پس گرفته می‌شود
  S.selectedBuilding=null; updateBuildingCard();
  logEvent('«'+def.name+'» در '+(t?t.name:'جهان')+' تخریب شد — نیمی از منابع برگشت.','bad');
});
$('#btnFollow').addEventListener('click',()=>{ S.follow=!S.follow; updateSelected(); toast(S.follow?'دنبال می‌کنم':'دنبال‌کردن لغو شد'); });
$('#btnFoundTribe').addEventListener('click',()=>{
  const a=S.selected; if(!a||a.tribeId) return;
  if(a.age<0.4){ toast('هنوز کودک است — باید بالغ شود'); return; }
  if(leadershipOf(a)<0.60){ toast('رهبری‌اش هنوز به حد لازم نرسیده ('+fa(Math.round(leadershipOf(a)*100))+' از ۶۰)'); return; }
  const t=foundTribe(a);
  if(t){ toast(a.name+' قبیله‌ی «'+t.name+'» را ساخت!'); renderCiv(); updateSelected(); }
  else toast('کسی نزدیکش نیست تا به قبیله‌اش بپیوندد — باید دست‌کم ۷ بزرگسال وفادار نزدیکش باشند');
});
$('#btnLeaveTribe').addEventListener('click',()=>{
  const a=S.selected; if(!a||!a.tribeId) return;
  const t=tribeById(a.tribeId);
  leaveTribe(a,t); renderCiv(); updateSelected();
});
$('#btnJoinTribe').addEventListener('click',()=>{
  const a=S.selected; if(!a) return;
  const sel=$('#joinTribeSel'); if(!sel||!sel.value) return;
  const t=tribeById(+sel.value); if(!t) return;
  if(a.tribeId){ const old=tribeById(a.tribeId); if(old) logEvent(a.name+' از '+old.name+' جدا شد و به '+t.name+' پیوست.','bad'); }
  a.tribeId=t.id; a.job=null; a.loyalty=55; a.tribeSince=S.elapsed;
  logEvent(a.name+' به '+t.name+' پیوست.','good');
  renderCiv(); updateSelected();
});
$('#btnFeedOne').addEventListener('click',()=>{ if(S.selected){S.selected.energy=100;burst(S.selected.x,S.selected.y,'#4ade80',10,80);updateSelected();} });
$('#btnKillOne').addEventListener('click',()=>{ if(S.selected){const n=S.selected.name;killAgent(S.selected,'خدا');logEvent('خدا '+n+' را حذف کرد.','god');} });
$('#btnTraitOne').addEventListener('click',()=>{
  if(!S.selected) return;
  const t=pick(TRAITS); setGenotypeHigh(S.selected,t.gene);
  logEvent('به '+S.selected.name+' ویژگی «'+t.name+'» داده شد (ژنوتیپ AA).','god'); toast('«'+t.name+'» به '+S.selected.name+' داده شد'); updateSelected();
});
$('#btnPickMate').addEventListener('click',()=>{
  if(!S.selected){ toast('اول یک موجود را انتخاب کن'); return; }
  S.pickMate=true; toast('حالا موجود دوم را روی زمین بزن تا والد دوم شود');
});
$('#btnRandomMut').addEventListener('click',()=>{
  for(const a of S.agents){const k=pick(Object.keys(GENE_LABELS)); const rule=GEN_RULES[k];
    for(let i=0;i<rule.loci;i++){ if(Math.random()<0.5) a.genotype[k][i]=[Math.random()<.5?1:0,Math.random()<.5?1:0]; }
    a.genes[k]=phenotypeFor(k,a.genotype[k]);}
  logEvent('جهش تصادفی در همه‌ی موجودات رخ داد.','god'); toast('جهش تصادفی اعمال شد');
});
$('#btnShuffleGenes').addEventListener('click',()=>{
  for(const a of S.agents){ a.genotype=randomGenotypeAll(); a.genes=genesFromGenotype(a.genotype); }
  logEvent('ژن‌های همه به‌هم ریخته شد.','god'); toast('ژن‌ها به‌هم ریخته شد');
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
  logEvent('قوانین ژنتیک به حالت علمی استاندارد برگشت.','god'); toast('قوانین به حالت استاندارد برگشت');
});
$('#matePref').addEventListener('change',e=>{ S.genetics.matePref=e.target.value; logEvent('ترجیح جنسی عوض شد: '+e.target.selectedOptions[0].textContent,'god'); });
$('#matePrefStrength').addEventListener('input',e=>{ S.genetics.matePrefStrength=parseFloat(e.target.value); $('#matePrefStrengthTxt').textContent=fa1(S.genetics.matePrefStrength); });
$('#ctPower').addEventListener('input',e=>$('#ctPowerTxt').textContent=fa1(parseFloat(e.target.value)));
$('#btnCreateTrait').addEventListener('click',()=>{
  const name=$('#ctName').value.trim();
  if(!name){ toast('اول یک نام برای ویژگی بنویس'); $('#ctName').focus(); return; }
  const t={id:'ct'+Date.now(),icon:$('#ctGene').value,name,gene:$('#ctGene').value,power:parseFloat($('#ctPower').value)};
  S.customTraits.push(t); localStorage.setItem('godsim-custom',JSON.stringify(S.customTraits));
  injectTrait(t,25); renderCustomTraits(); $('#ctName').value='';
  logEvent('ویژگی دلخواه «'+name+'» ساخته و به ۲۵٪ تزریق شد.','god');
});
/* مهاجرت ذخیره‌ی v3 به v4: رهبر قبیله = قوی‌ترین عضو؛ خانواده‌ها از روی خانه‌های
   موجود (نزدیک‌ترین زوج بالغ + فرزندانشان)؛ حیوانات وحشی علامت‌گذاری می‌شوند */
function migrateV3(){
  for(const t of S.tribes){
    const mem=S.agents.filter(a=>!a.dead&&a.tribeId===t.id);
    if(mem.length){ const chief=mem.sort((x,y)=>leadershipOf(y)-leadershipOf(x))[0]; t.chiefId=chief.id; t.stance=chief.opinion; }
    else { t.chiefId=null; t.stance=0; }
  }
  for(const b of S.buildings){
    if(b.type!=='house'||b.progress<100) continue;
    const near=S.agents.filter(a=>!a.dead&&a.age>=0.35&&!a.familyId&&Math.hypot(a.x-b.x,a.y-b.y)<90);
    const male=near.find(a=>a.sex==='♂'), female=near.find(a=>a.sex==='♀');
    if(!male&&!female) continue;
    const members=[male,female].filter(Boolean);
    for(const a of S.agents) if(!a.dead&&!a.familyId&&a.parents&&members.some(m=>a.parents.includes(m.id))) members.push(a);
    const f=createFamily(members); f.houseId=b.id; b.ownerFamilyId=f.id;
  }
  for(const an of S.animals){ if(an.wild===undefined) an.wild=(an.kind==='wolf'||an.kind==='bear'); if(an.atkCd===undefined) an.atkCd=0; }
  logEvent('ذخیره‌ی قدیمی (v3) به نسخه‌ی تازه (v4) تبدیل شد: رهبر قبایل و خانواده‌ها ساخته شدند.','god');
}
function migrateV4(){
  // ذخیره‌ی v4 به v5: فیلدهای دیپلماسی و جان/سطح ساختمان‌ها
  for(const t of S.tribes){
    if(!t.allies) t.allies=[]; if(!t.grievance) t.grievance={}; if(!t.truce) t.truce={};
    if(t.warFatigue===undefined) t.warFatigue=0;
    if(!t.needsBal) t.needsBal={food:0,wood:0,stone:0};
    if(t.diplomacyT===undefined) t.diplomacyT=rand(0,10); if(t.needsT===undefined) t.needsT=0;
  }
  for(const b of S.buildings){
    if(b.hp===undefined){ b.maxHp=BUILDING_HP[b.type]||60; b.hp=b.maxHp; }
    if(b.level===undefined) b.level=1;
  }
  logEvent('ذخیره‌ی قدیمی (v4) به نسخه‌ی تازه (v5) تبدیل شد: اتحادها، آتش‌بس و جان ساختمان‌ها اضافه شد.','god');
}
$('#btnSave').addEventListener('click',()=>{
  const data={v:6,settings:S.settings,day:S.day,timeOfDay:S.timeOfDay,births:S.births,deaths:S.deaths,fights:S.fights,
    deathsBy:S.deathsBy,nextId:S.nextId,nextLineage:S.nextLineage,mutations:S.mutations,genetics:S.genetics,
    geneRules:GEN_RULES,alleleGene:S.alleleGene,
    tiles:Array.from(S.tiles||[]), roads:Array.from(S.roads||[]),
    tribes:S.tribes,buildings:S.buildings,buildQueue:S.buildQueue,trees:S.trees,stones:S.stones,animals:S.animals,
    nextBuildId:S.nextBuildId,selTribe:S.selTribe,
    families:S.families,nextFamilyId:S.nextFamilyId,nextTribeId:S.nextTribeId,nextBattleId:S.nextBattleId,
    battles:S.battles.map(b=>({id:b.id,t1:b.t1,t2:b.t2,x:b.x,y:b.y,big:b.big,s1:b.s1.slice(),s2:b.s2.slice(),t:b.t,state:b.state})),
    agents:S.agents.map(a=>({x:a.x,y:a.y,genes:a.genes,genotype:a.genotype,gen:a.gen,lineage:a.lineage,hue:a.hue,sex:a.sex,energy:a.energy,health:a.health,age:a.age,lifespan:a.lifespan,children:a.children,name:a.name,parents:a.parents||[],ancestors:a.ancestors||[],inbreedF:a.inbreedF||0,tribeId:a.tribeId,job:a.job,knowledge:a.knowledge,inv:a.inv,familyId:a.familyId||null,sexNeed:a.sexNeed||0,loyalty:a.loyalty||50,opinion:a.opinion||0,equip:a.equip||{weapon:null,shield:null,armor:null},training:a.training||0}))};
  localStorage.setItem('godsim-save',JSON.stringify(data)); toast('جهان ذخیره شد'); logEvent('جهان ذخیره شد.','good');
});
$('#btnLoad').addEventListener('click',()=>{
  const raw=localStorage.getItem('godsim-save');
  if(!raw){ toast('ذخیره‌ای پیدا نشد'); return; }
  try{
    const d=JSON.parse(raw);
    Object.assign(S.settings,d.settings); S.day=d.day; S.timeOfDay=d.timeOfDay;
    S.births=d.births; S.deaths=d.deaths; S.fights=d.fights; S.deathsBy=d.deathsBy;
    S.nextId=d.nextId; S.nextLineage=d.nextLineage; S.agents=[]; S.foods=[]; S.selected=null;
    S.buildings=[]; S.buildQueue=[]; S.trees=[]; S.stones=[]; S.animals=[];
    if(d.v===4&&d.tribes){
      S.tribes=d.tribes; S.buildings=d.buildings||[]; S.buildQueue=d.buildQueue||[]; S.trees=d.trees||[]; S.stones=d.stones||[]; S.animals=d.animals||[];
      S.nextBuildId=d.nextBuildId||1; S.selTribe=d.selTribe||0;
      S.families=d.families||[]; S.nextFamilyId=d.nextFamilyId||1; S.nextTribeId=d.nextTribeId||1; S.nextBattleId=d.nextBattleId||1;
      S.battles=(d.battles||[]).map(b=>({...b,s1:b.s1||[],s2:b.s2||[]}));
      migrateV4();
    }
    else if(d.v===5&&d.tribes){
      S.tribes=d.tribes; S.buildings=d.buildings||[]; S.buildQueue=d.buildQueue||[]; S.trees=d.trees||[]; S.stones=d.stones||[]; S.animals=d.animals||[];
      S.nextBuildId=d.nextBuildId||1; S.selTribe=d.selTribe||0;
      S.families=d.families||[]; S.nextFamilyId=d.nextFamilyId||1; S.nextTribeId=d.nextTribeId||1; S.nextBattleId=d.nextBattleId||1;
      S.battles=(d.battles||[]).map(b=>({...b,s1:b.s1||[],s2:b.s2||[]}));
    }
    else if(d.v===6&&d.tribes){
      S.tribes=d.tribes; S.buildings=d.buildings||[]; S.buildQueue=d.buildQueue||[]; S.trees=d.trees||[]; S.stones=d.stones||[]; S.animals=d.animals||[];
      S.nextBuildId=d.nextBuildId||1; S.selTribe=d.selTribe||0;
      S.families=d.families||[]; S.nextFamilyId=d.nextFamilyId||1; S.nextTribeId=d.nextTribeId||1; S.nextBattleId=d.nextBattleId||1;
      S.battles=(d.battles||[]).map(b=>({...b,s1:b.s1||[],s2:b.s2||[]}));
    }
    else if(d.v===3&&d.tribes){
      S.tribes=d.tribes; S.buildings=d.buildings||[]; S.buildQueue=d.buildQueue||[]; S.trees=d.trees||[]; S.stones=d.stones||[]; S.animals=d.animals||[];
      S.nextBuildId=d.nextBuildId||1; S.selTribe=d.selTribe||0;
      S.families=[]; S.nextFamilyId=1; S.nextTribeId=S.tribes.length+1; S.nextBattleId=1; S.battles=[];
    }
    else { createTribes(); spawnResources(); }
    // v6 (tiles): خانه‌های سرزمین — ذخیره‌ی v6 مالکیت را دارد؛ ذخیره‌ی قدیمی ندارد، پس از روی خانه و ساختمان‌ها بازسازی می‌شود
    S.tileCounts={};
    if(d.tiles&&d.tiles.length===TW*TH){
      S.tiles=Int16Array.from(d.tiles); S.roads=Uint8Array.from(d.roads||new Array(TW*TH).fill(0));
      for(let i=0;i<S.tiles.length;i++) if(S.tiles[i]) S.tileCounts[S.tiles[i]]=(S.tileCounts[S.tiles[i]]||0)+1;
    } else {
      S.tiles=new Int16Array(TW*TH); S.roads=new Uint8Array(TW*TH);
      for(const t of S.tribes) recomputeTerritory(t); // مهاجرت از ذخیره‌ی قدیمی (v5 و قبل‌تر)
    }
    // سازگاری با ذخیره‌های قدیمی: خانه‌ی ثابت و زمان ساخت ساختمان‌ها
    for(const t of S.tribes){ if(!t.home) t.home={x:t.centre.x,y:t.centre.y}; if(!t.centre) t.centre={x:t.home.x,y:t.home.y}; if(t.relocT===undefined) t.relocT=rand(0,20); if(t.plantCd===undefined) t.plantCd=0; if(!t.stock.meals) t.stock.meals=0; if(!t.armory) t.armory={weapon:{},shield:{},armor:{}}; if(!t.relations) t.relations={};
      /* v4: فیلدهای دیپلماسی و نیازها */
      if(!t.allies) t.allies=[]; if(!t.grievance) t.grievance={}; if(!t.truce) t.truce={}; if(t.warFatigue===undefined) t.warFatigue=0; if(!t.needsBal) t.needsBal={food:0,wood:0,stone:0}; if(t.diplomacyT===undefined) t.diplomacyT=rand(0,10); if(t.needsT===undefined) t.needsT=0;
      /* v5: دربار، رضایت، اعتراض، انقلاب و فروپاشی */
      if(!t.court) t.court={advisor:null,minister:null,general:null,treasurer:null}; if(t.warWins===undefined) t.warWins=0; if(t.warLosses===undefined) t.warLosses=0; if(t.recentDeaths===undefined) t.recentDeaths=0; if(t.lastBuiltT===undefined) t.lastBuiltT=0; if(t.protesting===undefined) t.protesting=false; if(t.protestT===undefined) t.protestT=0; if(t.revoltT===undefined) t.revoltT=0; if(t.protestCd===undefined) t.protestCd=0; if(t.revoltCd===undefined) t.revoltCd=0; if(t.collapseT===undefined) t.collapseT=0; if(t.collapseWarned===undefined) t.collapseWarned=false; if(t.collapseDue===undefined) t.collapseDue=false; if(t.collapseReason===undefined) t.collapseReason='';
      if(!t.borderTension) t.borderTension={}; if(!t.contested) t.contested={}; if(!t.landGrudgeT) t.landGrudgeT={}; if(!t.interRoads) t.interRoads={}; if(t.claimCd===undefined) t.claimCd=0; if(t.interRoadT===undefined) t.interRoadT=0; }
    for(const b of S.buildings){ if(b.createdAt===undefined) b.createdAt=S.elapsed; if(b.ownerFamilyId===undefined) b.ownerFamilyId=null; if(b.renterFamilyId===undefined) b.renterFamilyId=null; if(b.hp===undefined){ b.maxHp=BUILDING_HP[b.type]||60; b.hp=b.maxHp; } if(b.level===undefined) b.level=1; }
    if(!S.settings.fertility) S.settings.fertility=1;
    if(d.geneRules) GEN_RULES=d.geneRules;
    if(d.genetics) Object.assign(S.genetics,d.genetics);
    if(d.mutations) S.mutations=d.mutations;
    if(d.alleleGene) S.alleleGene=d.alleleGene;
    for(const a of d.agents){
      // سازگاری با ذخیره‌های قدیمی (v1) که ژنوتیپ نداشتند
      const gt=a.genotype||randomGenotypeAll();
      Object.keys(GENE_LABELS).forEach(k=>{ if(!gt[k]) gt[k]=randomGenotype(k,0.5); if(gt[k]._env===undefined) gt[k]._env=0; });
      const ag=makeAgent(a.x,a.y,a.genes||genesFromGenotype(gt),a.gen,a.lineage,a.hue,gt,a.parents||[],a.ancestors||[]);
      Object.assign(ag,{sex:a.sex,energy:a.energy,health:a.health,age:a.age,lifespan:a.lifespan,children:a.children,name:a.name,inbreedF:a.inbreedF||0,tribeId:a.tribeId,job:a.job||null,knowledge:a.knowledge||0,inv:a.inv||{wood:0,stone:0},
        familyId:a.familyId||null,sexNeed:a.sexNeed!==undefined?a.sexNeed:rand(0,40),loyalty:a.loyalty!==undefined?a.loyalty:rand(30,70),opinion:a.opinion!==undefined?a.opinion:rand(-1,1),
        satisf:a.satisf!==undefined?a.satisf:50,jailedUntil:a.jailedUntil||0,protesting:false,tribeSince:a.tribeSince||0,
        equip:a.equip||{weapon:null,shield:null,armor:null},training:a.training||0,battleId:null,battleSide:0,foundCd:0});
      ag.genes=genesFromGenotype(gt); S.agents.push(ag);
    }
    if(d.v===3) migrateV3(); // ذخیره‌ی v3: رهبر قبیله، خانواده‌ها و حیوانات وحشی ساخته می‌شوند
    // جنگجوهای نبردهای ذخیره‌شده دوباره به میدان می‌روند
    for(const b of S.battles){
      for(const id of b.s1){ const a=S.agents.find(x=>x.id===id); if(a){ a.battleId=b.id; a.battleSide=1; } }
      for(const id of b.s2){ const a=S.agents.find(x=>x.id===id); if(a){ a.battleId=b.id; a.battleSide=2; } }
    }
    if(d.v!==3&&d.v!==4&&d.v!==5&&d.v!==6){ for(const ag of S.agents){ ag.tribeId=ag.lineage%S.tribes.length; } for(const t of S.tribes) assignJobs(t); }
    for(let i=0;i<70;i++) spawnFood();
    buildSliders(); buildGeneRules(); buildAlleleSelect();
    $('#matePref').value=S.genetics.matePref; $('#matePrefStrength').value=S.genetics.matePrefStrength;
    $('#matePrefStrengthTxt').textContent=fa1(S.genetics.matePrefStrength);
    $('#extinctBox').hidden=true;
    toast('ذخیره بارگذاری شد'); logEvent('ذخیره‌ی جهان بارگذاری شد.','good');
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
  download('god-sim-stats-day-'+S.day+'.json',JSON.stringify(data,null,2),'application/json'); toast('خروجی آمار دانلود شد');
});
$('#btnExportLog').addEventListener('click',()=>{
  const text=[...$('#eventLog').children].reverse().map(li=>li.textContent).join('\n');
  download('god-sim-log-day-'+S.day+'.txt',text||'رویدادی ثبت نشده.','text/plain'); toast('خروجی رویدادها دانلود شد');
});
$('#btnClearLog').addEventListener('click',()=>{ $('#eventLog').innerHTML=''; logEvent('دفتر رویدادها پاک شد.'); });
$('#btnCopyLog').addEventListener('click',async()=>{
  const text=[...$('#eventLog').children].reverse().map(li=>li.textContent).join('\n');
  try{ await navigator.clipboard.writeText(text); toast('رویدادها کپی شد'); }catch(e){ toast('کپی نشد — مرورگر اجازه نداد'); }
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
  if(S.follow&&S.selected&&!S.selected.dead){ CAM.x=S.selected.x-VW/CAM.zoom/2; CAM.y=S.selected.y-VH/CAM.zoom/2; clampCam(); }
  draw();
  statAcc+=rawDt;
  if(statAcc>0.25){ statAcc=0; updateStats(); if(S.selectedBuilding) updateBuildingCard(); }
  chartAcc+=rawDt;
  if(chartAcc>1){ chartAcc=0; drawLineChart($('#chartPop'),S.historyPop,'جمعیت: '+fa(S.agents.length),'#34d399'); drawTraitChart(); drawAlleleChart(); }
  requestAnimationFrame(loop);
}

/* ---------------- شروع ---------------- */
window.addEventListener('resize',resize);
buildSliders(); buildPresets(); buildPowers(); buildTraits(); buildGeneRules(); buildAlleleSelect(); buildGuide(); buildCiv();
resize(); resetWorld(120);
// v27: ترجیح نما از حافظه‌ی مرورگر (پیش‌فرض ایزومتریک؛ اگر WebGL نباشد خودکار دوبعدی می‌شود)
try{ const pv=localStorage.getItem('godsim-view'); if(pv==='2d'||pv==='iso') S.view=pv; }catch(e){}
applyView();
logEvent('به جهان کوچک خوش آمدی، خدا! موجودات دنبال غذا می‌گردند؛ ویژگی تزریق کن و تکامل را تماشا کن.','good');
logEvent('راهنما: دو بار روی زمین بزن = باران غذا. روی یک موجود بزن تا ژن‌هایش را ببینی.','good');
updateStats(); requestAnimationFrame(loop);
