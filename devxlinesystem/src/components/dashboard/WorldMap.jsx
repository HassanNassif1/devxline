import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker, Line } from 'react-simple-maps';
import { Tooltip, Spin, Typography } from 'antd';
import { GlobalOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

// MAP URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// === EXTENDED COUNTRY COORDINATES ===
const countryDatabase = {
  // North America
  "United States": [-95.7129, 37.0902], "USA": [-95.7129, 37.0902], "US": [-95.7129, 37.0902],
  "Canada": [-106.3468, 56.1304], "CA": [-106.3468, 56.1304],
  "Mexico": [-102.5528, 23.6345], "MX": [-102.5528, 23.6345],
  
  // Europe
  "United Kingdom": [-3.4359, 55.3781], "UK": [-3.4359, 55.3781], "GB": [-3.4359, 55.3781],
  "Germany": [10.4515, 51.1657], "DE": [10.4515, 51.1657],
  "France": [2.2137, 46.2276], "FR": [2.2137, 46.2276],
  "Italy": [12.5674, 41.8719], "IT": [12.5674, 41.8719],
  "Spain": [-3.7492, 40.4637], "ES": [-3.7492, 40.4637],
  "Portugal": [-8.2245, 39.3999], "PT": [-8.2245, 39.3999],
  "Netherlands": [5.2913, 52.1326], "NL": [5.2913, 52.1326],
  "Sweden": [18.6435, 60.1282], "SE": [18.6435, 60.1282],
  "Norway": [8.4689, 60.4720], "NO": [8.4689, 60.4720],
  "Denmark": [9.5018, 56.2639], "DK": [9.5018, 56.2639],
  "Finland": [25.7482, 61.9241], "FI": [25.7482, 61.9241],
  "Ireland": [-8.2439, 53.4129], "IE": [-8.2439, 53.4129],
  "Poland": [19.1451, 51.9194], "PL": [19.1451, 51.9194],
  "Greece": [21.8243, 39.0742], "GR": [21.8243, 39.0742],
  
  // Asia
  "China": [104.1954, 35.8617], "CN": [104.1954, 35.8617],
  "India": [78.9629, 20.5937], "IN": [78.9629, 20.5937],
  "Japan": [138.2529, 36.2048], "JP": [138.2529, 36.2048],
  "South Korea": [127.7669, 35.9078], "KR": [127.7669, 35.9078],
  "Singapore": [103.8198, 1.3521], "SG": [103.8198, 1.3521],
  "UAE": [53.8478, 23.4241], "AE": [53.8478, 23.4241],
  "Saudi Arabia": [45.0792, 23.8859], "SA": [45.0792, 23.8859],
  
  // Oceania
  "Australia": [133.7751, -25.2744], "AU": [133.7751, -25.2744],
  
  // South America
  "Brazil": [-51.9253, -14.2350], "BR": [-51.9253, -14.2350],
  "Argentina": [-63.6167, -38.4161], "AR": [-63.6167, -38.4161],
  
  // Africa
  "South Africa": [22.9375, -30.5595], "ZA": [22.9375, -30.5595],
  "Nigeria": [8.6753, 9.0820], "NG": [8.6753, 9.0820],
  "Egypt": [30.8025, 26.8206], "EG": [30.8025, 26.8206],
  "Kenya": [37.9062, -1.2921], "KE": [37.9062, -1.2921],
  
  // Russia
  "Russia": [105.3188, 61.5240], "RU": [105.3188, 61.5240],
};

const getCountryCoords = (searchKey) => {
  if (!searchKey) return null;
  const key = Object.keys(countryDatabase).find(k => 
    k.toLowerCase() === searchKey.toLowerCase() || searchKey.toLowerCase().includes(k.toLowerCase())
  );
  return key ? countryDatabase[key] : null;
};

// MOCK DATA for fallback when API is not available
const MOCK_COUNTRY_DATA = [
  { nationality: "United States", count: 45 },
  { nationality: "United Kingdom", count: 32 },
  { nationality: "Germany", count: 28 },
  { nationality: "France", count: 24 },
  { nationality: "Canada", count: 20 },
  { nationality: "Australia", count: 18 },
  { nationality: "India", count: 15 },
  { nationality: "Brazil", count: 12 },
  { nationality: "China", count: 10 },
  { nationality: "Japan", count: 8 },
  { nationality: "Singapore", count: 7 },
  { nationality: "UAE", count: 6 },
  { nationality: "South Africa", count: 5 },
  { nationality: "Nigeria", count: 4 },
  { nationality: "Egypt", count: 3 },
];

const WorldMap = () => {
  const [loading, setLoading] = useState(true);
  const [countryData, setCountryData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [useMockData, setUseMockData] = useState(false);

  // Fetch data from API with fallback to mock data
  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/users-by-nationality');
        const data = res.data;
        
        if (data && data.length > 0) {
          // Format data from API
          const formatted = data
            .filter(item => item.nationality)
            .map(item => {
              const coords = getCountryCoords(item.nationality);
              return {
                nationality: item.nationality,
                count: parseInt(item.count, 10),
                coords: coords
              };
            })
            .filter(item => item.coords !== null);

          if (formatted.length > 0) {
            setCountryData(formatted);
            setTotalUsers(formatted.reduce((acc, curr) => acc + curr.count, 0));
            setUseMockData(false);
          } else {
            // If no valid coordinates found, use mock data
            useMockDataFallback();
          }
        } else {
          // If API returns empty, use mock data
          useMockDataFallback();
        }
      } catch (err) {
        console.warn("Failed to fetch nationalities, using mock data", err);
        useMockDataFallback();
      } finally {
        setLoading(false);
      }
    };

    const useMockDataFallback = () => {
      const formatted = MOCK_COUNTRY_DATA
        .map(item => {
          const coords = getCountryCoords(item.nationality);
          return {
            nationality: item.nationality,
            count: item.count,
            coords: coords
          };
        })
        .filter(item => item.coords !== null);
      
      setCountryData(formatted);
      setTotalUsers(formatted.reduce((acc, curr) => acc + curr.count, 0));
      setUseMockData(true);
    };

    fetchNationalities();
  }, []);

  // Generate Dynamic Network Connections (Lines between countries)
  const networkLines = useMemo(() => {
    if (countryData.length < 2) return [];
    const lines = [];
    
    const firstCountry = countryData[0];
    
    for (let i = 1; i < countryData.length; i++) {
      if (firstCountry.coords && countryData[i].coords) {
        lines.push({
          from: firstCountry.coords,
          to: countryData[i].coords,
          key: `line-${i}`
        });
      }
      
      if (i < countryData.length - 1 && Math.random() > 0.6) {
        if (countryData[i].coords && countryData[i+1].coords) {
          lines.push({
            from: countryData[i].coords,
            to: countryData[i+1].coords,
            key: `cross-${i}`
          });
        }
      }
    }
    return lines;
  }, [countryData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 250 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!countryData.length) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 250, flexDirection: 'column', gap: 12 }}>
        <GlobalOutlined style={{ fontSize: 40, color: 'rgba(255,255,255,0.4)' }} />
        <Text style={{ color: 'rgba(255,255,255,0.5)' }}>No client location data available</Text>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: 'transparent', borderRadius: 16 }}>
      
      {useMockData && (
        <div style={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          zIndex: 10,
          background: 'rgba(168, 85, 247, 0.2)',
          padding: '2px 10px',
          borderRadius: 12,
          border: '1px solid rgba(168, 85, 247, 0.3)',
          fontSize: 9,
          color: '#c084fc'
        }}>
          Demo Data
        </div>
      )}

      <div style={{ height: '100%', minHeight: 220, width: '100%', position: 'relative' }}>
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 160 }}
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6E56CF" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity={0.95} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ZoomableGroup center={[0, 10]} zoom={1.1}>
            
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { 
                        fill: 'url(#mapGradient)', 
                        stroke: 'rgba(255,255,255,0.1)', 
                        strokeWidth: 0.5, 
                        outline: 'none', 
                        transition: 'all 0.3s ease' 
                      },
                      hover: { 
                        fill: '#ffffff', 
                        stroke: '#a855f7', 
                        strokeWidth: 1.5, 
                        outline: 'none', 
                        cursor: 'pointer' 
                      },
                      pressed: { fill: '#a855f7', outline: 'none' },
                    }}
                  />
                ))
              }
            </Geographies>

            {networkLines.map((line) => (
              <Line
                key={line.key}
                from={line.from}
                to={line.to}
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeOpacity={0.3}
                fill="none"
              />
            ))}

            {countryData.map((country) => {
              const [x, y] = country.coords;
              return (
                <Tooltip title={`${country.nationality}: ${country.count} Clients`} color="#1e1e36" key={country.nationality}>
                  <Marker coordinates={[x, y]}>
                    <g>
                      <circle r={16} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth={1}>
                        <animate attributeName="r" from="14" to="20" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      
                      <circle r={10} fill="#ffffff" filter="url(#glow)" />
                      
                      <UserOutlined style={{ 
                        fontSize: 12, 
                        color: '#1a1a3a', 
                        position: 'absolute', 
                        transform: 'translate(-6px, -6px)' 
                      }} />
                      
                      <text
                        x={0}
                        y={-20}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={9}
                        fontWeight={600}
                        style={{ 
                          pointerEvents: 'none', 
                          textShadow: '0px 1px 6px rgba(0,0,0,0.9)'
                        }}
                      >
                        {country.count}
                      </text>
                    </g>
                  </Marker>
                </Tooltip>
              );
            })}
            
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div style={{ 
        position: 'absolute', 
        bottom: 10, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 16, 
        alignItems: 'center', 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 10,
        background: 'rgba(13,13,26,0.8)',
        padding: '4px 12px',
        borderRadius: 20,
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff' }} />
          <span>Client Hubs</span>
        </div>
        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
        <TeamOutlined style={{ marginRight: 4 }} /> {totalUsers} Active Users
        {useMockData && (
          <>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ color: '#c084fc' }}>📊 Demo</span>
          </>
        )}
      </div>
    </div>
  );
};

export default WorldMap;