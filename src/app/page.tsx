"use client";

import { useEffect, useState } from "react";

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
  const [maxLife, setMaxLife] = useState<number>(120000);
  const [wormSpeedUpgradeCost, setWormSpeedUpgradeCost] = useState<number>(100);
  const [growUpgradeCost, setGrowUpgradeCost] = useState<number>(80);
  const [maxLifeUpgradeCost, setMaxLifeUpgradeCost] = useState<number>(150);

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
      setBirds((prevBirds) =>
        prevBirds
          .filter((bird) => {
            const ageInMs = new Date().getTime() - bird.birthDate.getTime();
            return ageInMs < maxLife;
          })
          .map((bird) => {
            const ageInMs = new Date().getTime() - bird.birthDate.getTime();
            if (!bird.isAdult && ageInMs >= growMs) {
              return { ...bird, isAdult: true };
            }
            return bird;
          })
      );
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
    }, msPerWorm);
    return () => clearInterval(interval);
  }, [msPerWorm]);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold text-white mb-8 text-center">Avis</h1>
      <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
        <div className="bg-stone-900 p-4 text-center shadow-offset">
          <p className="text-stone-100 text-sm">
            Worms:{" "}
            {(
              birds.filter((b) => b.isAdult).length *
              (1000 / msPerWorm)
            ).toFixed(2)}{" "}
            per second
          </p>
          <p className="text-3xl font-bold text-white">{worms}</p>
        </div>
        <div className="bg-stone-900 p-4 text-center shadow-offset">
          <p className="text-stone-100 text-sm">Woodcock stats</p>
          <p className="">
            <span>Adults: </span>
            <span className="text-stone-100 font-bold">
              {birds.filter((b) => b.isAdult).length}
            </span>
            <span> Chicks: </span>
            <span className="text-stone-100 font-bold">
              {birds.filter((b) => !b.isAdult).length}
            </span>
          </p>
        </div>
      </div>
      <button
        className="w-32 h-32 -full bg-stone-200 shadow-offset hover:bg-stone-400 transition-all mb-8 flex items-center justify-center"
        onClick={hatchEgg}
      >
        <span className="text-2xl text-stone-800">Hatch a egg!</span>
      </button>
      <h1 className="text-2xl font-bold text-white mb-4 text-center">
        Upgrades
      </h1>
      <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
        <div className="bg-stone-900 p-4 mb-4 shadow-offset">
          <p className="text-stone-100 mb-2 font-semibold">
            Worm Speed Upgrade
          </p>
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
                setWormSpeedUpgradeCost(Math.floor(wormSpeedUpgradeCost * 1.2));
              }
            }}
            disabled={worms < wormSpeedUpgradeCost}
            className="font-bold bg-stone-700 px-2 py-1 hover:bg-stone-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy ({wormSpeedUpgradeCost} worms)
          </button>
        </div>
        <div className="bg-stone-900 p-4 mb-4 shadow-offset">
          <p className="text-stone-100 mb-2 font-semibold">Growth Upgrade</p>
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
                setGrowMs(Math.floor(growMs / 1.1));
                setGrowUpgradeCost(Math.floor(growUpgradeCost * 1.1));
              }
            }}
            disabled={worms < growUpgradeCost}
            className="font-bold bg-stone-700 px-2 py-1 hover:bg-stone-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy ({growUpgradeCost} worms)
          </button>
        </div>
        <div className="bg-stone-900 p-4 mb-4 shadow-offset">
          <p className="text-stone-100 mb-2 font-semibold">Bird Life Upgrade</p>
          <p className="text-stone-300 text-sm mb-1">
            Current: {(maxLife / 1000).toFixed(0)}s max life
          </p>
          <p className="text-stone-300 text-sm mb-2">
            After upgrade: {(Math.floor(maxLife * 1.2) / 1000).toFixed(0)}s max
            life
          </p>
          <button
            onClick={() => {
              if (worms >= maxLifeUpgradeCost) {
                setWorms(worms - maxLifeUpgradeCost);
                setMaxLife(Math.floor(maxLife * 1.2));
                setMaxLifeUpgradeCost(Math.floor(maxLifeUpgradeCost * 1.2));
              }
            }}
            disabled={worms < maxLifeUpgradeCost}
            className="font-bold bg-stone-700 px-2 py-1 hover:bg-stone-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy ({maxLifeUpgradeCost} worms)
          </button>
        </div>
      </div>
      <div className="w-full max-w-md">
        {birds.map((bird, index) => (
          <div
            key={index}
            className="bg-stone-900 text-stone-100 p-4 mb-4 shadow-offset-lg"
          >
            <h2 className="text-xl font-bold mb-2">{bird.name}</h2>
            <p>
              Born at{" "}
              <span className="text-stone-400 font-bold">
                {bird.birthDate.toLocaleString()}
              </span>
            </p>
            <p>Status: {bird.isAdult ? "Adult" : "Chick"}</p>
            {(() => {
              const ageInMs = new Date().getTime() - bird.birthDate.getTime();
              const progress = bird.isAdult
                ? Math.min(((ageInMs - growMs) / (maxLife - growMs)) * 100, 100)
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
      </div>
    </div>
  );
}
