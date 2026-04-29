import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import type { Habit } from '@/types/habit';

const baseHabit: Habit = {
  id: '1',
  userId: 'u1',
  name: 'Drink Water',
  description: '',
  frequency: 'daily',
  createdAt: '2026-01-01T00:00:00Z',
  completions: [],
};

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2026-04-28');
    expect(result.completions).toContain('2026-04-28');
  });

  it('removes a completion date when the date already exists', () => {
    const habit = { ...baseHabit, completions: ['2026-04-28'] };
    const result = toggleHabitCompletion(habit, '2026-04-28');
    expect(result.completions).not.toContain('2026-04-28');
  });

  it('does not mutate the original habit object', () => {
    const habit = { ...baseHabit, completions: [] };
    toggleHabitCompletion(habit, '2026-04-28');
    expect(habit.completions).toHaveLength(0);
  });

  it('does not return duplicate completion dates', () => {
    const habit = { ...baseHabit, completions: ['2026-04-28'] };
    const result = toggleHabitCompletion(habit, '2026-04-29');
    const unique = new Set(result.completions);
    expect(unique.size).toBe(result.completions.length);
  });
});
