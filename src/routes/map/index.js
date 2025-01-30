import { createEffect, onCleanup } from "solid-js";
import maplibre from "maplibre-gl";
import roadStyles from "./styles/roads"

export default function Map() {
  let mapContainer

  createEffect(() => {
    if (!mapContainer) return;

    const map = new maplibre.Map({
      container: mapContainer,
      style: roadStyles,
      pitchWithRotate: false,
      dragRotate: false,
      touchPitch: false,
      center: [44.7833, 41.7167],
      zoom: 10,
      maxZoom: 16,
      pitch: 0,
      bearing: 0
    });

    onCleanup(() => map.remove());
  });

  return <div ref={mapContainer} style={{ height: "100vh", width: "100%" }} />;
}