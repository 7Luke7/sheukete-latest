import { createEffect, onCleanup } from "solid-js";
import maplibre from "maplibre-gl";
import * as maptilersdk from "@maptiler/sdk"
import roadStyles from "../../../map/styles/roads.json"
import hirer from "../../../../svg-images/hirer.svg"

export const MapRendererServices = (props) => {
  let mapContainer

  /*
    We can display the location info here 
    --                                 --
    For now I don't really care about styles
    as long as functionality works.
  */
  maptilersdk.config.apiKey = "SYnPa7w6ED7a5SoPa4Pm";
  createEffect(() => {
    if (!mapContainer) return;

    const map = new maplibre.Map({
      container: mapContainer,
      style: roadStyles,
      center: [44.7833, 41.7167],
      zoom: 10,
      maxZoom: 18,
    })

    map.on("load", () => {
        props.services.forEach((s) => {
            const showPopUp = () => {
                console.log(s)
            }
            new maptilersdk.Marker({
                element: <button onClick={showPopUp}><img src={hirer}></img></button>, 
                scale: 1,
                draggable: false
            }).setLngLat([s.longitude, s.latitude]).addTo(map);
        });
    })

    onCleanup(() => map.remove());
  });

  return <div ref={mapContainer} style={{ height: props.height, width: props.width }} />;
}