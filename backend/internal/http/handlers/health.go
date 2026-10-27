package handlers

import (
	"log/slog"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/morgorn/pos-crispy-catfish/backend/internal/platform/database"
)

// HealthHandler manages liveness and readiness probe requests.
type HealthHandler struct {
	pool   *pgxpool.Pool
	logger *slog.Logger
}

// NewHealthHandler creates a new HealthHandler instance.
func NewHealthHandler(pool *pgxpool.Pool, logger *slog.Logger) *HealthHandler {
	return &HealthHandler{
		pool:   pool,
		logger: logger,
	}
}

// Health handles GET /health liveness probe.
func (h *HealthHandler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

// Ready handles GET /ready readiness probe by inspecting database pool health.
func (h *HealthHandler) Ready(c *gin.Context) {
	if err := database.HealthCheck(c.Request.Context(), h.pool); err != nil {
		h.logger.Error("readiness probe failed: database ping failed", slog.String("error", err.Error()))
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":   "unavailable",
			"database": "disconnected",
			"error":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   "ready",
		"database": "ok",
	})
}
