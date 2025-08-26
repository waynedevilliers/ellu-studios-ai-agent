export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          AI Agent
        </h1>
        <p className="text-sm text-center sm:text-left">
          Production-ready AI Agent using Claude API
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ready to build your AI agent
          </p>
        </div>
      </main>
    </div>
  );
}