'use client';
import { useSyncExternalStore } from 'react';
import CursorGrid from './CursorGrid';
import './PortfolioBackground.css';
const query='(prefers-reduced-motion: reduce), (pointer: coarse)';
const subscribe=callback=>{const media=matchMedia(query);media.addEventListener('change',callback);return()=>media.removeEventListener('change',callback)};
const snapshot=()=>matchMedia(query).matches;
export default function PortfolioBackground({ready}){
 const still=useSyncExternalStore(subscribe,snapshot,()=>false);
 return <div className="portfolio-background" aria-hidden="true">{ready&&<CursorGrid key={still?'static':'interactive'} cellSize={64} color="#d283ff" gridColor="#ab51e3" gridStyle="lines" radius={150} holdTime={250} fadeDuration={900} lineWidth={0.75} maxOpacity={0.3} fillOpacity={0.025} gridOpacity={0.065} spotlight={0.25} clickPulse ambient={0} intro edgeFade={0.12} dpr={1}/>}</div>;
}
