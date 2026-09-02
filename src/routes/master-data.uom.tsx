import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2, FileText, Save, PlusCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/master-data/uom")({
  head: () => ({
    meta: [
      { title: "Master Data — Unit of Measurement" },
      { name: "description", content: "Master Data for Unit of Measurement." },
    ],
  }),
  component: UoMPage,
});

type UoMData = {
  id: string;
  name: string;
};

const INITIAL_DATA: UoMData[] = [
  { id: "UOM-001", name: "MPa" },
  { id: "UOM-002", name: "°C" },
  { id: "UOM-003", name: "CM" },
  { id: "UOM-004", name: "L/Menit" },
  { id: "UOM-005", name: "MM" },
];

function UoMPage() {
  const [data, setData] = useState<UoMData[]>(INITIAL_DATA);
  const [q, setQ] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");

  const rows = data.filter(item => 
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  const openCreateModal = () => {
    setEditId(null);
    setFormName("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: UoMData) => {
    setEditId(item.id);
    setFormName(item.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const saveModal = () => {
    if (!formName.trim()) return;
    
    if (editId) {
      setData(prev => prev.map(item => item.id === editId ? { ...item, name: formName } : item));
    } else {
      setData(prev => [...prev, { id: "UOM-" + Date.now(), name: formName }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Main Container */}
      <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col overflow-hidden">
        {/* Header Actions */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-secondary/10">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder="Search UoM..." 
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" 
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Data
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
              <tr>
                <th className="px-6 py-3 font-semibold w-24">Action</th>
                <th className="px-6 py-3 font-semibold">Unit of measurement name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(row)}
                          className="p-1.5 rounded-md text-blue-600 hover:bg-blue-600/10 dark:text-blue-400 dark:hover:bg-blue-400/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 rounded-md text-red-600 hover:bg-red-600/10 dark:text-red-400 dark:hover:bg-red-400/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium text-foreground">
                      {row.name}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-8 w-8 opacity-20" />
                      <p>No UoM data found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-secondary/5">
          <div>Showing 1 to {rows.length} of {rows.length} entries</div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
          <DialogHeader className="p-5 border-b border-border bg-secondary/10">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              {editId ? <Edit2 className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
              {editId ? "Edit UoM" : "Add UoM"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">UoM Name</label>
              <input 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., MPa"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <DialogFooter className="p-5 border-t border-border bg-secondary/10 sm:justify-end gap-2">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary border border-transparent hover:border-border transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={saveModal}
              disabled={!formName.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
