"use server";
import { json } from "@solidjs/router";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export async function GET({ request }) {
  const defaultParams = {
    category: null,
    priceFrom: null,
    priceTo: null,
    region: "ყველა",
    sort: "created_at-DESC",
    page: 1,
    city: "ყველა",
    avgrating: null,
    completeDJobFrom: null,
    distanceTo: null,
  };
  const requestUrl = new URL(request.url);
  const providedParams = Object.fromEntries(requestUrl.searchParams.entries());
  
  const mergedParams = { ...defaultParams, ...providedParams };
  
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(mergedParams)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, value);
    }
  }
  const search = '?' + searchParams.toString();
  
  const url = "get_browse_initial_services";
  const finalUrl = `${url}${search}`;
  
    try {
      const postgresql_response = await postgresql_server_request("GET", finalUrl, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (postgresql_response.status !== 200) {
        return { ...postgresql_response };
      }

      for (let i = 0; i < postgresql_response.services.length; i++) {
        postgresql_response.services[i][
          "thumbnail_src"
        ] = `${process.env.FILESERVER_SERVER_DOMAIN}:${process.env.FILESERVER_SERVER_PORT}/static/images/xelosani/${postgresql_response.services[i].profId}/services/${postgresql_response.services[i].publicId}/thumbnail/thumbnail.webp`;
        postgresql_response.services[i][
          "prof_pic_src"
        ] = `${process.env.FILESERVER_SERVER_DOMAIN}:${process.env.FILESERVER_SERVER_PORT}/static/images/xelosani/profile/${postgresql_response.services[i].profId}.webp`;
      }

      const [parent, main] = [
        postgresql_response.services[0].categories[
          postgresql_response.services[0].categories.length - 1
        ],
        postgresql_response.services[0].categories[
          postgresql_response.services[0].categories.length - 2
        ],
      ];

      const last_service = postgresql_response.services[postgresql_response.services.length - 1]

      const field = mergedParams.sort.split("-")[0]
      const value = last_service[mergedParams.sort.split("-")[0]]
      sp.set(`lastservice-${field}`, value)
      sp.set("lastservice-pid", last_service.publicId)

      console.log({...postgresql_response, query: search, defaultParams: mergedParams, parent, main})

      return json({...postgresql_response, query: search, defaultParams: mergedParams, parent, main});
    } catch (error) {
      console.log("err", error);
    }
}