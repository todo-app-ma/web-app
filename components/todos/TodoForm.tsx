"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateTodoInput } from "@/types/todo";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: CreateTodoInput) => Promise<void>;
  submitLabel?: string;
  serverError?: string | null;
}

export function TodoForm({ defaultValues, onSubmit, submitLabel = "Save", serverError }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title <span className="text-destructive">*</span></label>
        <input
          {...register("title")}
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="What needs to be done?"
        />
        {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Optional details..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deadline <span className="text-destructive">*</span></label>
        <input
          {...register("deadline")}
          type="datetime-local"
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.deadline && <p className="text-destructive text-xs mt-1">{errors.deadline.message}</p>}
      </div>

      {serverError && (
        <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-md">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
