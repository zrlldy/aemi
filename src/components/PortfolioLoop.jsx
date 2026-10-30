'use client';
import { Sparkles } from 'lucide-react';
import LogoLoop from './LogoLoop';
const logos=['LOGIC MEETS EXPRESSION','BUILT TO WORK','MADE TO MOVE'].map(text=>({node:<span className="loop-phrase">{text}<Sparkles aria-hidden="true"/></span>,title:text}));
export default function PortfolioLoop(){return <div className="ticker portfolio-loop entry-motion"><LogoLoop logos={logos} speed={65} direction="left" logoHeight={28} gap={40} fadeOut={false} intro={false} ariaLabel="Making things work and move"/></div>}
