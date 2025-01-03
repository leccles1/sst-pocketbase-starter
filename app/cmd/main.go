package main

import (
	server "app/app/internal"
	"log"
)

func main() {

	app := server.InitialiseServer().Server

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
