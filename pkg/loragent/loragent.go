// Package loragent provides the official Go SDK for the Loragent Universal Multi-Agent Ecosystem.
// It exposes formation configurations, edge MCP telemetry, and catalog registry querying.
package loragent

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

// Version of the Loragent Go SDK.
const Version = "2.0.0"

// Default endpoints.
const (
	DefaultPortalURL = "https://loragent.lorapok.tech"
	DefaultMCPURL    = "https://mcp.lorapk-labs.workers.dev"
	DefaultPkgsiteURL = "https://pkg.go.dev/v1"
)

// Supported squad formations.
const (
	FormationAuto      = "auto"
	FormationOffice    = "office"
	FormationChela     = "chela"
	FormationFreelance = "freelance"
	FormationObserver  = "observer"
	FormationSpidernet = "spidernet"
)

// Formations contains all active multi-agent squad formations.
var Formations = []string{
	FormationAuto,
	FormationOffice,
	FormationChela,
	FormationFreelance,
	FormationObserver,
	FormationSpidernet,
}

// Client interacts with the Loragent platform and edge MCP services.
type Client struct {
	PortalURL  string
	MCPURL     string
	HTTPClient *http.Client
}

// Option configures a Client.
type Option func(*Client)

// WithPortalURL sets custom portal endpoint.
func WithPortalURL(url string) Option {
	return func(c *Client) {
		c.PortalURL = strings.TrimRight(url, "/")
	}
}

// WithMCPURL sets custom MCP endpoint.
func WithMCPURL(url string) Option {
	return func(c *Client) {
		c.MCPURL = strings.TrimRight(url, "/")
	}
}

// WithHTTPClient sets a custom http.Client.
func WithHTTPClient(client *http.Client) Option {
	return func(c *Client) {
		c.HTTPClient = client
	}
}

// NewClient initializes a new Loragent Client.
func NewClient(opts ...Option) *Client {
	portal := os.Getenv("LORAGENT_PORTAL_URL")
	if portal == "" {
		portal = DefaultPortalURL
	}
	mcp := os.Getenv("LORAGENT_MCP_URL")
	if mcp == "" {
		mcp = DefaultMCPURL
	}

	c := &Client{
		PortalURL: strings.TrimRight(portal, "/"),
		MCPURL:    strings.TrimRight(mcp, "/"),
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}

	for _, opt := range opts {
		opt(c)
	}

	return c
}

// HealthStatus represents the health check response from the edge MCP server.
type HealthStatus struct {
	Status    string `json:"status"`
	Version   string `json:"version,omitempty"`
	Timestamp string `json:"timestamp,omitempty"`
}

// CheckHealth verifies Edge MCP connectivity.
func (c *Client) CheckHealth(ctx context.Context) (bool, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.MCPURL+"/health", nil)
	if err != nil {
		return false, fmt.Errorf("failed to create health request: %w", err)
	}
	req.Header.Set("User-Agent", "Loragent-Go-SDK/"+Version)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return false, fmt.Errorf("health check request failed: %w", err)
	}
	defer resp.Body.Close()

	return resp.StatusCode == http.StatusOK, nil
}

// CatalogSummary represents an aggregated summary of the Loragent agent ecosystem.
type CatalogSummary struct {
	TotalItems  int      `json:"totalItems"`
	AgentsCount int      `json:"agentsCount"`
	MCPCount    int      `json:"mcpCount"`
	Formations  []string `json:"formations"`
}

// GetSummary returns a summary of ecosystem assets.
func (c *Client) GetSummary() CatalogSummary {
	return CatalogSummary{
		TotalItems:  257,
		AgentsCount: 224,
		MCPCount:    20,
		Formations:  Formations,
	}
}

// PkgsiteModuleInfo represents metadata returned from Go Pkgsite API v1.0.0.
type PkgsiteModuleInfo struct {
	ModulePath string `json:"module_path"`
	Version    string `json:"version"`
	CommitTime string `json:"commit_time,omitempty"`
	Readme     string `json:"readme,omitempty"`
}

// GetPkgsiteModule queries pkg.go.dev/v1/module/{path} per the openapi.yaml specification.
func (c *Client) GetPkgsiteModule(ctx context.Context, modulePath string, version string) (*PkgsiteModuleInfo, error) {
	if version == "" {
		version = "latest"
	}
	url := fmt.Sprintf("%s/module/%s?version=%s", DefaultPkgsiteURL, modulePath, version)

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create pkgsite request: %w", err)
	}
	req.Header.Set("User-Agent", "Loragent-Go-SDK/"+Version)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("pkgsite request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("pkgsite returned HTTP %d", resp.StatusCode)
	}

	var info PkgsiteModuleInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return nil, fmt.Errorf("failed to decode pkgsite response: %w", err)
	}

	return &info, nil
}
