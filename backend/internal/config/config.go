package config

// Config holds all application configuration.
// TODO: Implement environment loading and validation.
type Config struct {
	Port           string
	DatabaseURL    string
	JWTSecret      string
	JWTAccessExp   string
	JWTRefreshExp  string
	GinMode        string
}
