import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/learn/content/registry";
import { ArticleView } from "@/components/learn/article/article-view";

export default async function ArticlePage({ params }: { params: Promise<{ moduleId: string; slug: string }> }) {
  const { moduleId, slug } = await params;
  const article = getArticleBySlug(moduleId, slug);
  if (!article) notFound();

  return <ArticleView article={article} />;
}
