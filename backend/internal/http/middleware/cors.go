package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// CORS provides Cross-Origin Resource Sharing middleware for the Gin router.
// If allowedOrigins is empty, defaults to localhost development origins.
func CORS(allowedOrigins ...string) gin.HandlerFunc {
	originsMap := make(map[string]bool)
	if len(allowedOrigins) == 0 {
		originsMap["http://localhost:3000"] = true
		originsMap["http://127.0.0.1:3000"] = true
		originsMap["http://localhost:5173"] = true
		originsMap["http://127.0.0.1:5173"] = true
	} else {
		for _, origin := range allowedOrigins {
			originsMap[origin] = true
		}
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		if origin != "" {
			if originsMap["*"] || originsMap[origin] {
				c.Header("Access-Control-Allow-Origin", origin)
				c.Header("Access-Control-Allow-Credentials", "true")
				c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
				c.Header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, User-Agent, DNT, Cache-Control, X-Mx-ReqToken, Keep-Alive, X-Requested-With, If-Modified-Since, X-Request-ID, Idempotency-Key")
				c.Header("Access-Control-Expose-Headers", "Content-Length, Content-Range, X-Request-ID")
				c.Header("Access-Control-Max-Age", "86400")
			}
		}

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
