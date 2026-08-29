package loragent

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestNewClient(t *testing.T) {
	client := NewClient(
		WithPortalURL("https://custom.loragent.test"),
		WithMCPURL("https://custom.mcp.test"),
	)

	if client.PortalURL != "https://custom.loragent.test" {
		t.Errorf("expected portal URL 'https://custom.loragent.test', got '%s'", client.PortalURL)
	}

	if client.MCPURL != "https://custom.mcp.test" {
		t.Errorf("expected MCP URL 'https://custom.mcp.test', got '%s'", client.MCPURL)
	}
}

func TestFormations(t *testing.T) {
	if len(Formations) != 6 {
		t.Fatalf("expected 6 formations, got %d", len(Formations))
	}

	expected := map[string]bool{
		"auto":      true,
		"office":    true,
		"chela":     true,
		"freelance": true,
		"observer":  true,
		"spidernet": true,
	}

	for _, f := range Formations {
		if !expected[f] {
			t.Errorf("unexpected formation: %s", f)
		}
	}
}

func TestCheckHealth(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/health" {
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`{"status":"ok"}`))
			return
		}
		w.WriteHeader(http.StatusNotFound)
	}))
	defer ts.Close()

	client := NewClient(WithMCPURL(ts.URL))
	ok, err := client.CheckHealth(context.Background())
	if err != nil {
		t.Fatalf("CheckHealth failed: %v", err)
	}
	if !ok {
		t.Errorf("expected health check to return true")
	}
}

func TestGetSummary(t *testing.T) {
	client := NewClient()
	summary := client.GetSummary()

	if summary.TotalItems != 257 {
		t.Errorf("expected 257 total items, got %d", summary.TotalItems)
	}
	if summary.AgentsCount != 224 {
		t.Errorf("expected 224 agents, got %d", summary.AgentsCount)
	}
	if summary.MCPCount != 20 {
		t.Errorf("expected 20 MCP servers, got %d", summary.MCPCount)
	}
}
