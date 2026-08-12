"use client";

import * as React from "react";
import Link from "next/link";
import { Bookmark, CheckCircle2, Clock, ThumbsUp, ThumbsDown, AlertTriangle, Lightbulb, ListChecks, Layers, MessageSquare, ArrowLeft } from "lucide-react";
import { CodeBlock } from "./code-block";
import { MermaidDiagram } from "./mermaid-diagram";
import { TableOfContents } from "./table-of-contents";
import { ReadingProgressBar } from "./reading-progress-bar";
import { useArticleProgress } from "@/lib/learn/hooks/use-article-progress";
import { useLearnSettings } from "@/lib/learn/settings-store";
import { awardXp } from "@/lib/learn/gamification/award-xp";
import { XP_REWARDS } from "@/lib/learn/gamification/levels";
import { getModuleMeta, getInterviewQuestion } from "@/lib/learn/content/registry";
import { PersistedTextarea } from "@/components/learn/shared/persisted-textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/learn/content/types";

function Section({ id, title, icon: Icon, children }: { id: string; title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-6 first:border-0 first:pt-0">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold tracking-tight">
        <Icon className="size-4.5 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ArticleView({ article }: { article: Article }) {
  const { progress, toggleBookmark, setNotes, markComplete } = useArticleProgress(article.id);
  const recordRecentArticle = useLearnSettings((s) => s.recordRecentArticle);
  const [completing, setCompleting] = React.useState(false);

  React.useEffect(() => {
    recordRecentArticle(article.id);
  }, [article.id, recordRecentArticle]);

  const moduleMeta = getModuleMeta(article.moduleId);

  async function handleMarkComplete() {
    if (progress?.completed || completing) return;
    setCompleting(true);
    try {
      await markComplete();
      await awardXp(XP_REWARDS.articleCompleted, `completed "${article.title}"`);
    } finally {
      setCompleting(false);
    }
  }

  const sections: { id: string; label: string }[] = [
    { id: "definition", label: "Definition" },
    { id: "explanation", label: "Explanation" },
    ...(article.examples.length ? [{ id: "examples", label: "Examples" }] : []),
    ...(article.advantages.length || article.disadvantages.length ? [{ id: "pros-cons", label: "Pros & Cons" }] : []),
    ...(article.diagrams.length ? [{ id: "diagrams", label: "Diagrams" }] : []),
    ...(article.commonMistakes.length ? [{ id: "mistakes", label: "Common Mistakes" }] : []),
    ...(article.bestPractices.length ? [{ id: "best-practices", label: "Best Practices" }] : []),
    { id: "summary", label: "Summary" },
    ...(article.references.length ? [{ id: "references", label: "References" }] : []),
    ...(article.interviewQuestionIds.length || article.quizId || article.flashcardSetId ? [{ id: "practice", label: "Practice This Topic" }] : []),
  ];

  return (
    <>
      <ReadingProgressBar />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_200px] lg:px-8">
        <div className="min-w-0">
          <Link href={`/learn/${article.moduleId}`} className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            {moduleMeta?.title ?? article.moduleId}
          </Link>

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{moduleMeta?.title}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {article.readingTimeMin} min read
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance">{article.title}</h1>
          <p className="mt-2 text-muted-foreground">{article.summary}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant={progress?.bookmarked ? "secondary" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => void toggleBookmark()}
            >
              <Bookmark className={cn("size-3.5", progress?.bookmarked && "fill-current")} />
              {progress?.bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            <Button
              variant={progress?.completed ? "secondary" : "default"}
              size="sm"
              className="gap-1.5"
              disabled={progress?.completed || completing}
              onClick={() => void handleMarkComplete()}
            >
              <CheckCircle2 className="size-3.5" />
              {progress?.completed ? "Completed" : `Mark as complete (+${XP_REWARDS.articleCompleted} XP)`}
            </Button>
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <Section id="definition" title="Definition" icon={Lightbulb}>
              <p className="leading-relaxed text-foreground">{article.definition}</p>
            </Section>

            <Section id="explanation" title="Explanation" icon={Lightbulb}>
              <div className="flex flex-col gap-3">
                {article.explanation.map((p, i) => (
                  <p key={i} className="leading-relaxed text-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </Section>

            {article.examples.length > 0 && (
              <Section id="examples" title="Examples" icon={ListChecks}>
                {article.examples.map((ex, i) => (
                  <CodeBlock key={i} language={ex.language} code={ex.code} caption={ex.caption} />
                ))}
              </Section>
            )}

            {(article.advantages.length > 0 || article.disadvantages.length > 0) && (
              <Section id="pros-cons" title="Pros & Cons" icon={ThumbsUp}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {article.advantages.length > 0 && (
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-success">
                        <ThumbsUp className="size-3.5" /> Advantages
                      </p>
                      <ul className="flex flex-col gap-1.5 text-sm">
                        {article.advantages.map((a, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-success">+</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {article.disadvantages.length > 0 && (
                    <div>
                      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-destructive">
                        <ThumbsDown className="size-3.5" /> Disadvantages
                      </p>
                      <ul className="flex flex-col gap-1.5 text-sm">
                        {article.disadvantages.map((a, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-destructive">−</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {article.diagrams.length > 0 && (
              <Section id="diagrams" title="Diagrams" icon={Layers}>
                {article.diagrams.map((d, i) => (
                  <MermaidDiagram key={i} title={d.title} code={d.code} />
                ))}
              </Section>
            )}

            {article.commonMistakes.length > 0 && (
              <Section id="mistakes" title="Common Mistakes" icon={AlertTriangle}>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {article.commonMistakes.map((m, i) => (
                    <li key={i} className="flex gap-2">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                      {m}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {article.bestPractices.length > 0 && (
              <Section id="best-practices" title="Best Practices" icon={CheckCircle2}>
                <ul className="flex flex-col gap-1.5 text-sm">
                  {article.bestPractices.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            <Section id="summary" title="Summary" icon={ListChecks}>
              <ul className="flex flex-col gap-1.5 text-sm">
                {article.summaryPoints.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Section>

            {article.references.length > 0 && (
              <Section id="references" title="References" icon={Lightbulb}>
                <ul className="flex flex-col gap-1 text-sm">
                  {article.references.map((r) => (
                    <li key={r.url}>
                      <a href={r.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        {r.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {(article.interviewQuestionIds.length > 0 || article.quizId || article.flashcardSetId) && (
              <Section id="practice" title="Practice This Topic" icon={MessageSquare}>
                <div className="flex flex-wrap gap-2">
                  {article.quizId && (
                    <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/learn/quiz/${article.quizId}`} />}>
                      Take the quiz
                    </Button>
                  )}
                  {article.flashcardSetId && (
                    <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/learn/flashcards/${article.flashcardSetId}`} />}>
                      Review flashcards
                    </Button>
                  )}
                  {article.interviewQuestionIds.length > 0 && (
                    <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/learn/interview-prep" />}>
                      Related interview questions
                    </Button>
                  )}
                </div>
                {article.interviewQuestionIds.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
                    {article.interviewQuestionIds.map((id) => {
                      const q = getInterviewQuestion(id);
                      return q ? <li key={id}>• {q.question}</li> : null;
                    })}
                  </ul>
                )}
              </Section>
            )}

            <section className="border-t border-border pt-6">
              <h2 className="mb-2 text-sm font-semibold">Your notes</h2>
              {progress === undefined ? (
                <Textarea disabled placeholder="Loading…" rows={4} className="text-sm" />
              ) : (
                <PersistedTextarea
                  key={article.id}
                  initialValue={progress.notes}
                  onSave={(v) => void setNotes(v)}
                  placeholder="Jot down anything worth remembering about this topic…"
                  rows={4}
                  className="text-sm"
                />
              )}
              {progress?.notes && <p className="mt-1 text-xs text-muted-foreground">Saved automatically as you type.</p>}
            </section>
          </div>
        </div>

        <aside className="hidden lg:block">
          <TableOfContents items={sections} />
        </aside>
      </div>
    </>
  );
}
