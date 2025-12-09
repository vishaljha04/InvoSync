import {
  BarChart2,
  FileText,
  LayoutDashboard,
  Mail,
  Plus,
  Sparkle,
  Users,
} from "lucide-react";

export const FEATURE = [
  {
    icon: Sparkle,
    title: "AI Invoice Creation",
    description:
      "Paste any text,email or recipt, and let our AI instantly generate a complete, professional invoice for you.",
  },
  {
    icon: BarChart2,
    title: "AI Powered Dashboard",
    description:
      "Get smart actionable insights about your business finances, generated automatically by our AI analyst.",
  },
  {
    icon: Mail,
    title: "Smart Reminders",
    description:
      "Automatically genrate polite and effective payment reminder emails for overdue invoices with a single click",
  },
  {
    icon: FileText,
    title: "Easy Invoice Management",
    description:
      "Easily manage all invoices, track payments, and send reminders for overdue payments.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Invosync has completely changed the way I handle client billing. I just paste my notes, and boom — a perfect invoice appears.",
    author: "Aarav Sharma",
    title: "Freelance UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=300&q=80",
  },
  {
    quote:
      "The AI dashboard gives me insights I never even thought to check. It feels like having a personal finance analyst.",
    author: "Mia Rodriguez",
    title: "Small Business Owner",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&q=80",
  },
  {
    quote:
      "Sending payment reminders used to be awkward. Now Invosync generates super polite emails automatically. Total lifesaver!",
    author: "Ethan Carter",
    title: "Freelance Developer",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=300&q=80",
  },
  {
    quote:
      "I manage multiple clients and projects, and Invosync keeps everything organized. The invoicing process has never been this smooth.",
    author: "Sofia Martins",
    title: "Content Creator & Marketing Strategist",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&q=80",
  },
  {
    quote:
      "The accuracy of the AI invoice generation is insane. It detects items from messy text better than I ever could.",
    author: "Leo Nguyen",
    title: "Startup Founder",
    avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=80",
  },
  {
    quote:
      "Invosync saves me hours every week. The AI-generated invoices look professional and the reminders help me get paid faster.",
    author: "Hannah Wilson",
    title: "Freelance Photographer",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
  },
];

export const FAQS = [
  {
    question: "What is Invosync?",
    answer:
      "Invosync is an AI-powered invoicing tool that helps you generate invoices, send payment reminders, and get smart financial insights automatically.",
  },
  {
    question: "Do I need to know anything about invoicing to use it?",
    answer:
      "Not at all! You can paste any text, email, or notes, and our AI will turn it into a complete invoice for you.",
  },
  {
    question: "Is Invosync free to use?",
    answer:
      "Yes! You can create invoices and use basic features for free. Advanced AI tools and analytics may require a premium plan.",
  },
  {
    question: "Can I manage multiple clients?",
    answer:
      "Absolutely. You can store unlimited clients, track invoices for each, and organize everything from one clean dashboard.",
  },
  {
    question: "Does Invosync send reminders automatically?",
    answer:
      "Yes! With one click, Invosync can generate polite, professional reminder emails for overdue payments.",
  },
  {
    question: "Is my data secure?",
    answer:
      "All your information is encrypted and stored securely. We do not share your invoices or client data with any third parties.",
  },
  {
    question: "Can I download my invoices as PDF?",
    answer:
      "Yes, every invoice can be exported as a clean, professional PDF ready to send to your clients.",
  },
];

export const NAVIGATION_MENU = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", name: "Invoices", icon: FileText },
  { id: "invoices/new", name: "Create Invoice", icon: Plus },
  { id: "profile", name: "Profile", icon: Users },
];
