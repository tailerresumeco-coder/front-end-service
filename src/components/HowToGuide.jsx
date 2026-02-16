import React from 'react';

/**
 * HowToStep - Individual step with Schema.org markup
 */
const HowToStep = ({ step, index, totalSteps }) => (
  <div 
    className="howto-step relative pl-12 pb-8 last:pb-0"
    itemProp="step" 
    itemScope 
    itemType="https://schema.org/HowToStep"
  >
    {/* Step number/connector */}
    <div className="absolute left-0 top-0 flex flex-col items-center">
      <div 
        className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg"
        itemProp="position"
      >
        {index + 1}
      </div>
      {index < totalSteps - 1 && (
        <div className="w-0.5 h-full bg-brand-primary/30 mt-2"></div>
      )}
    </div>

    {/* Step content */}
    <div className="bg-surface-dark/50 rounded-lg shadow-md p-6 border-l-4 border-brand-primary">
      <h3 
        className="text-xl font-bold text-text-primary mb-3"
        itemProp="name"
      >
        {step.name}
      </h3>
      <p 
        className="text-text-secondary leading-relaxed"
        itemProp="text"
      >
        {step.text}
      </p>

      {step.url && (
        <meta itemProp="url" content={step.url} />
      )}
      {step.image && (
        <figure className="mt-4">
          <img 
            src={step.image} 
            alt={step.name}
            className="rounded-lg w-full max-w-md"
            loading="lazy"
            itemProp="image"
          />
        </figure>
      )}
    </div>
  </div>
);

/**
 * HowToGuide - Main HowTo component with Schema.org markup
 * @param {Object} props
 * @param {string} props.name - Guide title
 * @param {string} props.description - Guide description
 * @param {string} props.totalTime - ISO 8601 duration (e.g., "PT5M")
 * @param {Array} props.steps - Array of {name, text, url, image} objects
 * @param {string} props.className - Additional CSS classes
 */
const HowToGuide = ({ 
  name, 
  description, 
  totalTime = "PT5M", 
  steps = [], 
  className = "" 
}) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <section 
      className={`howto-section py-16 ${className}`}
      itemScope 
      itemType="https://schema.org/HowTo"
    >
      <div className="max-w-7xl mx-auto px-8">

        {/* HowTo header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold text-text-primary mb-4"
            itemProp="name"
          >
            {name}
          </h2>
          <p 
            className="text-text-secondary text-lg max-w-2xl mx-auto"
            itemProp="description"
          >
            {description}
          </p>

          <meta itemProp="totalTime" content={totalTime} />
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-text-muted bg-surface-dark/50 px-4 py-2 rounded-full">

            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Estimated time: {totalTime.replace('PT', '').replace('M', ' minutes').replace('H', ' hours')}</span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, index) => (
            <HowToStep 
              key={index}
              step={step}
              index={index}
              totalSteps={steps.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToGuide;

// Default HowTo data for resume tailoring
export const resumeTailoringSteps = [
  {
    name: "Upload Your Resume",
    text: "Upload your existing resume in PDF, DOCX, or TXT format to the Tailer Resume platform. Our system will parse and analyze your current experience, skills, and qualifications.",
    url: "https://tailerresume.com/tailor-resume"
  },
  {
    name: "Paste Job Description",
    text: "Copy and paste the complete job description from the job posting you want to apply for. Include all requirements, responsibilities, and qualifications listed by the employer.",
    url: "https://tailerresume.com/tailor-resume"
  },
  {
    name: "AI Analysis",
    text: "Our AI analyzes the job requirements and identifies key skills, keywords, and qualifications needed. It compares these against your resume to find optimization opportunities.",
    url: "https://tailerresume.com/tailor-resume"
  },

  {
    name: "Review Tailored Resume",
    text: "Review the AI-tailored resume with optimized keywords and restructured content highlighting your relevant experience. Compare before and after versions to see the improvements.",
    url: "https://tailerresume.com/resume-builder"
  },
  {
    name: "Download and Apply",
    text: "Download your tailored resume in PDF or DOCX format and use it for your job application. Your optimized resume is now ready to pass ATS screening and impress recruiters.",
    url: "https://tailerresume.com/resume-builder"
  }
];
