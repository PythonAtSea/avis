"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "avis_game_state";

interface SerializedWoodcock {
  birthDate: string;
  isAdult: boolean;
  name: string;
}

interface GameState {
  woodcocks: SerializedWoodcock[];
  worms: number;
  msPerWorm: number;
  growMs: number;
  maxLife: number;
  wormSpeedUpgradeCost: number;
  growUpgradeCost: number;
  maxLifeUpgradeCost: number;
  lastWormTime: number;
  blazeStartTime: string;
  sacrificeTime: string;
  incubatorSecondsPerHatch: number;
  incubatorCost: number;
  instantGrowthChance: number;
  instantGrowthCost: number;
  immortalityChance: number;
  immortalityCost: number;
}

const saveToLocalStorage = (state: GameState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save game state to localStorage:", error);
  }
};

const loadFromLocalStorage = (): GameState | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Failed to load game state from localStorage:", error);
    return null;
  }
};

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.0);
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(120, 113, 108, 0.8);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(168, 162, 158, 0.8);
  }
`;

type Woodcock = {
  birthDate: Date;
  isAdult: boolean;
  name: string;
};

const BIRD_NAMES = [
  "Archimedes",
  "Beatrice",
  "Cedar",
  "Delilah",
  "Ember",
  "Falcon",
  "Gideon",
  "Harper",
  "Iris",
  "Jasper",
  "Kestrel",
  "Luna",
  "Maverick",
  "Nova",
  "Oliver",
  "Phoenix",
  "Quinn",
  "Raven",
  "Sage",
  "Theron",
  "Ulysses",
  "Vesper",
  "Willow",
  "Xavier",
  "Yarrow",
  "Zephyr",
];

const getOrdinal = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
};

const getNextName = (existingWoodcocks: Woodcock[]) => {
  const randomBaseName =
    BIRD_NAMES[Math.floor(Math.random() * BIRD_NAMES.length)];
  const usedCount = existingWoodcocks.filter((woodcock) =>
    woodcock.name.startsWith(randomBaseName)
  ).length;

  if (usedCount === 0) {
    return randomBaseName;
  }

  return `${randomBaseName} the ${getOrdinal(usedCount + 1)}`;
};

export default function Home() {
  const savedState =
    typeof window !== "undefined" ? loadFromLocalStorage() : null;

  const [woodcocks, setWoodcocks] = useState<Woodcock[]>(
    savedState?.woodcocks.map((w) => ({
      ...w,
      birthDate: new Date(w.birthDate),
    })) || []
  );
  const [worms, setWorms] = useState<number>(savedState?.worms ?? 0);
  const [msPerWorm, setMsPerWorm] = useState<number>(
    savedState?.msPerWorm ?? 10000
  );
  const [growMs, setGrowMs] = useState<number>(savedState?.growMs ?? 10000);
  const [maxLife, setMaxLife] = useState<number>(savedState?.maxLife ?? 70000);
  const [wormSpeedUpgradeCost, setWormSpeedUpgradeCost] = useState<number>(
    savedState?.wormSpeedUpgradeCost ?? 100
  );
  const [growUpgradeCost, setGrowUpgradeCost] = useState<number>(
    savedState?.growUpgradeCost ?? 80
  );
  const [maxLifeUpgradeCost, setMaxLifeUpgradeCost] = useState<number>(
    savedState?.maxLifeUpgradeCost ?? 150
  );
  const [lastWormTime, setLastWormTime] = useState<number>(
    savedState?.lastWormTime ?? Date.now()
  );
  const [blazeStartTime, setBlazeStartTime] = useState<Date>(
    savedState ? new Date(savedState.blazeStartTime) : new Date(0)
  );
  const [sacrificeTime, setSacrificeTime] = useState<Date>(
    savedState ? new Date(savedState.sacrificeTime) : new Date(0)
  );
  const [incubatorSecondsPerHatch, setIncubatorSecondsPerHatch] =
    useState<number>(savedState?.incubatorSecondsPerHatch ?? 0);
  const [incubatorCost, setIncubatorCost] = useState<number>(
    savedState?.incubatorCost ?? 500
  );
  const lastIncubatorHatchTimeRef = useRef<number>(0);
  const [instantGrowthChance, setInstantGrowthChance] = useState<number>(
    savedState?.instantGrowthChance ?? 0
  );
  const [instantGrowthCost, setInstantGrowthCost] = useState<number>(
    savedState?.instantGrowthCost ?? 700
  );
  const [immortalityChance, setImmortalityChance] = useState<number>(
    savedState?.immortalityChance ?? 0
  );
  const [immortalityCost, setImmortalityCost] = useState<number>(
    savedState?.immortalityCost ?? 1200
  );

  const hatchEgg = useCallback(() => {
    const newName = getNextName(woodcocks);
    if (Math.random() * 100 < instantGrowthChance) {
      const newWoodcock: Woodcock = {
        birthDate: new Date(Date.now() - growMs - 1000),
        isAdult: true,
        name: newName,
      };
      setWoodcocks([...woodcocks, newWoodcock]);
      return;
    }
    const newWoodcock: Woodcock = {
      birthDate: new Date(),
      isAdult: false,
      name: newName,
    };
    setWoodcocks([...woodcocks, newWoodcock]);
  }, [growMs, instantGrowthChance, woodcocks]);

  useEffect(() => {
    const gameState: GameState = {
      woodcocks: woodcocks.map((w) => ({
        birthDate: w.birthDate.toISOString(),
        isAdult: w.isAdult,
        name: w.name,
      })),
      worms,
      msPerWorm,
      growMs,
      maxLife,
      wormSpeedUpgradeCost,
      growUpgradeCost,
      maxLifeUpgradeCost,
      lastWormTime,
      blazeStartTime: blazeStartTime.toISOString(),
      sacrificeTime: sacrificeTime.toISOString(),
      incubatorSecondsPerHatch,
      incubatorCost,
      instantGrowthChance,
      instantGrowthCost,
      immortalityChance,
      immortalityCost,
    };
    saveToLocalStorage(gameState);
  }, [
    woodcocks,
    worms,
    msPerWorm,
    growMs,
    maxLife,
    wormSpeedUpgradeCost,
    growUpgradeCost,
    maxLifeUpgradeCost,
    lastWormTime,
    blazeStartTime,
    sacrificeTime,
    incubatorSecondsPerHatch,
    incubatorCost,
    instantGrowthChance,
    instantGrowthCost,
    immortalityChance,
    immortalityCost,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWoodcocks((prevWoodcocks) => {
        const now = Date.now();
        const hatchIntervalMs = incubatorSecondsPerHatch * 1000;

        const aliveWoodcocks = prevWoodcocks
          .map((woodcock) => {
            const ageInMs = now - woodcock.birthDate.getTime();
            if (ageInMs >= maxLife && woodcock.isAdult) {
              if (Math.random() * 100 < immortalityChance) {
                return {
                  ...woodcock,
                  birthDate: new Date(now - growMs - 1000),
                };
              }
              return null;
            }
            return woodcock;
          })
          .filter((woodcock): woodcock is Woodcock => woodcock !== null);

        const maturedWoodcocks = aliveWoodcocks.map((woodcock) => {
          const ageInMs = now - woodcock.birthDate.getTime();
          if (!woodcock.isAdult && ageInMs >= growMs) {
            return { ...woodcock, isAdult: true };
          }
          return woodcock;
        });

        const nextWoodcocks = [...maturedWoodcocks];

        if (
          incubatorSecondsPerHatch > 0 &&
          lastIncubatorHatchTimeRef.current > 0
        ) {
          const elapsedSinceLastHatch = now - lastIncubatorHatchTimeRef.current;
          if (elapsedSinceLastHatch >= hatchIntervalMs) {
            hatchEgg();
            lastIncubatorHatchTimeRef.current = now;
          }
        }

        return nextWoodcocks;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [growMs, maxLife, incubatorSecondsPerHatch, hatchEgg, immortalityChance]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWoodcocks((prevWoodcocks) => {
        const adultCount = prevWoodcocks.filter(
          (woodcock) => woodcock.isAdult
        ).length;
        if (adultCount > 0) {
          setWorms((prevWorms) => prevWorms + adultCount / 2);
        }
        return prevWoodcocks;
      });
      setLastWormTime(Date.now());
    }, msPerWorm);
    return () => clearInterval(interval);
  }, [msPerWorm]);

  useEffect(() => {
    const interval = setInterval(() => {}, 0);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      <style>{scrollbarStyles}</style>

      <div className="flex flex-1 gap-4 min-h-0">
        <div className="w-80 overflow-y-auto custom-scrollbar h-screen p-4">
          <h2 className="text-2xl font-bold text-white mb-4 top-0 bg-stone-950">
            Woodcocks
          </h2>
          {woodcocks
            .sort((a, b) => b.birthDate.getTime() - a.birthDate.getTime())
            .map((woodcock, index) => (
              <div
                key={index}
                className="bg-stone-900 text-stone-100 p-4 mb-4 shadow-offset-lg"
              >
                <h2 className="text-xl font-bold mb-2">
                  {woodcock.name} ({woodcock.isAdult ? "Adult" : "Chick"})
                </h2>
                <p>
                  Born at{" "}
                  <span className="text-stone-400 font-bold">
                    {woodcock.birthDate.toLocaleString()}
                  </span>
                </p>
                {(() => {
                  const ageInMs =
                    new Date().getTime() - woodcock.birthDate.getTime();
                  const progress = woodcock.isAdult
                    ? Math.min(
                        ((ageInMs - growMs) / (maxLife - growMs)) * 100,
                        100
                      )
                    : Math.min((ageInMs / growMs) * 100, 100);
                  return (
                    <div className="w-full bg-stone-700 h-2 mt-2">
                      <div
                        className="bg-stone-400 h-2"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  );
                })()}
              </div>
            ))}
          {woodcocks.length === 0 && (
            <div className="bg-stone-900 text-stone-100 p-4 mb-4 shadow-offset-lg">
              No woodcocks yet. Hatch some eggs, that&apos;s kinda the entire
              point of this! Once you have some woodcocks, they will grow up
              from chicks to adults, and then they&apos;ll start foraging for
              worms for you.
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-8">
          {(typeof window !== "undefined" &&
            window.location.hostname === "localhost" && (
              <button
                className="text-5xl font-bold text-white mb-8 text-center"
                onClick={() => {
                  setWorms((prev) => prev + 5000000);
                }}
              >
                + 5000000 (dev)
              </button>
            )) || (
            <h1 className="text-5xl font-bold text-white mb-8 text-center">
              Avis
            </h1>
          )}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-stone-900 p-4 shadow-offset">
              <p className="text-stone-100 text-sm">
                Worms:{" "}
                {(
                  woodcocks.filter((b) => b.isAdult).length *
                  (1000 / msPerWorm)
                ).toFixed(2)}{" "}
                per second
              </p>
              <p className="text-3xl font-bold text-white mb-2">{worms}</p>
              <p className="text-stone-300 text-xs mb-2">Foraging Progress</p>
              <div className="w-full bg-stone-700 h-2">
                <div
                  className="bg-green-600 h-2"
                  style={{
                    width: `${
                      woodcocks.filter((b) => b.isAdult).length > 0
                        ? Math.min(
                            ((Date.now() - lastWormTime) / msPerWorm) * 100,
                            100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-stone-900 p-4 shadow-offset">
              <p className="text-stone-100 text-lg font-bold">Woodcock Fall</p>
              <p className="">
                <span>Adults: </span>
                <span className="text-stone-100 font-bold">
                  {woodcocks.filter((b) => b.isAdult).length}
                </span>
                <br />
                <span> Chicks: </span>
                <span className="text-stone-100 font-bold">
                  {woodcocks.filter((b) => !b.isAdult).length}
                </span>
              </p>
            </div>
          </div>
          <button
            className="w-32 h-32 -full bg-stone-200 shadow-offset hover:bg-stone-400 flex items-center justify-center"
            onClick={hatchEgg}
          >
            <span className="text-2xl text-stone-800">Hatch a egg!</span>
          </button>
        </div>

        <div className="w-80 overflow-y-auto custom-scrollbar h-screen p-4">
          <h2 className="text-2xl font-bold text-white mb-4 top-0 bg-stone-950">
            Permanent Upgrades
          </h2>
          <div className="bg-stone-900 p-4 shadow-offset mb-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-stone-100 text-lg font-bold">Foraging Speed</p>
            </div>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">Current</p>
              <p className="text-stone-100 font-semibold">
                {(msPerWorm / 1000).toFixed(1)}s per worm
              </p>
            </div>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">After Upgrade</p>
              <p className="text-green-400 font-semibold">
                {(Math.floor(msPerWorm / 1.1) / 1000).toFixed(1)}s per worm
              </p>
            </div>
            <button
              onClick={() => {
                if (worms >= wormSpeedUpgradeCost) {
                  setWorms(worms - wormSpeedUpgradeCost);
                  setMsPerWorm(Math.floor(msPerWorm / 1.1));
                  setWormSpeedUpgradeCost(
                    Math.floor(wormSpeedUpgradeCost * 1.2)
                  );
                  setLastWormTime(Date.now());
                }
              }}
              disabled={worms < wormSpeedUpgradeCost}
              className={`w-full font-bold bg-stone-700 px-2 py-2 ${
                worms >= wormSpeedUpgradeCost ? "hover:bg-stone-600" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Buy ({wormSpeedUpgradeCost} worms)
            </button>
          </div>
          <div className="bg-stone-900 p-4 shadow-offset mb-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-stone-100 text-lg font-bold">Growth Speed</p>
            </div>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">Current</p>
              <p className="text-stone-100 font-semibold">
                {(growMs / 1000).toFixed(1)}s to grow
              </p>
            </div>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">After Upgrade</p>
              <p className="text-green-400 font-semibold">
                {(Math.floor(growMs / 1.3) / 1000).toFixed(1)}s to grow
              </p>
            </div>
            <button
              onClick={() => {
                if (worms >= growUpgradeCost) {
                  setWorms(worms - growUpgradeCost);
                  setGrowMs(Math.floor(growMs / 1.3));
                  setGrowUpgradeCost(Math.floor(growUpgradeCost * 1.1));
                }
              }}
              disabled={worms < growUpgradeCost}
              className={`w-full font-bold bg-stone-700 px-2 py-2 ${
                worms >= growUpgradeCost ? "hover:bg-stone-600" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Buy ({growUpgradeCost} worms)
            </button>
          </div>
          <div className="bg-stone-900 p-4 shadow-offset mb-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-stone-100 text-lg font-bold">
                Bird Life Length
              </p>
            </div>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">Current</p>
              <p className="text-stone-100 font-semibold">
                {((maxLife - growMs) / 1000).toFixed(0)}s life length
              </p>
            </div>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">After Upgrade</p>
              <p className="text-green-400 font-semibold">
                {(Math.floor((maxLife - growMs) * 1.2) / 1000).toFixed(0)}s life
                length
              </p>
            </div>
            <button
              onClick={() => {
                if (worms >= maxLifeUpgradeCost) {
                  setWorms(worms - maxLifeUpgradeCost);
                  setMaxLife(Math.floor((maxLife - growMs) * 1.2));
                  setMaxLifeUpgradeCost(Math.floor(maxLifeUpgradeCost * 1.2));
                }
              }}
              disabled={worms < maxLifeUpgradeCost}
              className={`w-full font-bold bg-stone-700 px-2 py-2 ${
                worms >= maxLifeUpgradeCost ? "hover:bg-stone-600" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Buy ({maxLifeUpgradeCost} worms)
            </button>
          </div>
          <div className="bg-stone-900 p-4 shadow-offset mb-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-stone-100 text-lg font-bold">Incubator</p>
            </div>
            <p className="text-stone-300 text-sm mb-3">
              Automatically hatch a new egg at a set interval.
            </p>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">Current</p>
              <p className="text-stone-100 font-semibold">
                {incubatorSecondsPerHatch > 0
                  ? `${incubatorSecondsPerHatch}s per hatch`
                  : "Inactive"}
              </p>
            </div>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">After Upgrade</p>
              <p className="text-green-400 font-semibold">
                {incubatorSecondsPerHatch > 0
                  ? `${
                      incubatorSecondsPerHatch <= 5
                        ? incubatorSecondsPerHatch * 0.8
                        : Math.max(5, incubatorSecondsPerHatch - 5)
                    }s per hatch`
                  : "30s per hatch"}
              </p>
            </div>
            {incubatorSecondsPerHatch > 0 && (
              <div className="w-full bg-stone-700 h-2 mb-3">
                <div
                  className="bg-blue-500 h-2"
                  style={{
                    width: `${Math.min(
                      ((Date.now() - lastIncubatorHatchTimeRef.current) /
                        (incubatorSecondsPerHatch * 1000)) *
                        100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            )}
            <button
              disabled={worms < incubatorCost}
              className={`w-full font-bold bg-stone-700 px-2 py-2 ${
                worms >= incubatorCost ? "hover:bg-stone-600" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => {
                if (worms >= incubatorCost) {
                  setWorms(worms - incubatorCost);
                  const newInterval =
                    incubatorSecondsPerHatch > 0
                      ? incubatorSecondsPerHatch <= 5
                        ? incubatorSecondsPerHatch * 0.8
                        : Math.max(5, incubatorSecondsPerHatch - 5)
                      : 30;
                  setIncubatorSecondsPerHatch(newInterval);
                  setIncubatorCost(Math.floor(incubatorCost * 1.5));
                  if (incubatorSecondsPerHatch === 0) {
                    lastIncubatorHatchTimeRef.current = Date.now();
                  }
                }
              }}
            >
              Buy ({incubatorCost} worms)
            </button>
          </div>
          <div className="bg-stone-900 p-4 shadow-offset mb-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-stone-100 text-lg font-bold">Instant Growth</p>
            </div>
            <p className="text-stone-300 text-sm mb-3">
              Has a chance of instantly maturing a chick into an adult when
              hatched.
            </p>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">Current</p>
              <p className="text-stone-100 font-semibold">
                {instantGrowthChance}% chance
              </p>
            </div>
            {instantGrowthChance < 100 ? (
              <>
                <div className="bg-stone-800 p-2 mb-3">
                  <p className="text-stone-300 text-xs mb-1">After Upgrade</p>
                  <p className="text-green-400 font-semibold">
                    {Math.min(instantGrowthChance + 5, 100)}% chance
                  </p>
                </div>
                <button
                  disabled={worms < instantGrowthCost}
                  className={`w-full font-bold bg-stone-700 px-2 py-2 ${
                    worms >= instantGrowthCost ? "hover:bg-stone-600" : ""
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => {
                    if (worms >= instantGrowthCost) {
                      setWorms(worms - instantGrowthCost);
                      setInstantGrowthChance(
                        Math.min(instantGrowthChance + 5, 100)
                      );
                      setInstantGrowthCost(Math.floor(instantGrowthCost * 1.3));
                    }
                  }}
                >
                  Buy ({instantGrowthCost} worms)
                </button>
              </>
            ) : (
              <div className="bg-green-900 p-2 mb-3">
                <p className="text-green-400 font-semibold text-center">
                  MAX LEVEL
                </p>
              </div>
            )}
          </div>
          <div className="bg-stone-900 p-4 shadow-offset mb-4">
            <div className="flex justify-between items-start mb-3">
              <p className="text-stone-100 text-lg font-bold">Immortality</p>
            </div>
            <p>
              Chance to reset the age of a Woodcock when it&apos;s supposed to
              die.
            </p>
            <div className="bg-stone-800 p-2 mb-3">
              <p className="text-stone-300 text-xs mb-1">Current</p>
              <p className="text-stone-100 font-semibold">
                {immortalityChance}% chance
              </p>
            </div>
            {immortalityChance < 80 ? (
              <>
                <div className="bg-stone-800 p-2 mb-3">
                  <p className="text-stone-300 text-xs mb-1">After Upgrade</p>
                  <p className="text-green-400 font-semibold">
                    {Math.min(immortalityChance + 5, 80)}% chance
                  </p>
                </div>
                <button
                  disabled={worms < immortalityCost}
                  className={`w-full font-bold bg-stone-700 px-2 py-2 ${
                    worms >= immortalityCost ? "hover:bg-stone-600" : ""
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => {
                    if (worms >= immortalityCost) {
                      setWorms(worms - immortalityCost);
                      setImmortalityChance(Math.min(immortalityChance + 5, 80));
                      setImmortalityCost(Math.floor(immortalityCost * 1.5));
                    }
                  }}
                >
                  Buy ({immortalityCost} worms)
                </button>
              </>
            ) : (
              <div className="bg-green-900 p-2 mb-3">
                <p className="text-green-400 font-semibold text-center">
                  MAX LEVEL
                </p>
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 mt-8">
            Temporary Buffs
          </h2>
          <div className={`bg-stone-900 p-4 shadow-offset mb-4 relative`}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-stone-100 text-lg font-bold">Blaze of Glory</p>
            </div>
            <p className="text-stone-300 text-xs mb-3">
              Triples foraging speed for 30s, then kills all woodcocks.
              (Cooldown: 2 minutes)
            </p>
            {(() => {
              const now = Date.now();
              const buffEndTime = blazeStartTime.getTime() + 30000;
              const cooldownEndTime = blazeStartTime.getTime() + 120000;

              if (now < buffEndTime) {
                const timeLeft = buffEndTime - now;
                const progress = (timeLeft / 30000) * 100;
                return (
                  <div className="w-full bg-stone-700 h-2 mb-2">
                    <div
                      className="bg-red-500 h-2 transition-all duration-100 animate-pulse"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                );
              } else {
                const timeLeft = cooldownEndTime - now;
                const progress = (timeLeft / 90000) * 100;
                return (
                  <div className="w-full bg-stone-700 h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 transition-all duration-100"
                      style={{ width: `${Math.min(100 - progress, 100)}%` }}
                    ></div>
                  </div>
                );
              }
            })()}
            <button
              onClick={() => {
                if (woodcocks.length > 0 && worms >= 500) {
                  setLastWormTime(Date.now());
                  setWorms(worms - 500);
                  setMsPerWorm(Math.floor(msPerWorm / 3));
                  setBlazeStartTime(new Date());
                  setTimeout(() => {
                    setWoodcocks([]);
                  }, 30000);
                  setTimeout(() => {
                    setMsPerWorm(msPerWorm * 3);
                  }, 30000);
                }
              }}
              disabled={
                worms < 500 ||
                woodcocks.length === 0 ||
                blazeStartTime.getTime() + 120000 > Date.now()
              }
              className={`w-full font-bold bg-stone-700 px-2 py-2 ${
                worms >= 500 &&
                woodcocks.length > 0 &&
                blazeStartTime.getTime() + 120000 <= Date.now()
                  ? "hover:bg-stone-600"
                  : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Activate (500 worms)
            </button>
          </div>
          <div className="p-4 shadow-offset mb-4 relative bg-stone-900">
            <div className="flex justify-between items-start mb-2">
              <p className="text-stone-100 text-lg font-bold">Sacrifice</p>
            </div>
            <p className="text-stone-300 text-xs mb-3">
              Kill 50 random woodcocks for 2x foraging speed for 3 minutes.
              (Cooldown: 10 minutes)
            </p>
            {(() => {
              const now = Date.now();
              const buffEndTime = sacrificeTime.getTime() + 180000;
              const cooldownEndTime = sacrificeTime.getTime() + 600000;

              if (now < buffEndTime) {
                const timeLeft = buffEndTime - now;
                const progress = (timeLeft / 180000) * 100;
                return (
                  <div className="w-full bg-stone-700 h-2 mb-2">
                    <div
                      className="bg-red-500 h-2 transition-all duration-100 animate-pulse"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                );
              } else {
                const timeLeft = cooldownEndTime - now;
                const progress = (timeLeft / 420000) * 100;
                return (
                  <div className="w-full bg-stone-700 h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 transition-all duration-100"
                      style={{ width: `${Math.min(100 - progress, 100)}%` }}
                    ></div>
                  </div>
                );
              }
            })()}
            <button
              onClick={() => {
                if (woodcocks.length > 0 && worms >= 500) {
                  setLastWormTime(Date.now());
                  setWorms(worms - 500);
                  setMsPerWorm(Math.floor(msPerWorm / 2));
                  setSacrificeTime(new Date());
                  const woodcocksToKill = Math.min(50, woodcocks.length);
                  const shuffledWoodcocks = [...woodcocks].sort(
                    () => Math.random() - 0.5
                  );
                  const remainingWoodcocks =
                    shuffledWoodcocks.slice(woodcocksToKill);
                  setWoodcocks(remainingWoodcocks);

                  setTimeout(() => {
                    setMsPerWorm(msPerWorm * 2);
                  }, 180000);
                }
              }}
              disabled={
                worms < 500 ||
                woodcocks.length === 0 ||
                sacrificeTime.getTime() + 10 * 60 * 1000 > Date.now()
              }
              className={`w-full font-bold bg-stone-700 px-2 py-2 ${
                worms >= 500 &&
                woodcocks.length > 0 &&
                sacrificeTime.getTime() + 10 * 60 * 1000 <= Date.now()
                  ? "hover:bg-stone-600"
                  : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Activate (500 worms)
            </button>
          </div>
          <div className="p-4 shadow-offset mb-4 relative bg-stone-900">
            <div className="flex justify-between items-start mb-2">
              <p className="text-stone-100 text-lg font-bold">Pesticides</p>
            </div>
            <p className="text-stone-300 text-xs mb-3">
              50% chance to double all worms, but 50% chance to kill all
              woodcocks. Needs at least 20 woodcocks to gamble.
            </p>
            <button
              disabled={woodcocks.length < 20}
              className={`w-full font-bold bg-stone-700 px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => {
                if (woodcocks.length >= 20) {
                  if (Math.random() < 0.5) {
                    setWorms(worms * 2);
                  } else {
                    setWoodcocks([]);
                  }
                }
              }}
            >
              Gamble!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
