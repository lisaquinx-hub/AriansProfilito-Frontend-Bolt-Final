'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const CARD_SELECTOR = '[data-magic-bento], .magic-bento-card, .glass';
const PARTICLE_COUNT = 5;

function getCard(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element ? target.closest<HTMLElement>(CARD_SELECTOR) : null;
}

function isInside(card: HTMLElement, target: EventTarget | null) {
  return target instanceof Node && card.contains(target);
}

function prepareCard(card: HTMLElement) {
  if (card.dataset.magicBentoReady === 'true') return;

  card.dataset.magicBentoReady = 'true';
  card.classList.add('magic-bento-ready');

  if (window.getComputedStyle(card).position === 'static') {
    card.style.position = 'relative';
  }
}

function addParticle(layer: HTMLElement, card: HTMLElement, index: number) {
  const rect = card.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const particle = document.createElement('i');
  const angle = (Math.PI * 2 * index) / PARTICLE_COUNT + Math.random() * 0.5;
  const distance = 18 + Math.random() * 34;

  particle.className = 'magic-bento-particle';
  particle.style.left = `${rect.left + rect.width * (0.12 + Math.random() * 0.76)}px`;
  particle.style.top = `${rect.top + rect.height * (0.12 + Math.random() * 0.76)}px`;
  particle.style.setProperty('--particle-x', `${Math.cos(angle) * distance}px`);
  particle.style.setProperty('--particle-y', `${Math.sin(angle) * distance}px`);
  particle.style.setProperty('--particle-delay', `${index * 45}ms`);
  layer.appendChild(particle);
  particle.addEventListener('animationend', () => particle.remove(), { once: true });
}

function addRipple(layer: HTMLElement, card: HTMLElement, clientX: number, clientY: number) {
  const rect = card.getBoundingClientRect();
  const radius = Math.max(
    Math.hypot(clientX - rect.left, clientY - rect.top),
    Math.hypot(clientX - rect.right, clientY - rect.top),
    Math.hypot(clientX - rect.left, clientY - rect.bottom),
    Math.hypot(clientX - rect.right, clientY - rect.bottom)
  );
  const ripple = document.createElement('i');

  ripple.className = 'magic-bento-ripple';
  ripple.style.left = `${clientX}px`;
  ripple.style.top = `${clientY}px`;
  ripple.style.setProperty('--ripple-size', `${Math.max(radius * 2, 72)}px`);
  layer.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

/**
 * Adds the supplied Magic Bento spotlight, star and click feedback to existing
 * cards without replacing their markup, data or glass treatment.
 */
export default function MagicBentoProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (isDashboard || !finePointer.matches || reducedMotion.matches) return;

    const layer = document.createElement('div');
    layer.className = 'magic-bento-fx-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    let activeCard: HTMLElement | null = null;
    let animationFrame = 0;
    let pendingPointer: PointerEvent | null = null;

    const updateGlow = () => {
      animationFrame = 0;
      const event = pendingPointer;
      const card = activeCard;
      if (!event || !card) return;

      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100));
      card.style.setProperty('--magic-x', `${x}%`);
      card.style.setProperty('--magic-y', `${y}%`);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const card = getCard(event.target);
      if (!card || isInside(card, event.relatedTarget)) return;

      prepareCard(card);
      activeCard?.classList.remove('magic-bento-active');
      activeCard = card;
      card.classList.add('magic-bento-active');

      if (finePointer.matches && !reducedMotion.matches) {
        Array.from({ length: PARTICLE_COUNT }, (_, index) => addParticle(layer, card, index));
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const card = getCard(event.target);
      if (!card || !finePointer.matches) return;

      prepareCard(card);
      activeCard = card;
      pendingPointer = event;
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateGlow);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const card = getCard(event.target);
      if (!card || isInside(card, event.relatedTarget)) return;

      card.classList.remove('magic-bento-active');
      card.style.setProperty('--magic-intensity', '0');
      if (activeCard === card) activeCard = null;
    };

    const handleClick = (event: MouseEvent) => {
      const card = getCard(event.target);
      if (!card || reducedMotion.matches) return;
      addRipple(layer, card, event.clientX, event.clientY);
    };

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerout', handlePointerOut);
    document.addEventListener('click', handleClick);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('click', handleClick);
      layer.remove();
    };
  }, [pathname]);

  return null;
}
