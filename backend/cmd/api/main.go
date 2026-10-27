package main

import (
	"context"
	"log/slog"
	"os"

	"github.com/morgorn/pos-crispy-catfish/backend/internal/app"
)

func main() {
	ctx := context.Background()

	application, err := app.New(ctx)
	if err != nil {
		slog.Error("failed to initialize application", slog.String("error", err.Error()))
		os.Exit(1)
	}

	if err := application.Run(); err != nil {
		slog.Error("application encountered fatal error", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
