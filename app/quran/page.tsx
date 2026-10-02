export const dynamic = 'force-static';

export default function QuranPage() {
  return (
    <main className="w-full h-screen overflow-hidden bg-[var(--color-background)]">
      <iframe
        title="Quran reader"
        src="/quran/index.html?embedded=1"
        className="block w-full h-full border-0"
        loading="eager"
      />
    </main>
  );
}
