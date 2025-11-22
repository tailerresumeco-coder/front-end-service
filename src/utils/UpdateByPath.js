export default function updateByPath(obj, path, value) {
  const keys = path.split(".");
  const updated = { ...obj };
  let current = updated;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      current[key] = value;
    } else {
      current[key] = Array.isArray(current[key])
        ? [...current[key]]
        : { ...current[key] };
      current = current[key];
    }
  });

  return updated;
}
