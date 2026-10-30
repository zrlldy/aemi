'use client';

import { Children, useEffect, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { animate, onScroll } from 'animejs';

import './ScrollReveal.css';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const SCRUB_SPAN = 0.5;
const RISE_MASK = 'inset(-1em -1em -0.15em -1em)';

const clamp01 = value => Math.min(Math.max(value, 0), 1);
const smooth = value => value * value * (3 - 2 * value);
const easeOut = value => 1 - Math.pow(1 - value, 3);
const easeBack = (value, overshoot) => {
  const shifted = value - 1;
  return 1 + (overshoot + 1) * shifted * shifted * shifted + overshoot * shifted * shifted;
};
const glowAt = t => (t <= 0 || t >= 1 ? 0 : t < 0.35 ? smooth(t / 0.35) : 1 - smooth((t - 0.35) / 0.65));

const paintPiece = (piece, t, look) => {
  let reveal = t;
  let fadeIn = t;
  let motion = '';
  if (look.effect === 'rise') {
    reveal = easeOut(t);
    fadeIn = clamp01(reveal * 1.25);
    if (reveal < 1) {
      motion = look.masked
        ? `translateY(${((1 - reveal) * 100).toFixed(2)}%) translateY(${((1 - reveal) * 0.2).toFixed(3)}em)`
        : `translateY(${((1 - reveal) * 0.8).toFixed(3)}em)`;
    }
  } else if (look.effect === 'flip') {
    reveal = easeBack(t, 1.2);
    fadeIn = clamp01(t * 2);
    if (t < 1) motion = `perspective(6em) rotateX(${((1 - reveal) * 90).toFixed(2)}deg)`;
  } else if (look.effect === 'scale') {
    reveal = easeBack(t, 1.6);
    fadeIn = clamp01(t * 1.6);
    if (t < 1) motion = `scale(${(0.35 + 0.65 * reveal).toFixed(4)})`;
  }
  if (look.highlightColor) fadeIn = Math.max(fadeIn, clamp01(t / 0.35));
  const settle = clamp01(reveal);
  const lift = look.offset * (1 - settle);
  piece.style.opacity = t >= 1 ? '' : (look.baseOpacity + (1 - look.baseOpacity) * fadeIn).toFixed(3);
  piece.style.transform = [lift ? `translateY(${lift.toFixed(2)}px)` : '', motion].filter(Boolean).join(' ');
  piece.style.filter = look.blur && settle < 1 ? `blur(${(look.blur * (1 - settle)).toFixed(2)}px)` : '';
  if (look.highlightColor) {
    const glow = glowAt(t);
    piece.style.color =
      glow > 0.002 ? `color-mix(in srgb, ${look.highlightColor} ${(glow * 100).toFixed(1)}%, currentColor)` : '';
  }
};

const query = '(prefers-reduced-motion: reduce)';
const subscribe = callback => {
  const media = matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const snapshot = () => matchMedia(query).matches;

const ScrollReveal = ({
  children,
  scrollContainerRef = undefined,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  baseOffset = 0,
  stagger = 0.05,
  smoothing = 0,
  splitBy = 'words',
  effect = 'fade',
  trigger = 'scroll',
  enabled = true,
  duration = 0.8,
  highlightColor = '',
  containerClassName = '',
  textClassName = '',
  as: Root = 'span'
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  const text = useMemo(() => {
    const parts = Children.toArray(children);
    return parts.every(part => typeof part === 'string' || typeof part === 'number') ? parts.join('') : null;
  }, [children]);

  const splitText = useMemo(() => {
    if (text === null) return null;
    return text.split(/(\s+)/).map((word, index) =>
      word.trim() === '' ? (
        word
      ) : (
        <span className="scroll-reveal-word" key={index}>
          {splitBy === 'chars' ? (
            Array.from(word).map((char, charIndex) => (
              <span className="scroll-reveal-piece" key={charIndex}>
                {char}
              </span>
            ))
          ) : (
            <span className="scroll-reveal-piece">{word}</span>
          )}
        </span>
      )
    );
  }, [text, splitBy]);

  const reduced = useSyncExternalStore(subscribe, snapshot, () => false);
  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current, textEl = textRef.current;
    if (!el || !textEl || reduced || matchMedia(query).matches) return;
    const wrappers = text === null ? [] : Array.from(textEl.querySelectorAll('.scroll-reveal-word'));
    const pieces = wrappers.length ? Array.from(textEl.querySelectorAll('.scroll-reveal-piece')) : [textEl];
    const look = { effect, masked: effect === 'rise' && wrappers.length > 0, baseOpacity, blur: enableBlur ? blurStrength : 0, offset: baseOffset, highlightColor };
    const state = { p: 0 };
    const order = pieces.map((_, index) => index);
    let count = pieces.length;
    const measure = () => {
      if (splitBy !== 'lines' || !wrappers.length) return;
      let line = -1, top = -Infinity;
      wrappers.forEach((word, index) => {
        if (Math.abs(word.offsetTop - top) > 2) { line++; top = word.offsetTop; }
        order[index] = line;
      });
      count = line + 1;
    };
    measure();
    const span = trigger === 'mount' ? duration : SCRUB_SPAN;
    const total = () => span + Math.max(0, count - 1) * Math.max(0, stagger);
    const render = () => {
      const at = state.p * total();
      pieces.forEach((piece, index) => paintPiece(piece, clamp01((at - order[index] * stagger) / span), look));
      if (baseRotation) el.style.transform = `rotate(${baseRotation * (1 - state.p)}deg)`;
    };
    if (look.masked) wrappers.forEach(word => word.style.clipPath = RISE_MASK);
    render();
    // Clamp the end at the page bottom so footer copy still finishes revealing.
    const scroll = trigger === 'scroll' ? onScroll({
      target: el,
      container: scrollContainerRef?.current,
      enter: 'bottom top',
      leave: 'min+=60% bottom',
      sync: smoothing > 0 ? smoothing : true,
      onUpdate: observer => {
        if (observer.scroll >= observer.container.scrollHeight - observer.container.height - 1) state.p = 1;
        render();
      }
    }) : null;
    const animation = animate(state, { p: [0, 1], duration: trigger === 'mount' ? total() * 1000 : 1000, ease: 'linear', autoplay: scroll ?? enabled, onUpdate: render });
    let leftViewport = false;
    const entrance = trigger === 'mount' && enabled ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) leftViewport = true;
        else if (leftViewport) { animation.restart(); leftViewport = false; }
      }
    }) : null;
    entrance?.observe(el);
    const resize = new ResizeObserver(() => { measure(); scroll?.refresh(); render(); });
    resize.observe(document.body);
    if (scrollContainerRef?.current) resize.observe(scrollContainerRef.current);
    return () => {
      resize.disconnect();
      entrance?.disconnect();
      scroll?.revert();
      animation.revert();
      pieces.forEach(piece => ['opacity', 'transform', 'filter', 'color'].forEach(property => piece.style.removeProperty(property)));
      wrappers.forEach(word => word.style.removeProperty('clip-path'));
      if (baseRotation) el.style.removeProperty('transform');
    };
  }, [reduced, text, splitBy, effect, trigger, enabled, duration, highlightColor, enableBlur, baseOpacity, baseRotation, blurStrength, baseOffset, stagger, smoothing, scrollContainerRef]);
  const Text = text === null ? 'div' : 'span';

  return (
    <Root ref={containerRef} className={`scroll-reveal ${containerClassName}`} aria-label={text ?? undefined}>
      <Text
        ref={textRef}
        className={`scroll-reveal-text ${textClassName}`}
        aria-hidden={text === null ? undefined : true}
      >
        {splitText ?? children}
      </Text>
    </Root>
  );
};

export default ScrollReveal;

