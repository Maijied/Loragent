import React from 'react';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-900 font-sans selection:bg-blue-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              L
            </div>
            <span className="font-semibold text-lg text-gray-900">Lorapok Labs</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Security & Trust</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</a>
            <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 text-center lg:text-left space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Enterprise-grade <span className="text-blue-600">AI orchestration</span> for modern teams.
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Loragent provides absolute security and zero-trust credential management while synchronizing your AI coding assistants across Cursor, VSCode, and Claude Desktop.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button className="w-full sm:w-auto px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                Install Loragent CLI
              </button>
              <button className="w-full sm:w-auto px-6 py-3 rounded-md bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                Read Documentation
              </button>
            </div>
            
            <div className="pt-8 border-t border-gray-200 mt-8">
              <p className="text-sm text-gray-500 font-medium mb-4">TRUSTED BY ENGINEERING TEAMS USING</p>
              <div className="flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale">
                {/* Mock logos */}
                <div className="font-bold text-lg">Cursor</div>
                <div className="font-bold text-lg">VSCode</div>
                <div className="font-bold text-lg">Claude Desktop</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-6">
            {/* Clean UI Diagram Mockup */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden p-6 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 {/* Decorative element */}
                 <svg width="100" height="100" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 10l80 80M90 10L10 90"/></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Vault Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium text-gray-700">Machine PIN Enclave</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Secured</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-medium text-gray-700">Workspace Guard</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="font-medium text-gray-700">Telemetry Sync</span>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Structured Architecture Section */}
      <section className="bg-white border-y border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">LLDP Architecture</h2>
            <p className="mt-4 text-gray-600">Structured for scalability, built for security.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { id: "01", title: "FACE", desc: "CLI routing and interaction." },
              { id: "02", title: "PULSE", desc: "Always-on telemetry daemon." },
              { id: "03", title: "LORE", desc: "Model intelligence rules." },
              { id: "04", title: "PORT", desc: "Cross-platform MCP tools." },
              { id: "05", title: "LOOM", desc: "Orchestration & graph execution." }
            ].map((layer, idx) => (
              <div key={idx} className="relative group">
                <div className="text-5xl font-extrabold text-gray-100 mb-4">{layer.id}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{layer.title}</h3>
                <p className="text-sm text-gray-600">{layer.desc}</p>
                {/* Connecting line for desktop */}
                {idx < 4 && <div className="hidden lg:block absolute top-8 -right-4 w-8 h-px bg-gray-200"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
