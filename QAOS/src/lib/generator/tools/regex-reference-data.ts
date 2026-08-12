export interface CheatSheetItem {
  token: string;
  meaning: string;
  example: string;
  qaUseCase: string;
}

export interface CheatSheetGroup {
  title: string;
  items: CheatSheetItem[];
}

export const CHEAT_SHEET: CheatSheetGroup[] = [
  {
    title: "Character Classes",
    items: [
      { token: ".", meaning: "Any character", example: "a.c → abc, a1c", qaUseCase: "Loosely match a single unknown character in log output." },
      { token: "\\d", meaning: "Digit", example: "\\d{4} → 1234", qaUseCase: "Validate numeric fields like PIN codes or quantities." },
      { token: "\\D", meaning: "Non-digit", example: "\\D+ → 'abc' in 'abc123'", qaUseCase: "Assert a field has no digits, e.g. a name field." },
      { token: "\\w", meaning: "Word character (A-Z a-z 0-9 _)", example: "\\w+ → 'user_01'", qaUseCase: "Match usernames, slugs, or identifiers." },
      { token: "\\W", meaning: "Non-word character", example: "\\W → '@', ' ', '-'", qaUseCase: "Detect stray punctuation or whitespace in an identifier." },
      { token: "\\s", meaning: "Whitespace", example: "\\s+ → the space in 'a b'", qaUseCase: "Normalize or detect spacing issues in test data." },
      { token: "\\S", meaning: "Non-whitespace", example: "\\S+ → 'hello' in 'hello world'", qaUseCase: "Split free-text input into tokens for comparison." },
    ],
  },
  {
    title: "Quantifiers",
    items: [
      { token: "*", meaning: "Zero or more", example: "ab*c → ac, abc, abbbc", qaUseCase: "Allow an optional repeated character in fuzzy matching." },
      { token: "+", meaning: "One or more", example: "ab+c → abc, abbbc (not ac)", qaUseCase: "Require at least one occurrence, e.g. one or more digits." },
      { token: "?", meaning: "Zero or one", example: "colou?r → color, colour", qaUseCase: "Support optional spelling/format variants." },
      { token: "{n}", meaning: "Exactly n", example: "\\d{4} → 1234", qaUseCase: "Enforce a fixed length field, like a 4-digit PIN." },
      { token: "{n,}", meaning: "n or more", example: "\\d{3,} → 123, 12345", qaUseCase: "Enforce a minimum length, like an 8+ char password." },
      { token: "{n,m}", meaning: "Between n and m", example: "\\d{2,4} → 12, 123, 1234", qaUseCase: "Enforce a length range, like a 2-4 digit code." },
    ],
  },
  {
    title: "Anchors",
    items: [
      { token: "^", meaning: "Start of string", example: "^Hi matches 'Hi there'", qaUseCase: "Ensure a field starts with a required prefix." },
      { token: "$", meaning: "End of string", example: "end$ matches 'the end'", qaUseCase: "Ensure a field ends with a required suffix, like a file extension." },
      { token: "\\b", meaning: "Word boundary", example: "\\bcat\\b matches 'a cat' not 'category'", qaUseCase: "Match a whole word only, avoiding partial-word false positives." },
    ],
  },
  {
    title: "Character Sets",
    items: [
      { token: "[abc]", meaning: "a, b, or c", example: "[abc] → a, b, c", qaUseCase: "Allow a short, explicit list of valid characters." },
      { token: "[a-z]", meaning: "a through z", example: "[a-z]+ → 'hello'", qaUseCase: "Enforce lowercase-only input." },
      { token: "[0-9]", meaning: "0 through 9", example: "[0-9]{3} → 123", qaUseCase: "Equivalent to \\d — enforce digits explicitly." },
      { token: "[^abc]", meaning: "Anything except a, b, c", example: "[^abc] → x, 1, ' '", qaUseCase: "Reject specific disallowed characters." },
    ],
  },
  {
    title: "Groups",
    items: [
      { token: "(abc)", meaning: "Capture group", example: "(\\d{4})-(\\d{2}) → captures year and month", qaUseCase: "Extract specific fields from a matched string, e.g. in test data parsing." },
      { token: "(?:abc)", meaning: "Non-capturing group", example: "(?:\\d{1,3}\\.){3} → groups without capturing", qaUseCase: "Apply a quantifier to a sequence without cluttering capture results." },
      { token: "(?<name>)", meaning: "Named capture group", example: "(?<year>\\d{4}) → captures as 'year'", qaUseCase: "Make replacements/extractions self-documenting in test scripts." },
    ],
  },
  {
    title: "Operators",
    items: [{ token: "|", meaning: "OR", example: "cat|dog matches 'cat' or 'dog'", qaUseCase: "Accept multiple valid formats, e.g. 'yes|no|maybe'." }],
  },
  {
    title: "Escape",
    items: [{ token: "\\", meaning: "Escape special character", example: "\\. matches a literal '.'", qaUseCase: "Match literal punctuation like '.', '$', or '('." }],
  },
];

export interface CommonPattern {
  id: string;
  name: string;
  icon: string;
  pattern: string;
  flags: string;
  explanation: string;
  positiveSamples: string[];
  negativeSamples: string[];
}

export const COMMON_QA_PATTERNS: CommonPattern[] = [
  {
    id: "email",
    name: "Email Validation",
    icon: "Mail",
    pattern: "^[\\w.+-]+@[\\w-]+\\.[A-Za-z]{2,}$",
    flags: "",
    explanation: "Validates a standard email address: a local part, an @ symbol, and a domain with a valid extension.",
    positiveSamples: ["john@gmail.com", "john.doe@example.com", "test+qa@gmail.com"],
    negativeSamples: ["johngmail.com", "john@", "@gmail.com"],
  },
  {
    id: "phone",
    name: "Phone Number",
    icon: "Phone",
    pattern: "^\\+?1?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$",
    flags: "",
    explanation: "Validates common US-style phone number formats, with or without parentheses, dashes/dots, or a leading country code.",
    positiveSamples: ["123-456-7890", "(123) 456-7890", "+11234567890"],
    negativeSamples: ["12345", "123-456-789", "abc-456-7890"],
  },
  {
    id: "username",
    name: "Username",
    icon: "User",
    pattern: "^[a-zA-Z0-9_]{3,16}$",
    flags: "",
    explanation: "Validates a username of 3 to 16 characters using only letters, digits, and underscores.",
    positiveSamples: ["john_doe", "QA_tester1", "usr"],
    negativeSamples: ["jo", "invalid username", "toolongusernamethatexceedslimit"],
  },
  {
    id: "password",
    name: "Password",
    icon: "Lock",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
    flags: "",
    explanation: "Validates a password of at least 8 characters that contains a lowercase letter, an uppercase letter, and a digit.",
    positiveSamples: ["Passw0rd", "Str0ngPass123", "Qatest2026"],
    negativeSamples: ["password", "PASSWORD1", "short1A"],
  },
  {
    id: "pin",
    name: "PIN Code",
    icon: "KeyRound",
    pattern: "^\\d{4,6}$",
    flags: "",
    explanation: "Validates a numeric PIN of 4 to 6 digits.",
    positiveSamples: ["1234", "123456", "0000"],
    negativeSamples: ["12a4", "123", "1234567"],
  },
  {
    id: "url",
    name: "URL",
    icon: "Link2",
    pattern: "^https?:\\/\\/[\\w.-]+\\.[a-zA-Z]{2,}(\\/\\S*)?$",
    flags: "",
    explanation: "Validates an http/https URL with a domain and an optional path or query string.",
    positiveSamples: ["https://quangrade.dev", "http://example.com/path", "https://sub.example.co.in/page?x=1"],
    negativeSamples: ["ftp://example.com", "www.example.com", "https://"],
  },
  {
    id: "ipv4",
    name: "IPv4 Address",
    icon: "Network",
    pattern: "^(?:(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|1?\\d?\\d)$",
    flags: "",
    explanation: "Validates an IPv4 address where each of the 4 dot-separated octets is between 0 and 255.",
    positiveSamples: ["192.168.1.1", "255.255.255.255", "0.0.0.0"],
    negativeSamples: ["256.1.1.1", "192.168.1", "192.168.1.1.1"],
  },
  {
    id: "isoDate",
    name: "Date",
    icon: "Calendar",
    pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$",
    flags: "",
    explanation: "Validates a date in ISO format (YYYY-MM-DD) with a valid month (01-12) and day (01-31). It doesn't check real calendar validity (e.g. Feb 30).",
    positiveSamples: ["2026-08-11", "1999-12-31", "2024-02-29"],
    negativeSamples: ["2026-13-01", "2026-00-15", "26-08-11"],
  },
  {
    id: "time",
    name: "Time",
    icon: "Clock",
    pattern: "^([01]\\d|2[0-3]):[0-5]\\d$",
    flags: "",
    explanation: "Validates a 24-hour time in HH:MM format.",
    positiveSamples: ["09:30", "23:59", "00:00"],
    negativeSamples: ["24:00", "9:30", "12:60"],
  },
  {
    id: "postalCode",
    name: "Postal Code",
    icon: "MapPin",
    pattern: "^\\d{5}(-\\d{4})?$",
    flags: "",
    explanation: "Validates a US ZIP code, with an optional 4-digit ZIP+4 extension.",
    positiveSamples: ["12345", "12345-6789", "00501"],
    negativeSamples: ["1234", "ABCDE", "12345-67"],
  },
  {
    id: "uuid",
    name: "UUID",
    icon: "Fingerprint",
    pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
    flags: "",
    explanation: "Validates a standard 8-4-4-4-12 hexadecimal UUID.",
    positiveSamples: ["550e8400-e29b-41d4-a716-446655440000", "123e4567-e89b-12d3-a456-426614174000", "00000000-0000-0000-0000-000000000000"],
    negativeSamples: ["550e8400-e29b-41d4-a716", "not-a-uuid-at-all-xxxxx", "550e8400e29b41d4a716446655440000"],
  },
  {
    id: "creditCard",
    name: "Credit Card Format",
    icon: "CreditCard",
    pattern: "^\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}$",
    flags: "",
    explanation: "Validates a 16-digit card number, optionally grouped in 4s with spaces or dashes. Format only — not a Luhn checksum validation.",
    positiveSamples: ["4111111111111111", "4111-1111-1111-1111", "4111 1111 1111 1111"],
    negativeSamples: ["4111111111", "4111-1111-1111", "4111a1111b1111c1111"],
  },
  {
    id: "alphanumeric",
    name: "Alphanumeric",
    icon: "Binary",
    pattern: "^[a-zA-Z0-9]+$",
    flags: "",
    explanation: "Validates a value containing only letters and digits, with nothing else.",
    positiveSamples: ["Test123", "QA2026", "abcXYZ"],
    negativeSamples: ["Test 123", "Test-123", "Test_123"],
  },
  {
    id: "onlyNumbers",
    name: "Only Numbers",
    icon: "Hash",
    pattern: "^\\d+$",
    flags: "",
    explanation: "Validates a value containing only digits.",
    positiveSamples: ["123456", "0", "000123"],
    negativeSamples: ["123.45", "12a34", "-123"],
  },
  {
    id: "onlyLetters",
    name: "Only Letters",
    icon: "CaseSensitive",
    pattern: "^[a-zA-Z]+$",
    flags: "",
    explanation: "Validates a value containing only letters (no digits, spaces, or symbols).",
    positiveSamples: ["QAEngineer", "test", "ABC"],
    negativeSamples: ["Test123", "Test Case", "Test-Case"],
  },
];
