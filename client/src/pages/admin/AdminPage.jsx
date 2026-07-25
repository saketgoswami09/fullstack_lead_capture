import { useState } from "react";
import { Search, LogOut, LayoutGrid, ArrowUpRight, Sparkles } from "lucide-react";
import { useGetLeadsQuery, useUpdateLeadStatusMutation } from "../../store/leadsApi";
import {
  Button,
  Card,
  Input,
  Badge,
  Avatar,
  Dropdown,
  DropdownItem,
  Spinner,
} from "../../components/ui";

const STAGE_STYLES = {
  New: { badge: "bg-sky-50 text-sky-700", dot: "bg-sky-500" },
  Contacted: { badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Closed: { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
};

export default function AdminPage() {
  const [secret, setSecret] = useState(sessionStorage.getItem("adminSecret") || "");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useGetLeadsQuery(
    { search, page, limit: 10, secret },
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
    try {
      await updateStatus({ id, status: newStatus, secret }).unwrap();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!secret) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
        <Card className="w-full max-w-sm p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="brand-gradient mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-ink">Admin Access</h1>
            <p className="text-sm text-ink-soft">Enter the admin secret to continue.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input name="secret" type="password" placeholder="x-admin-secret..." required />
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </Card>
      </div>
    );
  }

  const leads = data?.data?.leads || [];
  const pagination = data?.data?.pagination || {};

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
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:px-6 lg:px-8 py-8 mx-auto w-full max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">Leads Pipeline</h1>
            <p className="text-sm text-ink-soft">Track and qualify your incoming leads.</p>
          </div>
        </div>

        <Card className="p-4 space-y-4">
          {/* Toolbar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email..."
              className="pl-10"
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            <div className="p-8 text-center text-rose-600 bg-rose-50 rounded-xl border border-rose-200">
              {error?.status === 401 ? "Unauthorized. Check your admin secret." : "Failed to load leads."}
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-line rounded-xl">
              <LayoutGrid className="mx-auto h-8 w-8 text-ink-soft/40 mb-3" />
              <h3 className="font-semibold text-ink">No leads found</h3>
              <p className="text-sm text-ink-soft mt-1">Try adjusting your search filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-line bg-surface-muted/40 text-xs uppercase tracking-wide text-ink-soft">
                  <tr>
                    <th className="px-6 py-3.5 font-medium">Lead</th>
                    <th className="px-6 py-3.5 font-medium">Stage</th>
                    <th className="px-6 py-3.5 font-medium">Budget</th>
                    <th className="px-6 py-3.5 font-medium">Message</th>
                    <th className="px-6 py-3.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => {
                    const stage = STAGE_STYLES[lead.status] || STAGE_STYLES.New;
                    return (
                      <tr key={lead._id} className="border-b border-line last:border-0 hover:bg-surface-muted/50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={lead.name} size="sm" />
                            <div>
                              <p className="font-medium text-ink">{lead.name}</p>
                              <p className="text-xs text-ink-soft">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={stage.badge} dot={stage.dot}>{lead.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-ink-soft">{lead.budgetRange}</td>
                        <td className="px-6 py-4 text-ink-soft max-w-[200px] truncate" title={lead.message}>
                          {lead.message}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Dropdown
                            align="right"
                            trigger={
                              <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                Update status
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
                Showing page {pagination.page} of {pagination.totalPages}
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
