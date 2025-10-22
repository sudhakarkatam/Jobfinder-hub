/**
 * Format salary for display
 * Shows EXACTLY what admin entered - no formatting
 * @param {string|number|null} salaryMin - Minimum salary
 * @param {string|number|null} salaryMax - Maximum salary
 * @returns {string} - Salary string exactly as entered or "Salary not disclosed"
 */
export const formatSalary = (salaryMin, salaryMax) => {
  // Convert to strings and trim
  const minStr = salaryMin ? String(salaryMin).trim() : '';
  const maxStr = salaryMax ? String(salaryMax).trim() : '';

  // If both are empty/null, return "Salary not disclosed"
  if (!minStr && !maxStr) {
    return 'Salary not disclosed';
  }

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

  return 'Salary not disclosed';
};

