import Link from 'next/link';
import { getAllQuestions } from '@/src/features/questions/queries';
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';

export default async function QuestionsPage() {
  const questions = await getAllQuestions();

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Questions</h1>
        {questions.length === 0 ? (
          <p className="text-center text-muted-foreground">No questions available.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q) => (
              <li key={q.id}>
                <Link href={`/questions/${q.id}`}>
                  <Card className="hover:bg-accent transition-colors">
                    <CardHeader>
                      <CardTitle className="text-xl">{q.text}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Posted on {new Date(q.display_date).toLocaleDateString()}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}