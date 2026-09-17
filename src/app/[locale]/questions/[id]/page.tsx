import { getQuestionById, getAnswersPage } from '@/src/features/questions/queries'
import AnswerList from '@/src/features/questions/components/AnswerList'
import AnswerForm from '@/src/features/questions/components/AnswerForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const question = await getQuestionById(id)
  const t = await getTranslations('Questions.Detail')

  if (!question) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-destructive">{t('notFound')}</p>
          <Button variant="link" asChild>
            <Link href="/questions">{t('back')}</Link>
          </Button>
        </div>
      </main>
    )
  }

  const { answers, hasMore } = await getAnswersPage(question.id, 0)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <Button variant="link" asChild className="p-0">
            <Link href="/questions">{t('back')}</Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{question.text}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('postedOn', { date: new Date(question.display_date).toLocaleDateString() })}
            </p>
          </CardHeader>
          <CardContent>
            <AnswerForm questionId={question.id} />
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4">{t('answersTitle')}</h2>
        <AnswerList questionId={question.id} initialAnswers={answers} initialHasMore={hasMore} />
      </div>
    </main>
  )
}