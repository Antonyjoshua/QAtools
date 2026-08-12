import Link from "next/link";
import { ArrowLeft, Database, Webhook, Bug, ListChecks } from "lucide-react";
import { ALL_QUIZZES, EXERCISES, getModuleMeta } from "@/lib/learn/content/registry";

export default function PracticeZonePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Learn
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Practice Zone</h1>
      <p className="mt-1 text-muted-foreground">Hands-on practice — quizzes, playgrounds, and exercises with model solutions.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/learn/practice/sql" className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
          <Database className="size-5 text-primary" />
          <p className="font-medium group-hover:text-primary">SQL Playground</p>
          <p className="text-xs text-muted-foreground">A real in-browser SQLite database — practice queries with zero setup.</p>
        </Link>
        <Link href="/learn/practice/api" className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
          <Webhook className="size-5 text-primary" />
          <p className="font-medium group-hover:text-primary">API Playground</p>
          <p className="text-xs text-muted-foreground">Send real HTTP requests and inspect the response — a lightweight Postman.</p>
        </Link>
        <Link href="/learn/practice/exercises" className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
          <Bug className="size-5 text-primary" />
          <p className="font-medium group-hover:text-primary">Exercises</p>
          <p className="text-xs text-muted-foreground">{EXERCISES.length} bug-finding, test-case-writing, and automation challenges.</p>
        </Link>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold text-muted-foreground">Quizzes</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ALL_QUIZZES.map((quiz) => (
          <Link
            key={quiz.id}
            href={`/learn/quiz/${quiz.id}`}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
          >
            <ListChecks className="size-4.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium group-hover:text-primary">{quiz.title}</p>
              <p className="text-xs text-muted-foreground">
                {getModuleMeta(quiz.moduleId)?.title} · {quiz.questions.length} questions
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
