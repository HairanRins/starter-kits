package com.boilerplate.crud;

import com.boilerplate.crud.common.BaseService;
import org.springframework.stereotype.Service;

@Service
public class TodoService extends BaseService<Todo, TodoRepository> {

    public TodoService(TodoRepository repository) {
        super(repository);
    }

    @Override
    protected void updateFields(Todo existing, Todo updated) {
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setCompleted(updated.isCompleted());
    }
}
