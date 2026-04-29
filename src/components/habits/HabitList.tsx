import type { Habit } from '@/types/habit';
import HabitCard from './HabitCard';

interface Props {
  habits: Habit[];
  today: string;
  showDeleteId: string | null;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onDeleteRequest: (id: string) => void;
  onDeleteConfirm: (id: string) => void;
  onDeleteCancel: () => void;
}

export default function HabitList({
  habits, today, showDeleteId,
  onToggle, onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel
}: Props) {
  return (
    <div>
      {habits.map(habit => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          showDelete={showDeleteId === habit.id}
          onToggle={onToggle}
          onEdit={onEdit}
          onDeleteRequest={onDeleteRequest}
          onDeleteConfirm={onDeleteConfirm}
          onDeleteCancel={onDeleteCancel}
        />
      ))}
    </div>
  );
}
