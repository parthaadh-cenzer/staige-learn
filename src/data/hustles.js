// 50 AI side hustle ideas. Bonus #2.
// path: A = Faceless Content, B = Digital Products, C = AI Services
export const hustleCategories = [
  { id: 'content', name: 'Content Businesses', tone: 'brand', path: 'A' },
  { id: 'products', name: 'Digital Products', tone: 'mint', path: 'B' },
  { id: 'services', name: 'AI Services', tone: 'sun', path: 'C' },
  { id: 'local', name: 'Local Business', tone: 'flamingo', path: 'C' },
  { id: 'hybrid', name: 'Hybrid Models', tone: 'sky2', path: 'B' },
]

const raw = {
  content: ['Football Content Brand', 'Travel Content Brand', 'AI News Page', 'Finance Content Page', 'Luxury Lifestyle Page', 'History Shorts Channel', 'Productivity Channel', 'Movie Breakdown Channel', 'Tech Review Channel', 'Startup Analysis Page'],
  products: ['Resume Templates', 'LinkedIn Templates', 'Notion Systems', 'Prompt Packs', 'Business Planners', 'Content Calendars', 'Fitness Trackers', 'Interview Preparation Kits', 'Career Toolkits', 'Marketing Templates'],
  services: ['LinkedIn Content Service', 'AI-Powered Blog Writing', 'Newsletter Creation', 'Social Media Management', 'Lead Generation', 'Competitor Research', 'Email Marketing Setup', 'Sales Outreach Assistance', 'CRM Cleanup', 'Customer Support Knowledge Bases'],
  local: ['Restaurant Content Packages', 'Gym Social Media Packages', 'Dentist Content Packages', 'Real Estate Content Systems', 'Salon Marketing Systems', 'Local Lead Generation', 'Google Business Profile Optimization', 'Review Generation Systems', 'Appointment Follow-Up Systems', 'Customer Reactivation Campaigns'],
  hybrid: ['Niche Newsletter', 'Paid Community', 'Membership Resource Hub', 'Industry Research Reports', 'AI Business Toolkit', 'Local Business Playbooks', 'Creator Resource Libraries', 'Coaching Resources', 'Industry Templates', 'Digital Asset Bundles'],
}

export const hustles = Object.entries(raw).flatMap(([category, names]) =>
  names.map((name, i) => ({ id: `${category}-${i}`, name, category }))
)
