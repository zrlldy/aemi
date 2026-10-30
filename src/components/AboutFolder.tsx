'use client';
import { useState } from 'react';
import FolderFloat from './FolderFloat';
const notes:Record<string,string>={
 'Backend':'APIs, database architecture, and automations at East Equator Express Philippines Inc.',
 'Motion':'Product animations, promotional videos, posters, and anime music videos.',
 'Cebu':'Based in Cebu, Philippines.',
 'Education':'BS Information Technology, Cebu Technological University, 2026.'
};
export default function AboutFolder(){const[selected,setSelected]=useState('Backend');return <div className="about-folder"><FolderFloat items={Object.keys(notes)} label="aemi.files" sublabel="Code, motion & everything between" trigger="click" width={230} height={170} spread={125} folderColor="#4a0a77" frontColor="#6818a5" paperColor="#f8f3fc" itemColor="#310055" itemTextColor="#f8f3fc" labelColor="#f8f3fc" onSelect={(value)=>setSelected(value)} onOpenChange={undefined}/><div className="folder-detail" role="status"><b>{selected}</b><p>{notes[selected]}</p></div></div>}
