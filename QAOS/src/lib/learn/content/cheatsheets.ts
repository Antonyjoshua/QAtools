import type { CheatSheet } from "./types";

export const CHEAT_SHEETS: CheatSheet[] = [
  {
    id: "cheat-sql",
    title: "SQL",
    description: "Core syntax for querying and joining relational data.",
    sections: [
      {
        heading: "Basic queries",
        items: [
          { term: "SELECT col1, col2 FROM table;", description: "Retrieve specific columns." },
          { term: "SELECT * FROM table WHERE col = 'x';", description: "Filter rows." },
          { term: "SELECT DISTINCT col FROM table;", description: "Unique values only." },
          { term: "ORDER BY col DESC", description: "Sort results, descending." },
          { term: "LIMIT 10", description: "Cap the number of rows returned." },
        ],
      },
      {
        heading: "Joins",
        items: [
          { term: "INNER JOIN", description: "Rows with matches in both tables." },
          { term: "LEFT JOIN", description: "All rows from the left table, NULLs where no match." },
          { term: "RIGHT JOIN", description: "All rows from the right table, NULLs where no match." },
          { term: "FULL OUTER JOIN", description: "All rows from both tables." },
        ],
      },
      {
        heading: "Aggregation",
        items: [
          { term: "GROUP BY col", description: "Group rows sharing a value." },
          { term: "HAVING COUNT(*) > 1", description: "Filter groups (WHERE runs before grouping, HAVING after)." },
          { term: "COUNT(), SUM(), AVG(), MIN(), MAX()", description: "Common aggregate functions." },
        ],
      },
      {
        heading: "Modifying data",
        items: [
          { term: "INSERT INTO t (a,b) VALUES (1,2);", description: "Add a row." },
          { term: "UPDATE t SET a=1 WHERE id=5;", description: "Modify rows — always filter with WHERE." },
          { term: "DELETE FROM t WHERE id=5;", description: "Remove rows — always filter with WHERE." },
        ],
      },
    ],
  },
  {
    id: "cheat-git",
    title: "Git",
    description: "Everyday commands for branching, committing, and syncing.",
    sections: [
      {
        heading: "Basics",
        items: [
          { term: "git status", description: "See staged/unstaged/untracked changes." },
          { term: "git add <file>", description: "Stage a file for commit." },
          { term: "git commit -m \"message\"", description: "Commit staged changes." },
          { term: "git log --oneline", description: "Compact commit history." },
        ],
      },
      {
        heading: "Branching",
        items: [
          { term: "git branch <name>", description: "Create a branch." },
          { term: "git checkout -b <name>", description: "Create and switch to a branch." },
          { term: "git merge <branch>", description: "Merge a branch into the current one." },
          { term: "git rebase <branch>", description: "Replay current commits on top of another branch." },
        ],
      },
      {
        heading: "Remote & sync",
        items: [
          { term: "git pull", description: "Fetch and merge from the remote." },
          { term: "git push", description: "Push commits to the remote." },
          { term: "git fetch", description: "Download remote changes without merging." },
        ],
      },
      {
        heading: "Undoing things",
        items: [
          { term: "git restore <file>", description: "Discard unstaged changes to a file." },
          { term: "git reset --soft HEAD~1", description: "Undo the last commit, keep changes staged." },
          { term: "git stash", description: "Shelve uncommitted changes temporarily." },
        ],
      },
    ],
  },
  {
    id: "cheat-linux",
    title: "Linux",
    description: "Shell commands testers use most: navigating, inspecting, and managing processes.",
    sections: [
      {
        heading: "Navigation & files",
        items: [
          { term: "ls -la", description: "List files, including hidden ones, with details." },
          { term: "cd <path>", description: "Change directory." },
          { term: "pwd", description: "Print working directory." },
          { term: "cp / mv / rm", description: "Copy / move / delete files." },
          { term: "find . -name \"*.log\"", description: "Search for files by name." },
        ],
      },
      {
        heading: "Viewing content",
        items: [
          { term: "cat file", description: "Print entire file." },
          { term: "tail -f file", description: "Follow a growing file (great for live logs)." },
          { term: "grep -i \"error\" file", description: "Search text, case-insensitive." },
        ],
      },
      {
        heading: "Processes & permissions",
        items: [
          { term: "ps aux | grep node", description: "Find running processes." },
          { term: "kill -9 <pid>", description: "Force-kill a process." },
          { term: "chmod +x script.sh", description: "Make a file executable." },
        ],
      },
    ],
  },
  {
    id: "cheat-xpath",
    title: "XPath",
    description: "Locating elements in the DOM for automation.",
    sections: [
      {
        heading: "Basic paths",
        items: [
          { term: "//tag", description: "Any element anywhere in the document." },
          { term: "//tag[@attr='value']", description: "Element with a specific attribute value." },
          { term: "//tag[text()='Exact Text']", description: "Element with exact visible text." },
          { term: "//tag[contains(text(),'partial')]", description: "Element containing partial text." },
        ],
      },
      {
        heading: "Relationships",
        items: [
          { term: "//parent/child", description: "Direct child." },
          { term: "//ancestor//descendant", description: "Any descendant, any depth." },
          { term: "//tag/following-sibling::tag2", description: "Sibling that comes after." },
          { term: "//tag/parent::div", description: "Parent element." },
        ],
      },
      {
        heading: "Combining conditions",
        items: [
          { term: "//input[@type='text' and @name='email']", description: "Multiple attribute conditions." },
          { term: "(//tag)[2]", description: "The 2nd matching element (1-indexed)." },
          { term: "//tag[last()]", description: "The last matching element." },
        ],
      },
    ],
  },
  {
    id: "cheat-css-selectors",
    title: "CSS Selectors",
    description: "The faster, more readable alternative to XPath for most locators.",
    sections: [
      {
        heading: "Basics",
        items: [
          { term: ".class", description: "Elements with a given class." },
          { term: "#id", description: "Element with a given id." },
          { term: "tag", description: "All elements of a tag type." },
          { term: "[attr='value']", description: "Elements with a specific attribute value." },
        ],
      },
      {
        heading: "Combinators",
        items: [
          { term: "parent > child", description: "Direct child only." },
          { term: "ancestor descendant", description: "Any descendant, any depth." },
          { term: "elem + sibling", description: "Immediately following sibling." },
          { term: "elem ~ sibling", description: "Any following sibling." },
        ],
      },
      {
        heading: "Pseudo-classes",
        items: [
          { term: ":nth-child(2)", description: "The 2nd child of its parent." },
          { term: ":first-child / :last-child", description: "First or last child element." },
          { term: ":not(.disabled)", description: "Excludes elements matching the inner selector." },
        ],
      },
    ],
  },
  {
    id: "cheat-http-status",
    title: "HTTP Status Codes",
    description: "What each status range means, and the codes you'll see most.",
    sections: [
      {
        heading: "2xx — Success",
        items: [
          { term: "200 OK", description: "Standard success response." },
          { term: "201 Created", description: "A new resource was created." },
          { term: "204 No Content", description: "Success, but no body to return." },
        ],
      },
      {
        heading: "3xx — Redirection",
        items: [
          { term: "301 Moved Permanently", description: "Resource has a new permanent URL." },
          { term: "304 Not Modified", description: "Cached version is still valid." },
        ],
      },
      {
        heading: "4xx — Client error",
        items: [
          { term: "400 Bad Request", description: "Malformed request syntax or invalid data." },
          { term: "401 Unauthorized", description: "Authentication missing or invalid." },
          { term: "403 Forbidden", description: "Authenticated, but not allowed to access this." },
          { term: "404 Not Found", description: "Resource doesn't exist at this URL." },
          { term: "409 Conflict", description: "Request conflicts with current server state." },
          { term: "422 Unprocessable Entity", description: "Well-formed request, but semantically invalid." },
          { term: "429 Too Many Requests", description: "Rate limit exceeded." },
        ],
      },
      {
        heading: "5xx — Server error",
        items: [
          { term: "500 Internal Server Error", description: "Unexpected server-side failure." },
          { term: "502 Bad Gateway", description: "Upstream server returned an invalid response." },
          { term: "503 Service Unavailable", description: "Server temporarily overloaded or down for maintenance." },
        ],
      },
    ],
  },
  {
    id: "cheat-playwright",
    title: "Playwright",
    description: "Common locators, actions, and assertions.",
    sections: [
      {
        heading: "Locators",
        items: [
          { term: "page.getByRole('button', { name: 'Submit' })", description: "Locate by accessible role — the recommended default." },
          { term: "page.getByText('Welcome')", description: "Locate by visible text." },
          { term: "page.getByLabel('Email')", description: "Locate a form control by its label." },
          { term: "page.locator('.card').first()", description: "Locate by CSS, take the first match." },
        ],
      },
      {
        heading: "Actions",
        items: [
          { term: "await locator.click();", description: "Click, with auto-waiting for actionability." },
          { term: "await locator.fill('text');", description: "Clear and type into a field." },
          { term: "await page.goto(url);", description: "Navigate to a URL." },
        ],
      },
      {
        heading: "Assertions",
        items: [
          { term: "await expect(locator).toBeVisible();", description: "Auto-retrying visibility assertion." },
          { term: "await expect(locator).toHaveText('x');", description: "Assert exact text content." },
          { term: "await expect(page).toHaveURL(/dashboard/);", description: "Assert the current URL." },
        ],
      },
    ],
  },
  {
    id: "cheat-selenium",
    title: "Selenium",
    description: "WebDriver essentials for Java/Python-style automation.",
    sections: [
      {
        heading: "Locating elements",
        items: [
          { term: "driver.findElement(By.id(\"x\"))", description: "Find by id." },
          { term: "driver.findElement(By.cssSelector(\".x\"))", description: "Find by CSS selector." },
          { term: "driver.findElement(By.xpath(\"//x\"))", description: "Find by XPath." },
        ],
      },
      {
        heading: "Waits",
        items: [
          { term: "driver.manage().timeouts().implicitlyWait(...)", description: "Global wait for element lookups." },
          { term: "new WebDriverWait(driver, timeout)", description: "Explicit wait for a specific condition." },
          { term: "ExpectedConditions.elementToBeClickable(x)", description: "Common explicit-wait condition." },
        ],
      },
      {
        heading: "Interactions",
        items: [
          { term: "element.click(); element.sendKeys(\"x\");", description: "Click and type." },
          { term: "new Actions(driver).moveToElement(x).perform();", description: "Hover / complex interactions." },
        ],
      },
    ],
  },
  {
    id: "cheat-api-testing",
    title: "API Testing",
    description: "What to check on every endpoint, and common request patterns.",
    sections: [
      {
        heading: "What to verify",
        items: [
          { term: "Status code", description: "Matches the documented contract for this scenario." },
          { term: "Response schema", description: "Field names, types, and required-ness match the contract." },
          { term: "Response time", description: "Within an acceptable SLA for the endpoint." },
          { term: "Headers", description: "Content-Type, caching, and security headers are correct." },
        ],
      },
      {
        heading: "Cases to cover",
        items: [
          { term: "Happy path", description: "Valid request, valid auth, expected response." },
          { term: "Invalid input", description: "Missing/malformed fields return 400 with a useful message." },
          { term: "Auth failures", description: "Missing/expired/invalid token returns 401." },
          { term: "Authorization", description: "A valid user can't access another user's or admin-only data (403)." },
          { term: "Idempotency", description: "Repeating the same PUT/DELETE has the same effect as doing it once." },
        ],
      },
    ],
  },
  {
    id: "cheat-regex",
    title: "Regular Expressions",
    description: "The patterns you'll reach for constantly.",
    sections: [
      {
        heading: "Anchors & classes",
        items: [
          { term: "^ and $", description: "Start and end of string." },
          { term: "\\d, \\w, \\s", description: "Digit, word character, whitespace." },
          { term: "[abc], [^abc]", description: "Character set / negated set." },
        ],
      },
      {
        heading: "Quantifiers",
        items: [
          { term: "*, +, ?", description: "0-or-more, 1-or-more, 0-or-1." },
          { term: "{n,m}", description: "Between n and m repetitions." },
        ],
      },
      {
        heading: "Common patterns",
        items: [
          { term: "^[\\w.-]+@[\\w.-]+\\.\\w+$", description: "Basic email format check." },
          { term: "^\\d{4}-\\d{2}-\\d{2}$", description: "ISO date format (YYYY-MM-DD)." },
          { term: "(?<=prefix)value", description: "Lookbehind — match 'value' only after 'prefix'." },
        ],
      },
    ],
  },
];
