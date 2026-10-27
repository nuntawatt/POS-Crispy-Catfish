package logger

import (
	"log/slog"
	"os"
	"strings"
)

const ServiceName = "pos-crispy-catfish"

// New initializes and returns a structured slog.Logger.
// In release / production mode, it outputs JSON. In development/debug mode, it outputs text.
func New(mode string) *slog.Logger {
	var handler slog.Handler

	opts := &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}

	if strings.ToLower(mode) == "release" || strings.ToLower(mode) == "production" {
		handler = slog.NewJSONHandler(os.Stdout, opts)
	} else {
		opts.Level = slog.LevelDebug
		handler = slog.NewTextHandler(os.Stdout, opts)
	}

	// Add service metadata attribute to every log entry
	logger := slog.New(handler).With(
		slog.String("service", ServiceName),
	)

	// Set as global default slog logger as well
	slog.SetDefault(logger)

	return logger
}
