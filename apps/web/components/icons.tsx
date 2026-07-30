import type { ReactElement, SVGProps } from "react";
import type { PackageIcon, PrincipleIcon } from "../content";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function Svg({ size = 24, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Standard CSS frames the character: two corner marks around an em box. */
function StandardsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M3.5 8.5v-5h5" />
      <path d="M20.5 15.5v5h-5" />
      <rect x="8.25" y="8.25" width="7.5" height="7.5" rx="2" opacity="0.55" />
    </Svg>
  );
}

/** Only the missing part of the frame is supplied by the fallback. */
function FallbackIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 20.5H7.5a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4H12"
        opacity="0.45"
      />
      <path d="M12 3.5h4.5a4 4 0 0 1 4 4V12" />
      <path d="M20.5 15v5.5H15" opacity="0.45" />
      <path d="M12 8.75v6.5" opacity="0.35" />
    </Svg>
  );
}

/** One policy carried across DOM, React and MDX. */
function LayersIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 3.25 20.75 7.5 12 11.75 3.25 7.5z" />
      <path d="M3.25 12 12 16.25 20.75 12" opacity="0.6" />
      <path d="M3.25 16.5 12 20.75l8.75-4.25" opacity="0.35" />
    </Svg>
  );
}

const principleIcons: Record<PrincipleIcon, (props: IconProps) => ReactElement> =
  {
    standards: StandardsIcon,
    fallback: FallbackIcon,
    layers: LayersIcon
  };

export function PrincipleGlyph({
  name,
  ...props
}: IconProps & { name: PrincipleIcon }) {
  const Glyph = principleIcons[name];
  return <Glyph {...props} />;
}

/** The brand bracket, used for the integrated package. */
function BracketIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 17V8.5A2.5 2.5 0 0 1 8.5 6H18" strokeWidth={1.7} />
    </Svg>
  );
}

function BracesIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.5 4.5c-2 0-2.5 1-2.5 2.7v1.9c0 1.6-.6 2.4-2 2.9 1.4.5 2 1.3 2 2.9v1.9c0 1.7.5 2.7 2.5 2.7" />
      <path d="M14.5 4.5c2 0 2.5 1 2.5 2.7v1.9c0 1.6.6 2.4 2 2.9-1.4.5-2 1.3-2 2.9v1.9c0 1.7-.5 2.7-2.5 2.7" />
    </Svg>
  );
}

function TreeIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="5" r="2.1" />
      <circle cx="5.5" cy="19" r="2.1" />
      <circle cx="18.5" cy="19" r="2.1" />
      <path d="M12 7.1v3.4M5.5 16.9v-2.3h13v2.3" />
    </Svg>
  );
}

function AtomIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="1.9" />
      <ellipse cx="12" cy="12" rx="9" ry="4" />
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
      <ellipse
        cx="12"
        cy="12"
        rx="9"
        ry="4"
        transform="rotate(120 12 12)"
        opacity="0.55"
      />
    </Svg>
  );
}

function MarkdownIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="3" opacity="0.5" />
      <path d="M7.5 15.5v-7l2.6 3 2.6-3v7" />
      <path d="M16.5 8.5v7M16.5 15.5l-1.6-1.8M16.5 15.5l1.6-1.8" />
    </Svg>
  );
}

const packageIcons: Record<PackageIcon, (props: IconProps) => ReactElement> = {
  mojikumi: BracketIcon,
  css: BracesIcon,
  dom: TreeIcon,
  react: AtomIcon,
  rehype: MarkdownIcon
};

export function PackageGlyph({
  name,
  ...props
}: IconProps & { name: PackageIcon }) {
  const Glyph = packageIcons[name];
  return <Glyph {...props} />;
}

export function BranchIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <circle cx="7" cy="5.5" r="2.2" />
      <circle cx="7" cy="18.5" r="2.2" />
      <circle cx="17" cy="9.5" r="2.2" />
      <path d="M7 7.7v8.6M17 11.7c0 3-2.4 4.6-6.2 4.9" />
    </Svg>
  );
}

export function PackageBoxIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <path d="M12 3.4 20 7.6v8.8L12 20.6 4 16.4V7.6z" />
      <path d="M4 7.6l8 4.2 8-4.2M12 11.8v8.8" opacity="0.55" />
    </Svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.6} {...props}>
      <path d="M4 7.5h16M4 12h16M4 16.5h16" />
    </Svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.6} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Svg strokeWidth={1.5} {...props}>
      <path d="M4.5 12h15M14 6.5l5.5 5.5L14 17.5" />
    </Svg>
  );
}
