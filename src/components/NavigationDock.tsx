'use client';
import { useState } from 'react';
import { BriefcaseBusiness, FolderOpen, House, Mail, Sparkles, UserRound } from 'lucide-react';
import './NavigationDock.css';
const items=[{id:'top',label:'Home',icon:House},{id:'work',label:'Work',icon:BriefcaseBusiness},{id:'playground',label:'Playground',icon:Sparkles},{id:'about',label:'About',icon:UserRound},{id:'contact',label:'Let’s talk',icon:Mail}];
export default function NavigationDock({active,onPlayground,onFiles}:{active:string;onPlayground:()=>void;onFiles:()=>void}){
 const[hovered,setHovered]=useState<number|null>(null);
 const[focused,setFocused]=useState<number|null>(null);
 const target=hovered??focused;
 const scaleFor=(index:number)=>{const distance=target===null?Infinity:Math.abs(index-target);return distance===0?1.5:distance===1?1.22:distance===2?1.06:1;};
 return <nav className="navigation-dock entry-motion" aria-label="Main navigation" onPointerLeave={()=>setHovered(null)}>
  {items.map(({id,label,icon:Icon},index)=>{
   const scale=scaleFor(index);
   return <a key={id} className={`dock-item dock-${id}`} style={{width:52*scale}} href={`#${id}`} aria-label={label} aria-current={(active||'top')===id?'location':undefined} onPointerEnter={event=>{if(event.pointerType==='mouse')setHovered(index)}} onFocus={()=>setFocused(index)} onBlur={()=>setFocused(null)} onClick={id==='playground'?onPlayground:undefined}>
    <span className="dock-icon" style={{transform:`translateY(${-(scale-1)*22}px) scale(${scale})`}}><Icon aria-hidden="true" size={27} strokeWidth={1.8}/></span>
    <span className="dock-label" style={{bottom:72+(scale-1)*52}}>{label}</span>
    <span className="dock-indicator" aria-hidden="true"/>
   </a>;
  })}
  <button className="dock-item dock-files" style={{width:52*scaleFor(5)}} onPointerEnter={event=>{if(event.pointerType==='mouse')setHovered(5)}} onFocus={()=>setFocused(5)} onBlur={()=>setFocused(null)} onClick={onFiles} aria-label="Open personal files">
   <span className="dock-icon" style={{transform:`translateY(${-(scaleFor(5)-1)*22}px) scale(${scaleFor(5)})`}}><FolderOpen size={27} strokeWidth={1.8}/></span>
   <span className="dock-label">My files</span>
  </button>
 </nav>;
}
