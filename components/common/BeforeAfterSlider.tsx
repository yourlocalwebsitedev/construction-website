import React, { useRef, useState, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  onInteract?: () => void;
}

/**
 * Touch-friendly before/after comparison slider.
 * Works with mouse drag, touch drag, and click-to-set on the track.
 */
const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeSrc,
  afterSrc,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
  className = '',
  onInteract,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const interactedRef = useRef(false);

  const notifyInteraction = useCallback(() => {
    if (!interactedRef.current) {
      interactedRef.current = true;
      onInteract?.();
    }
  }, [onInteract]);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    notifyInteraction();
    updatePosition(e.clientX);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) updatePosition(e.clientX);
  };
  const stopDrag = () => setDragging(false);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) updatePosition(e.touches[0].clientX);
  };
  const handleTouchStart = (e: React.TouchEvent) => {
    notifyInteraction();
    if (e.touches[0]) updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] overflow-hidden rounded-xl select-none touch-none cursor-ew-resize bg-ink ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* After image (base layer) */}
      <img
        src={afterSrc}
        alt={afterLabel}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      {/* Before image (clipped via clip-path so it stays responsive) */}
      <img
        src={beforeSrc}
        alt={beforeLabel}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />

      {/* Labels */}
      <span className="absolute bottom-3 left-3 bg-ink/70 text-cream text-[10px] font-bold tracking-wider px-2 py-1 rounded backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute bottom-3 right-3 bg-gold/90 text-ink text-[10px] font-bold tracking-wider px-2 py-1 rounded backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-cream/90"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-cream shadow-lg flex items-center justify-center text-ink">
          <MoveHorizontal size={16} />
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
