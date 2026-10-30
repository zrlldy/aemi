'use client';
import ScrollReveal from './ScrollReveal';

export default function TextReveal({ text, splitBy = 'word', trigger = 'scroll', enabled = true }: {
 text: string;
 splitBy?: 'char' | 'word';
 trigger?: 'scroll' | 'mount';
 enabled?: boolean;
}) {
 return <ScrollReveal trigger={trigger} enabled={enabled} splitBy={splitBy==='char'?'chars':'words'} effect="fade" baseRotation={0} baseOffset={12} baseOpacity={trigger==='mount'?0.1:0.28} blurStrength={trigger==='mount'?4:2} stagger={0.035}>{text}</ScrollReveal>;
}
