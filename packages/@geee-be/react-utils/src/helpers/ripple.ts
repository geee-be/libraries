import type { MouseEventHandler } from 'react';

const RIPPLE_MS = 500;

export const createRipple: MouseEventHandler<HTMLElement> = (event) => {
  const element = event.currentTarget;
  if (!element || !(element instanceof HTMLElement)) return;

  element.style.position = 'relative';
  element.style.overflow = 'hidden';

  const rect = element.getBoundingClientRect();

  const radius = findFurthestPoint(
    event.clientX,
    element.offsetWidth,
    rect.left,
    event.clientY,
    element.offsetHeight,
    rect.top,
  );

  const circle = document.createElement('span');

  applyStyles(circle, rect, radius, { x: event.clientX, y: event.clientY });
  applyAnimation(circle);

  element.appendChild(circle);

  setTimeout(() => circle.remove(), RIPPLE_MS);
};

const findFurthestPoint = (
  clickPointX: number,
  elementWidth: number,
  offsetX: number,
  clickPointY: number,
  elementHeight: number,
  offsetY: number,
): number => {
  const x = clickPointX - offsetX > elementWidth / 2 ? 0 : elementWidth;
  const y = clickPointY - offsetY > elementHeight / 2 ? 0 : elementHeight;
  return Math.hypot(x - (clickPointX - offsetX), y - (clickPointY - offsetY));
};

const applyAnimation = (element: HTMLElement): void => {
  element.animate(
    [
      {
        transform: 'scale(0)',
        opacity: 0.5,
      },
      {
        transform: 'scale(1.5)',
        opacity: 0,
      },
    ],
    {
      duration: RIPPLE_MS,
      easing: 'ease-out',
      fill: 'forwards',
    },
  );
};

const applyStyles = (
  element: HTMLElement,
  rect: { top: number; left: number },
  radius: number,
  position: { x: number; y: number },
): void => {
  element.classList.add('ripple');
  element.style.backgroundColor = 'currentColor';
  element.style.borderRadius = '50%';
  element.style.pointerEvents = 'none';
  element.style.position = 'absolute';
  element.style.left = `${position.x - rect.left - radius}px`;
  element.style.top = `${position.y - rect.top - radius}px`;
  element.style.width = element.style.height = `${radius * 2}px`;
};
