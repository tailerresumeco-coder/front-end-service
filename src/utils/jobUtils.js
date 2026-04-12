// Shared helpers used by JobCard and JobDetailPage

export function timeAgo(dateStr) {
  if (!dateStr) return null;
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function formatSalary(min, max, currency) {
  if (!min && !max) return null;
  const fmt = (n) => n >= 100000 ? `${(n / 100000).toFixed(1)}L` : `${(n / 1000).toFixed(0)}K`;
  const sym = currency || 'INR';
  if (min && max) return `${fmt(min)} – ${fmt(max)} ${sym}`;
  if (min)        return `From ${fmt(min)} ${sym}`;
  return          `Up to ${fmt(max)} ${sym}`;
}

export const JOB_TYPE_BADGE = {
  FULLTIME:   'bg-green-500/20  text-green-400  border border-green-500/30',
  CONTRACTOR: 'bg-amber-500/20  text-amber-400  border border-amber-500/30',
  PARTTIME:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  INTERN:     'bg-blue-500/20   text-blue-400   border border-blue-500/30',
};

export const JOB_TYPE_LABEL = {
  FULLTIME: 'Full-Time', CONTRACTOR: 'Contract',
  PARTTIME: 'Part-Time', INTERN: 'Internship',
};

export const SOURCE_BADGE = {
  jsearch: 'bg-cyan-500/20   text-cyan-400   border border-cyan-500/30',
  adzuna:  'bg-purple-500/20 text-purple-400 border border-purple-500/30',
};
