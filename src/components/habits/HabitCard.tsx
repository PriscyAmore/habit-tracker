'use client';
import { getHabitSlug } from '@/lib/slug';
import { calculateCurrentStreak } from '@/lib/streaks';
import type { Habit } from '@/types/habit';

interface Props {
  habit: Habit;
  today: string;
  showDelete: boolean;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDeleteRequest: (id: string) => void;
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;
}

export default function HabitCard({
  habit, today, showDelete,
  onToggle, onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel
}: Props) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className={`rounded-2xl p-5 mb-4 border transition-all ${
        isCompleted
          ? 'bg-indigo-950 border-indigo-700'
          : 'bg-gray-900 border-gray-800'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-gray-400 text-sm mt-1">{habit.description}</p>
          )}
        </div>
        <span
          data-testid={`habit-streak-${slug}`}
          className="text-indigo-400 font-bold text-sm"
        >
          🔥 {streak}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            isCompleted
              ? 'bg-green-700 hover:bg-green-800 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {isCompleted ? '✓ Done' : 'Mark Done'}
        </button>

        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="px-3 py-1 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 text-white"
        >
          Edit
        </button>

        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => onDeleteRequest(habit.id)}
          className="px-3 py-1 rounded-lg text-sm bg-red-800 hover:bg-red-700 text-white"
        >
          Delete
        </button>
      </div>

      {showDelete && (
        <div className="mt-4 p-4 bg-gray-800 rounded-xl border border-red-700">
          <p className="text-white text-sm mb-3">
            Are you sure you want to delete <strong>{habit.name}</strong>?
          </p>
          <div className="flex gap-2">
            <button
              data-testid="confirm-delete-button"
              onClick={() => onDeleteConfirm(habit.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
            >
              Yes, Delete
            </button>
            <button
              onClick={onDeleteCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
