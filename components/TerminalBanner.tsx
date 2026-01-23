'use client';

export function TerminalBanner() {
  const asciiArt = `
████████╗██████╗  █████╗ ██████╗ ███████╗ ██████╗ ██╗   ██╗████████╗     ██████╗ ██████╗ ██████╗ ██████╗ 
╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔═══██╗██║   ██║╚══██╔══╝    ██╔════╝██╔═══██╗██╔══██╗██╔══██╗
   ██║   ██████╔╝███████║██║  ██║█████╗  ██║   ██║██║   ██║   ██║       ██║     ██║   ██║██████╔╝██████╔╝
   ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝  ██║   ██║██║   ██║   ██║       ██║     ██║   ██║██╔══██╗██╔═══╝ 
   ██║   ██║  ██║██║  ██║██████╔╝███████╗╚██████╔╝╚██████╔╝   ██║       ╚██████╗╚██████╔╝██║  ██║██║     
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝    ╚═╝        ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝     
`.trim();

  const lines = asciiArt.split('\n');

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 flex items-start justify-center pt-4 md:pt-8">
      <pre 
        className="font-mono text-[0.3rem] xs:text-[0.4rem] sm:text-[0.5rem] md:text-[0.65rem] lg:text-[0.75rem] xl:text-[0.85rem] leading-none tracking-tight text-center text-black/20 select-none"
      >
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </div>
  );
}
