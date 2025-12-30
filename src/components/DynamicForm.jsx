import React from "react";
import { FIELD_CONFIG } from "../config/FieldConfig";

export default function DynamicForm({ data, onChange, path = "", sectionKey = null }) {
  if (!data) return null;

  const getFieldConfig = (key, sectionKey) => {
    const section = FIELD_CONFIG[sectionKey];
    if (section?.fields) {
      return section.fields[key];
    }
    return null;
  };

  const renderInput = (fieldConfig, value, path) => {
    if (!fieldConfig) {
      return <input
        className="border p-2 rounded w-full"
        value={value || ""}
        onChange={(e) => onChange(path, e.target.value)}
      />;
    }

    const { type, readOnly, placeholder } = fieldConfig;

    if (readOnly) {
      return <div className="bg-gray-100 p-2 rounded text-gray-600">{value}</div>;
    }

    switch (type) {
      case "email":
        return <input
          type="email"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(path, e.target.value)}
        />;

      case "tel":
        return <input
          type="tel"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(path, e.target.value)}
        />;

      case "url":
        return <input
          type="url"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(path, e.target.value)}
        />;

      case "number":
        return <input
          type="number"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(path, Number(e.target.value))}
        />;

      case "date-range":
        // For now, accept "Aug 2024 – Dec 2024" format
        return <input
          type="text"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          placeholder="e.g., Aug 2024 – Dec 2024"
          onChange={(e) => onChange(path, e.target.value)}
        />;

      case "textarea":
        return <textarea
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(path, e.target.value)}
        />;

      default:
        return <input
          type="text"
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500"
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(path, e.target.value)}
        />;
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => {
        // Skip metadata in main form
        if (key === "_metadata") return null;

        const currentPath = path ? `${path}.${key}` : key;
        const fieldConfig = getFieldConfig(key, sectionKey || key);
        const sectionConfig = FIELD_CONFIG[sectionKey || key];

        // STRING
        if (typeof value === "string") {
          return (
            <div key={currentPath}>
              <label className="block text-sm font-semibold mb-1">
                {fieldConfig?.label || formatLabel(key)}
                {fieldConfig?.required && <span className="text-red-500">*</span>}
              </label>
              {renderInput(fieldConfig, value, currentPath)}
            </div>
          );
        }

        // NUMBER
        if (typeof value === "number") {
          return (
            <div key={currentPath}>
              <label className="block text-sm font-semibold mb-1">
                {fieldConfig?.label || formatLabel(key)}
              </label>
              {renderInput(fieldConfig, value, currentPath)}
            </div>
          );
        }

        // ARRAY
        if (Array.isArray(value)) {
          return (
            <div key={currentPath}>
              <label className="block text-sm font-semibold mb-2">
                {sectionConfig?.label || fieldConfig?.label || formatLabel(key)}
              </label>
              {value.map((item, index) => (
                <div
                  key={index}
                  className="ml-4 border-l-2 border-blue-300 pl-4 my-4 bg-blue-50 p-3 rounded"
                >
                  {typeof item === "string" ? (
                    <input
                      className="border p-2 rounded w-full"
                      value={item}
                      onChange={(e) =>
                        onChange(`${currentPath}.${index}`, e.target.value)
                      }
                    />
                  ) : (
                    <DynamicForm
                      data={item}
                      onChange={onChange}
                      path={`${currentPath}.${index}`}
                      sectionKey={key}
                    />
                  )}
                </div>
              ))}

              {sectionConfig?.canAddRemove && (
                <button
                  onClick={() => {
                    const newItem = createEmptyItem(key);
                    onChange(currentPath, [...value, newItem]);
                  }}
                  className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  + Add {formatLabel(key)}
                </button>
              )}
            </div>
          );
        }

        // OBJECT
        if (typeof value === "object" && value !== null) {
          return (
            <div key={currentPath} className="border border-gray-300 p-3 rounded-md bg-gray-50">
              <div className="text-md font-semibold mb-3 capitalize text-blue-700">
                {sectionConfig?.label || formatLabel(key)}
              </div>
              <DynamicForm
                data={value}
                onChange={onChange}
                path={currentPath}
                sectionKey={key}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function createEmptyItem(sectionKey) {
  const templates = {
    experience: { role: "", company: "", dates: "", highlights: [] },
    projects: { name: "", technologies: [], description: "" },
    skills: { category: "", items: [] }
  };
  return templates[sectionKey] || {};
}