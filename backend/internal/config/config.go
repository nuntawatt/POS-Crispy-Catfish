package config

import (
	"fmt"
	"net/url"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration values for the POS-Crispy-Catfish backend.
type Config struct {
	// HTTP Server settings
	Port    string
	GinMode string

	// Database settings
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string

	// JWT Authentication
	JWTSecret        string
	JWTAccessExpiry  time.Duration
	JWTRefreshExpiry time.Duration

	// Restaurant Information
	RestaurantName    string
	RestaurantAddress string
	RestaurantLat     float64
	RestaurantLng     float64

	// Delivery configuration
	DeliveryRadiusKM float64
}

// Load loads application configuration from environment variables and an optional .env file.
func Load() (*Config, error) {
	// Attempt loading .env file; silently ignore if not found
	_ = godotenv.Load()

	cfg := &Config{
		Port:              getEnv("PORT", "8080"),
		GinMode:           getEnv("GIN_MODE", "debug"),
		DBHost:            getEnv("DB_HOST", "localhost"),
		DBPort:            getEnv("DB_PORT", "5432"),
		DBUser:            getEnv("DB_USER", "postgres"),
		DBPassword:        os.Getenv("DB_PASSWORD"),
		DBName:            getEnv("DB_NAME", "crispy_catfish"),
		DBSSLMode:         getEnv("DB_SSLMODE", "disable"),
		JWTSecret:         os.Getenv("JWT_SECRET"),
		RestaurantName:    getEnv("RESTAURANT_NAME", "Crispy Catfish"),
		RestaurantAddress: getEnv("RESTAURANT_ADDRESS", "123 Bangkok Road, Bangkok, Thailand"),
	}

	// Validate required secrets / credentials
	if cfg.DBPassword == "" {
		return nil, fmt.Errorf("required environment variable missing: DB_PASSWORD")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("required environment variable missing: JWT_SECRET")
	}

	// Parse JWT Access Expiry
	accessExpiryStr := getEnv("JWT_ACCESS_EXPIRY", "15m")
	accessExpiry, err := time.ParseDuration(accessExpiryStr)
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_ACCESS_EXPIRY '%s': %w", accessExpiryStr, err)
	}
	cfg.JWTAccessExpiry = accessExpiry

	// Parse JWT Refresh Expiry
	refreshExpiryStr := getEnv("JWT_REFRESH_EXPIRY", "168h") // 7 days
	refreshExpiry, err := time.ParseDuration(refreshExpiryStr)
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_REFRESH_EXPIRY '%s': %w", refreshExpiryStr, err)
	}
	cfg.JWTRefreshExpiry = refreshExpiry

	// Parse Restaurant Coordinates
	latStr := getEnv("RESTAURANT_LAT", "13.7563")
	lat, err := strconv.ParseFloat(latStr, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid RESTAURANT_LAT '%s': %w", latStr, err)
	}
	cfg.RestaurantLat = lat

	lngStr := getEnv("RESTAURANT_LNG", "100.5018")
	lng, err := strconv.ParseFloat(lngStr, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid RESTAURANT_LNG '%s': %w", lngStr, err)
	}
	cfg.RestaurantLng = lng

	// Parse Delivery Radius KM
	radiusStr := getEnv("DELIVERY_RADIUS_KM", "15.0")
	radius, err := strconv.ParseFloat(radiusStr, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid DELIVERY_RADIUS_KM '%s': %w", radiusStr, err)
	}
	cfg.DeliveryRadiusKM = radius

	return cfg, nil
}

// DatabaseDSN returns a PostgreSQL connection URI formatted with URL-encoded credentials.
func (c *Config) DatabaseDSN() string {
	encodedUser := url.QueryEscape(c.DBUser)
	encodedPass := url.QueryEscape(c.DBPassword)
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		encodedUser,
		encodedPass,
		c.DBHost,
		c.DBPort,
		c.DBName,
		c.DBSSLMode,
	)
}

func getEnv(key, defaultVal string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return defaultVal
}
