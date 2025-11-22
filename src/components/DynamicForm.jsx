// components/DynamicForm.jsx
import React from "react";

export default function DynamicForm({ data, onChange, path = "" }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;

        // STRING
        if (typeof value === "string") {
          return (
            <div key={currentPath}>
              <label className="block text-sm font-semibold mb-1 capitalize">{key}</label>
              <input
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={value}
                onChange={(e) => onChange(currentPath, e.target.value)}
              />
            </div>
          );
        }

        // NUMBER
        if (typeof value === "number") {
          return (
            <div key={currentPath}>
              <label className="block text-sm font-semibold mb-1 capitalize">{key}</label>
              <input
                type="number"
                className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={value}
                onChange={(e) => onChange(currentPath, Number(e.target.value))}
              />
            </div>
          );
        }

        // ARRAY
        if (Array.isArray(value)) {
          return (
            <div key={currentPath}>
              <label className="block text-sm font-semibold mb-2 capitalize">{key}</label>
              {value.map((item, index) => (
                <div key={index} className="ml-4 border-l-2 border-blue-300 pl-4 my-2">
                  {typeof item === "string" ? (
                    <input
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    />
                  )}
                </div>
              ))}
            </div>
          );
        }

        // OBJECT
        if (typeof value === "object" && value !== null) {
          return (
            <div key={currentPath} className="border border-gray-300 p-3 rounded-md bg-gray-50">
              <div className="text-md font-semibold mb-2 capitalize text-blue-700">{key}</div>
              <DynamicForm
                data={value}
                onChange={onChange}
                path={currentPath}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}