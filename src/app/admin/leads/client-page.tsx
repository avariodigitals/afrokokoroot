"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Mail } from "lucide-react"
import { toast } from "sonner"
import { Lead } from "@/lib/types"

interface LeadsClientPageProps {
  initialLeads: Lead[]
}

export function LeadsClientPage({ initialLeads }: LeadsClientPageProps) {
  const [leads] = useState<Lead[]>(initialLeads)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLeads = searchQuery
    ? leads.filter(lead => lead.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : leads

  const exportToCSV = () => {
    if (leads.length === 0) {
      toast.error("No leads to export")
      return
    }

    const headers = ["ID", "Email", "Date", "Status"]
    const csvContent = [
      headers.join(","),
      ...leads.map(lead => [
        lead.id,
        lead.email,
        new Date(lead.date).toLocaleDateString(),
        lead.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Leads</h1>
          <p className="text-muted-foreground">Manage your newsletter subscribers and export data.</p>
        </div>
        <Button onClick={exportToCSV} className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search emails..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-3 font-medium text-slate-500">Email</th>
              <th className="px-6 py-3 font-medium text-slate-500">Date Subscribed</th>
              <th className="px-6 py-3 font-medium text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    {lead.email}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(lead.date).toLocaleDateString()} at {new Date(lead.date).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
