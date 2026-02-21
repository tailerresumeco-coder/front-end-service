import React, { useState } from 'react';

/**
 * FAQItem - Individual FAQ question/answer with expandable accordion and Schema.org markup
 */
const FAQItem = ({ question, answer, index, isOpen, onToggle }) => (
  <div 
    className="faq-item border-b border-gray-200 last:border-0"
    itemScope 
    itemProp="mainEntity" 
    itemType="https://schema.org/Question"
  >
    <button
      onClick={onToggle}
      className="w-full py-6 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors rounded-lg px-4"
      aria-expanded={isOpen}
      aria-controls={`faq-answer-${index}`}
    >
      <span className="flex-shrink-0 w-8 h-8 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center text-sm font-bold">
        {index + 1}
      </span>
      <span className="flex-1 pt-1">
        <h3 
          className="text-lg font-semibold text-gray-800 pr-8"
          itemProp="name"
        >
          {question}
        </h3>
      </span>
      <span className={`flex-shrink-0 w-6 h-6 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>
    <div 
      id={`faq-answer-${index}`}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      itemScope 
      itemProp="acceptedAnswer" 
      itemType="https://schema.org/Answer"
    >
      <div className="pl-12 pr-4 pb-6">
        <p 
          className="text-gray-600 leading-relaxed"
          itemProp="text"
        >
          {answer}
        </p>
      </div>
    </div>
  </div>
);

/**
 * FAQ - Main FAQ section component with FAQPage schema and accordion functionality
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {Array} props.faqs - Array of {question, answer} objects
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.allowMultipleOpen - Whether to allow multiple items open at once (default: true)
 */
const FAQ = ({ title = "Frequently Asked Questions", faqs = [], className = "", allowMultipleOpen = true }) => {
  const [openItems, setOpenItems] = useState([]);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  const handleToggle = (index) => {
    if (allowMultipleOpen) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      );
    }
  };

  const isItemOpen = (index) => openItems.includes(index);

  return (
    <section 
      className={`faq-section py-16 ${className}`}
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-7xl mx-auto px-8">
        <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
          {title}
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer}
              index={index}
              isOpen={isItemOpen(index)}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

// Default FAQ data for Tailor Resume - Concise answers under 60 words for AI citations
export const defaultFAQs = [
  {
    question: "How does AI resume tailoring work?",
    answer: "AI resume tailoring analyzes job descriptions and automatically adjusts your resume content, keywords, and formatting to match employer requirements while maintaining ATS compatibility."
  },
  {
    question: "Is Tailor Resume ATS-friendly?",
    answer: "Yes. Tailor Resume optimizes all resumes for Applicant Tracking Systems using proper formatting, relevant keywords, and clean structure without tables or graphics."
  },
  {
    question: "How long does it take to tailor a resume?",
    answer: "Our AI tailors resumes in under 30 seconds. Upload your resume, paste the job description, and receive an optimized version ready for application."
  },
  {
    question: "Can I tailor my resume for multiple jobs?",
    answer: "Yes. Create unlimited tailored versions for different job applications. Each version is saved and accessible from your account for easy management."
  },
  {
    question: "What file formats are supported?",
    answer: "Upload PDF, DOCX, or TXT files. Download tailored resumes in PDF or DOCX format for maximum compatibility with employer ATS systems."
  },
  {
    question: "Does Tailor Resume store my personal information?",
    answer: "Your data is encrypted and stored securely. You control deletion from account settings. We never share information with third parties."
  },
  {
    question: "How accurate is the AI tailoring?",
    answer: "Our AI achieves 95% accuracy in keyword matching, trained on thousands of successful resumes. The system continuously learns from successful applications."
  },
  {
    question: "Can I edit the AI-generated resume?",
    answer: "Yes. You have full editing control. The AI provides optimized suggestions, but you customize every section of your tailored resume."
  }
];
