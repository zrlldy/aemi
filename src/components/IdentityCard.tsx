'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const Lanyard = dynamic(() => import('./Lanyard'), { ssr: false });
export default function IdentityCard({ready}:{ready:boolean}) {
 const [phone, setPhone] = useState(false);
 useEffect(() => {
  const query = matchMedia('(max-width: 560px)');
  const update = () => setPhone(query.matches);
  update();
  query.addEventListener('change', update);
  return () => query.removeEventListener('change', update);
 }, []);
 return <div className="identity identity-webgl">
  {ready&&<Lanyard frontImage="/images/id-front.svg" backImage="/images/id-back.svg" strapImage="/images/strap.svg" cardColor="#dc97ff" strapColor="#6818a5" orientation="portrait" finish="glossy" metal="graphite" cornerRadius={0.35} size={phone ? 0.7 : 0.6} anchor="center" strapLength={phone ? 0.05 : 0.45} gravity={0.85} damping={0.55} elasticity={0.45} breeze={0.15} interactive intro />}
  <p className="handnote entry-motion">a little code, a little chaos.<br/><span>drag to swing · click to flip</span></p>
 </div>;
}
