package app

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/morgorn/pos-crispy-catfish/backend/internal/config"
	internalhttp "github.com/morgorn/pos-crispy-catfish/backend/internal/http"
	"github.com/morgorn/pos-crispy-catfish/backend/internal/platform/database"
	"github.com/morgorn/pos-crispy-catfish/backend/internal/platform/logger"
)

// App manages application lifecycle, configuration, database connections, and HTTP server.
type App struct {
	cfg    *config.Config
	logger *slog.Logger
	pool   *pgxpool.Pool
	server *http.Server
}

// New constructs and initializes all application dependencies.
func New(ctx context.Context) (*App, error) {
	// 1. Load configuration
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("failed to load configuration: %w", err)
	}

	// 2. Setup structured logging
	appLogger := logger.New(cfg.GinMode)
	appLogger.Info("initializing application",
		slog.String("restaurant", cfg.RestaurantName),
		slog.String("port", cfg.Port),
		slog.String("mode", cfg.GinMode),
	)

	// 3. Connect to PostgreSQL database
	pool, err := database.New(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to establish database pool: %w", err)
	}
	appLogger.Info("database connection pool successfully established",
		slog.String("host", cfg.DBHost),
		slog.String("database", cfg.DBName),
	)

	// 4. Assemble HTTP router
	router := internalhttp.NewRouter(cfg, pool, appLogger)

	// 5. Build HTTP server
	server := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	return &App{
		cfg:    cfg,
		logger: appLogger,
		pool:   pool,
		server: server,
	}, nil
}

// Run starts the HTTP server and blocks until an OS termination signal is received.
func (a *App) Run() error {
	serverErrChan := make(chan error, 1)

	go func() {
		a.logger.Info("starting HTTP server", slog.String("addr", a.server.Addr))
		if err := a.server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErrChan <- err
		}
	}()

	// Listen for OS termination signals (SIGINT, SIGTERM)
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-serverErrChan:
		a.Close()
		return fmt.Errorf("server startup failed: %w", err)
	case sig := <-quit:
		a.logger.Info("shutdown signal received", slog.String("signal", sig.String()))
	}

	// Context for graceful HTTP shutdown
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := a.server.Shutdown(shutdownCtx); err != nil {
		a.logger.Error("server forced to shutdown", slog.String("error", err.Error()))
	} else {
		a.logger.Info("HTTP server stopped gracefully")
	}

	a.Close()
	return nil
}

// Close gracefully releases application resources (database pool).
func (a *App) Close() {
	if a.pool != nil {
		a.logger.Info("closing database connection pool")
		a.pool.Close()
	}
}
