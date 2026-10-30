'use client';
import LogoLoop from './LogoLoop';
import TextReveal from './TextReveal';
import ScrollReveal from './ScrollReveal';
import './ToolLoops.css';

const groups = [
  { name: 'Coding', direction: 'left', tools: [
    ['Laravel', 'laravel'], ['NestJS', 'nestjs'], ['MySQL', 'mysql'],
    ['MariaDB', 'mariadb'], ['PostgreSQL', 'postgresql']
  ] },
  { name: 'Editing', direction: 'right', tools: [
    ['Adobe Illustrator', 'illustrator'], ['Adobe After Effects', 'after-effects'], ['Affinity', 'affinity']
  ] }
].map(group => ({ ...group, logos: group.tools.map(([title, file]) => ({
  src: `/logos/${file}.svg`, title, alt: title, width: 36, height: 36
})) }));

export default function ToolLoops() {
  return <section id="tools" className="tool-loops" aria-labelledby="tools-title">
    <h3 id="tools-title"><TextReveal text="Tools I use"/></h3>
    {groups.map(group => <ScrollReveal as="div" containerClassName="scroll-reveal-content" baseRotation={0} baseOffset={16} enableBlur={false} key={group.name}><div className="tool-row">
      <p>{group.name}</p>
      <LogoLoop logos={group.logos} direction={group.direction} speed={38} logoHeight={36}
        gap={48} labels="inline" hoverSpeed={0} intro={false} ariaLabel={`${group.name} tools`}/>
    </div></ScrollReveal>)}
  </section>;
}
