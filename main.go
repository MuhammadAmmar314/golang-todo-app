package main

import (
	"github.com/MuhammadAmmar314/todo-app/config"
	"github.com/MuhammadAmmar314/todo-app/models"
	"github.com/MuhammadAmmar314/todo-app/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	app := fiber.New()

	config.ConnectDB()
	config.DB.AutoMigrate(&models.User{}, &models.Todo{})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
	}))

	routes.SetupRoutes(app)

	app.Listen(":3000")
}
