'use client';
import { useEffect, useState } from 'react';
export default function useSectionScroll(filter:string) {
 const [active,setActive]=useState('');
 const [away,setAway]=useState(false);
 useEffect(()=>{
  let frame=0;
  const sections=['work','playground','about','contact'].map(id=>document.getElementById(id)).filter((el):el is HTMLElement=>!!el);
  function update(){
   frame=0;
   const marker=Math.min(innerHeight*.35,240);
   let current='';
   for(const section of sections)if(section.getBoundingClientRect().top<=marker)current=section.id;
   if(scrollY+innerHeight>=document.documentElement.scrollHeight-4)current='contact';
   setActive(current);setAway(scrollY>innerHeight*.7);
   const length=document.documentElement.scrollHeight-innerHeight;
   document.querySelector<HTMLElement>('.scroll-progress')?.style.setProperty('--progress',String(length>0?Math.min(1,Math.max(0,scrollY/length)):0));
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update)}
  const observer=new ResizeObserver(schedule);observer.observe(document.body);
  function navigate(event:MouseEvent){
   if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   const link=event.target instanceof Element?event.target.closest<HTMLAnchorElement>('a[href^="#"]'):null;
   if(!link)return;
   const hash=link.getAttribute('href');if(!hash||hash==='#')return;
   event.preventDefault();
   requestAnimationFrame(()=>{
    const target=document.getElementById(hash.slice(1));if(!target)return;
    if(location.hash!==hash)history.pushState(null,'',hash);
    target.focus({preventScroll:true});
    target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
   });
  }
  document.addEventListener('click',navigate);
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('click',navigate);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule)};
 },[filter]);
 return {active,away};
}
