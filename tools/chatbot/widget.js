/* sfera assistant, phase 1. Static answers from tools/chatbot/kb.json, built into /chat.js by tools/build_chat.py. Do not edit /chat.js by hand. */
(function(){try{
var KB=__KB__;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var css='\
.sc-orb{--s:56px;position:relative;display:inline-block;flex:none;width:var(--s);height:var(--s);border-radius:50%;background:radial-gradient(circle at 38% 30%,#fff 0,#f1effd 30%,#c9c3ff 78%,#b9b3ee 100%);box-shadow:inset 0 -6px 12px rgba(90,75,218,.25),0 8px 22px rgba(90,75,218,.28);animation:sc-bob 4.2s ease-in-out infinite;isolation:isolate}\
.sc-orb::before{content:"";position:absolute;inset:-8%;border-radius:50%;background:conic-gradient(from 0deg,#f2a7c3,#c9c3ff,#8f86e8,#f7c6dc,#b9b3ee,#f2a7c3);filter:blur(7px);opacity:.55;animation:sc-spin 9s linear infinite;z-index:-1}\
.sc-orb::after{content:"";position:absolute;left:18%;top:11%;width:30%;height:14%;border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.95),rgba(255,255,255,0) 72%);transform:rotate(-24deg)}\
.sc-face{position:absolute;inset:0;transform:translate(var(--ex,0px),var(--ey,0px));transition:transform .12s ease-out}\
.sc-eye{position:absolute;top:40%;width:calc(var(--s)*.095);height:calc(var(--s)*.15);border-radius:50%;background:#14112b;animation:sc-blink 5s infinite}\
.sc-eye.l{left:32%}.sc-eye.r{right:32%}\
.sc-mouth{position:absolute;left:50%;top:62%;width:calc(var(--s)*.2);height:calc(var(--s)*.09);margin-left:calc(var(--s)*-.1);border-bottom:calc(var(--s)*.04) solid #14112b;border-radius:0 0 100px 100px;transition:width .3s,margin .3s,height .3s}\
.sc-orb.happy .sc-mouth{width:calc(var(--s)*.3);margin-left:calc(var(--s)*-.15);height:calc(var(--s)*.13)}\
.sc-orb.happy .sc-eye{height:calc(var(--s)*.11);border-radius:100px 100px 0 0;top:42%}\
.sc-orb.sm{--s:34px;animation:none;box-shadow:inset 0 -3px 7px rgba(90,75,218,.25),0 4px 12px rgba(90,75,218,.25)}\
.sc-orb.lg{--s:76px}\
@keyframes sc-bob{50%{transform:translateY(-4px)}}@keyframes sc-spin{to{transform:rotate(360deg)}}@keyframes sc-blink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.1)}}\
.sc-launch{position:fixed;right:max(18px,env(safe-area-inset-right,0px));bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:9990;display:flex;align-items:center;gap:10px;flex-direction:row-reverse;font-family:Geist,"Helvetica Neue",Arial,sans-serif}\
.sc-lbtn{width:68px;height:68px;border-radius:50%;border:1px solid #d8d3f0;background:rgba(255,255,255,.92);display:grid;place-items:center;cursor:pointer;box-shadow:0 16px 40px rgba(90,75,218,.22);transition:transform .25s;padding:0}\
.sc-lbtn:hover{transform:translateY(-3px) scale(1.04)}\
.sc-tip{background:#fff;border:1px solid #d8d3f0;border-radius:16px 16px 4px 16px;padding:10px 14px;font-size:14px;line-height:20px;color:#14112b;box-shadow:0 10px 30px rgba(20,17,43,.1);animation:sc-tipin .5s .8s cubic-bezier(.2,.8,.2,1) backwards;max-width:190px}\
@keyframes sc-tipin{from{opacity:0;transform:translateY(8px) scale(.95)}}\
.sc-launch.open .sc-tip{display:none}\
body.sc-open .wa{display:none !important}\
.sc-panel{position:fixed;right:max(18px,env(safe-area-inset-right,0px));bottom:calc(84px + env(safe-area-inset-bottom,0px));z-index:9991;width:min(380px,calc(100vw - 32px));height:min(600px,calc(100svh - 120px));display:none;flex-direction:column;border-radius:28px;background:#fff;border:1px solid #d8d3f0;box-shadow:0 30px 80px rgba(20,17,43,.25);overflow:hidden;transform-origin:bottom right;font-family:Geist,"Helvetica Neue",Arial,sans-serif;color:#14112b;text-align:left}\
.sc-panel.open{display:flex;animation:sc-pin .35s cubic-bezier(.2,.9,.25,1)}\
@keyframes sc-pin{from{opacity:0;transform:translateY(16px) scale(.94)}}\
.sc-ph{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #e0dcff;background:linear-gradient(180deg,#fff,#f1effd)}\
.sc-ph b{display:block;font-size:15px;font-weight:500}\
.sc-ph small{display:block;font-size:11.5px;color:#565075}\
.sc-tag{margin-left:auto;font:500 10px/14px "Geist Mono",ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:#4a3cc9;background:#f1effd;border-radius:999px;padding:4px 9px;white-space:nowrap}\
.sc-x{border:0;background:transparent;font-size:22px;line-height:1;color:#565075;cursor:pointer;padding:4px 6px;border-radius:8px}\
.sc-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:radial-gradient(70% 40% at 80% 0,#f1effd,transparent),#fff}\
.sc-hello{display:flex;flex-direction:column;gap:14px;align-items:flex-start;padding:8px 2px}\
.sc-hello h3{margin:0;font-size:34px;line-height:1.04;font-weight:500;letter-spacing:-.04em}\
.sc-hello h3 em{font-family:"Instrument Serif",Georgia,serif;font-weight:400;color:#4a3cc9}\
.sc-hello p{margin:0;font-size:13px;line-height:19px;color:#565075}\
.sc-chips{display:flex;flex-wrap:wrap;gap:8px}\
.sc-chip{border:1px solid #c9c3ff;background:linear-gradient(135deg,#fff,#f1effd);color:#14112b;border-radius:14px;padding:9px 13px;font:500 13.5px/18px Geist,"Helvetica Neue",Arial,sans-serif;cursor:pointer;text-align:left;transition:transform .2s,border-color .2s,background .2s}\
.sc-chip:hover{transform:translateY(-2px);border-color:#8f86e8;background:#fff}\
.sc-chip.q{background:#fff}\
.sc-msg{max-width:88%;padding:11px 14px;border-radius:18px;font-size:14.5px;line-height:22px;animation:sc-mi .35s cubic-bezier(.2,.8,.2,1)}\
@keyframes sc-mi{from{opacity:0;transform:translateY(8px)}}\
.sc-msg.me{align-self:flex-end;background:#5a4bda;color:#fff;border-radius:18px 18px 4px 18px}\
.sc-msg.bot{align-self:flex-start;background:#f1effd;border:1px solid #e0dcff;border-radius:18px 18px 18px 4px}\
.sc-row{display:flex;gap:8px;align-items:flex-end;align-self:flex-start;max-width:100%}\
.sc-row .sc-msg{max-width:calc(100% - 42px)}\
.sc-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}\
.sc-cta{display:inline-flex;align-items:center;gap:6px;padding:8px 13px;border-radius:999px;font-size:13px;font-weight:500;text-decoration:none;background:#5a4bda;color:#fff !important;cursor:pointer}\
.sc-cta.alt{background:#fff;color:#14112b !important;border:1px solid #c9c3ff}\
.sc-rel{margin-top:10px;display:flex;flex-direction:column;gap:6px;align-items:flex-start}\
.sc-dots{display:inline-flex;gap:4px;padding:4px 0}\
.sc-dots i{width:6px;height:6px;border-radius:50%;background:#8f86e8;animation:sc-d 1s infinite}\
.sc-dots i:nth-child(2){animation-delay:.15s}.sc-dots i:nth-child(3){animation-delay:.3s}\
@keyframes sc-d{50%{transform:translateY(-4px);opacity:.5}}\
.sc-pf{padding:12px 14px;border-top:1px solid #e0dcff;background:#fff}\
.sc-in{display:flex;gap:8px;align-items:center;border:1px solid #c9c3ff;border-radius:999px;padding:5px 5px 5px 16px;background:#f1effd;margin:0}\
.sc-in:focus-within{border-color:#8f86e8}\
.sc-inp{flex:1;min-width:0;width:auto !important;border:0 !important;background:transparent !important;font:400 14.5px/20px Geist,"Helvetica Neue",Arial,sans-serif;color:#14112b;padding:8px 0 !important;outline:none}\
.sc-inp::placeholder{color:#8a84a8}\
.sc-inp:focus-visible{outline:none !important}\
.sc-send{width:36px;height:36px;border-radius:50%;border:0;background:#5a4bda;color:#fff;font-size:16px;cursor:pointer;flex:none}\
.sc-foot{display:flex;gap:8px;margin-top:10px}\
.sc-foot .sc-cta{flex:1;justify-content:center}\
.sc-lbtn:focus-visible,.sc-send:focus-visible,.sc-chip:focus-visible,.sc-cta:focus-visible,.sc-x:focus-visible{outline:2px solid #4a3cc9;outline-offset:2px}\
.sc-hl{animation:sc-hl 2.4s ease-out}\
@keyframes sc-hl{0%{box-shadow:0 0 0 0 rgba(143,134,232,.0)}15%{box-shadow:0 0 0 10px rgba(143,134,232,.45)}100%{box-shadow:0 0 0 0 rgba(143,134,232,0)}}\
@media (max-width:520px){.sc-panel{right:16px;left:16px;width:auto;bottom:calc(16px + env(safe-area-inset-bottom,0px));height:min(640px,calc(100svh - 32px))}.sc-launch{right:16px}.sc-tip{display:none}}\
@media (prefers-reduced-motion:reduce){.sc-orb,.sc-orb::before,.sc-eye,.sc-tip,.sc-panel.open,.sc-msg,.sc-dots i,.sc-hl{animation:none !important}.sc-lbtn,.sc-chip{transition:none}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var ORB='<span class="sc-face"><i class="sc-eye l"></i><i class="sc-eye r"></i><b class="sc-mouth"></b></span>';
var wrap=document.createElement('div');
wrap.innerHTML='<div class="sc-launch" id="sc-launch"><button type="button" class="sc-lbtn" id="sc-open" aria-label="Open the sfera assistant" aria-expanded="false" aria-controls="sc-panel"><span class="sc-orb" id="sc-orbL">'+ORB+'</span></button><div class="sc-tip" id="sc-tip">Questions about hiring? Ask me.</div></div>'+
'<section class="sc-panel" id="sc-panel" role="dialog" aria-label="sfera assistant"><div class="sc-ph"><span class="sc-orb sm happy">'+ORB+'</span><div><b>sfera assistant</b><small>Pre-written answers, reviewed by our team</small></div><span class="sc-tag">Automated</span><button type="button" class="sc-x" id="sc-close" aria-label="Close the assistant">&times;</button></div>'+
'<div class="sc-body" id="sc-body" aria-live="polite"></div><div class="sc-pf"><form class="sc-in" id="sc-form" autocomplete="off"><input class="sc-inp" id="sc-inp" type="text" maxlength="200" placeholder="Ask us anything about hiring" aria-label="Ask a question"><button class="sc-send" type="submit" aria-label="Send">&#8593;</button></form>'+
'<div class="sc-foot"><a class="sc-cta" id="sc-cal" target="_blank" rel="noopener">Book a call</a><a class="sc-cta alt" id="sc-wa" target="_blank" rel="noopener">WhatsApp</a></div></div></section>';
while(wrap.firstChild)document.body.appendChild(wrap.firstChild);
var $=function(i){return document.getElementById(i)};
var body=$('sc-body'),panel=$('sc-panel'),launch=$('sc-launch'),openBtn=$('sc-open'),inp=$('sc-inp');
$('sc-cal').href=KB.fallback.link;$('sc-wa').href=KB.whatsapp.link;
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function orb(){var s=el('span','sc-orb sm happy');s.innerHTML=ORB;return s}
function scroll(){body.scrollTop=body.scrollHeight}
function me(t){body.appendChild(el('div','sc-msg me',t));scroll()}
var onHome=location.pathname==='/'||location.pathname==='/index.html';
function go(href){
  var m=href.match(/^\/#([\w-]+)$/);
  if(m&&onHome){var t=document.getElementById(m[1]);if(t){
    if(window.innerWidth<=520)setOpen(false,true);
    if(history.replaceState)history.replaceState(null,'','#'+m[1]);
    try{window.dispatchEvent(new HashChangeEvent('hashchange'))}catch(e){}
    var target=t.closest('#services')&&t.id!=='services'?document.getElementById('services'):t;
    target.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
    var hl=t.closest('details')||t;if(hl.tagName==='DETAILS')hl.open=true;
    hl.classList.remove('sc-hl');void hl.offsetWidth;hl.classList.add('sc-hl');
    return true}}
  return false;
}
function btn(label,href,alt){var a=el('a','sc-cta'+(alt?' alt':''),label);a.href=href;if(/^https?:/.test(href)){a.target='_blank';a.rel='noopener'}else{a.addEventListener('click',function(e){if(go(href))e.preventDefault()})}return a}
function bot(entry,related){
  var w=el('div','sc-row');w.appendChild(orb());
  var m=el('div','sc-msg bot');m.appendChild(el('div',null,entry.a));
  var acts=el('div','sc-acts');if(entry.link)acts.appendChild(btn(entry.linkLabel||'Read more',entry.link));
  if(acts.children.length)m.appendChild(acts);
  if(related&&related.length){var r=el('div','sc-rel');related.forEach(function(x){var c=el('button','sc-chip q',x.q);c.type='button';c.addEventListener('click',function(){ask(x.q,x)});r.appendChild(c)});m.appendChild(r)}
  w.appendChild(m);body.appendChild(w);scroll();
}
function fallback(){
  var w=el('div','sc-row');w.appendChild(orb());
  var m=el('div','sc-msg bot');m.appendChild(el('div',null,KB.fallback.text));
  var acts=el('div','sc-acts');acts.appendChild(btn(KB.fallback.linkLabel,KB.fallback.link));acts.appendChild(btn(KB.fallback.secondLabel,KB.fallback.secondLink,true));m.appendChild(acts);
  w.appendChild(m);body.appendChild(w);scroll();
}
function typing(cb){
  var w=el('div','sc-row');w.appendChild(orb());var m=el('div','sc-msg bot');m.innerHTML='<span class="sc-dots"><i></i><i></i><i></i></span>';w.appendChild(m);body.appendChild(w);scroll();
  setTimeout(function(){w.remove();cb()},reduce?0:550);
}
function home(){
  body.innerHTML='';var h=el('div','sc-hello');var o=el('span','sc-orb lg happy');o.innerHTML=ORB;h.appendChild(o);
  var t=el('h3');t.innerHTML='How can we help <em>today?</em>';h.appendChild(t);h.appendChild(el('p',null,KB.greeting));
  var c=el('div','sc-chips');KB.categories.forEach(function(cat){var b=el('button','sc-chip',cat.label);b.type='button';b.addEventListener('click',function(){category(cat)});c.appendChild(b)});
  h.appendChild(c);body.appendChild(h);
}
function qlist(list,box){
  var show=list.slice(0,7);show.forEach(function(x){var b=el('button','sc-chip q',x.q);b.type='button';b.addEventListener('click',function(){ask(x.q,x)});box.appendChild(b)});
  if(list.length>7){var more=el('button','sc-chip','More questions');more.type='button';more.addEventListener('click',function(){more.remove();list.slice(7).forEach(function(x){var b=el('button','sc-chip q',x.q);b.type='button';b.addEventListener('click',function(){ask(x.q,x)});box.appendChild(b)});scroll()});box.appendChild(more)}
}
function category(cat){me(cat.label);typing(function(){
  var w=el('div','sc-row');w.appendChild(orb());var m=el('div','sc-msg bot');m.appendChild(el('div',null,'Here is what people ask most about '+cat.label.toLowerCase()+'.'));
  var r=el('div','sc-rel');qlist(KB.entries.filter(function(e){return e.cat===cat.id}),r);m.appendChild(r);w.appendChild(m);body.appendChild(w);scroll();
})}
function related(e){return KB.entries.filter(function(x){return x.cat===e.cat&&x.id!==e.id}).slice(0,2)}
function ask(q,entry){me(q);typing(function(){bot(entry,related(entry))})}
var STOP={the:1,a:1,an:1,is:1,are:1,do:1,does:1,you:1,your:1,we:1,i:1,to:1,of:1,and:1,or:1,in:1,on:1,for:1,can:1,it:1,my:1,me:1,with:1,what:1,how:1,about:1,us:1,our:1,there:1,any:1,will:1,be:1,if:1,that:1,this:1,have:1,has:1,which:1,who:1,when:1,where:1,why:1,should:1,would:1,could:1,get:1,need:1,want:1,like:1,sfera:1};
function stem(w){return w.length>4&&/s$/.test(w)&&!/ss$/.test(w)?w.slice(0,-1):w}
function toks(s){return (s.toLowerCase().match(/[a-z0-9+]+/g)||[]).filter(function(w){return !STOP[w]}).map(stem)}
KB.entries.forEach(function(e){e._k=e.keywords.map(function(k){return stem(k.toLowerCase())});e._q=toks(e.q);e._a=e.a.toLowerCase()});
function search(q){
  var t=toks(q);if(!t.length)return null;var best=null,bs=0;
  KB.entries.forEach(function(e){var s=0;t.forEach(function(w){if(e._k.indexOf(w)>-1)s+=2;if(e._q.indexOf(w)>-1)s+=1.5;if(w.length>3&&e._a.indexOf(w)>-1)s+=.4});s=s/Math.sqrt(Math.max(3,e._q.length)/3);if(s>bs){bs=s;best=e}});
  return bs>=2.5?best:null;
}
$('sc-form').addEventListener('submit',function(ev){ev.preventDefault();var q=inp.value.trim();if(!q)return;inp.value='';me(q);typing(function(){var e=search(q);if(e)bot(e,related(e));else fallback()})});
function setOpen(o,keepFocus){
  panel.classList.toggle('open',o);launch.classList.toggle('open',o);document.body.classList.toggle('sc-open',o);openBtn.setAttribute('aria-expanded',o?'true':'false');
  if(o){if(!body.children.length)home();if(window.innerWidth>520)setTimeout(function(){inp.focus()},50)}else if(!keepFocus)openBtn.focus();
}
openBtn.addEventListener('click',function(){setOpen(!panel.classList.contains('open'))});
$('sc-close').addEventListener('click',function(){setOpen(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&panel.classList.contains('open'))setOpen(false)});
if(!reduce&&window.matchMedia&&matchMedia('(pointer: fine)').matches){
  document.addEventListener('pointermove',function(e){Array.prototype.forEach.call(document.querySelectorAll('.sc-orb'),function(o){var r=o.getBoundingClientRect();if(!r.width)return;var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.sqrt(dx*dx+dy*dy)||1,m=Math.min(1,d/200)*r.width*.07;var f=o.querySelector('.sc-face');f.style.setProperty('--ex',(dx/d*m).toFixed(1)+'px');f.style.setProperty('--ey',(dy/d*m).toFixed(1)+'px')})});
  openBtn.addEventListener('mouseenter',function(){$('sc-orbL').classList.add('happy')});
  openBtn.addEventListener('mouseleave',function(){$('sc-orbL').classList.remove('happy')});
}
setTimeout(function(){var t=$('sc-tip');if(t&&!panel.classList.contains('open'))t.style.display='none'},9000);
}catch(err){}})();
