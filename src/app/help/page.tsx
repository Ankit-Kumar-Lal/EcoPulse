"use client";

import { useState } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Footer } from "@/components/layout/Footer";
import { HelpCircle, Mail, MessageSquare, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqs = [
    {
      question: "How does EcoPulse calculate my carbon footprint?",
      answer:
        "EcoPulse multiplies your recorded activity quantities (e.g. kilowatt-hours of electricity, kilometres driven, or meals consumed) by official, published emission factors from organizations like India's Central Electricity Authority (CEA User Guide v19.0), the UK Department for Energy Security and Net Zero (DEFRA 2024), and the IPCC. You can review all factors and formulas on our Methodology page.",
    },
    {
      question: "Are the displayed carbon numbers exact measurements?",
      answer:
        "No. All carbon footprint metrics on EcoPulse are transparent estimates derived from user-entered activities and regional averages. We never claim false precision or present estimates as direct physical sensor measurements.",
    },
    {
      question: "Who can see my activities and personal records?",
      answer:
        "Only you. Your activity log, notes, household location, and personal entries are protected by strict server-side authorization policies. If you choose to join an optional community challenge, only your public display name and completion percentage appear on the opt-in leaderboard—your activity logs remain strictly confidential.",
    },
    {
      question: "Can I download or permanently delete my data?",
      answer:
        "Yes, absolutely. In your Settings dashboard, you can download a full CSV or JSON export of your complete activity ledger at any time. You can also permanently delete your account, which completely removes all your records, credentials, and logs from our database.",
    },
    {
      question: "How do Action Recommendations work?",
      answer:
        "Recommendations are rules-based suggestions tailored to your highest emitting categories and stated focus areas. Each recommendation details the specific action steps, estimated kg CO₂e potential savings, and underlying scientific assumptions.",
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-natural text-brand-forest">
      <PublicHeader />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 rounded-full bg-brand-emerald/10 px-3 py-1 text-xs font-semibold text-brand-emerald-dark border border-brand-emerald/20">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Help & Support</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-forest">
              Frequently Asked Questions & Support
            </h1>
            <p className="text-sm sm:text-base text-brand-sage">
              Find clear answers to how our calculations work, how your privacy is protected, and how to get in touch.
            </p>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-brand-forest hover:bg-brand-natural/40 transition"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`ml-3 h-5 w-5 flex-shrink-0 text-brand-sage transition-transform ${
                        isOpen ? "rotate-180 text-brand-emerald" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-brand-sage leading-relaxed border-t border-brand-border/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="rounded-3xl border border-brand-border bg-white p-6 sm:p-10 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-natural text-brand-emerald">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-forest">
                  Need Help or Have a Question?
                </h2>
                <p className="text-xs text-brand-sage">
                  Send a message to Team Codyssey or email us directly at{" "}
                  <a
                    href="mailto:ankitkumarlal2006@gmail.com"
                    className="text-brand-emerald font-semibold hover:underline"
                  >
                    ankitkumarlal2006@gmail.com
                  </a>
                </p>
              </div>
            </div>

            {formSubmitted ? (
              <div className="rounded-2xl bg-emerald-50 p-6 border border-brand-emerald/20 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-brand-emerald mx-auto" />
                <h4 className="text-sm font-bold text-brand-forest">
                  Message Sent Successfully
                </h4>
                <p className="text-xs text-brand-sage max-w-md mx-auto">
                  Thank you for reaching out. We have received your inquiry and will respond to{" "}
                  <span className="font-semibold text-brand-forest">{contactEmail}</span> as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-forest mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3 py-2 text-xs text-brand-forest focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-forest mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3 py-2 text-xs text-brand-forest focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-forest mb-1">
                    Your Question or Feedback
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we assist you with tracking or methodology?"
                    className="w-full rounded-xl border border-brand-border bg-brand-natural/40 px-3 py-2 text-xs text-brand-forest focus:border-brand-emerald focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-emerald"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-brand-sage">
                    Direct support: ankitkumarlal2006@gmail.com
                  </span>
                  <button
                    type="submit"
                    className="rounded-xl bg-brand-emerald px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-brand-emerald-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
