import { useState, useMemo, useCallback } from 'react';
import { useStore } from "../../../lib/store";
import { motion } from 'motion/react';
import {
  MapPin, TrendingDown, TrendingUp, X,
  Eye, EyeOff, Search, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import btData from '../../imports/bt.json';

const generateRiskDataFromGeoJSON = () => {
  const features = btData.features;
  return features.map((feature, index) => {
    const name = feature.properties.name;
    const nameHash = name.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

    let total = 0, low = 0, medium = 0, high = 0, critical = 0, riskLevel = '', trend = '';

    if (name === 'Thimphu') {
      total = 234; low = 180; medium = 42; high = 10; critical = 2; riskLevel = 'Low'; trend = 'stable';
    } else if (name === 'Paro') {
      total = 156; low = 110; medium = 32; high = 12; critical = 2; riskLevel = 'Medium'; trend = 'improving';
    } else if (name === 'Punakha') {
      total = 189; low = 120; medium = 45; high = 20; critical = 4; riskLevel = 'Medium'; trend = 'deteriorating';
    } else if (name === 'Bumthang') {
      total = 98; low = 75; medium = 18; high = 4; critical = 1; riskLevel = 'Low'; trend = 'stable';
    } else if (name === 'Wangdue Phodrang') {
      total = 142; low = 95; medium = 35; high = 10; critical = 2; riskLevel = 'Medium'; trend = 'improving';
    } else if (name === 'Trongsa') {
      total = 87; low = 68; medium = 15; high = 3; critical = 1; riskLevel = 'Low'; trend = 'stable';
    } else {
      const seed = (nameHash + index * 7) % 100;
      total = 50 + (seed % 150);
      low = Math.floor(total * (0.4 + (seed % 40) / 100));
      medium = Math.floor(total * (0.2 + (seed % 30) / 100));
      high = Math.floor(total * (0.05 + (seed % 15) / 100));
      critical = Math.max(0, total - low - medium - high);
      const sum = low + medium + high + critical;
      if (sum !== total) low += total - sum;
      const highRiskPercent = (high + critical) / total;
      if (highRiskPercent > 0.25) riskLevel = 'Critical';
      else if (highRiskPercent > 0.15) riskLevel = 'High';
      else if (highRiskPercent > 0.08) riskLevel = 'Medium';
      else riskLevel = 'Low';
      const trends = ['stable', 'improving', 'deteriorating'];
      trend = trends[seed % 3];
    }

    return { id: feature.properties.id, name, total, low, medium, high, critical, riskLevel, trend };
  });
};

const riskLevelColors: Record<string, { bg: string; text: string }> = {
  Low:      { bg: "#1a6b58", text: "#ffffff" },
  Medium:   { bg: "#fbbf24", text: "#0b1f1a" },
  High:     { bg: "#fb923c", text: "#ffffff" },
  Critical: { bg: "#c2410c", text: "#ffffff" },
};

const getMapFillColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Low':      return '#1a6b58';
    case 'Medium':   return '#fbbf24';
    case 'High':     return '#fb923c';
    case 'Critical': return '#c2410c';
    default:         return '#e7efe9';
  }
};

const ROWS_PER_PAGE = 10;

type Tab = 'map' | 'table';

export function RiskMapPage() {
  const [activeTab, setActiveTab] = useState<Tab>('map');

  // Map tab state
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Table tab state
  const [tableSearch, setTableSearch] = useState('');
  const [tableRisk, setTableRisk] = useState('All');
  const [tablePage, setTablePage] = useState(1);

  const storeFarms = useStore(s => s.farms);
  const storeAssessments = useStore(s => s.assessments);

  const dzongkhagRiskData = useMemo(() => generateRiskDataFromGeoJSON(), []);

  const stats = useMemo(() => {
    const realTotal = storeFarms.length;
    const nonDraft = storeAssessments.filter(a => a.status !== 'Draft');
    const latestByFarm = new Map<string, typeof nonDraft[0]>();
    [...nonDraft]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach(a => { if (!latestByFarm.has(a.farmId)) latestByFarm.set(a.farmId, a); });

    let realHigh = 0;
    latestByFarm.forEach(a => { if ((a.overallScore ?? 0) <= 40) realHigh++; });

    const realHighRiskDistricts = new Set(
      storeFarms.filter(f => {
        const a = latestByFarm.get(f.id);
        return a && (a.overallScore ?? 0) <= 40;
      }).map(f => f.dzongkhag)
    ).size;

    let compliantCount = 0;
    latestByFarm.forEach(a => { if (a.ncCount === 0) compliantCount++; });
    const assessedCount = latestByFarm.size;
    const realCompliancePct = assessedCount > 0 ? Math.round((compliantCount / assessedCount) * 100) : 0;

    const geoTotal = dzongkhagRiskData.reduce((s, d) => s + d.total, 0);
    const geoHigh = dzongkhagRiskData.reduce((s, d) => s + d.high + d.critical, 0);
    const geoHighDistricts = dzongkhagRiskData.filter(d => d.riskLevel === 'High' || d.riskLevel === 'Critical').length;

    return {
      totalFarms:        realTotal > 0 ? realTotal : geoTotal,
      totalHighRiskFarms: realTotal > 0 ? realHigh : geoHigh,
      highRiskDistricts: realTotal > 0 ? realHighRiskDistricts : geoHighDistricts,
      compliancePct:     realTotal > 0 ? realCompliancePct : Math.round((1 - geoHigh / geoTotal) * 100),
    };
  }, [storeFarms, storeAssessments, dzongkhagRiskData]);

  // Table tab filtered + paginated data
  const tableFiltered = useMemo(() => {
    return dzongkhagRiskData.filter(d => {
      const matchSearch = tableSearch === '' || d.name.toLowerCase().includes(tableSearch.toLowerCase());
      const matchRisk = tableRisk === 'All' || d.riskLevel === tableRisk;
      return matchSearch && matchRisk;
    });
  }, [dzongkhagRiskData, tableSearch, tableRisk]);

  const tableTotalPages = Math.max(1, Math.ceil(tableFiltered.length / ROWS_PER_PAGE));
  const tableRows = useMemo(
    () => tableFiltered.slice((tablePage - 1) * ROWS_PER_PAGE, tablePage * ROWS_PER_PAGE),
    [tableFiltered, tablePage]
  );

  const handleTableSearch = (v: string) => { setTableSearch(v); setTablePage(1); };
  const handleTableRisk = (v: string) => { setTableRisk(v); setTablePage(1); };

  const handleGeographyClick = useCallback((geo: any) => {
    const district = dzongkhagRiskData.find(d => d.id === geo.properties.id);
    if (district) setSelectedDistrict(district);
  }, [dzongkhagRiskData]);

  const handleGeographyMouseEnter = useCallback((geo: any, event?: any) => {
    setHoveredDistrict(geo.properties.name);
    if (event) setHoverPos({ x: event.clientX, y: event.clientY });
  }, []);

  const handleGeographyMouseLeave = useCallback(() => {
    setHoveredDistrict(null);
    setHoverPos(null);
  }, []);

  const closeModal = () => setSelectedDistrict(null);

  return (
    <div className="space-y-5 p-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Header + tabs */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0b1f1a]">Risk Map</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Biosecurity risk assessment by region · {dzongkhagRiskData.length} Dzongkhags
            </p>
          </div>
        </div>
        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-border/60 pb-0">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'map'
                ? 'border-[#1a6b58] text-[#1a6b58]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Interactive Risk Map
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'table'
                ? 'border-[#1a6b58] text-[#1a6b58]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Risk Table
          </button>
        </div>
      </div>

      {activeTab === 'map' && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-border/60 p-5 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Farms</p>
              <p className="text-3xl font-bold text-[#0b1f1a] mt-1">{stats.totalFarms.toLocaleString()}</p>
              <p className="text-xs text-[#1a6b58] mt-1">Across {dzongkhagRiskData.length} Dzongkhags</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }}
              className="bg-white rounded-3xl border border-border/60 p-5 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">High Risk Farms</p>
              <p className="text-3xl font-bold text-[#c2410c] mt-1">{stats.totalHighRiskFarms.toLocaleString()}</p>
              <p className="text-xs text-[#c2410c] mt-1">
                {Math.round((stats.totalHighRiskFarms / (stats.totalFarms || 1)) * 100)}% of total
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-border/60 p-5 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">High-Risk Districts</p>
              <p className="text-3xl font-bold text-[#fb923c] mt-1">{stats.highRiskDistricts}</p>
              <p className="text-xs text-[#fb923c] mt-1">Require immediate attention</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl border border-border/60 p-5 shadow-sm">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Compliance Rate</p>
              <p className="text-3xl font-bold text-[#1a6b58] mt-1">{stats.compliancePct}%</p>
              <p className="text-xs text-[#1a6b58] mt-1">Of assessed farms</p>
            </motion.div>
          </div>

          {/* Risk Legend */}
          <div className="bg-white rounded-3xl border border-border/60 p-5 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Risk Level Legend</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Low Risk',      color: '#1a6b58', score: 'Score > 60' },
                { label: 'Medium Risk',   color: '#fbbf24', score: 'Score 41–60' },
                { label: 'High Risk',     color: '#fb923c', score: 'Score 21–40' },
                { label: 'Critical Risk', color: '#c2410c', score: 'Score ≤ 20' },
              ].map(({ label, color, score }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: color }} />
                  <div>
                    <p className="text-sm font-semibold text-[#0b1f1a]">{label}</p>
                    <p className="text-xs text-muted-foreground">{score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="bg-white rounded-3xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">Bhutan Dzongkhag Risk Map</h3>
                <button
                  onClick={() => setShowMap(prev => !prev)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                  title={showMap ? 'Hide map' : 'Show map'}
                >
                  {showMap
                    ? <Eye className="w-4 h-4 text-[#1a6b58]" />
                    : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              {hoveredDistrict && (
                <div className="text-sm text-[#1a6b58] bg-[#e7efe9] px-3 py-1 rounded-full">
                  {hoveredDistrict}
                </div>
              )}
            </div>
            {showMap && (
              <div
                className="w-full h-[500px] rounded-2xl overflow-hidden border border-border/60"
                onWheelCapture={e => { e.preventDefault(); e.stopPropagation(); }}
              >
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{ scale: 18000, center: [90.5, 27.5] }}
                  style={{ width: '100%', height: '100%', touchAction: 'none' }}
                >
                  <ZoomableGroup zoom={1} center={[90.5, 27.5]} disablePanning
                    onMoveStart={() => {}} onMoveEnd={() => {}} onMove={() => {}}>
                    <Geographies geography={btData}>
                      {({ geographies }) =>
                        geographies.map(geo => {
                          const d = dzongkhagRiskData.find(x => x.id === geo.properties.id);
                          return (
                            <Geography
                              key={geo.rsmKey}
                              geography={geo}
                              fill={d ? getMapFillColor(d.riskLevel) : '#e2e8f0'}
                              stroke="#ffffff"
                              strokeWidth={0.5}
                              style={{
                                default: { outline: 'none', cursor: 'pointer' },
                                hover: { outline: 'none', fill: '#fbbf24', transition: 'all 250ms' },
                                pressed: { outline: 'none' },
                              }}
                              onClick={() => handleGeographyClick(geo)}
                              onMouseEnter={(event) => handleGeographyMouseEnter(geo, event)}
                              onMouseLeave={handleGeographyMouseLeave}
                            />
                          );
                        })
                      }
                    </Geographies>
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            )}
            <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground px-1">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#1a6b58] inline-block" /> Low</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#fbbf24] inline-block" /> Medium</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#fb923c] inline-block" /> High</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#c2410c] inline-block" /> Critical</span>
              <span>Click any district for details</span>
            </div>
          </div>
        </>
      )}

      {activeTab === 'table' && (
        <>
          {/* Table filters */}
          <div className="bg-white rounded-3xl border border-border/60 p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={tableSearch}
                  onChange={e => handleTableSearch(e.target.value)}
                  placeholder="Search by Dzongkhag..."
                  className="h-11 w-full rounded-xl border border-border pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b58]/30"
                />
              </div>
              <select
                value={tableRisk}
                onChange={e => handleTableRisk(e.target.value)}
                className="h-11 rounded-xl border border-border px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a6b58]/30"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Risk</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="p-4">S/N</th>
                    <th className="p-4">Dzongkhag</th>
                    <th className="p-4 text-right">Total Farms</th>
                    <th className="p-4 text-right text-[#1a6b58]">Low</th>
                    <th className="p-4 text-right text-[#fbbf24]">Medium</th>
                    <th className="p-4 text-right text-[#fb923c]">High</th>
                    <th className="p-4 text-right text-[#c2410c]">Critical</th>
                    <th className="p-4">Risk Level</th>
                    <th className="p-4">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tableRows.length > 0 ? (
                    tableRows.map((d, i) => (
                      <tr
                        key={d.id}
                        className="hover:bg-secondary/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedDistrict(d)}
                      >
                        <td className="p-4 font-medium text-muted-foreground">
                          {(tablePage - 1) * ROWS_PER_PAGE + i + 1}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 font-medium">
                            <MapPin className="h-4 w-4 text-[#1a6b58] flex-shrink-0" />
                            {d.name}
                          </div>
                        </td>
                        <td className="p-4 text-right font-semibold">{d.total}</td>
                        <td className="p-4 text-right font-medium text-[#1a6b58]">{d.low}</td>
                        <td className="p-4 text-right font-medium text-amber-600">{d.medium}</td>
                        <td className="p-4 text-right font-medium text-orange-500">{d.high}</td>
                        <td className="p-4 text-right font-medium text-[#c2410c]">{d.critical}</td>
                        <td className="p-4">
                          <span
                            className="inline-block rounded-full px-3 py-0.5 text-xs font-bold"
                            style={{
                              backgroundColor: riskLevelColors[d.riskLevel].bg,
                              color: riskLevelColors[d.riskLevel].text,
                            }}
                          >
                            {d.riskLevel}
                          </span>
                        </td>
                        <td className="p-4">
                          {d.trend === 'improving' && (
                            <span className="flex items-center gap-1 text-[#1a6b58]">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-xs">Improving</span>
                            </span>
                          )}
                          {d.trend === 'deteriorating' && (
                            <span className="flex items-center gap-1 text-[#c2410c]">
                              <TrendingDown className="h-4 w-4" />
                              <span className="text-xs">Deteriorating</span>
                            </span>
                          )}
                          {d.trend === 'stable' && (
                            <span className="text-xs text-muted-foreground">Stable</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-10 text-center text-muted-foreground">
                        No districts match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-border bg-background/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">
                  {tableFiltered.length === 0 ? 0 : (tablePage - 1) * ROWS_PER_PAGE + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium text-foreground">
                  {Math.min(tablePage * ROWS_PER_PAGE, tableFiltered.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium text-foreground">{tableFiltered.length}</span>{' '}
                districts
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTablePage(p => p - 1)}
                  disabled={tablePage === 1}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-secondary/40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: tableTotalPages }).map((_, idx) => {
                    const pg = idx + 1;
                    return (
                      <button
                        key={pg}
                        onClick={() => setTablePage(pg)}
                        className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          tablePage === pg
                            ? 'bg-[#1a6b58] text-white border-[#1a6b58]'
                            : 'border-border hover:bg-secondary/40'
                        }`}
                      >
                        {pg}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setTablePage(p => p + 1)}
                  disabled={tablePage === tableTotalPages}
                  className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium disabled:opacity-40 hover:bg-secondary/40 transition-colors"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* District Detail Modal (shared between both tabs) */}
      {selectedDistrict && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1a6b58]" />
                <h3 className="text-xl font-bold text-[#0b1f1a]">{selectedDistrict.name}</h3>
              </div>
              <button onClick={closeModal} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/60">
                <span className="text-sm text-muted-foreground">Risk Level</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: riskLevelColors[selectedDistrict.riskLevel].bg,
                    color: riskLevelColors[selectedDistrict.riskLevel].text,
                  }}
                >
                  {selectedDistrict.riskLevel}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border/60">
                <span className="text-sm text-muted-foreground">Total Farms</span>
                <span className="font-bold text-[#0b1f1a]">{selectedDistrict.total}</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Risk Breakdown</p>
                <div className="h-2.5 bg-secondary rounded-full overflow-hidden flex">
                  <div className="bg-[#1a6b58] h-full" style={{ width: `${(selectedDistrict.low / selectedDistrict.total) * 100}%` }} />
                  <div className="bg-[#fbbf24] h-full" style={{ width: `${(selectedDistrict.medium / selectedDistrict.total) * 100}%` }} />
                  <div className="bg-[#fb923c] h-full" style={{ width: `${(selectedDistrict.high / selectedDistrict.total) * 100}%` }} />
                  <div className="bg-[#c2410c] h-full" style={{ width: `${(selectedDistrict.critical / selectedDistrict.total) * 100}%` }} />
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <span className="text-[#1a6b58]">Low: {selectedDistrict.low}</span>
                  <span className="text-amber-500">Medium: {selectedDistrict.medium}</span>
                  <span className="text-orange-500">High: {selectedDistrict.high}</span>
                  <span className="text-[#c2410c]">Critical: {selectedDistrict.critical}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-border/60">
                <span className="text-sm text-muted-foreground">Trend</span>
                <div className="flex items-center gap-1">
                  {selectedDistrict.trend === 'improving' && (
                    <><TrendingUp className="w-4 h-4 text-[#1a6b58]" /><span className="text-sm text-[#1a6b58]">Improving</span></>
                  )}
                  {selectedDistrict.trend === 'deteriorating' && (
                    <><TrendingDown className="w-4 h-4 text-[#c2410c]" /><span className="text-sm text-[#c2410c]">Deteriorating</span></>
                  )}
                  {selectedDistrict.trend === 'stable' && (
                    <span className="text-sm text-muted-foreground">Stable</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 px-4 py-2 bg-[#1a6b58] text-white rounded-xl text-sm font-medium hover:bg-[#0b1f1a] transition-colors">
                  View Report
                </button>
                <button className="px-4 py-2 border border-border text-[#0b1f1a] rounded-xl text-sm font-medium hover:bg-secondary/40 transition-colors">
                  Export
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Map hover tooltip */}
      {hoveredDistrict && hoverPos && activeTab === 'map' && (
        <div
          className="fixed z-50 bg-white shadow-xl rounded-2xl border border-border/60 p-4 w-56"
          style={{ top: hoverPos.y + 15, left: hoverPos.x + 15, pointerEvents: 'none' }}
        >
          {(() => {
            const data = dzongkhagRiskData.find(d => d.name === hoveredDistrict);
            if (!data) return null;
            return (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#1a6b58]" />
                  <h4 className="font-bold text-[#0b1f1a] text-sm">{data.name}</h4>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span
                      className="px-2 py-0.5 rounded font-bold"
                      style={{ backgroundColor: riskLevelColors[data.riskLevel].bg, color: riskLevelColors[data.riskLevel].text }}
                    >
                      {data.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Farms</span>
                    <span className="font-bold">{data.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">High + Critical</span>
                    <span className="font-bold text-[#c2410c]">{data.high + data.critical}</span>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default RiskMapPage;
