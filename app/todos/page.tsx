"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Todo } from "@/types/todo";
import { TodoCard } from "@/components/todos/TodoCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/v1/todos").then((res) => {
      setTodos(res.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleMarkDone = async (id: string) => {
    await api.patch(`/v1/todos/${id}/done`);
    setTodos((prev) => prev.map((t) => t.todoId === id ? { ...t, done: true } : t));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this todo?")) return;
    await api.delete(`/v1/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t.todoId !== id));
  };

  const pending = todos.filter((t) => !t.done);
  const done = todos.filter((t) => t.done);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <Link
          href="/todos/new"
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
        >
          <Plus className="h-4 w-4" /> New Todo
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-center py-12">Loading...</p>
      ) : todos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No todos yet. Create your first one!</p>
          <Link href="/todos/new" className="text-primary font-medium hover:underline">Create todo</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Pending ({pending.length})
              </h2>
              <div className="space-y-2">
                {pending.map((todo) => (
                  <TodoCard key={todo.todoId} todo={todo} onMarkDone={handleMarkDone} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}

          {done.length > 0 && (
            <section>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Done ({done.length})
              </h2>
              <div className="space-y-2">
                {done.map((todo) => (
                  <TodoCard key={todo.todoId} todo={todo} onMarkDone={handleMarkDone} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
