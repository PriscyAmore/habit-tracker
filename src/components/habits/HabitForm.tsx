'use client';
import { useState } from 'react';
import { validateHabitName } from '@/lib/validators';
import type { Habit } from '@/types/habit';

interface Props {
  initial?: Habit | null;
  onSave: (data: { name: string; description: string }) => void;
  onCancel: () => void;
}

export default function HabitForm({ initial, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error ?? 'Invalid name');
      return;
    }
    onSave({ name: validation.value, description });
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="bg-gray-900 rounded-2xl p-6 mb-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">
        {initial ? 'Edit Habit' : 'New Habit'}
      </h3>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div>
        <label htmlFor="habit-name" className="block text-sm text-gray-300 mb-1">
          Habit Name *
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Drink Water"
        />
      </div>
      <div>
        <label htmlFor="habit-description" className="block text-sm text-gray-300 mb-1">
          Description
        </label>
        <input
          id="habit-description"
          data-testid="habit-description-input"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Optional description"
        />
      </div>
      <div>
        <label htmlFor="habit-frequency" className="block text-sm text-gray-300 mb-1">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="daily">Daily</option>
        </select>
      </div>
      <div className="flex gap-3">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
