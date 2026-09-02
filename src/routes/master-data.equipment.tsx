import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2, X, FileText, CheckCircle2, Save, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/master-data/equipment")({
  head: () => ({
    meta: [
      { title: "Master Data — Equipment Standards" },
      { name: "description", content: "Master Data for Equipment, Frequency, and Standards." },
    ],
  }),
  component: MasterDataPage,
});

type StandardItem = {
  id: string;
  freq: string;
  standard: string;
};

type EquipmentData = {
  id: string;
  name: string;
  standards: StandardItem[];
};

const INITIAL_DATA: EquipmentData[] = [
  {
    id: "EQ-001",
    name: "Taki & Pipa",
    standards: [{ id: "S-1", freq: "1 x 1 Shift", standard: "Tidak ada kebocoran (Normal)" }],
  },
  {
    id: "EQ-002",
    name: "Pompa Flood Water Spray (Pus-111)",
    standards: [{ id: "S-2", freq: "1 x 1 Shift", standard: "0.09 MPa - 0.16 MPa" }],
  },
  {
    id: "EQ-003",
    name: "Tekanan Spray Flood Water (PRG-111C & PRG-1114)",
    standards: [{ id: "S-3", freq: "1 x 1 Shift", standard: "Tidak ada kebocoran getaran normal" }],
  },
  {
    id: "EQ-004",
    name: "Heat Exchanger 1",
    standards: [{ id: "S-4", freq: "1 x 1 Shift", standard: "Diatas 0.20 MPa" }],
  },
  {
    id: "EQ-005",
    name: "Heat Exchanger 2",
    standards: [{ id: "S-5", freq: "1 x 1 Shift", standard: "Diatas 0.20 MPa" }],
  },
  {
    id: "EQ-006",
    name: "Tekanan Hot Water Inlet",
    standards: [{ id: "S-6", freq: "1 x 1 Shift", standard: "Diatas 0.20 MPa" }],
  },
  {
    id: "EQ-007",
    name: "Spray Nozzle",
    standards: [{ id: "S-7", freq: "1 x 1 Shift", standard: "Diatas 0.20 MPa" }],
  },
  {
    id: "EQ-008",
    name: "Strainer Mesh",
    standards: [{ id: "S-8", freq: "1 x 1 Shift", standard: "0.09 MPa - 0.16 MPa" }],
  },
  {
    id: "EQ-009",
    name: "Temperatur Hot Water Inlet",
    standards: [{ id: "S-9", freq: "1 x 1 Shift", standard: "0.09 MPa - 0.16 MPa" }],
  },
  {
    id: "EQ-010",
    name: "Pressure difference Liquid Inlet & Outlet (Hexc)",
    standards: [{ id: "S-10", freq: "1 x 1 Shift", standard: "0.09 MPa - 0.16 MPa" }],
  },
];

function MasterDataPage() {
  const [data, setData] = useState<EquipmentData[]>(INITIAL_DATA);
  const [q, setQ] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formStandards, setFormStandards] = useState<StandardItem[]>([]);

  // Filtered rows for the table. Flattening so each standard is its own row if needed, 
  // grouping by equipment if needed. We'll map through equipments, and inside, map through standards.
  const rows = data.flatMap(eq => {
    return eq.standards
      .filter(s => eq.name.toLowerCase().includes(q.toLowerCase()) || s.standard.toLowerCase().includes(q.toLowerCase()))
      .map((s, idx) => ({
        ...s,
        equipmentId: eq.id,
        equipmentName: eq.name,
        isFirst: idx === 0,
        rowSpan: eq.standards.length
      }));
  });

  const openCreateModal = () => {
    setEditId(null);
    setFormName("");
    setFormStandards([{ id: Date.now().toString(), freq: "", standard: "" }]);
    setIsModalOpen(true);
  };

  const openEditModal = (eq: EquipmentData) => {
    setEditId(eq.id);
    setFormName(eq.name);
    setFormStandards([...eq.standards]);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const saveModal = () => {
    if (!formName.trim()) return;
    
    if (editId) {
      setData(prev => prev.map(item => item.id === editId ? { ...item, name: formName, standards: formStandards } : item));
    } else {
      setData(prev => [...prev, { id: "EQ-" + Date.now(), name: formName, standards: formStandards }]);
    }
    setIsModalOpen(false);
  };

  const addFormStandard = () => {
    setFormStandards(prev => [...prev, { id: Date.now().toString(), freq: "", standard: "" }]);
  };

  const updateFormStandard = (id: string, field: "freq" | "standard", value: string) => {
    setFormStandards(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeFormStandard = (id: string) => {
    setFormStandards(prev => prev.filter(s => s.id !== id));
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
              placeholder="Search equipment..." 
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
                <th className="px-6 py-3 font-semibold">Equipment name</th>
                <th className="px-6 py-3 font-semibold w-48">Freq</th>
                <th className="px-6 py-3 font-semibold">Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rows.length > 0 ? (
                rows.map((row, i) => (
                  <tr key={`${row.equipmentId}-${row.id}`} className="hover:bg-secondary/20 transition-colors group">
                    {/* Render equipment name and action only on the first row of an equipment group */}
                    {row.isFirst ? (
                      <>
                        <td className="px-6 py-3" rowSpan={row.rowSpan}>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditModal(data.find(d => d.id === row.equipmentId)!)}
                              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-600/10 dark:text-blue-400 dark:hover:bg-blue-400/10 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(row.equipmentId)}
                              className="p-1.5 rounded-md text-red-600 hover:bg-red-600/10 dark:text-red-400 dark:hover:bg-red-400/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium text-foreground" rowSpan={row.rowSpan}>
                          {row.equipmentName}
                        </td>
                      </>
                    ) : null}
                    <td className="px-6 py-3 text-muted-foreground">{row.freq}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.standard}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-8 w-8 opacity-20" />
                      <p>No equipment data found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder (Matching Figma layout) */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-secondary/5">
          <div>Showing 1 to {rows.length} of {rows.length} entries</div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <DialogHeader className="p-5 border-b border-border bg-secondary/10">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              {editId ? <Edit2 className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
              {editId ? "Edit Equipment" : "Add Equipment"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Equipment Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Equipment Name</label>
              <input 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Taki & Pipa"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* List Standard */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">List Standard</label>
                <button 
                  onClick={addFormStandard}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Standard
                </button>
              </div>
              
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-semibold w-12 text-center">Action</th>
                      <th className="px-3 py-2 font-semibold w-1/3">Standard</th>
                      <th className="px-3 py-2 font-semibold w-1/3">Freq</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50 bg-background">
                    {formStandards.map((s) => (
                      <tr key={s.id}>
                        <td className="px-3 py-2 text-center">
                          <button 
                            onClick={() => removeFormStandard(s.id)}
                            disabled={formStandards.length === 1}
                            className="p-1 rounded text-red-500 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="px-3 py-2">
                          <input 
                            value={s.standard}
                            onChange={(e) => updateFormStandard(s.id, "standard", e.target.value)}
                            placeholder="e.g., 0.09 MPa - 0.16 MPa"
                            className="w-full rounded border border-transparent hover:border-border focus:border-primary bg-transparent px-2 py-1.5 text-sm outline-none transition-colors"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input 
                            value={s.freq}
                            onChange={(e) => updateFormStandard(s.id, "freq", e.target.value)}
                            placeholder="e.g., 1 x 1 Shift"
                            className="w-full rounded border border-transparent hover:border-border focus:border-primary bg-transparent px-2 py-1.5 text-sm outline-none transition-colors"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              disabled={!formName.trim() || formStandards.some(s => !s.freq.trim() || !s.standard.trim())}
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
