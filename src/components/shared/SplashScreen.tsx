export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white"
    >
      <h1 className="text-4xl font-bold text-indigo-400">Habit Tracker</h1>
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  );
}
