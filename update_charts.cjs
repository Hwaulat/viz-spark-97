const fs = require('fs');
const content = fs.readFileSync('src/routes/monitoring-area.$id.tsx', 'utf-8');

// 1. Font sizes
let newContent = content.replace(/text-foreground font-mono font-bold text-sm/g, 'text-foreground font-mono font-bold text-lg');
newContent = newContent.replace(/text-foreground font-mono font-semibold text-primary/g, 'text-foreground font-mono font-semibold text-primary text-lg');
newContent = newContent.replace(/text-foreground font-mono font-semibold text-orange-500 dark:text-orange-400/g, 'text-foreground font-mono font-semibold text-orange-500 dark:text-orange-400 text-lg');

// 2. Mock Data
const mockData = `
const MINUTE_DATA = Array.from({ length: 30 }, (_, i) => {
  const time = new Date(Date.now() - (29 - i) * 60000);
  return {
    time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp1_b1: +(200 + Math.random() * 20).toFixed(1),
    temp2_b1: +(210 + Math.random() * 20).toFixed(1),
    temp1_b2: +(195 + Math.random() * 20).toFixed(1),
    temp2_b2: +(205 + Math.random() * 20).toFixed(1),
    temp1_b3: +(202 + Math.random() * 20).toFixed(1),
    temp2_b3: +(212 + Math.random() * 20).toFixed(1),
    pressure: +(5 + Math.random() * 2).toFixed(2),
    energy: +(50 + Math.random() * 10).toFixed(1),
    gas: +(30 + Math.random() * 5).toFixed(1),
  };
});
`;

newContent = newContent.replace('function MonitoringAreaDetails() {', mockData + '\nfunction MonitoringAreaDetails() {\n  const [historicalBoilerTab, setHistoricalBoilerTab] = useState("Boiler 1");');

// 3. Historical Charts
const historicalChartsContent = `              {activeTab === "Historical Charts" && (
                <div className="space-y-6">
                  {/* Temperature & Pressure Trends */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    {/* Temperature */}
                    <Panel title="Temperature Trends by Minute">
                      <div className="p-4 border-b border-border/50">
                        <div className="flex gap-2">
                          {["Boiler 1", "Boiler 2", "Boiler 3"].map(tab => (
                            <button
                              key={tab}
                              onClick={() => setHistoricalBoilerTab(tab)}
                              className={\`px-3 py-1.5 text-xs font-medium rounded-md transition \${historicalBoilerTab === tab ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}\`}
                            >
                              {tab}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-[300px] w-full p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                            <Line type="monotone" dataKey={historicalBoilerTab === "Boiler 1" ? "temp1_b1" : historicalBoilerTab === "Boiler 2" ? "temp1_b2" : "temp1_b3"} name="Actual Temp 1" stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                            <Line type="monotone" dataKey={historicalBoilerTab === "Boiler 1" ? "temp2_b1" : historicalBoilerTab === "Boiler 2" ? "temp2_b2" : "temp2_b3"} name="Actual Temp 2" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Panel>

                    {/* Pressure */}
                    <Panel title="Pressure Trends by Minute">
                      <div className="h-[300px] w-full p-4 mt-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12 }} />
                            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                            <Line type="monotone" dataKey="pressure" name="Pressure (bar)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Panel>
                  </div>

                  {/* Energy vs Gas */}
                  <Panel title="Energy Consumption vs Gas Usage by Minute">
                    <div className="h-[350px] w-full p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MINUTE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                          <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={10} />
                          <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                          <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }} itemStyle={{ fontSize: 12 }} />
                          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                          <Line yAxisId="left" type="monotone" dataKey="energy" name="Energy (kWh)" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                          <Line yAxisId="right" type="monotone" dataKey="gas" name="Gas Usage (m³)" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Panel>
                </div>
              )}`;

const oldHistoricalCharts = `              {activeTab === "Historical Charts" && (
                <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground bg-secondary/20">
                  <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm font-medium">Historical Trend Charts</p>
                  <p className="text-xs mt-1">Temperature and flow rate historical charts will be displayed here.</p>
                </div>
              )}`;

newContent = newContent.replace(oldHistoricalCharts, historicalChartsContent);

fs.writeFileSync('src/routes/monitoring-area.$id.tsx', newContent);
console.log('done');
