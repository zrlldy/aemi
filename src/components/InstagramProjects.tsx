'use client';
import { useEffect, useRef, useState } from 'react';
import { MoveUpRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import TextReveal from './TextReveal';
import './ProjectMedia.css';

const projects = [
  { title: 'Product in motion', description: 'Product-style animation', code: 'DcKIXady6Ol' },
  { title: 'Type with attitude', description: 'Poster exploration', code: 'DeadfahSFVV' },
  { title: 'Cut to the feeling', description: 'Anime music video', code: 'Cm-YFqgrxVi' }
];

function InstagramEmbed({ code, title }: { code: string; title: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const resize = (event: MessageEvent) => {
      if (event.origin !== 'https://www.instagram.com' || event.source !== frame.current?.contentWindow || typeof event.data !== 'string') return;
      let message;
      try { message = JSON.parse(event.data); }
      catch (error) { if (error instanceof SyntaxError) return; throw error; }
      const height = message?.details?.height;
      if (message?.type === 'MEASURE' && typeof height === 'number' && Number.isFinite(height) && height >= 100 && height <= 2400) {
        frame.current.style.height = `${Math.ceil(height)}px`;
      }
    };
    window.addEventListener('message', resize);
    // Register before loading the frame so its first size message is not missed.
    setReady(true);
    return () => window.removeEventListener('message', resize);
  }, []);
  return <iframe ref={frame} src={ready ? `https://www.instagram.com/p/${code}/embed/` : undefined} title={`Instagram: ${title}`}
    loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen
    referrerPolicy="strict-origin-when-cross-origin"/>;
}

export default function InstagramProjects() {
  return <div className="motion-grid">
    {projects.map(project => <article className="motion-project" key={project.code}>
      <ScrollReveal as="div" containerClassName="scroll-reveal-content" effect="rise" baseRotation={0} baseOpacity={0.3} enableBlur={false}>
        <div className="instagram-embed" tabIndex={0} role="region" aria-label={`${project.title}: Instagram post`}>
          <InstagramEmbed code={project.code} title={project.title}/>
        </div>
      </ScrollReveal>
      <ScrollReveal as="div" containerClassName="scroll-reveal-content" baseRotation={0} baseOffset={16} enableBlur={false}>      <a className="project-heading" href={`https://www.instagram.com/p/${project.code}/`} target="_blank" rel="noreferrer"
        aria-label={`View ${project.title} on Instagram`}>
        <h4><TextReveal text={project.title} splitBy="char"/></h4><MoveUpRight size={18}/>
      </a></ScrollReveal>
      <p><TextReveal text={project.description}/></p>
    </article>)}
  </div>;
}
