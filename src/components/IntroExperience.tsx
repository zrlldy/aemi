'use client';
import { useCallback, useEffect, useState } from 'react';
import FoldText from './FoldText';
export default function IntroExperience({onReveal}:{onReveal:()=>void}) {
 const [show,setShow]=useState(true);
 const finish=useCallback(()=>{
  try{sessionStorage.setItem('aemi-intro','seen')}catch{/* Storage is optional. */}
  setShow(false);
  onReveal();
  window.dispatchEvent(new Event('aemi:intro-complete'));
 },[onReveal]);
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  if(preference.matches){setShow(false);onReveal();return;}
  try{if(sessionStorage.getItem('aemi-intro')){setShow(false);onReveal();return;}}catch{/* Storage is optional. */}
  setShow(true);
  const timer=setTimeout(finish,2400);
  const onPreference=()=>{if(preference.matches)finish()};
  preference.addEventListener('change',onPreference);
  return()=>{clearTimeout(timer);preference.removeEventListener('change',onPreference)};
 },[finish,onReveal]);
 if(!show)return null;
 return <div className="intro name-intro" aria-label="aemi introduction">
  <div className="intro-label">AEMI® — PERSONAL PLAYGROUND</div>
  <div className="name-stage" role="status" aria-label="Loading aemi portfolio">
   <div className="loader-name" aria-hidden="true"><FoldText text="aemi" className="text-reveal" foldStyle="paper" splitBy="char" hinge="top" trigger="mount" foldAngle={92} duration={0.65} stagger={0.035} perspective={700} creaseShading={0.55} fontSize="inherit" fontWeight="inherit"/><span className="loader-asterisk">✳</span></div>
   <div className="loader-track" aria-hidden="true"><span/></div>
  </div>
  <div className="intro-bottom"><p>Making things work. Making things move.</p><button onClick={finish}>Skip intro ↗</button></div>
 </div>;
}
