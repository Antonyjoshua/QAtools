import type { GeneratorModule } from "../types";
import { faker } from "@faker-js/faker";

export const contentGenerators: GeneratorModule[] = [
  {
    slug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    category: "content",
    description: "Generate placeholder words, sentences, or paragraphs for layout and copy testing.",
    outputKind: "text",
    supportsBulk: true,
    defaultCount: 5,
    options: [
      {
        key: "unit",
        label: "Unit",
        type: "select",
        options: [
          { label: "Words", value: "words" },
          { label: "Sentences", value: "sentences" },
          { label: "Paragraphs", value: "paragraphs" },
        ],
        default: "paragraphs",
      },
    ],
    generate: (ctx) => {
      const unit = String(ctx.options.unit ?? "paragraphs");
      if (unit === "words") return faker.lorem.words({ min: 1, max: 3 });
      if (unit === "sentences") return faker.lorem.sentence();
      return faker.lorem.paragraph();
    },
  },
];
