"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Star, MoreHorizontal, Copy, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getTemplate } from "@/lib/portfolio/templates/registry";
import { duplicatePortfolio, deletePortfolio, togglePortfolioFavorite } from "@/lib/portfolio/repo/portfolios-repo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Portfolio } from "@/lib/portfolio/types";

export function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const template = getTemplate(portfolio.templateId);

  async function handleDuplicate(e: React.MouseEvent) {
    e.preventDefault();
    const copy = await duplicatePortfolio(portfolio.id);
    if (copy) toast.success("Portfolio duplicated");
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!window.confirm(`Delete "${portfolio.name}"? This cannot be undone.`)) return;
    await deletePortfolio(portfolio.id);
    toast.success("Portfolio deleted");
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <Link href={`/resume/portfolio/${portfolio.id}`} className="flex h-24 items-center justify-center" style={{ background: template?.gradient ?? "linear-gradient(135deg,#1e293b,#0f172a)" }}>
        <span className="text-xs font-medium text-white/80">{template?.name ?? portfolio.templateId}</span>
      </Link>
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{portfolio.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Edited {formatDistanceToNow(portfolio.updatedAt, { addSuffix: true })}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label={portfolio.favorite ? "Remove favorite" : "Add favorite"}
            onClick={(e) => {
              e.preventDefault();
              void togglePortfolioFavorite(portfolio.id);
            }}
          >
            <Star className={cn("size-3.5", portfolio.favorite && "fill-yellow-400 text-yellow-500")} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="size-7" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={<Link href={`/resume/portfolio/${portfolio.id}/preview`} target="_blank" />}
              >
                <ExternalLink className="size-3.5" />
                Open live
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="size-3.5" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <Trash2 className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
