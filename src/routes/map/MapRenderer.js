import { createEffect, onCleanup } from "solid-js";
import maplibre from "maplibre-gl";
import * as maptilersdk from "@maptiler/sdk";
import roadStyles from "./styles/roads.json";

export const MapRenderer = (props) => {
  let mapContainer;

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
      center: props.center || [44.7833544, 41.7167444],
      zoom: 10,
      maxZoom: 18,
    });

    const marker = new maptilersdk.Marker({
      color: "red",
      scale: 1,
      draggable: true,
    })
      .setLngLat(
        props.longitude && props.latitude
          ? [props.longitude, props.latitude]
          : [null, null]
      )
      .addTo(map);

    const popup = new maplibre.Popup({
      offset: [0, -25],
      closeButton: false,
      closeOnClick: false,
      className: "marker-label",
    });

    marker.setPopup(popup);
    popup.addTo(map);

    if (!props.longitude && !props.latitude && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userCoords = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          map.setCenter(userCoords);
          marker.setLngLat(userCoords);
          const results = await maptilersdk.geocoding.reverse(userCoords);
          console.log("result-not-parse: ", results)
          
          const parsed = parseGeocodeResult(results);
          console.log(parsed)
          props.setMarkedLocation(parsed);

          marker
            .getPopup()
            .setHTML(
              `<p class="text-sm font-[thin-font] pointer-events-none font-bold text-gray-500">${parsed.placeNameKa}</p>`
            );
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    function parseGeocodeResult(geojson) {
      if (!geojson?.features?.length) {
        return null;
      }

      var feature =
        geojson.features && geojson.features.length
          ? geojson.features[0]
          : null;
      if (!feature) {
        console.error("No features found in the GeoJSON response.");
      }

      var result = {
        center: feature.center || null,
        bbox: feature.bbox || null,
        placeNameKa: feature.place_name_ka || "",
        placeNameEn: feature.place_name_en || "",
        placeNameRU: feature.place_name_ru || "",
        streetNameKa: feature.text_ka || "",
        streetNameEn: feature.text_en || "",
        streetNameRu: feature.text_ru || "",
        city: null,
        district: null,
        region: null,
        quarter: null,
        longitude: geojson.query && geojson.query[0] ? geojson.query[0] : null,
        latitude: geojson.query && geojson.query[1] ? geojson.query[1] : null,
      };

      // Iterate over the context array using a classic for-loop for maximum compatibility
      if (Array.isArray(feature.context)) {
        for (var i = 0; i < feature.context.length; i++) {
          var ctx = feature.context[i];
          // Use indexOf instead of startsWith for broader support
          if (ctx.id && ctx.id.indexOf("region.") === 0) {
            if (ctx.text_ka === "თბილისი") {
              result.city = ctx.text_ka;
            }
            result.region = ctx.text_ka;
          } else if (ctx.id && ctx.id.indexOf("municipality.") === 0) {
            result.district = ctx.text_ka;
            if (!result.city) {
              result.city = ctx.text_ka;
            }
          } else if (
            ctx.id &&
            (ctx.id.indexOf("municipal_district.") === 0 ||
              ctx["osm:place_type"] === "town" ||
              ctx["osm:place_type"] === "village")
          ) {
            result.city = ctx.text_ka;
          } else if (ctx["osm:tags"] && ctx["osm:tags"].place === "village") {
            result.city = ctx.text_ka;
          } else if (
            ctx.id &&
            ctx.id.indexOf("place.") === 0 &&
            ctx["osm:place_type"] !== "town" &&
            ctx["osm:place_type"] !== "village"
          ) {
            result.quarter = ctx.text_ka;
          }
        }
      }

      return result;
    }

    marker.on("dragend", async (e) => {
      const { lng, lat } = e.target.getLngLat();
      const results = await maptilersdk.geocoding.reverse([lng, lat]);
      console.log("result-not-parse: ", results)
      const parsed = parseGeocodeResult(results);

      props.setMarkedLocation(parsed);
      console.log(parsed)
      marker
        .getPopup()
        .setHTML(
          `<p class="text-xs font-[thin-font] font-bold text-gray-600">${parsed.placeNameKa}</p>`
        );
    });

    onCleanup(() => map.remove());
  });

  return (
    <div
      ref={(el) => (mapContainer = el)}
      style={{ height: props.height, width: props.width }}
    />
  );
};
