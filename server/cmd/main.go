package main

import (
	"log"
	server "server/internal"
)

func main() {

	app := server.InitialiseServer().Server

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
