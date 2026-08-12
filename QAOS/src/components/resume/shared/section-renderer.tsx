import { SectionShell } from "./section-shell";
import { NameBlock, TitleBlock, PhotoBlock, SummaryBlock, ContactBlock, SocialBlock } from "./section-blocks/header-blocks";
import { SkillsBlock, LanguagesBlock, InterestsBlock } from "./section-blocks/list-blocks";
import { ExperienceBlock, EducationBlock, ProjectsBlock } from "./section-blocks/timeline-blocks";
import { CertificationsBlock, AwardsBlock, PublicationsBlock, ReferencesBlock } from "./section-blocks/credential-blocks";
import { CustomBlock } from "./section-blocks/custom-block";
import type { ResumeSectionInstance, ResumeTheme } from "@/lib/resume/types";

/** Name/Title/Photo render bare (they compose the header zone) — everything else gets a labeled section shell. */
export const HEADER_ZONE_TYPES = ["name", "title", "photo"] as const;

export function SectionRenderer({ section, theme, photoUrl }: { section: ResumeSectionInstance; theme: ResumeTheme; photoUrl?: string | null }) {
  const { data } = section;
  let content: React.ReactNode;

  switch (data.type) {
    case "name":
      content = <NameBlock data={data} theme={theme} />;
      break;
    case "title":
      content = <TitleBlock data={data} theme={theme} />;
      break;
    case "photo":
      content = <PhotoBlock data={data} theme={theme} photoUrl={photoUrl} />;
      break;
    case "summary":
      content = <SummaryBlock data={data} theme={theme} />;
      break;
    case "contact":
      content = <ContactBlock data={data} theme={theme} />;
      break;
    case "social":
      content = <SocialBlock data={data} theme={theme} />;
      break;
    case "skills":
    case "technicalSkills":
    case "softSkills":
      content = <SkillsBlock data={data} theme={theme} />;
      break;
    case "experience":
      content = <ExperienceBlock data={data} theme={theme} />;
      break;
    case "education":
      content = <EducationBlock data={data} theme={theme} />;
      break;
    case "projects":
      content = <ProjectsBlock data={data} theme={theme} />;
      break;
    case "certifications":
      content = <CertificationsBlock data={data} theme={theme} />;
      break;
    case "awards":
      content = <AwardsBlock data={data} theme={theme} />;
      break;
    case "publications":
      content = <PublicationsBlock data={data} theme={theme} />;
      break;
    case "languages":
      content = <LanguagesBlock data={data} theme={theme} />;
      break;
    case "interests":
      content = <InterestsBlock data={data} theme={theme} />;
      break;
    case "references":
      content = <ReferencesBlock data={data} theme={theme} />;
      break;
    case "custom":
      content = <CustomBlock data={data} theme={theme} />;
      break;
  }

  if ((HEADER_ZONE_TYPES as readonly string[]).includes(section.type)) return content;
  return (
    <SectionShell section={section} theme={theme}>
      {content}
    </SectionShell>
  );
}
