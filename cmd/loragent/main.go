// Loragent Go CLI tool.
package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/Maijied/Loragent/pkg/loragent"
)

func printUsage() {
	fmt.Printf("Loragent Go CLI (v%s) — Universal Multi-Agent Ecosystem for Lorapok Labs\n\n", loragent.Version)
	fmt.Println("Usage:")
	fmt.Println("  loragent <command> [arguments]")
	fmt.Println("\nCommands:")
	fmt.Println("  version                   Print the CLI and SDK version")
	fmt.Println("  formations                List available multi-agent squad formations")
	fmt.Println("  health                    Check Cloudflare Edge MCP health")
	fmt.Println("  summary                   Display catalog and formations statistics")
	fmt.Println("  pkgsite <module> [ver]    Query pkg.go.dev/v1 API for module metadata")
	fmt.Println("  boss <formation> [task]   Orchestrate multi-agent workflow")
	fmt.Println("\nExamples:")
	fmt.Println("  loragent formations")
	fmt.Println("  loragent health")
	fmt.Println("  loragent boss auto \"Build full-stack web application\"")
}

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(0)
	}

	cmd := os.Args[1]
	client := loragent.NewClient()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	switch cmd {
	case "version", "-v", "--version":
		fmt.Printf("loragent version %s (Go runtime)\n", loragent.Version)

	case "formations":
		fmt.Println("🤖 Loragent 6 Multi-Agent Formations:")
		for _, f := range loragent.Formations {
			fmt.Printf("  • %s\n", strings.ToUpper(f))
		}

	case "health":
		fmt.Printf("Checking Edge MCP Health (%s/health)...\n", client.MCPURL)
		ok, err := client.CheckHealth(ctx)
		if err != nil {
			fmt.Printf("🔴 Edge MCP health check error: %v\n", err)
			os.Exit(1)
		}
		if ok {
			fmt.Println("🟢 Edge MCP Server is LIVE and responsive (HTTP 200 OK).")
		} else {
			fmt.Println("🟡 Edge MCP Server returned non-200 status.")
		}

	case "summary":
		s := client.GetSummary()
		fmt.Printf("📊 Loragent Ecosystem Summary (v%s):\n", loragent.Version)
		fmt.Printf("  • Total Items:   %d\n", s.TotalItems)
		fmt.Printf("  • Agents Count:  %d\n", s.AgentsCount)
		fmt.Printf("  • MCP Servers:   %d\n", s.MCPCount)
		fmt.Printf("  • Formations:    %s\n", strings.Join(s.Formations, ", "))
		fmt.Printf("  • Portal:        %s\n", client.PortalURL)

	case "pkgsite":
		if len(os.Args) < 3 {
			fmt.Println("Usage: loragent pkgsite <module-path> [version]")
			os.Exit(1)
		}
		modPath := os.Args[2]
		ver := "latest"
		if len(os.Args) >= 4 {
			ver = os.Args[3]
		}
		fmt.Printf("Querying pkg.go.dev/v1/module/%s?version=%s...\n", modPath, ver)
		info, err := client.GetPkgsiteModule(ctx, modPath, ver)
		if err != nil {
			fmt.Printf("⚠️  Pkgsite query notice: %v\n", err)
		} else {
			fmt.Printf("📦 Module: %s\n", info.ModulePath)
			fmt.Printf("🏷️  Version: %s\n", info.Version)
			if info.CommitTime != "" {
				fmt.Printf("🕒 Commit Time: %s\n", info.CommitTime)
			}
		}

	case "boss":
		formation := "auto"
		task := "Universal Multi-Agent Orchestration"
		if len(os.Args) >= 3 {
			formation = os.Args[2]
		}
		if len(os.Args) >= 4 {
			task = strings.Join(os.Args[3:], " ")
		}
		fmt.Printf("⚡ Loragent Boss activated!\n")
		fmt.Printf("  • Formation: [%s]\n", strings.ToUpper(formation))
		fmt.Printf("  • Directive: %s\n", task)
		fmt.Printf("  • Orchestration URL: %s\n", client.PortalURL)

	default:
		flag.Usage = printUsage
		flag.CommandLine.Parse(os.Args[1:])
	}
}
