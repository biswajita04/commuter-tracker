"use client";

import { useState, useEffect } from "react";

interface BusRoute {
  id: string;
  routeNo: string;
  serviceType: "Vayu Vajra (AC)" | "Vajra (AC)" | "Ordinary";
  origin: string;
  destination: string;
  etaMins: number;
  fare: string;
  occupancy: "Low" | "Moderate" | "Crowded";
  nextStop: string;
  stops: string[];
}

const INITIAL_ROUTES: BusRoute[] = [
  {
    id: "1",
    routeNo: "317-E",
    serviceType: "Ordinary",
    origin: "Majestic (KBS)",
    destination: "East Point College (Bidarahalli)",
    etaMins: 5,
    fare: "₹35",
    occupancy: "Moderate",
    nextStop: "KR Puram",
    stops: [
      "Majestic (KBS)",
      "Shivajinagar",
      "Ulsoor",
      "Tin Factory",
      "KR Puram",
      "Battenahalli",
      "Bidarahalli",
      "East Point College",
    ],
  },
  {
    id: "2",
    routeNo: "300-H",
    serviceType: "Ordinary",
    origin: "Hebbal",
    destination: "Hoskote",
    etaMins: 7,
    fare: "₹30",
    occupancy: "Crowded",
    nextStop: "KR Puram",
    stops: [
      "Hebbal",
      "Nagawara",
      "TC Palya Gate",
      "KR Puram",
      "Budigere Cross",
      "Bidarahalli",
      "Hoskote Gate",
      "Hoskote Bus Stand",
    ],
  },
  {
    id: "3",
    routeNo: "500-D",
    serviceType: "Vajra (AC)",
    origin: "Central Silk Board",
    destination: "Hebbal",
    etaMins: 4,
    fare: "₹45",
    occupancy: "Moderate",
    nextStop: "Agara Junction",
    stops: [
      "Central Silk Board",
      "HSR Layout BDA",
      "Agara Junction",
      "Bellandur",
      "Marathahalli Bridge",
      "KR Puram",
      "Tin Factory",
      "Nagawara",
      "Hebbal",
    ],
  },
  {
    id: "4",
    routeNo: "KIA-9",
    serviceType: "Vayu Vajra (AC)",
    origin: "Majestic (KBS)",
    destination: "Kempegowda Int. Airport (KIAL)",
    etaMins: 10,
    fare: "₹270",
    occupancy: "Low",
    nextStop: "Hebbal Flyover",
    stops: [
      "Majestic (KBS)",
      "Mekhri Circle",
      "Hebbal Flyover",
      "Yelahanka Bypass",
      "Sadahalli Gate",
      "KIAL Airport Terminal",
    ],
  },
  {
    id: "5",
    routeNo: "500-A",
    serviceType: "Ordinary",
    origin: "Banashankari",
    destination: "East Point College (Bidarahalli)",
    etaMins: 6,
    fare: "₹40",
    occupancy: "Moderate",
    nextStop: "Marathahalli",
    stops: [
      "Banashankari",
      "Silk Board",
      "Bellandur",
      "Marathahalli",
      "KR Puram",
      "Bidarahalli",
      "East Point College",
    ],
  },
];

export default function Home() {
  const [bmtcRoutes, setBmtcRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [fromStop, setFromStop] = useState("");
  const [toStop, setToStop] = useState("");
  const [busSearch, setBusSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState<"All" | "Vayu Vajra (AC)" | "Vajra (AC)" | "Ordinary">("All");
  const [selectedRouteId, setSelectedRouteId] = useState<string>("1");

  // Real-time live countdown timer (ticks every 10 seconds for demo smoothness)
  useEffect(() => {
    const interval = setInterval(() => {
      setBmtcRoutes((prevRoutes) =>
        prevRoutes.map((bus) => {
          if (bus.etaMins <= 1) {
            // Reset / simulate next bus arriving when it hits 0
            return { ...bus, etaMins: Math.floor(Math.random() * 8) + 4 };
          }
          return { ...bus, etaMins: bus.etaMins - 1 };
        })
      );
    }, 10000); // ticks every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const selectedRoute = bmtcRoutes.find((b) => b.id === selectedRouteId) || bmtcRoutes[0];

  const swapStops = () => {
    setFromStop(toStop);
    setToStop(fromStop);
  };

  const filteredRoutes = bmtcRoutes.filter((bus) => {
    const matchesService = serviceFilter === "All" || bus.serviceType === serviceFilter;
    const matchesBusNo =
      busSearch.trim() === "" ||
      bus.routeNo.toLowerCase().includes(busSearch.toLowerCase()) ||
      bus.origin.toLowerCase().includes(busSearch.toLowerCase()) ||
      bus.destination.toLowerCase().includes(busSearch.toLowerCase());

    const matchesFrom =
      fromStop.trim() === "" ||
      bus.stops.some((stop) => stop.toLowerCase().includes(fromStop.toLowerCase()));

    const matchesTo =
      toStop.trim() === "" ||
      bus.stops.some((stop) => stop.toLowerCase().includes(toStop.toLowerCase()));

    return matchesService && matchesBusNo && matchesFrom && matchesTo;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-blue-800/60 px-6 py-5 shadow-lg">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-lg shadow">
              🚌
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">
                Namma <span className="text-amber-400">Commuter</span>
              </h1>
              <p className="text-xs text-blue-200">Live Bengaluru Bus Tracking • Route & Fare Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-900/70 px-3 py-1.5 rounded-full border border-blue-700/50 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-medium">GPS Live Feed Active (Auto-updating)</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 mt-6 space-y-6">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                From Stop
              </label>
              <input
                type="text"
                value={fromStop}
                onChange={(e) => setFromStop(e.target.value)}
                placeholder="e.g., Bidarahalli, Hebbal, Majestic"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition"
              />
            </div>

            <div className="lg:col-span-1 flex justify-center">
              <button
                onClick={swapStops}
                title="Swap Stops"
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl p-2.5 transition cursor-pointer"
              >
                ⇄
              </button>
            </div>

            <div className="lg:col-span-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                To Destination
              </label>
              <input
                type="text"
                value={toStop}
                onChange={(e) => setToStop(e.target.value)}
                placeholder="e.g., East Point College, Hoskote"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Search Bus No.
              </label>
              <input
                type="text"
                value={busSearch}
                onChange={(e) => setBusSearch(e.target.value)}
                placeholder="e.g., 317-E, 300-H, 500-D"
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800">
            <div className="flex flex-wrap gap-2">
              {(["All", "Vayu Vajra (AC)", "Vajra (AC)", "Ordinary"] as const).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setServiceFilter(tier)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    serviceFilter === tier
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>

            {(fromStop || toStop || busSearch || serviceFilter !== "All") && (
              <button
                onClick={() => {
                  setFromStop("");
                  setToStop("");
                  setBusSearch("");
                  setServiceFilter("All");
                }}
                className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                Available Buses ({filteredRoutes.length})
              </h2>
              <span className="text-xs text-slate-400">Click a bus to view live route stops</span>
            </div>

            {filteredRoutes.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
                <p className="text-slate-400 text-sm">No buses found matching those stops or route number.</p>
              </div>
            ) : (
              filteredRoutes.map((bus) => {
                const isSelected = selectedRoute?.id === bus.id;
                return (
                  <div
                    key={bus.id}
                    onClick={() => setSelectedRouteId(bus.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? "bg-blue-950/50 border-amber-400 shadow-lg"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-md text-sm">
                            {bus.routeNo}
                          </span>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              bus.serviceType.includes("Vayu")
                                ? "bg-sky-500/20 text-sky-300"
                                : bus.serviceType.includes("Vajra")
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {bus.serviceType}
                          </span>
                          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            Est. Fare: {bus.fare}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-white mt-2">
                          {bus.origin} <span className="text-amber-400 mx-1">→</span> {bus.destination}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Approaching: <span className="text-slate-200 font-medium">{bus.nextStop}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                          <p className="text-lg font-extrabold text-emerald-400 leading-none">
                            {bus.etaMins} min
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">
                            Live ETA
                          </p>
                        </div>

                        <p
                          className={`text-xs font-medium mt-2 ${
                            bus.occupancy === "Low"
                              ? "text-emerald-400"
                              : bus.occupancy === "Moderate"
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          ● {bus.occupancy} Crowd
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="lg:col-span-5">
            {selectedRoute ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                      Live Route Timeline
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-0.5">
                      Route {selectedRoute.routeNo}
                    </h3>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                    {selectedRoute.stops.length} Stops
                  </span>
                </div>

                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                  {selectedRoute.stops.map((stop, index) => {
                    const isNextStop = stop === selectedRoute.nextStop;
                    const isTerminal = index === 0 || index === selectedRoute.stops.length - 1;

                    return (
                      <div key={stop} className="relative flex items-center justify-between">
                        <span
                          className={`absolute -left-6 w-4 h-4 rounded-full border-2 ${
                            isNextStop
                              ? "bg-amber-400 border-amber-200 ring-4 ring-amber-400/20"
                              : isTerminal
                              ? "bg-cyan-400 border-slate-950"
                              : "bg-slate-800 border-slate-500"
                          }`}
                        />

                        <div>
                          <p
                            className={`text-sm ${
                              isNextStop
                                ? "font-bold text-amber-300"
                                : isTerminal
                                ? "font-semibold text-white"
                                : "text-slate-300"
                            }`}
                          >
                            {stop}
                          </p>
                          {isNextStop && (
                            <span className="text-[11px] text-amber-400 font-medium">
                              🚌 Bus arriving in {selectedRoute.etaMins} mins
                            </span>
                          )}
                        </div>

                        <span className="text-xs text-slate-500">
                          {index === 0 ? "Start" : index === selectedRoute.stops.length - 1 ? "End" : `#${index + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}