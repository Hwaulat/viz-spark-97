import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Edit2, Trash2, FileText, Save, PlusCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/master-data/station")({
  head: () => ({
    meta: [
      { title: "Master Data — Station" },
      { name: "description", content: "Master Data for Station." },
    ],
  }),
  component: StationPage,
});

type StationData = {
  id: string;
  code: string;
  name: string;
};

type StationGroupData = {
  id: string;
  parameterName: string;
  stations: string[];
};

const INITIAL_STATIONS: StationData[] = [
  { id: "S-001", code: "ST-001", name: "ED Coat Zone 1" },
  { id: "S-002", code: "ST-001", name: "ED Coat Zone 2" },
  { id: "S-003", code: "ST-001", name: "Anolyte & UF Permeate Zone" },
  { id: "S-004", code: "ST-001", name: "UF Rinse 1 & 2 Zone" },
  { id: "S-005", code: "ST-001", name: "Water Rinse 1 & 2 & Fresh Di Water Zone" },
  { id: "S-006", code: "ST-002", name: "Flood Spray Zone" },
  { id: "S-007", code: "ST-002", name: "Pre-Degreasing Spray Zone" },
  { id: "S-008", code: "ST-002", name: "Degreasing Spray Zone" },
  { id: "S-009", code: "ST-002", name: "Water Rinse 1 & 2 Spray Zone" },
  { id: "S-010", code: "ST-002", name: "Surface Conditioning Zone" },
];

const INITIAL_STATION_GROUPS: StationGroupData[] = [
  { 
    id: "SG-001", 
    parameterName: "Chemical CED", 
    stations: ["ED Coat Zone 1", "ED Coat Zone 2", "Anolyte & UF Permeate Zone", "UF Rinse 1 & 2 Zone", "Water Rinse 1 & 2 & Fresh Di Water Zone", "Oven CED", "CED", "Pretretment & ED"] 
  },
  { 
    id: "SG-002", 
    parameterName: "Pre-Treatment", 
    stations: ["Flood Spray Zone", "Pre-Degreasing Spray Zone", "Degreasing Spray Zone", "Water Rinse 1 & 2 Spray Zone", "Surface Conditioning Zone", "Phosphating Zone 1", "Phosphating Zone 2", "Water Rinse 3 & 4 Zone", "Water Rinse 5 Zone"] 
  },
];

function StationPage() {
  const [activeTab, setActiveTab] = useState<"Station" | "Station Group">("Station");
  const [q, setQ] = useState("");
  
  // Data state
  const [stations, setStations] = useState<StationData[]>(INITIAL_STATIONS);
  const [stationGroups, setStationGroups] = useState<StationGroupData[]>(INITIAL_STATION_GROUPS);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  
  // Station form
  const [formStationCode, setFormStationCode] = useState("");
  const [formStationName, setFormStationName] = useState("");

  // Station Group form
  const [formParamName, setFormParamName] = useState("");
  const [formGroupStations, setFormGroupStations] = useState<{id: string, name: string}[]>([]);

  // Filtering
  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(q.toLowerCase()) || 
    s.code.toLowerCase().includes(q.toLowerCase())
  );

  const filteredGroups = stationGroups.filter(g => 
    g.parameterName.toLowerCase().includes(q.toLowerCase()) || 
    g.stations.some(st => st.toLowerCase().includes(q.toLowerCase()))
  );

  // Handlers for Station
  const openStationCreate = () => {
    setEditId(null);
    setFormStationCode("");
    setFormStationName("");
    setIsModalOpen(true);
  };

  const openStationEdit = (item: StationData) => {
    setEditId(item.id);
    setFormStationCode(item.code);
    setFormStationName(item.name);
    setIsModalOpen(true);
  };

  const handleStationDelete = (id: string) => {
    setStations(prev => prev.filter(item => item.id !== id));
  };

  const saveStation = () => {
    if (!formStationCode.trim() || !formStationName.trim()) return;
    if (editId) {
      setStations(prev => prev.map(item => item.id === editId ? { ...item, code: formStationCode, name: formStationName } : item));
    } else {
      setStations(prev => [...prev, { id: "S-" + Date.now(), code: formStationCode, name: formStationName }]);
    }
    setIsModalOpen(false);
  };

  // Handlers for Station Group
  const openGroupCreate = () => {
    setEditId(null);
    setFormParamName("");
    setFormGroupStations([{ id: Date.now().toString(), name: "" }]);
    setIsModalOpen(true);
  };

  const openGroupEdit = (item: StationGroupData) => {
    setEditId(item.id);
    setFormParamName(item.parameterName);
    setFormGroupStations(item.stations.map((s, i) => ({ id: `${i}-${Date.now()}`, name: s })));
    setIsModalOpen(true);
  };

  const handleGroupDelete = (id: string) => {
    setStationGroups(prev => prev.filter(item => item.id !== id));
  };

  const addFormGroupStation = () => {
    setFormGroupStations(prev => [...prev, { id: Date.now().toString(), name: "" }]);
  };

  const updateFormGroupStation = (id: string, name: string) => {
    setFormGroupStations(prev => prev.map(s => s.id === id ? { ...s, name } : s));
  };

  const removeFormGroupStation = (id: string) => {
    setFormGroupStations(prev => prev.filter(s => s.id !== id));
  };

  const saveGroup = () => {
    if (!formParamName.trim()) return;
    const stNames = formGroupStations.map(s => s.name.trim()).filter(Boolean);
    if (stNames.length === 0) return;

    if (editId) {
      setStationGroups(prev => prev.map(item => item.id === editId ? { ...item, parameterName: formParamName, stations: stNames } : item));
    } else {
      setStationGroups(prev => [...prev, { id: "SG-" + Date.now(), parameterName: formParamName, stations: stNames }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-secondary/10 p-1.5 rounded-lg border border-border w-max">
        {(["Station", "Station Group"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setQ(""); }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab 
                ? "bg-background border border-border shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4 bg-secondary/10">
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
            onClick={activeTab === "Station" ? openStationCreate : openGroupCreate}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            <Plus className="h-4 w-4" /> Add Data
          </button>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "Station" ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-3 font-semibold w-24">Action</th>
                  <th className="px-6 py-3 font-semibold w-48">Station Code</th>
                  <th className="px-6 py-3 font-semibold">Station Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredStations.length > 0 ? (
                  filteredStations.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openStationEdit(row)}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-600/10 dark:text-blue-400 dark:hover:bg-blue-400/10 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleStationDelete(row.id)}
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-600/10 dark:text-red-400 dark:hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-foreground">{row.code}</td>
                      <td className="px-6 py-3 text-muted-foreground">{row.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="h-8 w-8 opacity-20" />
                        <p>No Station data found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/40 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/50">
                <tr>
                  <th className="px-6 py-3 font-semibold w-24">Action</th>
                  <th className="px-6 py-3 font-semibold w-64">Parameter Equipment name</th>
                  <th className="px-6 py-3 font-semibold">Station Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((row) => (
                    <tr key={row.id} className="hover:bg-secondary/20 transition-colors group">
                      <td className="px-6 py-3 align-top">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openGroupEdit(row)}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-600/10 dark:text-blue-400 dark:hover:bg-blue-400/10 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleGroupDelete(row.id)}
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-600/10 dark:text-red-400 dark:hover:bg-red-400/10 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-medium text-foreground align-top">{row.parameterName}</td>
                      <td className="px-6 py-3 text-muted-foreground leading-relaxed">
                        {row.stations.join(", ")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="h-8 w-8 opacity-20" />
                        <p>No Station Group data found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground bg-secondary/5">
          <div>Showing 1 to {activeTab === "Station" ? filteredStations.length : filteredGroups.length} of {activeTab === "Station" ? filteredStations.length : filteredGroups.length} entries</div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={activeTab === "Station" ? "sm:max-w-[500px] p-0 overflow-hidden" : "sm:max-w-[700px] p-0 overflow-hidden"}>
          <DialogHeader className="p-5 border-b border-border bg-secondary/10">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              {editId ? <Edit2 className="h-5 w-5 text-primary" /> : <PlusCircle className="h-5 w-5 text-primary" />}
              {editId ? `Edit ${activeTab}` : `Add ${activeTab}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {activeTab === "Station" ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Station Code</label>
                  <input 
                    value={formStationCode}
                    onChange={(e) => setFormStationCode(e.target.value)}
                    placeholder="e.g., ST-001"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Station Name</label>
                  <input 
                    value={formStationName}
                    onChange={(e) => setFormStationName(e.target.value)}
                    placeholder="e.g., ED Coat Zone 1"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parameter Equipment Name</label>
                  <input 
                    value={formParamName}
                    onChange={(e) => setFormParamName(e.target.value)}
                    placeholder="e.g., Chemical CED"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">List Station</label>
                    <button 
                      onClick={addFormGroupStation}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Station
                    </button>
                  </div>
                  
                  <div className="border border-border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 font-semibold w-12 text-center">Action</th>
                          <th className="px-3 py-2 font-semibold">Station Name</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 bg-background">
                        {formGroupStations.map((s) => (
                          <tr key={s.id}>
                            <td className="px-3 py-2 text-center">
                              <button 
                                onClick={() => removeFormGroupStation(s.id)}
                                disabled={formGroupStations.length === 1}
                                className="p-1 rounded text-red-500 hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                            <td className="px-3 py-2">
                              <input 
                                value={s.name}
                                onChange={(e) => updateFormGroupStation(s.id, e.target.value)}
                                placeholder="e.g., ED Coat Zone 1"
                                className="w-full rounded border border-transparent hover:border-border focus:border-primary bg-transparent px-2 py-1.5 text-sm outline-none transition-colors"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="p-5 border-t border-border bg-secondary/10 sm:justify-end gap-2">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary border border-transparent hover:border-border transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={activeTab === "Station" ? saveStation : saveGroup}
              disabled={
                activeTab === "Station" 
                  ? (!formStationCode.trim() || !formStationName.trim()) 
                  : (!formParamName.trim() || formGroupStations.some(s => !s.name.trim()))
              }
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
