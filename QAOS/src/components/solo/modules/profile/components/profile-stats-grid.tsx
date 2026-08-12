"use client";

import { Bug, FileText, Bot, Plug, Award, Briefcase, GraduationCap, MessageSquareText } from "lucide-react";
import { StatTile } from "@/components/solo/shared/stat-tile";
import { useAppStore } from "@/lib/solo/store/useAppStore";

export function ProfileStatsGrid() {
  const stats = useAppStore((s) => s.profile.stats);

  const tiles = [
    { icon: Bug, label: "Bugs Reported", value: stats.bugsReported },
    { icon: FileText, label: "Test Cases Written", value: stats.testCasesWritten },
    { icon: Bot, label: "Automation Scripts", value: stats.automationScripts },
    { icon: Plug, label: "APIs Tested", value: stats.apisTested },
    { icon: Award, label: "Certifications", value: stats.certifications },
    { icon: Briefcase, label: "Projects", value: stats.projects },
    { icon: GraduationCap, label: "Courses Completed", value: stats.coursesCompleted },
    { icon: MessageSquareText, label: "Interview Qs Solved", value: stats.interviewQuestionsSolved },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {tiles.map((tile) => (
        <StatTile key={tile.label} icon={tile.icon} label={tile.label} value={tile.value} />
      ))}
    </div>
  );
}
