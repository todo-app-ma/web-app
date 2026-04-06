export interface Todo {
  todoId: string;
  userId: string;
  title: string;
  description: string;
  deadline: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  deadline: string;
}

export interface UpdateTodoInput {
  title: string;
  description?: string;
  deadline: string;
}
