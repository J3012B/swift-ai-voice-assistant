import Image from "next/image";

type Props = {
  competitorName: string;
  competitorLogoPath: string;
};

/**
 * "TTYC vs Competitor" logo lockup used at the top of every /vs/ page.
 * To add a new competitor: drop their logo in /public/logos/ and set logoPath
 * in competitors.tsx. This component handles the rest.
 */
export default function VsHero({ competitorName, competitorLogoPath }: Props) {
  return (
    <div className="flex items-center justify-center gap-5 mb-10">
      {/* TTYC logo */}
      <div className="w-20 h-20 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-center shadow-sm">
        <Image
          src="/icon.png"
          alt="Talk To Your Computer"
          width={48}
          height={48}
          className="rounded-xl"
        />
      </div>

      <span className="text-2xl font-bold text-neutral-300 dark:text-neutral-700 select-none">
        vs
      </span>

      {/* Competitor logo */}
      <div className="w-20 h-20 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-center shadow-sm">
        <Image
          src={competitorLogoPath}
          alt={competitorName}
          width={40}
          height={40}
          className="dark:invert opacity-75"
        />
      </div>
    </div>
  );
}
