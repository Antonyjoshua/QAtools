import { MISSIONS } from "@/lib/playground/bug-hunter/missions-seed";
import { REQUIREMENTS } from "@/lib/playground/testcase-lab/requirements-seed";
import { CHALLENGES } from "@/lib/playground/manual-testing/challenges-seed";

interface Row {
  key: string;
  title: string;
  category: string;
  difficulty: string;
  xp: string;
}

export function ChallengeCatalogTable() {
  const rows: Row[] = [
    ...MISSIONS.map((m) => ({
      key: `mission-${m.id}`,
      title: m.title,
      category: "Bug Hunter Mission",
      difficulty: m.difficulty,
      xp: "20-50 per bug",
    })),
    ...REQUIREMENTS.map((r) => ({
      key: `req-${r.id}`,
      title: r.title,
      category: "Test Case Lab Requirement",
      difficulty: r.difficulty,
      xp: "15 per test case",
    })),
    ...CHALLENGES.map((c) => ({
      key: `challenge-${c.id}`,
      title: c.title,
      category: c.technique,
      difficulty: c.difficulty,
      xp: String(c.xp),
    })),
  ];

  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">
        {rows.length} total missions, requirements, and challenges across the playground.
      </p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground">
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">XP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-border last:border-0">
                <td className="p-2">{r.title}</td>
                <td className="p-2 text-muted-foreground">{r.category}</td>
                <td className="p-2">{r.difficulty}</td>
                <td className="p-2">{r.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
