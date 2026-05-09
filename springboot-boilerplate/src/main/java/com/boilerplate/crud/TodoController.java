package com.boilerplate.crud;

import com.boilerplate.crud.common.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/todos")
public class TodoController extends BaseController<Todo, TodoService> {

    public TodoController(TodoService service) {
        super(service, "Todo");
    }
}
