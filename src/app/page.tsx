import DailyQuestion from '@/features/questions/components/DailyQuestion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DailyQuestion />
      </div>
    </main>
  );
}