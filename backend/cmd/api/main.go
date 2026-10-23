package main

import (
	"fmt"
	"log"
	"os"
)

func main() {
	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("POS-Crispy-Catfish API starting on port %s", port)
	fmt.Printf("Server would start on :%s\n", port)
	// TODO: Initialize config, database, router, and start server
}
