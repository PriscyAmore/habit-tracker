'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logOut } from '@/lib/auth';
import { getHabits, saveHabits } from '@/lib/storage';
import { toggleHabitCompletion } from '@/lib/habits';
import type { Habit } from '@/types/habit';
import HabitForm from '@/components/habits/HabitForm';
import HabitList from '@/components/habits/HabitList';

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session || !session.userId) {
      router.replace('/login');
      return;
    }
    setUserId(session.userId);
    const all = getHabits();
    setHabits(all.filter(h => h.userId === session.userId));
  }, [router]);

  const today = new Date().toISOString().split('T')[0];

  function handleSaveHabit(data: { name: string; description: string }) {
    if (editingHabit) {
      const updated = {
        ...editingHabit,
        name: data.name,
        description: data.description,
      };
      const all = getHabits();
      const newAll = all.map(h => h.id === updated.id ? updated : h);
      saveHabits(newAll);
      setHabits(newAll.filter(h => h.userId === userId));
      setEditingHabit(null);
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID(),
        userId,
        name: data.name,
        description: data.description,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      };
      const all = getHabits();
      const newAll = [...all, newHabit];
      saveHabits(newAll);
      setHabits(newAll.filter(h => h.userId === userId));
    }
    setShowForm(false);
  }

  function handleToggle(habit: Habit) {
    const updated = toggleHabitCompletion(habit, today);
    const all = getHabits();
    const newAll = all.map(h => h.id === updated.id ? updated : h);
    saveHabits(newAll);
    setHabits(newAll.filter(h => h.userId === userId));
  }

  function handleDelete(id: string) {
    const all = getHabits();
    const newAll = all.filter(h => h.id !== id);
    saveHabits(newAll);
    setHabits(newAll.filter(h => h.userId === userId));
    setShowDeleteId(null);
  }

  function handleLogout() {
    logOut();
    router.replace('/login');
  }

  return (
    <main
      data-testid="dashboard-page"
      className="min-h-screen bg-gray-950 text-white px-4 py-8 max-w-2xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Habit Tracker</h1>
        <button
          data-testid="auth-logout-button"
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      <button
        data-testid="create-habit-button"
        onClick={() => { setEditingHabit(null); setShowForm(true); }}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg mb-6 font-semibold"
      >
        + New Habit
      </button>

      {(showForm || editingHabit) && (
        <HabitForm
          initial={editingHabit}
          onSave={handleSaveHabit}
          onCancel={() => { setShowForm(false); setEditingHabit(null); }}
        />
      )}

      {habits.length === 0 ? (
        <div data-testid="empty-state" className="text-center text-gray-400 py-16">
          <p className="text-lg">No habits yet. Create your first one!</p>
        </div>
      ) : (
        <HabitList
          habits={habits}
          today={today}
          showDeleteId={showDeleteId}
          onToggle={handleToggle}
          onEdit={(h) => { setEditingHabit(h); setShowForm(true); }}
          onDeleteRequest={(id) => setShowDeleteId(id)}
          onDeleteConfirm={handleDelete}
          onDeleteCancel={() => setShowDeleteId(null)}
        />
      )}
    </main>
  );
}
