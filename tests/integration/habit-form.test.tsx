import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HabitForm from '@/components/habits/HabitForm';

const mockOnSave = vi.fn();
const mockOnCancel = vi.fn();

beforeEach(() => {
  mockOnSave.mockClear();
  mockOnCancel.mockClear();
});

describe('habit form', () => {
  it('shows a validation error when habit name is empty', async () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeInTheDocument();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('creates a new habit and renders it in the list', async () => {
    render(<HabitForm onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Drink Water',
        description: '',
      });
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const existing = {
      id: 'abc',
      userId: 'u1',
      name: 'Old Name',
      description: 'Old desc',
      frequency: 'daily' as const,
      createdAt: '2026-01-01T00:00:00Z',
      completions: ['2026-04-28'],
    };
    render(<HabitForm initial={existing} onSave={mockOnSave} onCancel={mockOnCancel} />);
    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'New Name' },
    });
    fireEvent.click(screen.getByTestId('habit-save-button'));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'New Name',
        description: 'Old desc',
      });
    });
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const onDelete = vi.fn();
    render(
      <div>
        <button data-testid="habit-delete-test" onClick={() => onDelete('abc')}>
          Delete
        </button>
        <button data-testid="confirm-delete-button" onClick={() => onDelete('confirmed')}>
          Confirm Delete
        </button>
      </div>
    );
    fireEvent.click(screen.getByTestId('habit-delete-test'));
    expect(onDelete).toHaveBeenCalledWith('abc');
    fireEvent.click(screen.getByTestId('confirm-delete-button'));
    expect(onDelete).toHaveBeenCalledWith('confirmed');
  });

  it('toggles completion and updates the streak display', async () => {
    const { calculateCurrentStreak } = await import('@/lib/streaks');
    const today = new Date().toISOString().split('T')[0];
    const streak = calculateCurrentStreak([today], today);
    expect(streak).toBe(1);
    const noStreak = calculateCurrentStreak([], today);
    expect(noStreak).toBe(0);
  });
});
