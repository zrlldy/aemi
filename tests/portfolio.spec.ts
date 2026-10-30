import { test, expect } from '@playwright/test';
test('intro can be skipped and identity flipped with keyboard', async ({page}) => {
 await page.goto('http://localhost:3001',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Skip intro'}).click();
 await expect(page.getByRole('heading',{name:'aemi',exact:false}).first()).toBeVisible();
 const badge=page.getByRole('button',{name:'Flip identity card'});
 await expect(page.locator('.lanyard-canvas')).toBeVisible();
 const bounds=await page.locator('.lanyard-canvas').evaluate(canvas=>{const slot=canvas.parentElement.getBoundingClientRect();const rendered=canvas.getBoundingClientRect();return {outside:rendered.left<slot.left&&rendered.right>slot.right&&rendered.bottom>slot.bottom,pointerEvents:getComputedStyle(canvas).pointerEvents,viewport:rendered.left===0&&rendered.top===0&&rendered.width===innerWidth&&rendered.height===innerHeight};});
 expect(bounds.viewport).toBeTruthy();
 expect(bounds.pointerEvents).toBe('none');
 await badge.focus(); await page.keyboard.press('Enter');
 await expect(badge).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('.lanyard-shell [role="status"]')).toContainText('repeat.');
 await page.reload(); await expect(page.getByRole('button',{name:'Skip intro'})).toHaveCount(0);
});
test('work filters preserve playground navigation and mobile has no overflow', async ({page}) => {
 await page.emulateMedia({reducedMotion:'reduce'}); await page.setViewportSize({width:390,height:844});
 await page.goto('http://localhost:3001');
 await page.getByRole('button',{name:'Development',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Schedwise'})).toBeVisible();
 await page.getByRole('link',{name:'Playground',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Made to move.'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('EEEJAO uses the supplied screenshot and motion projects embed Instagram',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://localhost:3001');
 const screenshot=page.getByRole('img',{name:'EEEJAO careers website'});
 await screenshot.scrollIntoViewIfNeeded();
 await expect.poll(()=>screenshot.evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(1500);
 await expect(page.getByRole('heading',{name:'EEEJAO',exact:true})).toBeVisible();
 await expect(page.locator('.career-mark,.motion-art')).toHaveCount(0);
 const frames=page.locator('#playground iframe');await expect(frames).toHaveCount(3);
 for(const [index,code] of ['DcKIXady6Ol','DeadfahSFVV','Cm-YFqgrxVi'].entries()){
  await expect(frames.nth(index)).toHaveAttribute('src',`https://www.instagram.com/p/${code}/embed/`);
  expect(await frames.nth(index).evaluate(el=>el.closest('a')===null)).toBe(true);
 }
 await page.setViewportSize({width:320,height:740});
 expect(await page.locator('#playground iframe').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}))).toBe(true);
});
test('Instagram viewers keep equal sizes while retaining taller embed content',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('https://www.instagram.com/p/*/embed/',route=>{
  const height=route.request().url().includes('DeadfahSFVV')?900:route.request().url().includes('Cm-YFqgrxVi')?436:749;
  return route.fulfill({contentType:'text/html',body:`<script>parent.postMessage(JSON.stringify({type:"MEASURE",details:{height:${height}}}),"*")</script>`});
 });
 await page.goto('http://localhost:3001/#playground');
 const frame=page.locator('#playground iframe').first();
 await frame.scrollIntoViewIfNeeded();
 await expect(frame).toHaveCSS('height','749px');
 await expect(page.locator('#playground iframe').nth(1)).toHaveCSS('height','900px');
 const viewers=page.locator('.instagram-embed');
 await expect.poll(()=>viewers.evaluateAll(es=>{
  const boxes=es.map(e=>e.getBoundingClientRect());
  return boxes.every(r=>Math.abs(r.height-boxes[0].height)<1&&Math.abs(r.width-boxes[0].width)<1);
 })).toBe(true);
 expect(await page.locator('#playground .project-heading').evaluateAll(es=>{
  const top=es[0].getBoundingClientRect().top;
  return es.every(e=>Math.abs(e.getBoundingClientRect().top-top)<1);
 })).toBe(true);
 await expect(viewers.nth(1)).toHaveCSS('overflow-y','auto');
 await page.evaluate(()=>dispatchEvent(new MessageEvent('message',{origin:'https://example.com',data:JSON.stringify({type:'MEASURE',details:{height:2000}})})));
 await expect(frame).toHaveCSS('height','749px');
});

test('identity card falls back without WebGL', async ({page}) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(() => { const original=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(type,...args){if(String(type).includes('webgl'))return null;return original.apply(this,[type,...args]);} as typeof original; });
 await page.goto('http://localhost:3001');
 await expect(page.locator('.lanyard-fallback')).toBeVisible();
 await page.getByRole('button',{name:'Flip identity card'}).click();
 await expect(page.locator('.lanyard-fallback')).toHaveAttribute('src','/images/id-back.svg');
});
test('startup ScrollReveal animates after skipping intro and respects reduced motion',async({page})=>{
 await page.goto('http://localhost:3001');
 await page.getByRole('button',{name:'Skip intro'}).click();
 const action=page.getByRole('link',{name:'Explore my work',exact:true});
 await expect.poll(()=>action.evaluate(el=>getComputedStyle(el.parentElement).transform!=='none'&&el.querySelector('.scroll-reveal-piece')===null)).toBe(true);
 await expect(page.locator('h1 .scroll-reveal')).toBeVisible();
 await expect.poll(()=>page.locator('h1 .scroll-reveal-piece').evaluateAll(es=>es.some(el=>Number(getComputedStyle(el).opacity)<1))).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect.poll(()=>page.locator('h1 .scroll-reveal-piece').evaluateAll(es=>es.length>0&&es.every(el=>getComputedStyle(el).opacity==='1'&&getComputedStyle(el).transform==='none'))).toBe(true);
 await page.reload();
 await expect(page.getByRole('heading',{name:'Two sides. Same curiosity.'})).toBeAttached();
 expect(await page.locator('.scroll-reveal-piece').evaluateAll(es=>es.length>0&&es.every(e=>getComputedStyle(e).opacity==='1'))).toBeTruthy();
});
test('section navigation tracks scrolling and returns to top',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://localhost:3001');
 await page.getByRole('link',{name:'About',exact:true}).click();
 await expect(page.getByRole('link',{name:'About',exact:true})).toHaveAttribute('aria-current','location');
 await expect(page.getByRole('link',{name:'Back to top',exact:true})).toBeVisible();
 expect(await page.locator('.navigation-dock').evaluate(el=>getComputedStyle(el).position)).toBe('fixed');
 await page.getByRole('link',{name:'Back to top',exact:true}).click();
 await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
 await expect(page.getByRole('link',{name:'Back to top',exact:true})).toHaveCount(0);
});
test('remaining interface groups animate after loading and on refresh',async({page})=>{
 await page.goto('http://localhost:3001',{waitUntil:'domcontentloaded'});
 await expect(page.getByRole('button',{name:'Skip intro'})).toBeVisible();
 await expect(page.locator('.lanyard-canvas')).toHaveCount(0);
 await page.getByRole('button',{name:'Skip intro'}).click();
 const groups=page.locator('.dock-header,.navigation-dock,.roles,.hero-bottom,.handnote');
 await expect.poll(()=>groups.evaluateAll(es=>{
  return es.length===5&&es.every(e=>e.getAnimations().some(a=>a.playState==='running'));
 })).toBe(true);
 await expect(page.locator('.lanyard-canvas')).toBeVisible();
 await page.reload({waitUntil:'domcontentloaded'});
 await expect.poll(()=>page.locator('.navigation-dock').evaluate(e=>{
  return e.getAnimations().some(a=>a.playState==='running');
 })).toBe(true);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect.poll(()=>groups.evaluateAll(es=>{
  return es.every(e=>e.getAnimations().length===0&&getComputedStyle(e).opacity==='1'&&getComputedStyle(e).visibility==='visible');
 })).toBe(true);
});
test('centered name loader replaces laptop and finishes automatically',async({page})=>{
 await page.goto('http://localhost:3001');
 await expect(page.getByRole('status',{name:'Loading aemi portfolio'})).toBeVisible();
 await expect(page.locator('.intro canvas')).toHaveCount(0);
 await expect(page.locator('.page-entrance')).toHaveCSS('visibility','hidden');
 const center=await page.locator('.loader-name').evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:innerWidth,h:innerHeight,width:r.width}});
 expect(Math.abs(center.x-center.w/2)).toBeLessThan(2);
 expect(center.width).toBeGreaterThan(center.w*.4);
 expect(center.width).toBeLessThan(center.w*.9);
 await expect(page.getByRole('button',{name:'Skip intro'})).toHaveCount(0,{timeout:5000});
 await expect(page.locator('h1')).toBeVisible();
 const letters=page.locator('h1 .scroll-reveal-piece');
 await expect.poll(()=>letters.evaluateAll(es=>es.length>0&&es.some(e=>Number(getComputedStyle(e).opacity)<1&&getComputedStyle(e).filter!=='none'))).toBe(true);
 await expect(letters.last()).toHaveCSS('opacity','1');
 await expect(letters.last()).toHaveCSS('filter','none');
});
test('intro covers the first server-rendered frame before hydration',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 const page=await context.newPage();await page.goto('http://localhost:3001');
 await expect(page.locator('.name-intro')).toBeAttached();
 expect(await page.locator('.name-intro').evaluate(el=>getComputedStyle(el).position)).toBe('fixed');
 expect(await page.locator('h1 .scroll-reveal-piece').evaluateAll(es=>es.length>0&&es.every(e=>getComputedStyle(e).opacity==='1'))).toBe(true);
 await context.close();
});
test('ScrollReveal text works on direct links and remounted work',async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('aemi-intro','seen'));
 await page.goto('http://localhost:3001/#playground');
 await expect.poll(()=>page.locator('.motion-heading .scroll-reveal-piece').evaluateAll(es=>es.length>0&&es.every(e=>getComputedStyle(e).opacity==='1'))).toBe(true);
 await expect(page.locator('.development .scroll-reveal-content > .scroll-reveal-text').first()).toHaveCSS('opacity','1');
 await page.getByRole('button',{name:'Development',exact:true}).click();
 await page.getByRole('button',{name:'Motion',exact:true}).click();
 await page.getByRole('heading',{name:'Made to move.'}).evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*.35,behavior:'instant'}));
 await expect.poll(()=>page.locator('.motion-heading .scroll-reveal-piece').evaluateAll(es=>es.length>0&&es.every(e=>getComputedStyle(e).opacity==='1'))).toBe(true);
 await page.getByRole('heading',{name:'The person behind the pixels.'}).evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().top-innerHeight*.35,behavior:'instant'}));
 await expect.poll(()=>page.locator('#about h2 .scroll-reveal-piece').evaluateAll(es=>es.length>0&&es.every(e=>getComputedStyle(e).opacity==='1'))).toBe(true);
 const folder=page.locator('#about .scroll-reveal-content').filter({has:page.locator('.personal-folder')});
 await folder.evaluate(el=>scrollTo({top:scrollY+el.getBoundingClientRect().bottom-innerHeight*.55,behavior:'instant'}));
 await expect(folder.locator(':scope > .scroll-reveal-text')).toHaveCSS('opacity','1');
 await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
 await expect.poll(()=>page.locator('footer .scroll-reveal-piece').evaluateAll(es=>es.length>0&&es.every(e=>getComputedStyle(e).opacity==='1'))).toBe(true);
});
test('text reveal follows scrolling in both directions and respects reduced motion',async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('aemi-intro','seen'));
 await page.goto('http://localhost:3001');
 const text=page.locator('#work h2 .scroll-reveal');
 const range=await text.evaluate(el=>{const r=el.getBoundingClientRect();return {start:r.top+scrollY-innerHeight,height:r.height+innerHeight*.4}});
 const pieces=text.locator('.scroll-reveal-piece');
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),range.start+range.height*.65);
 await expect.poll(()=>pieces.evaluateAll(es=>es.some(e=>Number(getComputedStyle(e).opacity)<1))).toBe(true);
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),range.start+range.height*.4);
 await expect.poll(()=>pieces.first().evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThan(.28);
 expect(await pieces.last().evaluate(el=>Number(getComputedStyle(el).opacity))).toBeLessThan(1);
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),range.start+range.height+10);
 await expect(pieces.last()).toHaveCSS('opacity','1');
 await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),range.start-10);
 await expect(pieces.first()).toHaveCSS('opacity','0.28');
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(pieces.first()).toHaveCSS('opacity','1');
 await expect(pieces.first()).toHaveCSS('filter','none');
 await expect(page.locator('.scroll-reveal-content > .scroll-reveal-text').first()).toHaveCSS('transform','none');
});
test('hero text replays when returning to the top',async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('aemi-intro','seen'));
 await page.goto('http://localhost:3001');
 const letters=page.locator('h1 .scroll-reveal-piece');
 await expect(letters.last()).toHaveCSS('opacity','1');
 await page.locator('#work').scrollIntoViewIfNeeded();
 await expect(page.locator('h1')).not.toBeInViewport();
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
 await expect.poll(()=>letters.evaluateAll(es=>es.some(e=>Number(getComputedStyle(e).opacity)<1))).toBe(true);
 await expect(letters.last()).toHaveCSS('opacity','1');
});
test('phone dock has accessible navigation and fits the screen',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:320,height:740});await page.goto('http://localhost:3001');
 const dock=page.getByRole('navigation',{name:'Main navigation'});await expect(dock).toBeVisible();
 await dock.getByRole('link',{name:'About',exact:true}).click();
 await expect(dock.getByRole('link',{name:'About',exact:true})).toHaveAttribute('aria-current','location');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
test('personal files opens from folder and dock with resume downloads',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:3001/#about');
 await expect(page.locator('.folder-root')).toHaveCSS('--folder-base','rgb(139, 47, 201)');
 await page.getByRole('button',{name:'Browse my files'}).click();
 const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:/Backend résumé/}).click();
 await expect(dialog.locator('iframe,embed,object')).toHaveCount(0);
 const preview=dialog.getByRole('img',{name:'Backend résumé, full-page preview'});
 await expect(preview).toBeVisible();
 await expect.poll(()=>preview.evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(1500);
 const download=page.waitForEvent('download');await dialog.getByRole('link',{name:'Download résumé'}).click();expect((await download).suggestedFilename()).toContain('backend');
 await page.keyboard.press('Escape');await expect(dialog).not.toBeVisible();
 await page.getByRole('button',{name:'Open personal files'}).click();await expect(dialog).toBeVisible();
 await dialog.getByRole('button',{name:'Back to files'}).click();
 await expect(dialog.locator('.files-grid > button')).toHaveCount(3);
 await dialog.getByRole('button',{name:/About me & ID/}).click();
 await expect(dialog.getByRole('img',{name:/aemi personal ID/})).toBeVisible();
 await expect(dialog.getByRole('heading',{name:/Hey, I’m Jerold/})).toBeVisible();
 await expect(dialog.locator('.about-file p').first()).toHaveCSS('font-size','17px');
 await expect.poll(()=>dialog.locator('.about-file img').evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});
test('purple strip loops and pauses with reduced motion',async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('aemi-intro','seen'));await page.goto('http://localhost:3001');
 await page.locator('.portfolio-loop').scrollIntoViewIfNeeded();
 const track=page.locator('.portfolio-loop .logoloop__track');await expect(track).toBeVisible();
 const before=await track.getAttribute('style');await expect.poll(()=>track.getAttribute('style')).not.toBe(before);
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForTimeout(300);const paused=await track.getAttribute('style');await page.waitForTimeout(200);expect(await track.getAttribute('style')).toBe(paused);
});
test('tool logos loop and remain readable on mobile with reduced motion',async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('aemi-intro','seen'));
 await page.goto('http://localhost:3001/#tools');
 const tools=page.getByRole('region',{name:'Tools I use',exact:true});
 await expect(tools).toBeVisible();
 const coding=tools.getByRole('region',{name:'Coding tools',exact:true});
 const editing=tools.getByRole('region',{name:'Editing tools',exact:true});
 await expect(coding.getByRole('img')).toHaveCount(5);
 await expect(editing.getByRole('img')).toHaveCount(3);
 await expect.poll(()=>tools.locator('ul:not([aria-hidden]) img').evaluateAll(es=>es.length===8&&es.every(e=>(e as HTMLImageElement).naturalWidth>0))).toBe(true);
 const track=coding.locator('.logoloop__track');const before=await track.getAttribute('style');
 await expect.poll(()=>track.getAttribute('style')).not.toBe(before);
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({reducedMotion:'reduce'});
 await expect.poll(()=>tools.getByRole('img').evaluateAll(es=>es.every(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth}))).toBe(true);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await expect(track).toHaveCSS('transform','none');
});
test('dock magnifies hovered icons and their neighbors',async({page})=>{
 await page.addInitScript(()=>sessionStorage.setItem('aemi-intro','seen'));await page.goto('http://localhost:3001');
 const dock=page.getByRole('navigation',{name:'Main navigation'}),work=dock.getByRole('link',{name:'Work',exact:true}),home=dock.getByRole('link',{name:'Home',exact:true});
 const initial=(await home.boundingBox())!.width;await work.hover();
 await expect.poll(async()=>(await home.boundingBox())!.width).toBeGreaterThan(initial+2);
 await page.emulateMedia({reducedMotion:'reduce'});
 await expect(dock.locator('.dock-icon').first()).toHaveCSS('transform','none');
});
test('both resume files and the illustrated ID are available',async({request})=>{
 for(const path of['/resumes/jerold-noynay-backend.pdf','/resumes/jerold-noynay-motion-design.pdf']){const response=await request.get('http://localhost:3001'+path);expect(response.ok()).toBe(true);expect((await response.body()).subarray(0,4).toString()).toBe('%PDF')}
 const card=await request.get('http://localhost:3001/images/id-front.svg');expect((await card.text()).includes('id="id-avatar"')).toBe(true);
});
test('page entrance fades after intro and clears for reduced motion',async({page})=>{
 await page.goto('http://localhost:3001',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Skip intro'}).click();
 const content=page.locator('.page-entrance');await expect(content).toBeAttached();
 await expect.poll(()=>content.evaluate(e=>Number(getComputedStyle(e).opacity))).toBeLessThan(1);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(content).toHaveCSS('opacity','1');await expect(content).toHaveCSS('visibility','visible');
 const canvas=page.locator('.lanyard-canvas');await expect(canvas).toBeVisible();expect(await canvas.evaluate(e=>e.getBoundingClientRect().left)).toBe(0);
});
test('cursor grid renders behind usable navigation and becomes static for reduced motion',async({page})=>{
 await page.addInitScript(()=>{
  sessionStorage.setItem('aemi-intro','seen');
  const draw=WebGL2RenderingContext.prototype.drawArrays;
  WebGL2RenderingContext.prototype.drawArrays=function(...args){if(this.canvas instanceof HTMLCanvasElement&&this.canvas.classList.contains('cursor-grid__canvas'))this.canvas.dataset.draws=String(Number(this.canvas.dataset.draws||0)+1);return draw.apply(this,args)};
 });
 await page.goto('http://localhost:3001');
 const canvas=page.locator('.portfolio-background canvas');await expect(canvas).toBeVisible();
 await expect(page.locator('.portfolio-background')).toHaveCSS('pointer-events','none');
 const before=Number(await canvas.getAttribute('data-draws'));await page.mouse.move(700,300);
 await expect.poll(async()=>Number(await canvas.getAttribute('data-draws'))).toBeGreaterThan(before);
 await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'About',exact:true}).click();
 await expect(page).toHaveURL(/#about$/);
 await expect(page.getByRole('link',{name:'About',exact:true})).toHaveAttribute('aria-current','location');
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(300);
 const still=Number(await canvas.getAttribute('data-draws'));await page.mouse.move(300,400);await page.waitForTimeout(200);expect(Number(await canvas.getAttribute('data-draws'))).toBe(still);
});
