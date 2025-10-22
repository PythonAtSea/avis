"use client";

import { useEffect, useState } from "react";

type Bird = {
  birthDate: Date;
  isAdult: boolean;
  name: string;
};

export default function Home() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [worms, setWorms] = useState<number>(0);
  const [msPerWorm, setMsPerWorm] = useState<number>(10000);
  const [growMs, setGrowMs] = useState<number>(10000);
  const [maxLife, setMaxLife] = useState<number>(120000);

  const hatchEgg = () => {
    const newBird: Bird = {
      birthDate: new Date(),
      isAdult: false,
      name: `Bird #${birds.length + 1}`,
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
      <div className="w-full max-w-md">
        {birds.map((bird, index) => (
          <div
            key={index}
            className="bg-stone-800 text-stone-100 p-4 mb-4 shadow-offset-lg"
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
