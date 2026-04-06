"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { TodoForm } from "@/components/todos/TodoForm";
import { CreateTodoInput } from "@/types/todo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTodoPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateTodoInput) => {
    setServerError(null);
    try {
      await api.post("/v1/todos", {
        ...data,
        deadline: new Date(data.deadline).toISOString().replace("Z", ""),
      });
      router.push("/todos");
    } catch {
      setServerError("Failed to create todo. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link href="/todos" className="flex items-center gap-1.5 text-muted-foreground text-sm mb-6 hover:text-foreground transition">
        <ArrowLeft className="h-4 w-4" /> Back to todos
      </Link>
      <h1 className="text-2xl font-bold mb-6">New Todo</h1>
      <TodoForm onSubmit={handleSubmit} submitLabel="Create Todo" serverError={serverError} />
    </div>
  );
}
