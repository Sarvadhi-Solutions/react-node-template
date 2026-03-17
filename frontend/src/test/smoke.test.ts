import { describe, it, expect } from 'vitest';

/**
 * Smoke test — verifies the test infrastructure works.
 *
 * This file demonstrates the testing pattern. Add feature-specific tests
 * alongside your feature files: `src/pages/{feature}/__tests__/page.test.tsx`
 */
describe('Test Infrastructure', () => {
  it('should run tests with Vitest', () => {
    expect(true).toBe(true);
  });

  it('should have access to jest-dom matchers', () => {
    const div = document.createElement('div');
    div.textContent = 'Hello';
    document.body.appendChild(div);
    expect(div).toBeInTheDocument();
    document.body.removeChild(div);
  });
});
