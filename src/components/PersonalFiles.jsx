'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, ExternalLink, FileText, IdCard, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import ScrollReveal from './ScrollReveal';
const Folder=dynamic(()=>import('./Folder'),{ssr:false});
import './PersonalFiles.css';
const files=[
 {title:'Backend résumé',description:'Laravel, APIs & databases',image:'/resumes/backend-preview.png',alt:'Backend résumé preview',pdf:'/resumes/jerold-noynay-backend.pdf',icon:FileText},
 {title:'Motion & design résumé',description:'Animation, graphics & creative work',image:'/resumes/motion-preview.png',alt:'Motion and design résumé preview',pdf:'/resumes/jerold-noynay-motion-design.pdf',icon:FileText},
 {title:'About me & ID',description:'The person behind aemi, in one place',image:'/images/id-front-photo.svg',alt:'aemi personal ID with a photo of Jerold',icon:IdCard}
];
export default function PersonalFiles({open,onOpenChange}){
 const dialog=useRef(null);const[selected,setSelected]=useState(null);const[phone,setPhone]=useState(false);
 useEffect(()=>{const query=matchMedia('(max-width:560px)');const update=()=>setPhone(query.matches);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update)},[]);
 useEffect(()=>{if(open&&!dialog.current.open)dialog.current.showModal();else if(!open&&dialog.current.open)dialog.current.close()},[open]);
 const select=index=>{setSelected(index);onOpenChange(true)};
 const file=selected===null?null:files[selected];
 return <>
  <ScrollReveal as="div" containerClassName="scroll-reveal-content" effect="rise" baseRotation={0} baseOpacity={0.3} enableBlur={false}><div className="personal-folder"><Folder label="aemi.files" items={files} layout="row" color="#8b2fc9" paperColor="#f8f3fc" size={phone?0.65:0.95} theme="light" draggable={false} zoomOnClick={false} onItemClick={(_,index)=>select(index)}/><p className="personal-folder-caption">Two résumés and one introduction:<br/>a little about me, with my ID.</p><button className="files-open" onClick={()=>{setSelected(null);onOpenChange(true)}}>Browse my files <ExternalLink size={16}/></button></div></ScrollReveal>
  <dialog ref={dialog} className="files-dialog" aria-labelledby="files-title" onCancel={event=>{event.preventDefault();onOpenChange(false)}} onClose={()=>onOpenChange(false)} onClick={event=>{if(event.target===event.currentTarget)onOpenChange(false)}}>
   <div className="files-window"><div className="files-toolbar"><div>{file&&<button onClick={()=>setSelected(null)} aria-label="Back to files"><ArrowLeft size={19}/></button>}<h2 id="files-title">{file?file.title:'aemi.files'}</h2></div><button onClick={()=>onOpenChange(false)} aria-label="Close personal files"><X size={22}/></button></div>
   {!file?<><p className="files-intro">A little more about the person behind the portfolio.</p><div className="files-grid">{files.map((entry,index)=><button key={entry.title} onClick={()=>setSelected(index)}><entry.icon size={30}/><strong>{entry.title}</strong><span>{entry.description}</span></button>)}</div></>:file.pdf?<><div className="file-actions"><a href={file.pdf} download>Download résumé <ArrowDownToLine size={16}/></a></div><img className="resume-preview" src={file.image} alt={`${file.title}, full-page preview`}/></>:<div className="about-file"><img src="/images/id-front-photo.svg" alt="aemi personal ID with a photo of Jerold"/><div><h3>Hey, I’m Jerold.<br/>You can call me aemi.</h3><p>I’m a backend developer and motion designer based in Cebu, Philippines. I enjoy building systems that solve real problems and making ideas move.</p><p>I work with Laravel, Livewire, PHP, MySQL, and PostgreSQL. On the creative side, I use After Effects, Illustrator, and Affinity for animations, graphics, and visual storytelling.</p><p>I graduated with a BS in Information Technology from Cebu Technological University, Tabogon Extension, in 2026.</p></div></div>}
   </div>
  </dialog>
 </>;
}
