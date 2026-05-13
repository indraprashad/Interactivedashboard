import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { MapPin, Filter, AlertTriangle, TrendingDown, TrendingUp, X, Eye, EyeOff } from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';


// Import the Bhutan GeoJSON data - in a real app this would be imported from the file
// For this demo, we'll use the data structure from the provided file
// In production: import btData from './bt.json';
import btData from '../../imports/bt.json';

// Calculate farm risk data from the GeoJSON features
// This creates realistic risk scores based on district geography and name
const generateRiskDataFromGeoJSON = () => {
  const features = btData.features;

  return features.map((feature, index) => {
    const name = feature.properties.name;
    // Generate realistic risk metrics based on district name and index
    // This simulates actual farm data for demonstration
    const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed = (nameHash + index * 7) % 100;

    let total = 0;
    let low = 0;
    let medium = 0;
    let high = 0;
    let critical = 0;
    let riskLevel = '';
    let trend = '';

    // Generate realistic farm counts based on district size/population
    if (name === 'Thimphu') {
      total = 234;
      low = 180;
      medium = 42;
      high = 10;
      critical = 2;
      riskLevel = 'Low';
      trend = 'stable';
    } else if (name === 'Paro') {
      total = 156;
      low = 110;
      medium = 32;
      high = 12;
      critical = 2;
      riskLevel = 'Medium';
      trend = 'improving';
    } else if (name === 'Punakha') {
      total = 189;
      low = 120;
      medium = 45;
      high = 20;
      critical = 4;
      riskLevel = 'Medium';
      trend = 'deteriorating';
    } else if (name === 'Bumthang') {
      total = 98;
      low = 75;
      medium = 18;
      high = 4;
      critical = 1;
      riskLevel = 'Low';
      trend = 'stable';
    } else if (name === 'Wangdue Phodrang') {
      total = 142;
      low = 95;
      medium = 35;
      high = 10;
      critical = 2;
      riskLevel = 'Medium';
      trend = 'improving';
    } else if (name === 'Trongsa') {
      total = 87;
      low = 68;
      medium = 15;
      high = 3;
      critical = 1;
      riskLevel = 'Low';
      trend = 'stable';
    } else {
      // Generate random but realistic data for other districts
      total = 50 + Math.floor(Math.random() * 150);
      low = Math.floor(total * (0.4 + Math.random() * 0.4));
      medium = Math.floor(total * (0.2 + Math.random() * 0.3));
      high = Math.floor(total * (0.05 + Math.random() * 0.15));
      critical = Math.max(0, total - low - medium - high);

      // Adjust to ensure sums match
      const sum = low + medium + high + critical;
      if (sum !== total) {
        const diff = total - sum;
        if (diff > 0) low += diff;
        else critical -= diff;
      }

      // Determine risk level based on high + critical percentage
      const highRiskPercent = (high + critical) / total;
      if (highRiskPercent > 0.25) riskLevel = 'Critical';
      else if (highRiskPercent > 0.15) riskLevel = 'High';
      else if (highRiskPercent > 0.08) riskLevel = 'Medium';
      else riskLevel = 'Low';

      // Random trend
      const trends = ['stable', 'improving', 'deteriorating'];
      trend = trends[Math.floor(Math.random() * trends.length)];
    }

    return {
      id: feature.properties.id,
      name: name,
      total,
      low,
      medium,
      high,
      critical,
      riskLevel,
      trend,
      geometry: feature.geometry
    };
  });
};

const riskLevelColors: Record<string, { bg: string; text: string; map: string }> = {
  Low: { bg: "#1a6b58", text: "#ffffff", map: "#1a6b58" },
  Medium: { bg: "#fbbf24", text: "#0b1f1a", map: "#fbbf24" },
  High: { bg: "#fb923c", text: "#ffffff", map: "#fb923c" },
  Critical: { bg: "#c2410c", text: "#ffffff", map: "#c2410c" }
};

// Color scale for map based on risk level
const getMapFillColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'Low': return '#1a6b58';
    case 'Medium': return '#fbbf24';
    case 'High': return '#fb923c';
    case 'Critical': return '#c2410c';
    default: return '#e7efe9';
  }
};

export function RiskMapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [filterRisk, setFilterRisk] = useState<string>('All');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  // Generate risk data from the imported GeoJSON
  const dzongkhagRiskData = useMemo(() => generateRiskDataFromGeoJSON(), []);

  // Filter data based on selected risk level
  const filteredData = useMemo(() => {
    if (filterRisk === 'All') return dzongkhagRiskData;
    return dzongkhagRiskData.filter(d => d.riskLevel === filterRisk);
  }, [filterRisk, dzongkhagRiskData]);

  // Statistics for summary cards
  const stats = useMemo(() => {
    const totalFarms = dzongkhagRiskData.reduce((sum, d) => sum + d.total, 0);
    const totalCritical = dzongkhagRiskData.reduce((sum, d) => sum + d.critical, 0);
    const totalHigh = dzongkhagRiskData.reduce((sum, d) => sum + d.high, 0);
    const highRiskDistricts = dzongkhagRiskData.filter(d => d.riskLevel === 'High' || d.riskLevel === 'Critical').length;

    return {
      totalFarms,
      totalHighRiskFarms: totalHigh + totalCritical,
      highRiskDistricts,
      avgRiskScore: Math.round(((totalHigh + totalCritical) / totalFarms) * 100)
    };
  }, [dzongkhagRiskData]);

  const handleGeographyClick = useCallback((geo: any) => {
    const district = dzongkhagRiskData.find(d => d.id === geo.properties.id);
    if (district) {
      setSelectedDistrict(district);
    }
  }, [dzongkhagRiskData]);

  const handleGeographyMouseEnter = useCallback((geo: any, event?: any) => {
    setHoveredDistrict(geo.properties.name);

    if (event) {
      setHoverPos({
        x: event.clientX,
        y: event.clientY,
      });
    }
  }, []);

const handleGeographyMouseLeave = useCallback(() => {
  setHoveredDistrict(null);
  setHoverPos(null);
}, []);

  const closeModal = () => setSelectedDistrict(null);

  return (
    <div className="flex-1 bg-[#e7efe9] p-4 lg:p-8 overflow-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto"
      >
        {/* Header */}
        <div className="mb-6 bg-white rounded-lg p-4">
          <p className="text-[#8a8a8a] text-sm mb-1">Risk Assessment / Geographic View</p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-[#0b1f1a] text-2xl lg:text-3xl font-bold">Risk Map</h2>
              <p className="text-[#8a8a8a] text-sm">Biosecurity risk assessment by region using Bhutan GeoJSON data</p>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="px-4 py-2 bg-white border border-[#8a8a8a] text-[#0b1f1a] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a6b58]"
              >
                <option value="All">All Districts</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
                <option value="Critical">Critical Risk</option>
              </select>
              <button className="px-4 py-2 bg-white border border-[#8a8a8a] text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-5 shadow-sm"
          >
            <p className="text-[#8a8a8a] text-sm">Total Farms</p>
            <p className="text-2xl font-bold text-[#0b1f1a]">{stats.totalFarms.toLocaleString()}</p>
            <p className="text-xs text-[#1a6b58]">Across {dzongkhagRiskData.length} Dzongkhags</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-lg p-5 shadow-sm"
          >
            <p className="text-[#8a8a8a] text-sm">High Risk Farms</p>
            <p className="text-2xl font-bold text-[#c2410c]">{stats.totalHighRiskFarms.toLocaleString()}</p>
            <p className="text-xs text-[#c2410c]">{stats.avgRiskScore}% of total farms</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-5 shadow-sm"
          >
            <p className="text-[#8a8a8a] text-sm">High-Risk Districts</p>
            <p className="text-2xl font-bold text-[#fb923c]">{stats.highRiskDistricts}</p>
            <p className="text-xs text-[#fb923c]">Require immediate attention</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-lg p-5 shadow-sm"
          >
            <p className="text-[#8a8a8a] text-sm">Compliance Rate</p>
            <p className="text-2xl font-bold text-[#1a6b58]">78%</p>
            <p className="text-xs text-[#1a6b58]">+5% from last quarter</p>
          </motion.div>
        </div>

        {/* Risk Legend */}
        <div className="bg-white rounded-lg p-4 lg:p-6 shadow-sm mb-6">
          <h3 className="text-[#0b1f1a] text-lg font-bold mb-4">Risk Level Legend</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1a6b58]" />
              <div>
                <p className="text-[#0b1f1a] font-bold text-sm">Low Risk</p>
                <p className="text-[#8a8a8a] text-xs">Score: 2.0 - 3.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fbbf24]" />
              <div>
                <p className="text-[#0b1f1a] font-bold text-sm">Medium Risk</p>
                <p className="text-[#8a8a8a] text-xs">Score: 1.5 - 1.9</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fb923c]" />
              <div>
                <p className="text-[#0b1f1a] font-bold text-sm">High Risk</p>
                <p className="text-[#8a8a8a] text-xs">Score: 1.0 - 1.4</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c2410c]" />
              <div>
                <p className="text-[#0b1f1a] font-bold text-sm">Critical Risk</p>
                <p className="text-[#8a8a8a] text-xs">Score: 0.0 - 0.9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[#0b1f1a] text-lg font-bold">
                Interactive Risk Map
              </h3>

              <button
                onClick={() => setShowMap(prev => !prev)}
                className="p-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-1"
                title={showMap ? "Hide map" : "Show map"}
              >
                {showMap ? (
                  <Eye className="w-4 h-4 text-[#1a6b58]" />
                ) : (
                  <EyeOff className="w-4 h-4 text-[#8a8a8a]" />
                )}
              </button>
            </div>

            {hoveredDistrict && (
              <div className="text-sm text-[#1a6b58] bg-[#e7efe9] px-3 py-1 rounded-full">
                Hovering: {hoveredDistrict}
              </div>
            )}
          </div>
          {showMap && (
            <div
              className="w-full h-[500px] rounded-lg overflow-hidden border border-gray-200"
              onWheelCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 18000,
                  center: [90.5, 27.5],
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  touchAction: "none"
                }}
              >
                <ZoomableGroup
                  zoom={1}
                  center={[90.5, 27.5]}
                  disablePanning
                  onMoveStart={() => { }}
                  onMoveEnd={() => { }}
                  onMove={() => { }}
                >
                  <Geographies geography={btData}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const districtData = dzongkhagRiskData.find(
                          (d) => d.id === geo.properties.id
                        );

                        const fillColor = districtData
                          ? getMapFillColor(districtData.riskLevel)
                          : "#e2e8f0";

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fillColor}
                            stroke="#ffffff"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none", cursor: "pointer" },
                              hover: {
                                outline: "none",
                                fill: "#fbbf24",
                                transition: "all 250ms",
                              },
                              pressed: { outline: "none" },
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
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
            <span>◼ Green: Low Risk</span>
            <span>◼ Yellow: Medium Risk</span>
            <span>◼ Orange: High Risk</span>
            <span>◼ Red: Critical Risk</span>
            <span>Click on any district for details</span>
          </div>
        </div>


        {/* District Risk Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-200">
            <h3 className="text-[#0b1f1a] text-xl font-bold">Risk Assessment by Dzongkhag</h3>
            <p className="text-[#8a8a8a] text-sm mt-1">Based on farm compliance data from {dzongkhagRiskData.length} districts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Dzongkhag</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Total Farms</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Low</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Medium</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">High</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden lg:table-cell">Critical</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm">Risk Level</th>
                  <th className="text-left py-3 px-4 text-[#8a8a8a] font-bold text-sm hidden xl:table-cell">Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((dzongkhag, index) => (
                  <motion.tr
                    key={dzongkhag.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedDistrict(dzongkhag)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#1a6b58]" />
                        <span className="text-[#0b1f1a] font-bold">{dzongkhag.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#0b1f1a] font-bold">{dzongkhag.total}</td>
                    <td className="py-4 px-4 text-[#8a8a8a] hidden lg:table-cell">{dzongkhag.low}</td>
                    <td className="py-4 px-4 text-[#8a8a8a] hidden lg:table-cell">{dzongkhag.medium}</td>
                    <td className="py-4 px-4 text-[#8a8a8a] hidden lg:table-cell">{dzongkhag.high}</td>
                    <td className="py-4 px-4 text-[#8a8a8a] hidden lg:table-cell">{dzongkhag.critical}</td>
                    <td className="py-4 px-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: riskLevelColors[dzongkhag.riskLevel].bg,
                          color: riskLevelColors[dzongkhag.riskLevel].text
                        }}
                      >
                        {dzongkhag.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden xl:table-cell">
                      <div className="flex items-center gap-1">
                        {dzongkhag.trend === "improving" && (
                          <>
                            <TrendingDown className="w-4 h-4 text-[#1a6b58]" />
                            <span className="text-[#1a6b58] text-sm">Improving</span>
                          </>
                        )}
                        {dzongkhag.trend === "deteriorating" && (
                          <>
                            <TrendingUp className="w-4 h-4 text-[#c2410c]" />
                            <span className="text-[#c2410c] text-sm">Deteriorating</span>
                          </>
                        )}
                        {dzongkhag.trend === "stable" && (
                          <span className="text-[#8a8a8a] text-sm">Stable</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* District Detail Modal */}
      {selectedDistrict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#1a6b58]" />
                <h3 className="text-xl font-bold text-[#0b1f1a]">{selectedDistrict.name}</h3>
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-[#8a8a8a]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-[#8a8a8a]">Risk Level</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: riskLevelColors[selectedDistrict.riskLevel].bg,
                    color: riskLevelColors[selectedDistrict.riskLevel].text
                  }}
                >
                  {selectedDistrict.riskLevel}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-[#8a8a8a]">Total Farms</span>
                <span className="font-bold text-[#0b1f1a]">{selectedDistrict.total}</span>
              </div>

              <div className="space-y-2">
                <p className="text-[#8a8a8a] text-sm">Risk Breakdown</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#1a6b58] h-full"
                    style={{ width: `${(selectedDistrict.low / selectedDistrict.total) * 100}%` }}
                  />
                  <div
                    className="bg-[#fbbf24] h-full"
                    style={{ width: `${(selectedDistrict.medium / selectedDistrict.total) * 100}%` }}
                  />
                  <div
                    className="bg-[#fb923c] h-full"
                    style={{ width: `${(selectedDistrict.high / selectedDistrict.total) * 100}%` }}
                  />
                  <div
                    className="bg-[#c2410c] h-full"
                    style={{ width: `${(selectedDistrict.critical / selectedDistrict.total) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#1a6b58]">Low: {selectedDistrict.low}</span>
                  <span className="text-[#fbbf24]">Medium: {selectedDistrict.medium}</span>
                  <span className="text-[#fb923c]">High: {selectedDistrict.high}</span>
                  <span className="text-[#c2410c]">Critical: {selectedDistrict.critical}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-[#8a8a8a]">Trend</span>
                <div className="flex items-center gap-1">
                  {selectedDistrict.trend === "improving" && (
                    <>
                      <TrendingDown className="w-4 h-4 text-[#1a6b58]" />
                      <span className="text-[#1a6b58] text-sm">Improving</span>
                    </>
                  )}
                  {selectedDistrict.trend === "deteriorating" && (
                    <>
                      <TrendingUp className="w-4 h-4 text-[#c2410c]" />
                      <span className="text-[#c2410c] text-sm">Deteriorating</span>
                    </>
                  )}
                  {selectedDistrict.trend === "stable" && (
                    <span className="text-[#8a8a8a] text-sm">Stable</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-[#1a6b58] text-white rounded-lg text-sm font-medium hover:bg-[#0b1f1a]">
                  View Detailed Report
                </button>
                <button className="px-4 py-2 border border-[#8a8a8a] text-[#0b1f1a] rounded-lg text-sm font-medium hover:bg-gray-50">
                  Export Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {hoveredDistrict && hoverPos && (
        <div
          className="fixed z-50 bg-white shadow-xl rounded-xl border border-gray-200 p-4 w-64"
          style={{
            top: hoverPos.y + 15,
            left: hoverPos.x + 15,
            pointerEvents: "none",
          }}
        >
          {(() => {
            const data = dzongkhagRiskData.find(
              (d) => d.name === hoveredDistrict
            );

            if (!data) return null;

            return (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#1a6b58]" />
                  <h4 className="font-bold text-[#0b1f1a]">{data.name}</h4>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Risk:</span>{" "}
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: riskLevelColors[data.riskLevel].bg,
                        color: riskLevelColors[data.riskLevel].text,
                      }}
                    >
                      {data.riskLevel}
                    </span>
                  </p>

                  <p className="text-gray-600">
                    Total Farms: <span className="font-bold">{data.total}</span>
                  </p>

                  <p className="text-gray-600">
                    High Risk: <span className="font-bold text-[#c2410c]">{data.high + data.critical}</span>
                  </p>

                  <p className="text-gray-600">
                    Trend: <span className="font-bold">{data.trend}</span>
                  </p>
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