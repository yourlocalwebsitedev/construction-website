import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { badge: 44, kl: 'text-sm', font: 'text-[9px]', sub: 'text-[6px]' },
  md: { badge: 52, kl: 'text-base', font: 'text-xs', sub: 'text-[7px]' },
  lg: { badge: 72, kl: 'text-xl', font: 'text-sm', sub: 'text-[9px]' },
};

/**
 * K&L Pro-Finish Plastering LLC brand mark.
 * Uses the official supplied logo image (gold monogram badge on slate) + a
 * matching wordmark (K&L / PRO-FINISH / Plastering LLC) so the brand stays
 * recognizable at header size, where the badge photo alone is too small to read.
 */
const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md' }) => {
  const s = sizes[size];
  const textColor = variant === 'dark' ? 'text-ink' : 'text-cream';
  const subColor = variant === 'dark' ? 'text-body' : 'text-cream/70';

  return (
    <div className="flex items-center gap-3 select-none">
      <img
        src="/images/logo.jpeg"
        alt="K&L Pro-Finish Plastering LLC logo"
        className="rounded-full shrink-0 object-cover"
        style={{ width: s.badge, height: s.badge }}
      />
      <div className="flex flex-col leading-none">
        <span className={`font-serif font-bold tracking-wide text-gold ${s.kl} leading-tight`}>
          K&amp;L
        </span>
        <span className={`font-serif font-bold tracking-wide ${textColor} ${s.font} whitespace-nowrap mt-0.5`}>
          PRO-FINISH
        </span>
        <span className={`uppercase tracking-[0.2em] ${subColor} ${s.sub} mt-0.5 whitespace-nowrap`}>
          Plastering LLC
        </span>
      </div>
    </div>
  );
};

export default Logo;
