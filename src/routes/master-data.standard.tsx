import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2, FileText, Save, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/master-data/standard")({
  head: () => ({
    meta: [
      { title: "Master Data — Standard" },
      { name: "description", content: "Master Data for Standard limits and types." },
    ],
  }),
  component: StandardPage,
});

type StandardData = {
  id: string;
  categoryId: string; // To differentiate between tabs
  standard: string;
  type: string;
  symbol: string;
  valueStandard: string;
  uom: string;
};

const TABS = [
  "Equipment",
  "Thickness all Type",
  "Boiler & Oven Area",
  "PTED Area - Cleaning Bag Filter",
  "PTED Area - Control Point",
];

const INITIAL_DATA: StandardData[] = [
  { id: "ST-001", categoryId: "Equipment", standard: "Tidak ada kebocoran (Normal)", type: "Dropdown", symbol: "(<)", valueStandard: "3.5", uom: "Ltr/Menit" },
  { id: "ST-002", categoryId: "Equipment", standard: "0.09 MPa - 0.16 MPa", type: "Numeric", symbol: "(<)", valueStandard: "3.5", uom: "Ltr/Menit" },
  { id: "ST-003", categoryId: "Equipment", standard: "Tidak ada kebocoran getaran normal", type: "Dropdown", symbol: "(<)", valueStandard: "3.5", uom: "Ltr/Menit" },
  { id: "ST-004", categoryId: "Equipment", standard: "Diatas 0.20 MPa", type: "Numeric", symbol: "(<)", valueStandard: "3.5", uom: "Ltr/Menit" },
  { id: "ST-005", categoryId: "Thickness all Type", standard: "Standard Thickness 1", type: "Numeric", symbol: "Range", valueStandard: "0.22 - 0.27", uom: "mm" },
  { id: "ST-006", categoryId: "Boiler & Oven Area", standard: "Suhu Normal", type: "Numeric", symbol: "(>)", valueStandard: "180", uom: "°C" },
  { id: "ST-007", categoryId: "PTED Area - Cleaning Bag Filter", standard: "Kebersihan Filter", type: "Dropdown", symbol: "Range", valueStandard: "10-20", uom: "%" },
  { id: "ST-008", categoryId: "PTED Area - Control Point", standard: "pH Level", type: "Numeric", symbol: "Range", valueStandard: "6.5 - 7.5", uom: "pH" },
];

function StandardPage() {
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [data, setData] = useState<StandardData[]>(INITIAL_DATA);
  const [q, setQ] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Form state
  const [formStandard, setFormStandard] = useState("");
  const [formType, setFormType] = useState("Numeric");
  const [formSymbol, setFormSymbol] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formUom, setFormUom] = useState("");

  const filteredData = data.filter(item => 
    item.categoryId === activeTab &&
    (item.standard.toLowerCase().includes(q.toLowerCase()) || 
     item.type.toLowerCase().includes(q.toLowerCase()) ||
     item.uom.toLowerCase().includes(q.toLowerCase()))
  );

  const openCreateModal = () => {
    setEditId(null);
    setFormStandard("");
    setFormType("Numeric");
    setFormSymbol("");
    setFormValue("");
    setFormUom("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: StandardData) => {
    setEditId(item.id);
    setFormStandard(item.standard);
    setFormType(item.type);
    setFormSymbol(item.symbol);
    setFormValue(item.valueStandard);
    setFormUom(item.uom);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  const saveModal = () => {
    if (!formStandard.trim()) return;
    
    if (editId) {
      setData(prev => prev.map(item => item.id === editId ? { 
        ...item, 
        standard: formStandard, 
        type: formType,
        symbol: formSymbol,
        valueStandard: formValue,
        uom: formUom
      } : item));
    } else {
      setData(prev => [...prev, { 
        id: "ST-" + Date.now(), 
        categoryId: activeTab,
        standard: formStandard, 
        type: formType,
        symbol: formSymbol,
        valueStandard: formValue,
        uom: formUom
      }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Standard</h1>
        <p className="text-sm text-muted-foreground">Master data configuration for standard limits and parameters.</p>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col overflow-hidden">
        {/* Tab Navigation */}
        <div className="px-2 pt-2 border-b border-border/50 bg-secondary/10 flex overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setQ(""); }}
              className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              placeholder={`Search ${activeTab}...`}
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
                <th className="px-6 py-3 font-semibold">Standard</th>
                <th className="px-6 py-3 font-semibold w-32">Type</th>
                <th className="px-6 py-3 font-semibold w-32">Symbol</th>
                <th className="px-6 py-3 font-semibold w-40">Value Standard</th>
                <th className="px-6 py-3 font-semibold w-32">UoM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
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
                    <td className="px-6 py-3 font-medium text-foreground">{row.standard}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.type}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.symbol}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.valueStandard}</td>
                    <td className="px-6 py-3 text-muted-foreground">{row.uom}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-8 w-8 opacity-20" />
                      <p>No Standard data found for {activeTab}.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-secondary/5">
          <div>Showing 1 to {filteredData.length} of {filteredData.length} entries</div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <DialogHeader className="p-5 border-b border-border bg-secondary/10">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              {editId ? <Edit2 className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
              {editId ? "Edit Standard" : "Add Standard"}
              <span className="text-xs font-normal text-muted-foreground ml-2 px-2 py-1 rounded bg-secondary/50 border border-border">
                {activeTab}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Standard Name</label>
              <input 
                value={formStandard}
                onChange={(e) => setFormStandard(e.target.value)}
                placeholder="e.g., Tidak ada kebocoran"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</label>
              <select 
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              >
                <option value="Numeric">Numeric</option>
                <option value="Dropdown">Dropdown</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Symbol</label>
              <input 
                value={formSymbol}
                onChange={(e) => setFormSymbol(e.target.value)}
                placeholder="e.g., (<) or Range"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Value Standard</label>
              <input 
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="e.g., 3.5 or 0.22 - 0.27"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">UoM</label>
              <input 
                value={formUom}
                onChange={(e) => setFormUom(e.target.value)}
                placeholder="e.g., MPa, Ltr/Menit"
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
              disabled={!formStandard.trim()}
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
