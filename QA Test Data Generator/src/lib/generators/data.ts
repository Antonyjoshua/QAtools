/** Static reference datasets used across generator modules. */

export const COUNTRIES = [
  { code: "IN", name: "India", dial: "+91", currency: "INR" },
  { code: "US", name: "United States", dial: "+1", currency: "USD" },
  { code: "GB", name: "United Kingdom", dial: "+44", currency: "GBP" },
  { code: "CA", name: "Canada", dial: "+1", currency: "CAD" },
  { code: "AU", name: "Australia", dial: "+61", currency: "AUD" },
  { code: "DE", name: "Germany", dial: "+49", currency: "EUR" },
  { code: "FR", name: "France", dial: "+33", currency: "EUR" },
  { code: "SG", name: "Singapore", dial: "+65", currency: "SGD" },
  { code: "AE", name: "UAE", dial: "+971", currency: "AED" },
  { code: "JP", name: "Japan", dial: "+81", currency: "JPY" },
] as const;

export const INDIAN_STATES: { state: string; code: string; districts: string[] }[] = [
  { state: "Maharashtra", code: "27", districts: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"] },
  { state: "Delhi", code: "07", districts: ["New Delhi", "North Delhi", "South Delhi", "East Delhi"] },
  { state: "Karnataka", code: "29", districts: ["Bengaluru Urban", "Mysuru", "Mangaluru", "Hubballi"] },
  { state: "Tamil Nadu", code: "33", districts: ["Chennai", "Coimbatore", "Madurai", "Salem"] },
  { state: "Telangana", code: "36", districts: ["Hyderabad", "Warangal", "Nizamabad"] },
  { state: "West Bengal", code: "19", districts: ["Kolkata", "Howrah", "Darjeeling", "Siliguri"] },
  { state: "Gujarat", code: "24", districts: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"] },
  { state: "Rajasthan", code: "08", districts: ["Jaipur", "Jodhpur", "Udaipur", "Kota"] },
  { state: "Uttar Pradesh", code: "09", districts: ["Lucknow", "Kanpur", "Noida", "Varanasi", "Agra"] },
  { state: "Kerala", code: "32", districts: ["Thiruvananthapuram", "Kochi", "Kozhikode"] },
  { state: "Punjab", code: "03", districts: ["Chandigarh", "Ludhiana", "Amritsar"] },
  { state: "Haryana", code: "06", districts: ["Gurugram", "Faridabad", "Panipat"] },
];

export const INDIAN_BANKS = [
  { name: "State Bank of India", ifsc: "SBIN" },
  { name: "HDFC Bank", ifsc: "HDFC" },
  { name: "ICICI Bank", ifsc: "ICIC" },
  { name: "Axis Bank", ifsc: "UTIB" },
  { name: "Punjab National Bank", ifsc: "PUNB" },
  { name: "Bank of Baroda", ifsc: "BARB" },
  { name: "Kotak Mahindra Bank", ifsc: "KKBK" },
  { name: "Yes Bank", ifsc: "YESB" },
  { name: "IndusInd Bank", ifsc: "INDB" },
  { name: "Canara Bank", ifsc: "CNRB" },
];

export const INDIAN_FIRST_NAMES_M = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Reyansh", "Krishna", "Ishaan", "Rohan", "Karan", "Rahul", "Amit", "Sanjay", "Rajesh", "Suresh"];
export const INDIAN_FIRST_NAMES_F = ["Ananya", "Diya", "Saanvi", "Aadhya", "Ira", "Myra", "Priya", "Neha", "Pooja", "Kavya", "Sneha", "Anjali", "Divya", "Meera", "Riya"];
export const INDIAN_LAST_NAMES = ["Sharma", "Verma", "Patel", "Gupta", "Iyer", "Nair", "Reddy", "Rao", "Singh", "Kumar", "Mehta", "Joshi", "Chatterjee", "Bose", "Menon"];

export const WORLD_FIRST_NAMES_M = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Daniel", "Matthew", "Liam", "Noah", "Ethan", "Mason"];
export const WORLD_FIRST_NAMES_F = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Emma", "Olivia", "Ava", "Sophia", "Isabella"];
export const WORLD_LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas"];

export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  IN: ["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"],
  US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Francisco", "Seattle", "Austin"],
  GB: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol"],
  CA: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
  AU: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  DE: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
  FR: ["Paris", "Lyon", "Marseille", "Toulouse"],
  SG: ["Singapore"],
  AE: ["Dubai", "Abu Dhabi", "Sharjah"],
  JP: ["Tokyo", "Osaka", "Yokohama", "Nagoya"],
};

export const COMPANY_SUFFIXES = ["Technologies", "Solutions", "Systems", "Labs", "Industries", "Global", "Networks", "Digital", "Ventures", "Group"];
export const COMPANY_ROOTS = ["Nova", "Zenith", "Quantum", "Apex", "Vertex", "Orbit", "Pixel", "Astra", "Nimbus", "Horizon", "Catalyst", "Fusion", "Summit", "Beacon"];

export const JOB_TITLES = ["Software Engineer", "QA Engineer", "Product Manager", "Data Analyst", "DevOps Engineer", "UX Designer", "Business Analyst", "Project Manager", "SDET", "Solutions Architect", "Marketing Manager", "HR Specialist", "Sales Executive", "Customer Success Manager", "Financial Analyst"];

export const DEPARTMENTS = ["Engineering", "Quality Assurance", "Product", "Design", "Marketing", "Sales", "Human Resources", "Finance", "Customer Support", "Operations"];

export const UNIVERSITIES = ["Indian Institute of Technology, Bombay", "University of Delhi", "Anna University", "State University", "National Institute of Technology", "University of California", "Stanford University", "University of Manchester"];

export const DEGREES = ["B.Tech", "B.Sc", "B.Com", "M.Tech", "M.Sc", "MBA", "BCA", "MCA", "Ph.D"];

export const SKILLS_POOL = ["JavaScript", "TypeScript", "Python", "Java", "React", "Node.js", "SQL", "AWS", "Docker", "Kubernetes", "Selenium", "Cypress", "Playwright", "Jira", "Postman", "Git", "REST APIs", "GraphQL", "CI/CD", "Agile/Scrum"];

export const PRODUCT_ADJECTIVES = ["Premium", "Wireless", "Portable", "Smart", "Ultra", "Compact", "Eco", "Pro", "Classic", "Advanced"];
export const PRODUCT_NOUNS = ["Headphones", "Backpack", "Water Bottle", "Desk Lamp", "Keyboard", "Mouse", "Sneakers", "Watch", "Speaker", "Charger", "Notebook", "Chair", "Monitor", "Camera"];
export const PRODUCT_CATEGORIES = ["Electronics", "Fashion", "Home & Kitchen", "Sports", "Books", "Beauty", "Toys", "Automotive", "Grocery", "Office Supplies"];

export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "SGD"];

export const ANDROID_DEVICES = [
  { model: "Samsung Galaxy S24 Ultra", vendor: "Samsung" },
  { model: "Samsung Galaxy A55", vendor: "Samsung" },
  { model: "Google Pixel 8 Pro", vendor: "Google" },
  { model: "Google Pixel 7a", vendor: "Google" },
  { model: "OnePlus 12", vendor: "OnePlus" },
  { model: "Xiaomi 14", vendor: "Xiaomi" },
  { model: "Redmi Note 13 Pro", vendor: "Xiaomi" },
  { model: "OPPO Reno 11", vendor: "OPPO" },
  { model: "Vivo V29", vendor: "Vivo" },
  { model: "Motorola Edge 40", vendor: "Motorola" },
];

export const IOS_DEVICES = [
  "iPhone 15 Pro Max",
  "iPhone 15",
  "iPhone 14 Pro",
  "iPhone 13",
  "iPhone SE (3rd generation)",
  "iPad Pro 12.9-inch",
  "iPad Air (5th generation)",
  "iPad mini (6th generation)",
];

export const ANDROID_VERSIONS = ["10", "11", "12", "13", "14", "15"];
export const IOS_VERSIONS = ["15.8", "16.7", "17.0", "17.4", "17.5", "18.0", "18.1"];

export const SCREEN_SIZES = [
  { label: "iPhone SE", width: 375, height: 667 },
  { label: "iPhone 15", width: 393, height: 852 },
  { label: "iPhone 15 Pro Max", width: 430, height: 932 },
  { label: "Pixel 8", width: 412, height: 915 },
  { label: "Galaxy S24", width: 384, height: 854 },
  { label: "iPad Air", width: 820, height: 1180 },
  { label: "Desktop HD", width: 1366, height: 768 },
  { label: "Desktop Full HD", width: 1920, height: 1080 },
  { label: "4K Display", width: 3840, height: 2160 },
];

export const BROWSERS = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];

export const XSS_PAYLOADS = [
  "<script>alert('XSS')</script>",
  "<img src=x onerror=alert(1)>",
  "\"><script>alert(document.cookie)</script>",
  "<svg onload=alert('xss')>",
  "javascript:alert('XSS')",
  "<body onload=alert('XSS')>",
  "'-alert(1)-'",
  "<iframe src=\"javascript:alert('XSS')\"></iframe>",
];

export const SQLI_PAYLOADS = [
  "' OR '1'='1",
  "' OR '1'='1' --",
  "'; DROP TABLE users; --",
  "' UNION SELECT NULL,NULL,NULL --",
  "admin'--",
  "1' AND SLEEP(5)--",
  "' OR 1=1#",
  "\" OR \"\"=\"",
];

export const UNICODE_SAMPLES = ["こんにちは世界", "مرحبا بالعالم", "Привет мир", "你好世界", "Γειά σου Κόσμε", "안녕하세요 세계", "สวัสดีชาวโลก", "​Zero​Width​Space", "İstanbul", "café résumé naïve"];

export const EMOJI_SAMPLES = ["😀😃😄😁😆", "🚀🔥💯✅❌", "🐛🧪🔍📊💻", "👨‍👩‍👧‍👦", "🏳️‍🌈", "🇮🇳🇺🇸🇬🇧", "❤️‍🔥", "👍🏽"];

export const SPECIAL_CHAR_SAMPLES = ["!@#$%^&*()_+-=[]{}|;:',.<>/?`~", "\\n\\t\\r\\0", "±§€£¥©®™", "<<>>&&||", "\"'`´¨"];
