"use client";

import { useEffect, useState } from "react";

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

type Bird = {
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

export default function Home() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [worms, setWorms] = useState<number>(0);
  const [msPerWorm, setMsPerWorm] = useState<number>(10000);
  const [growMs, setGrowMs] = useState<number>(10000);
  const [maxLife, setMaxLife] = useState<number>(70000);
  const [wormSpeedUpgradeCost, setWormSpeedUpgradeCost] = useState<number>(100);
  const [growUpgradeCost, setGrowUpgradeCost] = useState<number>(80);
  const [maxLifeUpgradeCost, setMaxLifeUpgradeCost] = useState<number>(150);
  const [deadBirds, setDeadBirds] = useState<number>(0);
  const [lastWormTime, setLastWormTime] = useState<number>(Date.now());
  const [blazeStartTime, setBlazeStartTime] = useState<Date>(new Date(0));

  const getOrdinal = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return `${num}st`;
    if (j === 2 && k !== 12) return `${num}nd`;
    if (j === 3 && k !== 13) return `${num}rd`;
    return `${num}th`;
  };

  const getNextName = (existingBirds: Bird[]) => {
    const randomBaseName =
      BIRD_NAMES[Math.floor(Math.random() * BIRD_NAMES.length)];
    const usedCount = existingBirds.filter((bird) =>
      bird.name.startsWith(randomBaseName)
    ).length;

    if (usedCount === 0) {
      return randomBaseName;
    }

    return `${randomBaseName} the ${getOrdinal(usedCount + 1)}`;
  };

  const hatchEgg = () => {
    const newName = getNextName(birds);
    const newBird: Bird = {
      birthDate: new Date(),
      isAdult: false,
      name: newName,
    };
    setBirds([...birds, newBird]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("yo");
      setBirds((prevBirds) => {
        const aliveBirds = prevBirds.filter((bird) => {
          const ageInMs = new Date().getTime() - bird.birthDate.getTime();
          return ageInMs < maxLife;
        });
        const deadCount = prevBirds.length - aliveBirds.length;
        setDeadBirds((prev) => prev + deadCount);
        return aliveBirds.map((bird) => {
          const ageInMs = new Date().getTime() - bird.birthDate.getTime();
          if (!bird.isAdult && ageInMs >= growMs) {
            return { ...bird, isAdult: true };
          }
          return bird;
        });
      });
    }, 0);
    return () => clearInterval(interval);
  }, [growMs, maxLife]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBirds((prevBirds) => {
        const adultCount = prevBirds.filter((bird) => bird.isAdult).length;
        if (adultCount > 0) {
          setWorms((prevWorms) => prevWorms + adultCount / 2);
        }
        return prevBirds;
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
    <div className="min-h-screen bg-stone-950 flex flex-col p-4">
      <style>{scrollbarStyles}</style>

      {(typeof window !== "undefined" &&
        window.location.hostname === "localhost" && (
          <button
            className="text-5xl font-bold text-white mb-8 text-center"
            onClick={() => {
              setWorms((prev) => prev + 500);
            }}
          >
            + 500
          </button>
        )) || (
        <h1 className="text-5xl font-bold text-white mb-8 text-center">Avis</h1>
      )}
      <div className="flex flex-1 gap-4 min-h-0">
        <div
          className="w-80 overflow-y-auto custom-scrollbar"
          style={{ height: "calc(100vh - 7rem)" }}
        >
          <h2 className="text-2xl font-bold text-white mb-4 sticky top-0 bg-stone-950">
            Birds
          </h2>
          {birds
            .sort((a, b) => b.birthDate.getTime() - a.birthDate.getTime())
            .map((bird, index) => (
              <div
                key={index}
                className="bg-stone-900 text-stone-100 p-4 mb-4 shadow-offset-lg"
              >
                <h2 className="text-xl font-bold mb-2">
                  {bird.name} ({bird.isAdult ? "Adult" : "Chick"})
                </h2>
                <p>
                  Born at{" "}
                  <span className="text-stone-400 font-bold">
                    {bird.birthDate.toLocaleString()}
                  </span>
                </p>
                {(() => {
                  const ageInMs =
                    new Date().getTime() - bird.birthDate.getTime();
                  const progress = bird.isAdult
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
          {birds.length === 0 && (
            <div className="bg-stone-900 text-stone-100 p-4 mb-4 shadow-offset-lg">
              No birds yet. Hatch some eggs, that&apos;s kinda the entire point
              of this! Once you have some Woodcocks, they will grow up from
              chicks to adults, and then they&apos;ll start foraging for worms
              for you.
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-8">
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-stone-900 p-4 shadow-offset">
              <p className="text-stone-100 text-sm">
                Worms:{" "}
                {(
                  birds.filter((b) => b.isAdult).length *
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
                      birds.filter((b) => b.isAdult).length > 0
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
                  {birds.filter((b) => b.isAdult).length}
                </span>
                <br />
                <span> Chicks: </span>
                <span className="text-stone-100 font-bold">
                  {birds.filter((b) => !b.isAdult).length}
                </span>
                <br />
                <span> Dead: </span>
                <span className="text-stone-100 font-bold">{deadBirds}</span>
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

        <div
          className="w-80 overflow-y-auto custom-scrollbar"
          style={{ height: "calc(100vh - 7rem)" }}
        >
          <h2 className="text-2xl font-bold text-white mb-4 top-0 bg-stone-950">
            Permanent Upgrades
          </h2>
          <div className="bg-stone-900 p-4 shadow-offset mb-4">
            <p className="text-stone-100 mb-2 font-semibold">Foraging Speed</p>
            <p className="text-stone-300 text-sm mb-1">
              Current: {(msPerWorm / 1000).toFixed(1)}s per worm per adult bird
            </p>
            <p className="text-stone-300 text-sm mb-2">
              After upgrade: {(Math.floor(msPerWorm / 1.1) / 1000).toFixed(1)}s
              per worm per adult bird
            </p>
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
              className={`font-bold bg-stone-700 px-2 py-1 ${
                worms >= wormSpeedUpgradeCost ? "hover:bg-stone-600" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Buy ({wormSpeedUpgradeCost} worms)
            </button>
          </div>
          <div className="bg-stone-900 p-4 shadow-offset mb-4">
            <p className="text-stone-100 mb-2 font-semibold">Growth Speed</p>
            <p className="text-stone-300 text-sm mb-1">
              Current: {(growMs / 1000).toFixed(1)}s to grow
            </p>
            <p className="text-stone-300 text-sm mb-2">
              After upgrade: {(Math.floor(growMs / 1.3) / 1000).toFixed(1)}s to
              grow
            </p>
            <button
              onClick={() => {
                if (worms >= growUpgradeCost) {
                  setWorms(worms - growUpgradeCost);
                  setGrowMs(Math.floor(growMs / 1.3));
                  setGrowUpgradeCost(Math.floor(growUpgradeCost * 1.1));
                }
              }}
              disabled={worms < growUpgradeCost}
              className={`font-bold bg-stone-700 px-2 py-1 ${
                worms >= growUpgradeCost ? "hover:bg-stone-600" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Buy ({growUpgradeCost} worms)
            </button>
          </div>
          <div className="bg-stone-900 p-4 shadow-offset">
            <p className="text-stone-100 mb-2 font-semibold">
              Bird Life Length
            </p>
            <p className="text-stone-300 text-sm mb-1">
              Current: {((maxLife - growMs) / 1000).toFixed(0)}s life length
            </p>
            <p className="text-stone-300 text-sm mb-2">
              After upgrade:{" "}
              {(Math.floor((maxLife - growMs) * 1.2) / 1000).toFixed(0)}s life
              length
            </p>
            <button
              onClick={() => {
                if (worms >= maxLifeUpgradeCost) {
                  setWorms(worms - maxLifeUpgradeCost);
                  setMaxLife(Math.floor((maxLife - growMs) * 1.2));
                  setMaxLifeUpgradeCost(Math.floor(maxLifeUpgradeCost * 1.2));
                }
              }}
              disabled={worms < maxLifeUpgradeCost}
              className={`font-bold bg-stone-700 px-2 py-1 ${
                worms >= maxLifeUpgradeCost ? "hover:bg-stone-600" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Buy ({maxLifeUpgradeCost} worms)
            </button>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 mt-8">
            Temporary Buffs
          </h2>
          <div
            className={`${
              blazeStartTime.getTime() + 30000 > Date.now()
                ? "bg-amber-600 animate-pulse"
                : "bg-stone-900"
            } p-4 shadow-offset mb-4 relative`}
          >
            <p className="text-stone-100 mb-2 font-semibold">Blaze of glory</p>
            <p className="text-stone-300 text-sm mb-1">
              Triples foraging speed for 30 seconds, and then kills your entire
              fall of woodocks (can only be used once every 2 minutes).
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
                      className="bg-red-500 h-2 transition-all duration-100"
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
              return null;
            })()}
            <button
              onClick={() => {
                if (birds.length > 0 && worms >= 500) {
                  setLastWormTime(Date.now());
                  setWorms(worms - 500);
                  setMsPerWorm(Math.floor(msPerWorm / 3));
                  setBlazeStartTime(new Date());
                  setTimeout(() => {
                    setDeadBirds((prev) => prev + birds.length);
                    setBirds([]);
                  }, 30000);
                  setTimeout(() => {
                    setMsPerWorm(msPerWorm * 3);
                  }, 30000);
                }
              }}
              disabled={
                worms < 500 ||
                birds.length === 0 ||
                blazeStartTime.getTime() + 120000 > Date.now()
              }
              className={`font-bold bg-stone-700 px-2 py-1 ${
                worms >= 500 &&
                birds.length > 0 &&
                blazeStartTime.getTime() + 120000 <= Date.now()
                  ? "hover:bg-stone-600"
                  : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Activate (500 worms)
            </button>
          </div>
          <div className={`p-4 shadow-offset mb-4 relative bg-stone-900`}>
            <p className="text-stone-100 mb-2 font-semibold">Sacrifice</p>
          </div>
        </div>
      </div>
    </div>
  );
}
