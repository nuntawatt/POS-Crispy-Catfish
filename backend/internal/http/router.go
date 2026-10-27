package http

import (
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/morgorn/pos-crispy-catfish/backend/internal/config"
	"github.com/morgorn/pos-crispy-catfish/backend/internal/http/handlers"
	"github.com/morgorn/pos-crispy-catfish/backend/internal/http/middleware"
)

// RouterConfig contains dependencies required to assemble the HTTP router.
type RouterConfig struct {
	Config *config.Config
	Pool   *pgxpool.Pool
	Logger *slog.Logger
}

// NewRouter constructs and configures a Gin engine with all global middlewares and routes.
func NewRouter(cfg *config.Config, pool *pgxpool.Pool, logger *slog.Logger) *gin.Engine {
	if cfg.GinMode != "" {
		gin.SetMode(cfg.GinMode)
	}

	router := gin.New()

	// Global Middlewares
	router.Use(middleware.RequestID())
	router.Use(middleware.CORS())
	router.Use(middleware.Logger(logger))
	router.Use(middleware.Recovery(logger))

	// Health and readiness probes
	healthHandler := handlers.NewHealthHandler(pool, logger)
	router.GET("/health", healthHandler.Health)
	router.GET("/ready", healthHandler.Ready)

	// API v1 group (ready for domain routes)
	v1 := router.Group("/api/v1")
	{
		v1.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
				"service": loggerPkgServiceName(logger),
			})
		})
	}

	return router
}

func loggerPkgServiceName(l *slog.Logger) string {
	return "pos-crispy-catfish"
}
