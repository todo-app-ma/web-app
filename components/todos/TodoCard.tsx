"use client";

import { Todo } from "@/types/todo";
import { CheckCircle, Circle, Trash2, Pencil, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  todo: Todo;
  onMarkDone: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoCard({ todo, onMarkDone, onDelete }: Props) {
  const deadline = new Date(todo.deadline);
  const isOverdue = !todo.done && deadline < new Date();

  return (
    <div className={cn(
      "bg-card border rounded-lg p-4 flex flex-col gap-3",
      todo.done && "opacity-60",
      isOverdue && "border-destructive/50"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <button
            onClick={() => !todo.done && onMarkDone(todo.todoId)}
            className="mt-0.5 flex-shrink-0 text-muted-foreground hover:text-primary transition"
            disabled={todo.done}
          >
            {todo.done ? (
              <CheckCircle className="h-5 w-5 text-primary" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </button>
          <div className="min-w-0">
            <p className={cn("font-medium text-sm", todo.done && "line-through")}>{todo.title}</p>
            {todo.description && (
              <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{todo.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Link href={`/todos/${todo.todoId}`} className="p-1.5 rounded hover:bg-muted transition">
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Link>
          <button
            onClick={() => onDelete(todo.todoId)}
            className="p-1.5 rounded hover:bg-destructive/10 transition"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>

      <div className={cn("flex items-center gap-1 text-xs", isOverdue ? "text-destructive" : "text-muted-foreground")}>
        <Clock className="h-3 w-3" />
        <span>{isOverdue ? "Overdue: " : "Due: "}{deadline.toLocaleString()}</span>
      </div>
    </div>
  );
}
