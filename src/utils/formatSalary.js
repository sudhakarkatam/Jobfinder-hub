/**
 * Format salary for display
 * Shows EXACTLY what admin entered - no formatting
 * @param {string|number|null} salaryMin - Minimum salary
 * @param {string|number|null} salaryMax - Maximum salary
 * @returns {string|null} - Salary string exactly as entered or null
 */
export const formatSalary = (salaryMin, salaryMax) => {
  // If both are empty/null, return null
  if (!salaryMin && !salaryMax) {
    return null;
  }

  // Convert to strings and trim
  const minStr = salaryMin ? String(salaryMin).trim() : '';
  const maxStr = salaryMax ? String(salaryMax).trim() : '';

  // If both exist, show as range
  if (minStr && maxStr) {
    return `${minStr} - ${maxStr}`;
  }

  // If only min exists, show it
  if (minStr) {
    return minStr;
  }

  // If only max exists, show it
  if (maxStr) {
    return maxStr;
  }

  return null;
};

