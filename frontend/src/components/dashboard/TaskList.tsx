import type { Task } from '../../types';
import { toggleTask } from '../../lib/api';

interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (id: string, completed: boolean) => void;
}

function formatTaskDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function TaskList({ tasks, onTaskToggle }: TaskListProps) {
  const handleToggle = async (task: Task) => {
    try {
      await toggleTask(task.id, !task.is_completed);
      onTaskToggle(task.id, !task.is_completed);
    } catch {
      /* silently fail */
    }
  };

  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const key = task.task_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl p-5 shadow-card">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Tasks & Follow-ups</h3>

      <div className="space-y-4 max-h-72 overflow-y-auto">
        {Object.entries(grouped).map(([date, dateTasks]) => (
          <div key={date}>
            <p className="text-xs font-medium text-gray-400 mb-2">{formatTaskDate(date)}</p>
            {dateTasks.map((task) => (
              <label
                key={task.id}
                className="flex items-start gap-2.5 py-1.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={task.is_completed}
                  onChange={() => handleToggle(task)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-300"
                />
                <span
                  className={`text-sm leading-snug ${
                    task.is_completed
                      ? 'text-gray-400 line-through'
                      : 'text-gray-600 group-hover:text-gray-800'
                  }`}
                >
                  {task.description}
                </span>
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
