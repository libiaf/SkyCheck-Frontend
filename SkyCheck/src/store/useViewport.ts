import { create } from "zustand";

type Viewport = { lat: number; lon: number; zoom: number; placeName?: string; };
type VPStore = {
  viewport: Viewport;
  setViewport: (vp: Partial<Viewport>) => void;
};
export const useViewport = create<VPStore>((set) => ({
  viewport: { lat: 29.0892, lon: -110.9613, zoom: 10, placeName: "Hermosillo" },
  setViewport: (vp) => set((s) => ({ viewport: { ...s.viewport, ...vp } })),
}));
