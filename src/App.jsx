
import { useState } from "react";
import "./App.css";
const API_BASE_URL = "http://127.0.0.1:8000";

const tools = [
  {
    icon: "▤",
    color: "purple",
    title: "Invoice Generator",
    description: "Create professional invoices and track client payments.",
    tag: "PDF EXPORT",
    action: "Create invoice",
  },
  {
    icon: "✳",
    color: "orange",
    title: "Proposal Writer",
    description: "Write personalized proposals for your next client.",
    tag: "AI WRITING",
    action: "Write proposal",
  },
  {
    icon: "✉",
    color: "blue",
    title: "Client Messages",
    description: "Draft professional emails and payment reminders.",
    tag: "SMART REPLIES",
    action: "Write message",
  },
  {
    icon: "↗",
    color: "green",
    title: "Product Listings",
    description: "Turn product details into compelling descriptions.",
    tag: "FOR SELLERS",
    action: "Create listing",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [selectedTool, setSelectedTool] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [notice, setNotice] = useState("");

  const [clientName, setClientName] = useState("");
  const [project, setProject] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [proposal, setProposal] = useState("");
  const [loadingProposal, setLoadingProposal] = useState(false);
  const [proposalError, setProposalError] = useState("");
  const navItems = [
    { name: "Overview", icon: "⌂" },
    { name: "Invoices", icon: "▤" },
    { name: "Proposals", icon: "✳" },
    { name: "Messages", icon: "✉" },
    { name: "Listings", icon: "◇" },
  ];

  
  function openTool(tool) {
    setSelectedTool(tool);
    setPrompt("");
    setNotice("");
    setProposal("");
    setProposalError("");
    setClientName("");
    setProject("");
    setBudget("");
    setTimeline("");
  }


  function handleToolSubmit(event) {
    event.preventDefault();

    if (!prompt.trim()) {
      setNotice("Please enter some details first.");
      return;
    }

   setNotice(
      `${selectedTool.title} is not connected yet. Proposal Writer is currently connected to the backend.`
    );
  }

//   function handleNavigation(name) {
//     setActivePage(name);
//     setSelectedTool(null);
//     setNotice("");
//   }
// // backend ko frontend se add kar rahe hainn
// const [apiResult, setApiResult] = useState("");
// const [apiLoading, setApiLoading] = useState(false);

// async function testBackend() {
//   setApiLoading(true);
//   setApiResult("");

//   try {
//     const response = await fetch(
//       "http://127.0.0.1:8000/api/health"
//     );

//     if (!response.ok) {
//       throw new Error("Backend request failed");
//     }

//     const data = await response.json();
//     setApiResult(data.message || data.status);
//   } catch (error) {
//     setApiResult(
//       "Backend connect nahi hua. Check karo ki backend running hai."
//     );
//   } finally {
//     setApiLoading(false);
//   }
// }

  async function generateProposal(event) {
    event.preventDefault();
    setProposal("");
    setProposalError("");
    
    if (!clientName.trim() || !project.trim() || !budget.trim() || !timeline.trim()) {
      setProposalError("Please fill in all fields before generating the proposal.");
      return;
    }

    setLoadingProposal(true);
   try {
      const response = await fetch(`${API_BASE_URL}/api/generate-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_name: clientName.trim(),
          project: project.trim(),
          budget: budget.trim(),
          timeline: timeline.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success || !data.proposal) {
        throw new Error(data.message || `Proposal generation failed (HTTP ${response.status}).`);
      }
      setProposal(data.proposal);
    } catch (error) {
      setProposalError(
        error.message?.includes("Failed to fetch")
          ? "Backend connect nahi hua. Check karo ki FastAPI backend port 8000 par running hai aur CORS enabled hai."
          : error.message || "Backend se connect nahi ho paya."
      );
    } finally {
      setLoadingProposal(false);
    }
  }
  async function copyProposal() {
    try {
      await navigator.clipboard.writeText(proposal);
      setNotice("Proposal copied to clipboard.");
    } catch {
      setProposalError("Copy nahi ho paya. Proposal text select karke manually copy karein.");
    }
  }

  function handleNavigation(name) {
    setActivePage(name);
    setSelectedTool(null);
    setNotice("");
    setProposalError("");
  }
 return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">g</div>
          <span>gigcraft<span className="brand-dot">.</span></span>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activePage === item.name ? "active" : ""}`}
              onClick={() => handleNavigation(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Invoices" && <span className="nav-count">0</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <strong>Your next big idea starts here.</strong>
            <p>Work smarter. Build your business.</p>
          </div>
          <div className="profile">
            <div className="avatar">G</div>
            <div className="profile-info">
              <strong>GigCraft User</strong>
              <span>Free workspace</span>
            </div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>
  <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {selectedTool ? selectedTool.title : activePage}</div>
          <div className="topbar-right">
            <span className="status-dot" />
            AI workspace
            <button
              className="help-button"
              onClick={() => setNotice("More help options will be added soon.")}
              aria-label="Help"
            >
              ?
            </button>
          </div>
        </header>
  <div className="page-content">
          {selectedTool ? (
            <section className="tool-workspace">
              <button className="back-button" onClick={() => { setSelectedTool(null); setNotice(""); }}>
                ← Back to dashboard
              </button>

              <div className="tool-heading">
                <div className={`tool-icon ${selectedTool.color}`}>{selectedTool.icon}</div>
                <div>
                  <span className="eyebrow">GIGCRAFT AI STUDIO</span>
                  <h1>{selectedTool.title}</h1>
                  <p>{selectedTool.description}</p>
                </div>
              </div>
              {selectedTool.title === "Proposal Writer" ? (
                <form className="prompt-panel" onSubmit={generateProposal}>
                  <label htmlFor="client-name">Client or company name</label>
                  <input
                    id="client-name"
                    value={clientName}
                    onChange={(event) => setClientName(event.target.value)}
                    placeholder="e.g. Acme Studio"
                    required
                  />
     <label htmlFor="project-details">Project details and requirements</label>
                  <textarea
                    id="project-details"
                    value={project}
                    onChange={(event) => setProject(event.target.value)}
                    placeholder="Describe the project, deliverables and your skills..."
                    rows={5}
                    required
                  />
  <div className="proposal-fields">
                    <div>
                      <label htmlFor="project-budget">Budget</label>
                      <input
                        id="project-budget"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        placeholder="e.g. ₹10,000"
                        required
                      />
      </div>
                    <div>
                      <label htmlFor="project-timeline">Timeline</label>
                      <input
                        id="project-timeline"
                        value={timeline}
                        onChange={(event) => setTimeline(event.target.value)}
                        placeholder="e.g. 7 days"
                        required
                      />
                    </div>
                  </div>
                  <div className="prompt-footer">
                    <span>Review the proposal before sending it to your client.</span>
                    <button className="primary-button" type="submit" disabled={loadingProposal}>
                      {loadingProposal ? "Generating..." : "Generate Proposal"} <span>→</span>
                    </button>
                  </div>
                  {proposalError && <p className="notice" role="alert">{proposalError}</p>}
                  {proposal && (
                    <div className="proposal-result">
                      <h2>Your Proposal</h2>
                      <pre>{proposal}</pre>
                      <button type="button" className="primary-button" onClick={copyProposal}>Copy Proposal</button>
                    </div>
                  )}
                </form>
              ) : (
                <form className="prompt-panel" onSubmit={handleToolSubmit}>
                  <label htmlFor="tool-prompt">Tell us what you want to create</label>
                  <textarea
                    id="tool-prompt"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder={
                      selectedTool.title === "Invoice Generator"
                        ? "Client name, service, amount, due date..."
                        : selectedTool.title === "Client Messages"
                        ? "Who are you writing to, and what do you need to say?"
                        : "Product name, features, audience and tone..."
                    }
                    rows={6}
                  />
                  <div className="prompt-footer">
                    <span>Be specific for better results</span>
                    <button className="primary-button" type="submit">Prepare request <span>→</span></button>
                  </div>
                  {notice && <p className="notice" role="status">{notice}</p>}
                </form>
              )}
             <div className="privacy-note">
                <span>✦</span> AI-generated content should be reviewed before sending to clients.
              </div>
            </section>
          ) : (
            <>            <section className="welcome-section">
                <div>
                  <div className="eyebrow">MONDAY, OCTOBER 19</div>
                  <h1>Make room for <span>great work.</span></h1>
                  <p className="welcome-description">Less busywork, more business. What are we creating today?</p>
                </div>
                <div className="welcome-art" aria-hidden="true">
                  <div className="art-orbit orbit-one" />
                  <div className="art-orbit orbit-two" />
                  <div className="art-star">✳</div>
                  <div className="art-spark">✦</div>
                </div>
              </section>
              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top"><span>Invoices created</span><span className="stat-icon purple">▤</span></div>
                  <div className="stat-number">0</div>
                  <div className="stat-caption">Your invoices will appear here</div>
                </div>
                <div className="stat-card">
                  <div className="stat-top"><span>Pending payments</span><span className="stat-icon orange">◷</span></div>
                  <div className="stat-number">₹0</div>
                  <div className="stat-caption">No outstanding payments tracked</div>
                </div>
                <div className="stat-card">
                  <div className="stat-top"><span>AI creations</span><span className="stat-icon blue">✳</span></div>
                  <div className="stat-number">0</div>
                  <div className="stat-caption">Your creative work starts here</div>
                </div>
              </section>
         <section className="tools-section">
                <div className="section-heading">
                  <div><span className="eyebrow">YOUR CREATIVE TOOLKIT</span><h2>What do you need today?</h2></div>
                  <span className="tool-count">04 TOOLS</span>
                </div>
                <div className="tools-grid">
                  {tools.map((tool) => (
                    <article className="tool-card" key={tool.title}>
                      <div className="tool-card-top">
                        <div className={`tool-icon ${tool.color}`}>{tool.icon}</div>
                        <span className="tool-tag">{tool.tag}</span>
                      </div>
                      <h3>{tool.title}</h3>
                      <p>{tool.description}</p>
                      <button className="tool-action" onClick={() => openTool(tool)}>{tool.action} <span>↗</span></button>
                    </article>
                  ))}
                </div>
              </section>
                            <section className="bottom-banner">
                <div className="banner-symbol">✦</div>
                <div><h3>Your business, your rules.</h3><p>Built for independent creators who want to do more with less.</p></div>
                <span className="banner-label">MADE FOR INDIE BUSINESS</span>
              </section>
              {notice && <p className="notice" role="status">{notice}</p>}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
export default App;

  