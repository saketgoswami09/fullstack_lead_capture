import { useState, useEffect } from "react";
import { 
  Search, LogOut, LayoutGrid, Sparkles, ChevronDown, 
  Users, Inbox, MessageCircle, CheckCircle 
} from "lucide-react";
import { useGetLeadsQuery, useUpdateLeadStatusMutation } from "../../store/leadsApi";
import {
  Button,
  Card,
  Input,
  Avatar,
  Dropdown,
  DropdownItem,
} from "../../components/ui";

// Increased contrast for better scanability
const STAGE_STYLES = {
  New: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
  Contacted: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
  Closed: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
};

// Helper for human-readable dates
const formatDate = (dateString) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    if (diffInHours === 0) return "Less than an hour ago";
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(date);
};

export default function AdminPage() {
  const [secret, setSecret] = useState(sessionStorage.getItem("adminSecret") || "");
  
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { data, isLoading, isError, error } = useGetLeadsQuery(
    { search: debouncedSearch, page, limit: 10, secret },
    { skip: !secret }
  );

  const [updateStatus] = useUpdateLeadStatusMutation();

  const handleLogin = (e) => {
    e.preventDefault();
    const val = new FormData(e.target).get("secret");
    sessionStorage.setItem("adminSecret", val);
    setSecret(val);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminSecret");
    setSecret("");
  };

  const onStatusChange = async (id, newStatus) => {
    setActionError(null);
    try {
      await updateStatus({ id, status: newStatus, secret }).unwrap();
    } catch (err) {
      console.error("Failed to update status:", err);
      setActionError("Failed to update lead status. Please try again.");
      setTimeout(() => setActionError(null), 3000);
    }
  };

  if (!secret) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
        <Card className="w-full max-w-sm p-6 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl border-line">
          <div className="text-center space-y-2">
            <div className="brand-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-ink">Admin Access</h1>
            <p className="text-sm text-ink-soft">Enter the admin secret to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input name="secret" type="password" placeholder="x-admin-secret..." required />
            <Button type="submit" className="w-full transition-all active:scale-95">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const leads = data?.data?.leads || [];
  const pagination = data?.data?.pagination || { total: leads.length, page: 1, totalPages: 1 };
  
  // Safely compute stats dynamically if the backend doesn't explicitly return them
  const computedStats = leads.reduce(
    (acc, lead) => {
      if (lead.status === "New") acc.new++;
      if (lead.status === "Contacted") acc.contacted++;
      if (lead.status === "Closed") acc.closed++;
      return acc;
    },
    { new: 0, contacted: 0, closed: 0 }
  );

  const stats = data?.data?.stats || { 
    total: pagination.total, 
    new: computedStats.new, 
    contacted: computedStats.contacted, 
    closed: computedStats.closed 
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Top Nav */}
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-ink">LeadCapture CRM</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-surface-muted transition-colors">
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:px-6 lg:px-8 py-8 mx-auto w-full max-w-7xl space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink mb-1">Leads Pipeline</h1>
          <p className="text-sm text-ink-soft">Track and qualify your incoming leads.</p>
        </div>

        {/* ── KPI Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "New", value: stats.new, icon: Inbox, color: "text-sky-500", bg: "bg-sky-50" },
            { label: "Contacted", value: stats.contacted, icon: MessageCircle, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Closed", value: stats.closed, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-5 border-line shadow-sm rounded-2xl flex flex-col justify-center relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-semibold text-ink-soft">{kpi.label}</span>
              </div>
              <span className="text-3xl font-bold text-ink">{isLoading ? "-" : kpi.value}</span>
            </Card>
          ))}
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div className="flex items-center p-3 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-100 rounded-xl animate-in fade-in slide-in-from-top-2">
            {actionError}
          </div>
        )}

        <Card className="p-4 space-y-4 shadow-[0_4px_20px_rgb(0,0,0,0.02)] rounded-2xl border-line">
          {/* Toolbar - Widened search to max-w-2xl */}
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email..."
              className="pl-10 w-full transition-all focus:ring-2"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
                  <tr>
                    <th className="px-6 py-3.5">Lead</th>
                    <th className="px-6 py-3.5">Created</th>
                    <th className="px-6 py-3.5">Budget</th>
                    <th className="px-6 py-3.5">Message</th>
                    <th className="px-6 py-3.5 text-right">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-line last:border-0 h-[72px]">
                      <td className="px-6"><div className="h-10 w-48 bg-surface-muted animate-pulse rounded-lg"></div></td>
                      <td className="px-6"><div className="h-4 w-20 bg-surface-muted animate-pulse rounded"></div></td>
                      <td className="px-6"><div className="h-5 w-24 bg-surface-muted animate-pulse rounded-md"></div></td>
                      <td className="px-6"><div className="h-4 w-64 bg-surface-muted animate-pulse rounded"></div></td>
                      <td className="px-6 flex justify-end items-center h-[72px]"><div className="h-8 w-24 bg-surface-muted animate-pulse rounded-lg"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-rose-600 bg-rose-50 rounded-xl border border-rose-200">
              {error?.status === 401 ? "Unauthorized. Check your admin secret." : "Failed to load leads."}
            </div>
          ) : leads.length === 0 ? (
            // Updated Empty State
            <div className="p-12 text-center border border-dashed border-line rounded-xl bg-surface-muted/30">
              <LayoutGrid className="mx-auto h-8 w-8 text-ink-soft/40 mb-3" />
              <h3 className="font-semibold text-ink">No leads yet</h3>
              <p className="text-sm text-ink-soft mt-1">Your captured leads will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="border-b border-line bg-surface-muted/40 text-xs uppercase tracking-wide text-ink-soft">
                  <tr>
                    <th className="px-6 py-3.5 font-medium">Lead</th>
                    <th className="px-6 py-3.5 font-medium">Created</th>
                    <th className="px-6 py-3.5 font-medium">Budget</th>
                    <th className="px-6 py-3.5 font-medium">Message</th>
                    <th className="px-6 py-3.5 font-medium text-right">Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const styleClass = STAGE_STYLES[lead.status] || STAGE_STYLES.New;
                    return (
                      <tr key={lead._id} className="border-b border-line last:border-0 hover:bg-surface-muted/40 transition-colors duration-150 group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar name={lead.name} size="sm" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-ink">{lead.name}</span>
                              <span className="text-xs text-ink-soft">{lead.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-ink-soft font-medium">
                          {formatDate(lead.createdAt)}
                        </td>
                        {/* Subtle pill for budget */}
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                            {lead.budgetRange}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-ink-soft max-w-[280px] lg:max-w-[400px] truncate" title={lead.message}>
                            {lead.message}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Dropdown
                            align="right"
                            trigger={
                              <button className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${styleClass}`}>
                                {lead.status}
                                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                              </button>
                            }
                          >
                            <DropdownItem onClick={() => onStatusChange(lead._id, "New")}>Mark as New</DropdownItem>
                            <DropdownItem onClick={() => onStatusChange(lead._id, "Contacted")}>Mark as Contacted</DropdownItem>
                            <DropdownItem onClick={() => onStatusChange(lead._id, "Closed")}>Mark as Closed</DropdownItem>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-line pt-4 px-2">
              <span className="text-sm text-ink-soft">
                Showing page <span className="font-medium text-ink">{pagination.page}</span> of <span className="font-medium text-ink">{pagination.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page === pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}