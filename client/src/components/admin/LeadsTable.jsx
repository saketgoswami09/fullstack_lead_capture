// src/components/admin/LeadsTable.jsx — Admin leads table
// Responsibilities:
//   - Render a table of all leads (name, email, budget, message, createdAt, status)
//   - Status toggle button per row: New → Contacted → Closed → New (cycle)
//   - Call onStatusChange(id, newStatus) prop on toggle

// Props:
//   leads          Lead[]
//   onStatusChange (id: string, status: string) => void

// export default function LeadsTable({ leads, onStatusChange }) { ... }
