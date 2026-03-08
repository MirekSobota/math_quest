import forest from "../../assets/images/backgrounds/forest.png";
import cave from "../../assets/images/backgrounds/cave.png";
import ice from "../../assets/images/backgrounds/ice.png";
import lava from "../../assets/images/backgrounds/lava.png";
import castle from "../../assets/images/backgrounds/castle.png";

import e1 from "../../assets/images/enemies/e1.png";
import e2 from "../../assets/images/enemies/e2.png";
import e3 from "../../assets/images/enemies/e3.png";
import e4 from "../../assets/images/enemies/e4.png";
import e5 from "../../assets/images/enemies/e5.png";
import e6 from "../../assets/images/enemies/e6.png";
import e7 from "../../assets/images/enemies/e7.png";
import e8 from "../../assets/images/enemies/e8.png";
import e9 from "../../assets/images/enemies/e9.png";
import e10 from "../../assets/images/enemies/e10.png";
import e11 from "../../assets/images/enemies/e11.png";
import e12 from "../../assets/images/enemies/e12.png";
import e13 from "../../assets/images/enemies/e13.png";
import e14 from "../../assets/images/enemies/e14.png";
import e15 from "../../assets/images/enemies/e15.png";
import e16 from "../../assets/images/enemies/e16.png";

const assetUrls = [
  forest,
  cave,
  ice,
  lava,
  castle,
  e1,
  e2,
  e3,
  e4,
  e5,
  e6,
  e7,
  e8,
  e9,
  e10,
  e11,
  e12,
  e13,
  e14,
  e15,
  e16,
];

let preloadPromise: Promise<void> | null = null;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;

    const done = () => resolve();

    img.onload = async () => {
      try {
        if ("decode" in img) {
          await img.decode();
        }
      } catch {
        //
      }
      done();
    };

    img.onerror = () => done();
  });
}

export function preloadGameAssets(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  preloadPromise = Promise.all(assetUrls.map(preloadImage)).then(() => {});
  return preloadPromise;
}
