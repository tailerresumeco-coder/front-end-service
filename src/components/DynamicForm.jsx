import React, { useMemo, useCallback, useState } from "react";
import { ChevronDown, User, BookOpen, Briefcase, FolderOpen, Award, Medal, Globe } from 'lucide-react';

import { FIELD_CONFIG, TEMPLATE_SECTIONS } from "../config/FieldConfig";

/**
 * FIXED Production-ready DynamicForm component
 * - Fixed cross symbol (delete) functionality
 * - Added explicit Save button for nested sections
 * - Better path traversal for deep nesting
 * - Modern styling with section icons and chevron indicators
 */

// Map section keys to icons
const SECTION_ICONS = {
  personalDetails: User,
  education: BookOpen,
  experience: Briefcase,
  projects: FolderOpen,
  certifications: Award,
  skills: Award,
  internships: Briefcase,
  awards: Medal,
  languages: Globe,
};


export default function DynamicForm({
  data,
  onChange,
  path = "",
  sectionKey = null,
  onSave = null
}) {
  const [editingPath, setEditingPath] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [unsavedSections, setUnsavedSections] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set(TEMPLATE_SECTIONS.map(s => s.key)));

  if (!data || typeof data !== 'object') {
    return null;
  }

  const getValueAtPath = useCallback((obj, pathStr) => {
    if (!pathStr) return obj;
    const parts = pathStr.split('.');
    let current = obj;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return undefined;
      }
    }
    return current;
  }, []);

  const setValueAtPath = useCallback((obj, pathStr, value) => {
    if (!pathStr) return { ...obj, ...value };
    
    const parts = pathStr.split('.');
    const lastPart = parts.pop();
    let current = obj;
    const result = JSON.parse(JSON.stringify(obj));
    let resultCurrent = result;

    for (const part of parts) {
      if (!(part in resultCurrent)) {
        resultCurrent[part] = {};
      }
      resultCurrent = resultCurrent[part];
    }

    resultCurrent[lastPart] = value;
    return result;
  }, []);

  const getFieldConfig = useCallback((key, sectionKey) => {
    try {
      if (!FIELD_CONFIG || typeof FIELD_CONFIG !== 'object') {
        return null;
      }
      const section = FIELD_CONFIG[sectionKey];
      if (section?.fields && typeof section.fields === 'object') {
        return section.fields[key] || null;
      }
      return null;
    } catch (error) {
      console.error("Error getting field config:", error);
      return null;
    }
  }, []);

  const renderInput = useCallback((fieldConfig, value, path) => {
    try {
      const safeValue = value === null || value === undefined ? "" : String(value);

      if (!fieldConfig) {
        return (
          <input
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
            value={safeValue}
            onChange={(e) => onChange(path, e.target.value)}
            aria-label={path.split('.').pop() || "input"}
          />
        );
      }

      const { type, readOnly, placeholder } = fieldConfig;

      if (readOnly) {
        return (
          <div 
            className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-gray-700 border border-gray-300 text-sm font-medium"
            role="status"
            aria-label={`Read-only: ${safeValue}`}
          >
            {safeValue}
          </div>
        );
      }

      switch (type) {
        case "email":
          return (
            <input
              type="email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              value={safeValue}
              placeholder={placeholder || "email@example.com"}
              onChange={(e) => onChange(path, e.target.value)}
              aria-label="Email field"
            />
          );

        case "tel":
          return (
            <input
              type="tel"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              value={safeValue}
              placeholder={placeholder || "(123) 456-7890"}
              onChange={(e) => onChange(path, e.target.value)}
              aria-label="Phone field"
            />
          );

        case "url":
          return (
            <input
              type="url"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              value={safeValue}
              placeholder={placeholder || "https://example.com"}
              onChange={(e) => onChange(path, e.target.value)}
              aria-label="URL field"
            />
          );

        case "number":
          return (
            <input
              type="number"
              step="0.1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              value={safeValue}
              placeholder={placeholder || "0"}
              onChange={(e) => {
                const val = e.target.value;
                onChange(path, val === "" ? null : parseFloat(val) || 0);
              }}
              aria-label="Number field"
            />
          );

        case "date-range":
          return (
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              value={safeValue}
              placeholder="e.g., Jan 2024 – Dec 2024 or Jan 2024 – Present"
              onChange={(e) => onChange(path, e.target.value)}
              aria-label="Date range field"
            />
          );

        case "textarea":
          return (
            <textarea
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 resize-none"
              rows={4}
              value={safeValue}
              placeholder={placeholder || "Enter details here..."}
              onChange={(e) => onChange(path, e.target.value)}
              aria-label="Text area field"
            />
          );

        default:
          return (
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
              value={safeValue}
              placeholder={placeholder || "Enter text..."}
              onChange={(e) => onChange(path, e.target.value)}
              aria-label="Text field"
            />
          );
      }
    } catch (error) {
      console.error("Error rendering input:", error);
      return null;
    }
  }, [onChange]);

  const handleRemoveItem = useCallback((arrayPath, index) => {
    try {
      const relativePath = path ? arrayPath.replace(path + '.', '') : arrayPath;
      const currentValue = getValueAtPath(data, relativePath);

      if (!Array.isArray(currentValue)) {
        onChange(arrayPath, []);
        return;
      }

      if (index < 0 || index >= currentValue.length) {
        console.error(`Index ${index} out of bounds for array at ${arrayPath}`);
        return;
      }

      const newArray = currentValue.filter((_, i) => i !== index);
      onChange(arrayPath, newArray);
      setSaveStatus(`Removed item ${index + 1}`);
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  }, [data, onChange, getValueAtPath, path]);

  const handleAddItem = useCallback((arrayPath, sectionKey) => {
    try {
      const relativePath = path ? arrayPath.replace(path + '.', '') : arrayPath;
      const currentValue = getValueAtPath(data, relativePath);

      if (!Array.isArray(currentValue)) {
        onChange(arrayPath, []);
        setSaveStatus(`Initialized ${formatLabel(sectionKey)} array`);
        setTimeout(() => setSaveStatus(null), 2000);
        return;
      }

      let newItem;

      if (currentValue.length > 0) {
        const firstItem = currentValue[0];
        if (typeof firstItem === 'string') {
          newItem = "";
        } else if (typeof firstItem === 'object' && firstItem !== null) {
          newItem = createEmptyItem(sectionKey);
        } else {
          newItem = "";
        }
      } else {
        if (sectionKey === 'highlights' || sectionKey === 'technologies' || sectionKey === 'items') {
          newItem = "";
        } else {
          newItem = createEmptyItem(sectionKey);
        }
      }

      onChange(arrayPath, [...currentValue, newItem]);
      setUnsavedSections(prev => new Set([...prev, arrayPath]));
      setSaveStatus(`Added new ${formatLabel(sectionKey)}`);
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }, [data, onChange, getValueAtPath, path]);

  const handleSaveSection = useCallback((sectionPath) => {
    setSaveStatus(`✓ Saved ${sectionPath}`);
    setTimeout(() => setSaveStatus(null), 2000);
    setUnsavedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionPath);
      return newSet;
    });
  }, []);

  const toggleSection = useCallback((sectionKey) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionKey)) {
        newSet.delete(sectionKey);
      } else {
        newSet.add(sectionKey);
      }
      return newSet;
    });
  }, []);

  const renderField = useCallback((key, value, currentPath, fieldConfig, sectionConfig) => {
    try {
      if (typeof value === "string" || value === null) {
        return (
          <div key={currentPath} className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {fieldConfig?.label || formatLabel(key)}
              {fieldConfig?.required && (
                <span className="text-red-500 ml-1" aria-label="required">*</span>
              )}
            </label>
            {renderInput(fieldConfig, value, currentPath)}
          </div>
        );
      }

      if (typeof value === "number") {
        return (
          <div key={currentPath} className="mb-5">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              {fieldConfig?.label || formatLabel(key)}
            </label>
            {renderInput(fieldConfig, value, currentPath)}
          </div>
        );
      }

      if (Array.isArray(value)) {
        const isSectionEditable = sectionConfig?.canAddRemove ?? true;

        return (
          <div key={currentPath} className="mb-7">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-gray-900">
                {sectionConfig?.label || fieldConfig?.label || formatLabel(key)}
              </label>
              {onSave && (
                <button
                  onClick={() => handleSaveSection(currentPath)}
                  className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 transition-all duration-200 font-medium"
                  title="Save this section"
                >
                  💾 Save
                </button>
              )}
            </div>

            {value.length === 0 && isSectionEditable && (
              <div className="text-gray-600 text-sm mb-4 bg-purple-50 p-3 rounded-lg border border-purple-200">
                No {formatLabel(key).toLowerCase()} added yet. Click "Add" to create one.
              </div>
            )}

            <div className="space-y-3">
              {value.map((item, index) => {
                if (item === null || item === undefined) {
                  console.warn(`Item at index ${index} in ${currentPath} is null/undefined`);
                  return null;
                }

                return (
                  <div
                    key={`${currentPath}-${index}`}
                    className="relative ml-1 border-l-4 border-purple-400 pl-4 bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    role="region"
                    aria-label={`${formatLabel(key)} ${index + 1}`}
                  >
                    {isSectionEditable && value.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveItem(currentPath, index);
                        }}
                        className="absolute top-3 right-3 text-white bg-red-500 w-7 h-7 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 transition-all duration-200 flex items-center justify-center font-bold text-sm cursor-pointer"
                        title={`Remove ${formatLabel(key).toLowerCase()} item`}
                        aria-label={`Remove ${formatLabel(key).toLowerCase()} item`}
                        type="button"
                      >
                        ✕
                      </button>
                    )}

                    {typeof item === "string" ? (
                      <div>
                        <input
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                          value={item || ""}
                          onChange={(e) => onChange(`${currentPath}.${index}`, e.target.value)}
                          aria-label={`${formatLabel(key)} item ${index + 1}`}
                          placeholder={`Enter ${formatLabel(key).toLowerCase()}...`}
                        />
                      </div>
                    ) : typeof item === "object" && item !== null ? (
                      <DynamicForm
                        data={item}
                        onChange={onChange}
                        path={`${currentPath}.${index}`}
                        sectionKey={key}
                        onSave={onSave}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            {isSectionEditable && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleAddItem(currentPath, key)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-800 transition-all duration-200 font-semibold flex items-center gap-1"
                  aria-label={`Add new ${formatLabel(key).toLowerCase()}`}
                  type="button"
                >
                  + Add {formatLabel(key)}
                </button>
                {unsavedSections.has(currentPath) && (
                  <button
                    onClick={() => handleSaveSection(currentPath)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-800 transition-all duration-200 font-semibold"
                    title="Save this section"
                    aria-label="Save section"
                    type="button"
                  >
                    💾 Save
                  </button>
                )}
              </div>
            )}
          </div>
        );
      }

      if (typeof value === "object" && value !== null) {
        return (
          <div
            key={currentPath}
            className="mb-7 border-2 border-gray-300 p-5 rounded-lg bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-shadow duration-200"
            role="region"
            aria-label={sectionConfig?.label || formatLabel(key)}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-purple-900">
                {sectionConfig?.label || formatLabel(key)}
              </h3>
              {onSave && (
                <button
                  onClick={() => handleSaveSection(currentPath)}
                  className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-md hover:bg-purple-700 transition-all duration-200 font-medium"
                  type="button"
                >
                  💾 Save
                </button>
              )}
            </div>
            <DynamicForm
              data={value}
              onChange={onChange}
              path={currentPath}
              sectionKey={key}
              onSave={onSave}
            />
          </div>
        );
      }

      return null;
    } catch (error) {
      console.error(`Error rendering field ${key}:`, error);
      return null;
    }
  }, [renderInput, onChange, handleRemoveItem, handleAddItem, handleSaveSection, onSave]);

  if (!path) {
    return (
      <div className="space-y-4">
        {saveStatus && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fadeIn z-50">
            {saveStatus}
          </div>
        )}

        {TEMPLATE_SECTIONS.map(({ key: sectionKey, displayName }) => {
          const value = data[sectionKey];
          if (!value) return null;

          const isExpanded = expandedSections.has(sectionKey);
          const sectionConfig = FIELD_CONFIG[sectionKey];
          const IconComponent = SECTION_ICONS[sectionKey] || User;

          return (
            <div
              key={sectionKey}
              className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleSection(sectionKey)}
                className={`w-full text-left px-5 py-4 flex justify-between items-center transition-all duration-200 ${
                  isExpanded ? 'bg-purple-50 border-b border-gray-200' : 'hover:bg-gray-50'
                }`}
                aria-expanded={isExpanded}
                aria-controls={`section-${sectionKey}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <IconComponent 
                    size={22} 
                    className={`transition-colors ${
                      isExpanded ? 'text-purple-600' : 'text-gray-600'
                    }`}
                  />
                  
                  <h3 className="text-base font-bold text-gray-900">
                    {displayName}
                  </h3>
                  
                  {isExpanded && (
                    <span className="text-xs bg-purple-200 text-purple-900 px-2.5 py-1 rounded-full font-semibold">
                      Active
                    </span>
                  )}
                </div>
                
                <ChevronDown
                  size={20}
                  className={`text-gray-600 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                id={`section-${sectionKey}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-3 py-4 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
                  <DynamicForm
                    data={value}
                    onChange={onChange}
                    path={sectionKey}
                    sectionKey={sectionKey}
                    onSave={onSave}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {saveStatus && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fadeIn z-50">
          {saveStatus}
        </div>
      )}

      {Object.entries(data).map(([key, value]) => {
        if (key === "_metadata") return null;

        try {
          const currentPath = path ? `${path}.${key}` : key;
          const fieldConfig = getFieldConfig(key, sectionKey || key);
          const sectionConfig = FIELD_CONFIG?.[sectionKey || key];

          return renderField(key, value, currentPath, fieldConfig, sectionConfig);
        } catch (error) {
          console.error(`Error processing field ${key}:`, error);
          return null;
        }
      })}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function formatLabel(key) {
  if (!key || typeof key !== 'string') return "Field";
  
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function createEmptyItem(sectionKey) {
  const templates = {
    experience: {
      role: "",
      company: "",
      location: "",
      dates: "",
      projectName: "",
      highlights: []
    },
    projects: {
      name: "",
      technologies: [],
      highlights: []
    },
    education: {
      institution: "",
      degree: "",
      dates: "",
      gpa: null
    },
    skills: {
      category: "",
      items: []
    },
    certifications: "",
    internships: {
      role: "",
      company: "",
      location: "",
      dates: "",
      highlights: []
    },
    awards: {
      title: "",
      issuer: "",
      date: "",
      description: ""
    },
    languages: {
      language: "",
      proficiency: ""
    }
  };


  const template = templates[sectionKey];

  if (!template) {
    console.warn(`No template found for section: ${sectionKey}`);
    return {};
  }

  try {
    return JSON.parse(JSON.stringify(template));
  } catch (error) {
    console.error(`Error creating empty item for ${sectionKey}:`, error);
    return {};
  }
}
