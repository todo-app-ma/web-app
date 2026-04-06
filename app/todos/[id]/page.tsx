"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import { Todo, UpdateTodoInput } from "@/types/todo";
import { TodoForm } from "@/components/todos/TodoForm";
import { ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TodoDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/v1/todos/${id}`).then((res) => setTodo(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: UpdateTodoInput) => {
    setServerError(null);
    try {
      const res = await api.put(`/v1/todos/${id}`, {
        ...data,
        deadline: new Date(data.deadline).toISOString().replace("Z", ""),
      });
      setTodo(res.data);
      router.push("/todos");
    } catch {
      setServerError("Failed to update todo.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this todo?")) return;
    await api.delete(`/v1/todos/${id}`);
    router.push("/todos");
  };

  const handleMarkDone = async () => {
    const res = await api.patch(`/v1/todos/${id}/done`);
    setTodo(res.data);
  };

  if (loading) return <div className="max-w-xl mx-auto px-4 py-8 text-muted-foreground">Loading...</div>;
  if (!todo) return <div className="max-w-xl mx-auto px-4 py-8 text-muted-foreground">Todo not found.</div>;

  const defaultDeadline = todo.deadline
    ? new Date(todo.deadline).toISOString().slice(0, 16)
    : "";

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href="/todos" className="flex items-center gap-1.5 text-muted-foreground text-sm mb-6 hover:text-foreground transition">
        <ArrowLeft className="h-4 w-4" /> Back to todos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Todo</h1>
        <div className="flex gap-2">
          {!todo.done && (
            <button
              onClick={handleMarkDone}
              className="flex items-center gap-1.5 text-sm text-primary border border-primary px-3 py-1.5 rounded-md hover:bg-primary/10 transition"
            >
              <CheckCircle className="h-4 w-4" /> Mark done
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 text-sm text-destructive border border-destructive px-3 py-1.5 rounded-md hover:bg-destructive/10 transition"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {todo.done && (
        <p className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md mb-4">
          This todo is marked as done.
        </p>
      )}

      <TodoForm
        defaultValues={{ title: todo.title, description: todo.description, deadline: defaultDeadline }}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
        serverError={serverError}
      />
    </div>
  );
}
