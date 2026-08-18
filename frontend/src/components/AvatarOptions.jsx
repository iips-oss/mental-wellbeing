import React from "react";

/**
 * Predefined avatar options, built on the app's existing palette
 * (greens/coral/lime/cream used across Profile, Dashboard, and the
 * sidebar) plus a couple of harmonizing accent colors — dusty teal,
 * mustard, slate — so the set doesn't read as monotone while still
 * feeling like it belongs to the same visual family.
 *
 * Three families:
 *  - Nature/elemental, gender-neutral (sprout, sun, moon, breeze, leaf,
 *    droplet, star, cloud) — ties into the "Friend of the mind" branding
 *  - A wide range of character faces with varied hair, accessories
 *    (glasses, cap, bandana, flower, headband, mustache, beanie, bow)
 *    so there's genuine range from cute to masculine to feminine —
 *    nobody is labeled by gender, people just pick what they like
 *
 * Everything is inline SVG — no external image files, nothing to host,
 * nothing that can 404. Faces stay abstract (no skin-tone rendering) to
 * keep the flat, friendly illustration language consistent app-wide.
 */

const PALETTE = {
  green: "#386641",
  deepGreen: "#2A523D",
  lime: "#A7C957",
  coral: "#F48C6A",
  cream: "#FBEBC3",
  sage: "#9DB1A3",
  amber: "#F5A623",
  softGreen: "#E8F3EB",
  // harmonizing accents — muted/earthy, staying in the same green/amber/
  // coral family so nothing feels out of place
  teal: "#3E7C7B",
  mustard: "#C99A3A",
  slate: "#5B6B72",
};

// --- Nature / elemental, gender-neutral --------------------------------

const SproutIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M20 30V16" stroke={PALETTE.deepGreen} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M20 18c0-5 -5-8 -10-7 1 6 5 9 10 7z" fill={PALETTE.lime} />
    <path d="M20 20c0-6 6-9 11-8 -1 7 -6 10 -11 8z" fill={PALETTE.deepGreen} />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <circle cx="20" cy="20" r="8" fill={PALETTE.amber} />
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * Math.PI) / 4;
      const x1 = 20 + Math.cos(angle) * 12;
      const y1 = 20 + Math.sin(angle) * 12;
      const x2 = 20 + Math.cos(angle) * 16;
      const y2 = 20 + Math.sin(angle) * 16;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={PALETTE.amber} strokeWidth="2.5" strokeLinecap="round" />;
    })}
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M25 10a12 12 0 1 0 5 20 10 10 0 0 1 -5 -20z" fill={PALETTE.deepGreen} />
    <circle cx="16" cy="14" r="1.4" fill={PALETTE.cream} />
    <circle cx="12" cy="22" r="1" fill={PALETTE.cream} />
  </svg>
);

const BreezeIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M8 15h16a4 4 0 1 0 -4-4" stroke={PALETTE.green} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M8 21h20a4 4 0 1 1 -4 4" stroke={PALETTE.lime} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M8 27h13" stroke={PALETTE.green} strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const LeafIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M11 29C9 18 16 10 29 9c1 13-7 20-18 20z" fill={PALETTE.teal} />
    <path d="M12 28c4-8 9-12 15-15" stroke={PALETTE.deepGreen} strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
);

const DropletIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M20 9c5 7 9 12 9 17a9 9 0 1 1 -18 0c0-5 4-10 9-17z" fill={PALETTE.slate} />
    <path d="M15 25a5 5 0 0 0 5 5" stroke={PALETTE.cream} strokeWidth="1.6" strokeLinecap="round" fill="none" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path
      d="M20 8l3.4 8 8.6 0.6-6.6 5.6 2.2 8.4L20 26.2 12.4 30.6l2.2-8.4-6.6-5.6L16.6 16z"
      fill={PALETTE.mustard}
    />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path
      d="M12 25a5.5 5.5 0 0 1 1-11 7 7 0 0 1 13.4-2.2A6 6 0 0 1 28 24z"
      fill={PALETTE.sage}
    />
  </svg>
);

const MountainIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M6 27 15 13l6 8 3-4 10 14z" fill={PALETTE.deepGreen} />
    <path d="M12 20l3 3 2-2" stroke={PALETTE.cream} strokeWidth="1.4" strokeLinecap="round" fill="none" />
  </svg>
);
 
const FeatherIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M27 9c-9 1-16 8-17 17l6 6c9-1 16-8 17-17z" fill={PALETTE.teal} />
    <path d="M10 32l7-7" stroke={PALETTE.deepGreen} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17 15l6 6M14 20l6 6" stroke={PALETTE.cream} strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
  </svg>
);
 
const WaveIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M6 18c3-3 6-3 9 0s6 3 9 0 6-3 9 0" stroke={PALETTE.slate} strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <path d="M6 25c3-3 6-3 9 0s6 3 9 0 6-3 9 0" stroke={PALETTE.teal} strokeWidth="2.4" strokeLinecap="round" fill="none" />
  </svg>
);
 
const RainbowIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path d="M7 27a13 13 0 0 1 26 0" stroke={PALETTE.coral} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d="M11 27a9 9 0 0 1 18 0" stroke={PALETTE.amber} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    <path d="M15 27a5 5 0 0 1 10 0" stroke={PALETTE.lime} strokeWidth="2.6" fill="none" strokeLinecap="round" />
  </svg>
);
 
const SnowflakeIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    {Array.from({ length: 3 }).map((_, i) => {
      const angle = (i * Math.PI) / 3;
      const x1 = 20 - Math.cos(angle) * 11;
      const y1 = 20 - Math.sin(angle) * 11;
      const x2 = 20 + Math.cos(angle) * 11;
      const y2 = 20 + Math.sin(angle) * 11;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={PALETTE.slate} strokeWidth="2.2" strokeLinecap="round" />;
    })}
    <circle cx="20" cy="20" r="1.8" fill={PALETTE.teal} />
  </svg>
);
 
const HeartIcon = () => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <path
      d="M20 30c-9-6-13-11-13-16a7 7 0 0 1 13-3.5A7 7 0 0 1 33 14c0 5-4 10-13 16z"
      fill={PALETTE.coral}
    />
  </svg>
);

// --- Character avatars, simple flat style -------------------------------

const Face = ({ hair, hairColor = PALETTE.deepGreen, accessory, skin = PALETTE.cream }) => (
  <svg viewBox="0 0 40 40" className="w-full h-full">
    <circle cx="20" cy="21" r="10" fill={skin} />
    <circle cx="16.5" cy="20" r="1.2" fill={PALETTE.deepGreen} />
    <circle cx="23.5" cy="20" r="1.2" fill={PALETTE.deepGreen} />
    <path d="M16 25c1.5 1.5 6.5 1.5 8 0" stroke={PALETTE.deepGreen} strokeWidth="1.6" strokeLinecap="round" fill="none" />
    {hair(hairColor)}
    {accessory}
  </svg>
);

// hairstyles
const shortCrop = (c) => <path d="M9 18a11 11 0 0 1 22 0c-3-2-19-2-22 0z" fill={c} />;
const buzzcut = (c) => <path d="M10 16a10 10 0 0 1 20 0c-2-1-18-1-20 0z" fill={c} />;
const curls = (c) => (
  <>
    <circle cx="12" cy="14" r="3" fill={c} />
    <circle cx="17" cy="10" r="3.2" fill={c} />
    <circle cx="23" cy="10" r="3.2" fill={c} />
    <circle cx="28" cy="14" r="3" fill={c} />
    <path d="M10 17a10.5 10.5 0 0 1 20 0c-2-1.5-18-1.5-20 0z" fill={c} />
  </>
);
const ponytail = (c) => (
  <>
    <path d="M9 17a11 11 0 0 1 22 0c-3-2-19-2-22 0z" fill={c} />
    <path d="M30 14c3 1 4 5 2 8-1-2-2-5-2-8z" fill={c} />
  </>
);
const bunHair = (c) => (
  <>
    <path d="M9 17a11 11 0 0 1 22 0c-3-2-19-2-22 0z" fill={c} />
    <circle cx="20" cy="8" r="3.2" fill={c} />
  </>
);
const waves = (c) => (
  <path d="M8 19c0-7 5-11 12-11s12 4 12 11c-2-2-4 1-6-1s-3 2-6 0-4 2-6 0-4 2-6 1z" fill={c} />
);
const spiky = (c) => (
  <path
    d="M9 18l2-8 3 6 2-9 3 7 2-9 3 7 2-6 2 8c-4-2-15-2-19 0z"
    fill={c}
  />
);
const sidePart = (c) => (
  <path d="M9 17a11 11 0 0 1 22 0c-4-3-9 1-22 0z" fill={c} />
);
const pigtails = (c) => (
  <>
    <path d="M9 17a11 11 0 0 1 22 0c-3-2-19-2-22 0z" fill={c} />
    <circle cx="8" cy="20" r="3" fill={c} />
    <circle cx="32" cy="20" r="3" fill={c} />
  </>
);
const undercut = (c) => (
  <path d="M9 16a11 11 0 0 1 22 0c-2 0-3-2-3-4-3 3-13 3-16 0 0 2-1 4-3 4z" fill={c} />
);

// accessories (rendered on top of the face)
const glasses = (
  <>
    <circle cx="16.5" cy="20" r="3" fill="none" stroke={PALETTE.deepGreen} strokeWidth="1.3" />
    <circle cx="23.5" cy="20" r="3" fill="none" stroke={PALETTE.deepGreen} strokeWidth="1.3" />
    <line x1="19.5" y1="20" x2="20.5" y2="20" stroke={PALETTE.deepGreen} strokeWidth="1.3" />
  </>
);
const cap = (c) => (
  <>
    <path d="M9 16a11 11 0 0 1 22 0c-3-2-19-2-22 0z" fill={c} />
    <path d="M9 16c8-2.5 16-2.5 22 0-1-2-4-3-11-3s-10 1-11 3z" fill={c} />
    <rect x="18" y="10" width="4" height="2.5" rx="1" fill={c} />
  </>
);
const bandana = (c) => (
  <>
    <path d="M9 17a11 11 0 0 1 22 0c-3-2-19-2-22 0z" fill={c} />
    <path d="M14 13l3 4M26 13l-3 4" stroke={c} strokeWidth="2" strokeLinecap="round" />
    <circle cx="29" cy="17" r="1.6" fill={c} />
  </>
);
const headband = (accent) => (
  <rect x="9" y="15.5" width="22" height="2.4" rx="1.2" fill={accent} />
);
const flower = (accent) => (
  <g transform="translate(28,11)">
    <circle cx="0" cy="-2" r="1.6" fill={accent} />
    <circle cx="1.8" cy="0" r="1.6" fill={accent} />
    <circle cx="0" cy="2" r="1.6" fill={accent} />
    <circle cx="-1.8" cy="0" r="1.6" fill={accent} />
    <circle cx="0" cy="0" r="1.4" fill={PALETTE.deepGreen} />
  </g>
);
const mustache = (
  <path d="M15.5 24.5c1.5 1 2.5 1 4.5 1s3-0 4.5-1c-0.5 1.6-2 2.6-4.5 2.6s-4-1-4.5-2.6z" fill={PALETTE.slate} />
);
const beanie = (c) => (
  <>
    <path d="M9 17a11 11 0 0 1 22 0c-3-2-19-2-22 0z" fill={c} />
    <rect x="9" y="15.5" width="22" height="3" rx="1.5" fill={PALETTE.cream} opacity="0.5" />
    <circle cx="20" cy="8" r="2" fill={c} />
  </>
);
const bow = (accent) => (
  <g transform="translate(28,12)">
    <path d="M-3 0l-3-2v4z" fill={accent} />
    <path d="M3 0l3-2v4z" fill={accent} />
    <circle cx="0" cy="0" r="1.4" fill={accent} />
  </g>
);

// --- Public avatar catalog -----------------------------------------------

export const AVATAR_OPTIONS = [
  // -- Nature / elemental --
  { id: "sprout", label: "Sprout", bg: PALETTE.softGreen, render: SproutIcon },
  { id: "sun", label: "Sun", bg: "#FFF5E5", render: SunIcon },
  { id: "moon", label: "Moon", bg: PALETTE.sage + "33", render: MoonIcon },
  { id: "breeze", label: "Breeze", bg: "#F0EEFF", render: BreezeIcon },
  { id: "leaf", label: "Leaf", bg: "#E7F2F1", render: LeafIcon },
  { id: "droplet", label: "Droplet", bg: "#EAF0F1", render: DropletIcon },
  { id: "star", label: "Star", bg: "#FBF1DD", render: StarIcon },
  { id: "cloud", label: "Cloud", bg: "#F1EBF1", render: CloudIcon },
   { id: "mountain", label: "Mountain", bg: PALETTE.softGreen, render: MountainIcon },
  { id: "feather", label: "Feather", bg: "#E7F2F1", render: FeatherIcon },
  { id: "wave", label: "Wave", bg: "#EAF0F1", render: WaveIcon },
  { id: "rainbow", label: "Rainbow", bg: "#FFF5E5", render: RainbowIcon },
  { id: "snowflake", label: "Snowflake", bg: "#EAF0F1", render: SnowflakeIcon },
  { id: "heart", label: "Heart", bg: "#FFF5E5", render: HeartIcon },
  // -- Character faces --
  { id: "short-crop", label: "Short Crop", bg: PALETTE.softGreen, render: () => <Face hair={shortCrop} hairColor={PALETTE.deepGreen} /> },
  { id: "buzzcut", label: "Buzzcut", bg: "#FFF5E5", render: () => <Face hair={buzzcut} hairColor={PALETTE.amber} /> },
  { id: "curls", label: "Curls", bg: "#F0EEFF", render: () => <Face hair={curls} hairColor={PALETTE.coral} /> },
  { id: "ponytail", label: "Ponytail", bg: PALETTE.softGreen, render: () => <Face hair={ponytail} hairColor={PALETTE.deepGreen} /> },
  { id: "bun", label: "Bun", bg: "#FFF5E5", render: () => <Face hair={bunHair} hairColor={PALETTE.coral} /> },
  { id: "waves", label: "Waves", bg: PALETTE.sage + "33", render: () => <Face hair={waves} hairColor={PALETTE.amber} /> },
  
  { id: "side-part", label: "Side Part", bg: "#F0EEFF", render: () => <Face hair={sidePart} hairColor={PALETTE.deepGreen} /> },
  { id: "pigtails", label: "Pigtails", bg: "#FFF5E5", render: () => <Face hair={pigtails} hairColor={PALETTE.coral} /> },
  { id: "undercut", label: "Undercut", bg: "#EAF0F1", render: () => <Face hair={undercut} hairColor={PALETTE.slate} /> },

  // -- Character faces with accessories --
  { id: "specs", label: "Specs", bg: "#FBF1DD", render: () => <Face hair={shortCrop} hairColor={PALETTE.mustard} accessory={glasses} /> },
  { id: "cap", label: "Cap", bg: "#E8F3EB", render: () => <Face hair={cap} hairColor={PALETTE.green} /> },
  { id: "bandana", label: "Bandana", bg: "#FBEBC3", render: () => <Face hair={bandana} hairColor={PALETTE.coral} /> },
  { id: "headband", label: "Headband", bg: "#F0EEFF", render: () => <Face hair={waves} hairColor={PALETTE.deepGreen} accessory={headband(PALETTE.coral)} /> },
  { id: "flower-crown", label: "Flower Crown", bg: "#FFF5E5", render: () => <Face hair={curls} hairColor={PALETTE.amber} accessory={flower(PALETTE.coral)} /> },
  { id: "mustache", label: "Mustache", bg: PALETTE.sage + "33", render: () => <Face hair={sidePart} hairColor={PALETTE.slate} accessory={mustache} /> },
  { id: "beanie", label: "Beanie", bg: "#E7F2F1", render: () => <Face hair={beanie} hairColor={PALETTE.teal} /> }
];
  

export const getAvatarById = (id) => AVATAR_OPTIONS.find((a) => a.id === id) || null;

/** Renders one avatar (preset icon, or falls back to the name-initial circle
 * already used elsewhere in the app when no preset is selected). */
export const Avatar = ({ avatarId, fallbackInitial = "", size = 96, className = "" }) => {
  const preset = getAvatarById(avatarId);

  if (!preset) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-serif shadow-inner ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4, backgroundColor: PALETTE.softGreen, color: PALETTE.deepGreen }}
      >
        {fallbackInitial}
      </div>
    );
  }

  const Icon = preset.render;
  return (
    <div
      className={`rounded-full flex items-center justify-center shadow-inner p-3 ${className}`}
      style={{ width: size, height: size, backgroundColor: preset.bg }}
    >
      <Icon />
    </div>
  );
};

/** Grid picker — pass the currently selected id and an onSelect callback. */
export const AvatarPicker = ({ selectedId, onSelect }) => (
  <div className="grid grid-cols-5 gap-4 max-h-80 overflow-y-auto pr-1 py-1">
    {AVATAR_OPTIONS.map((opt) => {
      const isSelected = opt.id === selectedId;
      return (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          title={opt.label}
          className={`aspect-square justify-self-center rounded-full p-1 border-2 transition-transform ${
            isSelected ? "border-[#3A7654]" : "border-transparent hover:scale-105"
          }`}
        >
          <Avatar avatarId={opt.id} size={56} />
        </button>
      );
    })}
  </div>
);
