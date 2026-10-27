package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
)

// Logger returns a Gin middleware that logs HTTP requests using the provided structured logger.
func Logger(logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		rawQuery := c.Request.URL.RawQuery
		if rawQuery != "" {
			path = path + "?" + rawQuery
		}

		c.Next()

		duration := time.Since(start)
		status := c.Writer.Status()
		reqID := GetRequestID(c)
		clientIP := c.ClientIP()
		method := c.Request.Method
		bytesWritten := c.Writer.Size()

		attrs := []slog.Attr{
			slog.String("request_id", reqID),
			slog.String("method", method),
			slog.String("path", path),
			slog.Int("status", status),
			slog.Duration("duration", duration),
			slog.String("client_ip", clientIP),
			slog.Int("bytes", bytesWritten),
			slog.String("user_agent", c.Request.UserAgent()),
		}

		// Append Gin context errors if any
		if len(c.Errors) > 0 {
			attrs = append(attrs, slog.String("gin_errors", c.Errors.String()))
		}

		ctx := c.Request.Context()
		switch {
		case status >= 500:
			logger.LogAttrs(ctx, slog.LevelError, "HTTP request failed", attrs...)
		case status >= 400:
			logger.LogAttrs(ctx, slog.LevelWarn, "HTTP client warning", attrs...)
		default:
			logger.LogAttrs(ctx, slog.LevelInfo, "HTTP request handled", attrs...)
		}
	}
}
