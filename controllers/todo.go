// controllers/todo.go
package controllers

import (
	"github.com/MuhammadAmmar314/todo-app/models"

	"github.com/MuhammadAmmar314/todo-app/config"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func getUserID(c *fiber.Ctx) uint {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	return uint(claims["user_id"].(float64))
}

func GetTodos(c *fiber.Ctx) error {
	userID := getUserID(c)
	var todos []models.Todo
	config.DB.Where("user_id = ?", userID).Find(&todos)
	return c.JSON(todos)
}

func CreateTodo(c *fiber.Ctx) error {
	userID := getUserID(c)
	todo := new(models.Todo)
	if err := c.BodyParser(todo); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Bad request"})
	}
	todo.UserID = userID
	config.DB.Create(todo)
	return c.JSON(todo)
}

func UpdateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	var todo models.Todo
	if err := config.DB.First(&todo, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}
	if err := c.BodyParser(&todo); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Bad request"})
	}
	config.DB.Save(&todo)
	return c.JSON(todo)
}

func DeleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	if err := config.DB.Delete(&models.Todo{}, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}
	return c.SendStatus(204)
}
