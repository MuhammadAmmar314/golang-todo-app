package routes

import (
	"github.com/MuhammadAmmar314/todo-app/controllers"
	"github.com/MuhammadAmmar314/todo-app/middlewares"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	app.Get("/", func(c *fiber.Ctx) error {
		return c.Redirect("http://localhost:3001/login")
	})
	auth := app.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)

	todo := app.Group("/todos", middlewares.JWTProtected())
	todo.Get("/", controllers.GetTodos)
	todo.Post("/", controllers.CreateTodo)
	todo.Put("/:id", controllers.UpdateTodo)
	todo.Delete("/:id", controllers.DeleteTodo)
}
