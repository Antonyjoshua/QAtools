"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Copy, ExternalLink, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updatePortfolioContent, renamePortfolio, duplicatePortfolio, togglePortfolioFavorite, switchPortfolioTemplate } from "@/lib/portfolio/repo/portfolios-repo";
import { PORTFOLIO_TEMPLATES } from "@/lib/portfolio/templates/registry";
import { GenericListEditor } from "@/components/resume/editor/section-forms/generic-list-editor";
import { ProfileForm } from "./section-forms/profile-form";
import { AboutForm } from "./section-forms/about-form";
import { SkillsForm } from "./section-forms/skills-form";
import { ExperienceForm } from "./section-forms/experience-form";
import { ProjectsForm } from "./section-forms/projects-form";
import { CertificationsForm } from "./section-forms/certifications-form";
import { uid } from "@/lib/portfolio/id";
import type { Portfolio, PortfolioContent } from "@/lib/portfolio/types";

export function PortfolioEditorShell({ portfolio }: { portfolio: Portfolio }) {
  const router = useRouter();
  const [name, setName] = React.useState(portfolio.name);

  React.useEffect(() => setName(portfolio.name), [portfolio.id, portfolio.name]);

  function patch(patch: Partial<PortfolioContent>) {
    void updatePortfolioContent(portfolio.id, { ...portfolio.content, ...patch });
  }

  async function commitName() {
    const trimmed = name.trim() || "Untitled Portfolio";
    if (trimmed !== portfolio.name) await renamePortfolio(portfolio.id, trimmed);
  }

  async function handleDuplicate() {
    const copy = await duplicatePortfolio(portfolio.id);
    if (copy) {
      toast.success("Portfolio duplicated");
      router.push(`/resume/portfolio/${copy.id}`);
    }
  }

  const { content } = portfolio;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2.5">
        <Link href="/resume/portfolio" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Portfolios
        </Link>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => void commitName()}
          className="h-8 min-w-40 flex-1 rounded-md border border-transparent bg-transparent px-2 text-sm font-semibold outline-none hover:border-input focus-visible:border-ring"
        />

        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="size-3.5 text-muted-foreground" />
          <Select value={portfolio.templateId} onValueChange={(v) => v && void switchPortfolioTemplate(portfolio.id, v as Portfolio["templateId"])}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue placeholder="Template">{(v: string) => PORTFOLIO_TEMPLATES.find((t) => t.id === v)?.name ?? v}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PORTFOLIO_TEMPLATES.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="size-8" aria-label="Toggle favorite" onClick={() => void togglePortfolioFavorite(portfolio.id)}>
            <Star className={cn("size-4", portfolio.favorite && "fill-yellow-400 text-yellow-500")} />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDuplicate}>
            <Copy className="size-3.5" />
            Duplicate
          </Button>
          <Button size="sm" className="gap-1.5" nativeButton={false} render={<Link href={`/resume/portfolio/${portfolio.id}/preview`} target="_blank" />}>
            <ExternalLink className="size-3.5" />
            Open live
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-[420px] shrink-0 overflow-y-auto border-r border-border p-3">
          <Accordion defaultValue={["profile"]}>
            <AccordionItem value="profile">
              <AccordionTrigger>Profile</AccordionTrigger>
              <AccordionContent>
                <ProfileForm portfolioId={portfolio.id} profile={content.profile} onChange={(profile) => patch({ profile })} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="about">
              <AccordionTrigger>About</AccordionTrigger>
              <AccordionContent>
                <AboutForm paragraphs={content.aboutParagraphs} onChange={(aboutParagraphs) => patch({ aboutParagraphs })} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stats">
              <AccordionTrigger>Stats</AccordionTrigger>
              <AccordionContent>
                <GenericListEditor
                  items={content.stats}
                  onChange={(stats) => patch({ stats })}
                  addLabel="Add stat"
                  makeBlank={() => ({ id: uid(), value: "", suffix: "", label: "" })}
                  fields={[
                    { key: "value", label: "Value" },
                    { key: "suffix", label: "Suffix" },
                    { key: "label", label: "Label", span: 2 },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="education">
              <AccordionTrigger>Education</AccordionTrigger>
              <AccordionContent>
                <GenericListEditor
                  items={content.education}
                  onChange={(education) => patch({ education })}
                  addLabel="Add education"
                  makeBlank={() => ({ id: uid(), degree: "", institution: "", status: "", note: "" })}
                  fields={[
                    { key: "degree", label: "Degree" },
                    { key: "institution", label: "Institution" },
                    { key: "status", label: "Status", placeholder: "e.g. Pursuing" },
                    { key: "note", label: "Note", placeholder: "e.g. 85%" },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contactDetails">
              <AccordionTrigger>Contact details</AccordionTrigger>
              <AccordionContent>
                <GenericListEditor
                  items={content.contactDetails}
                  onChange={(contactDetails) => patch({ contactDetails })}
                  addLabel="Add contact detail"
                  makeBlank={() => ({ id: uid(), label: "", value: "", link: "" })}
                  fields={[
                    { key: "label", label: "Label" },
                    { key: "value", label: "Value" },
                    { key: "link", label: "Link (optional)", span: 2 },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="passions">
              <AccordionTrigger>Passions</AccordionTrigger>
              <AccordionContent>
                <GenericListEditor
                  items={content.passions}
                  onChange={(passions) => patch({ passions })}
                  addLabel="Add passion"
                  makeBlank={() => ({ id: uid(), icon: "🚀", title: "", desc: "" })}
                  fields={[
                    { key: "icon", label: "Icon (emoji)" },
                    { key: "title", label: "Title" },
                    { key: "desc", label: "Description", span: 2 },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skills">
              <AccordionTrigger>Skills</AccordionTrigger>
              <AccordionContent>
                <SkillsForm items={content.skills} onChange={(skills) => patch({ skills })} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="experience">
              <AccordionTrigger>Experience</AccordionTrigger>
              <AccordionContent>
                <ExperienceForm items={content.experience} onChange={(experience) => patch({ experience })} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="projects">
              <AccordionTrigger>Projects</AccordionTrigger>
              <AccordionContent>
                <ProjectsForm items={content.projects} onChange={(projects) => patch({ projects })} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="certifications">
              <AccordionTrigger>Certifications</AccordionTrigger>
              <AccordionContent>
                <CertificationsForm items={content.certifications} onChange={(certifications) => patch({ certifications })} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="extras">
              <AccordionTrigger>Extras (AI Lab)</AccordionTrigger>
              <AccordionContent>
                <GenericListEditor
                  items={content.extras}
                  onChange={(extras) => patch({ extras })}
                  addLabel="Add extra"
                  makeBlank={() => ({ id: uid(), icon: "🤖", title: "", desc: "", tag: "Live" })}
                  fields={[
                    { key: "icon", label: "Icon (emoji)" },
                    { key: "tag", label: "Tag", placeholder: "e.g. Live, In Progress, Research" },
                    { key: "title", label: "Title", span: 2 },
                    { key: "desc", label: "Description", span: 2 },
                  ]}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        <main className="flex flex-1 items-center justify-center bg-muted/40 p-4">
          <iframe key={portfolio.id} src={`/resume/portfolio/${portfolio.id}/preview`} className="h-full w-full rounded-lg border border-border bg-background shadow-sm" title="Portfolio live preview" />
        </main>
      </div>
    </div>
  );
}
