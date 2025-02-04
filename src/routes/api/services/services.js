"use server";
import { json } from "@solidjs/router";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export async function GET({ request }) {
    const request_url = new URL(request.url);
    const sp = new URLSearchParams(request_url.search)
    const query_name_values = {
      category: null,
      priceFrom: null,
      priceTo: null,
      region: "ყველა",
      sort: null,
      page: 1,
      city: "ყველა",
      avgrating: null,
      completeDJobFrom: null,
      distanceTo: null,
    } 

    let url = "get_browse_initial_services"
    let search = ""
    let i = 0
    sp.forEach((value, name) => {
        if (i === 0) {
            search += `?${name}=${value}`
            query_name_values[name] = value
            i++
        } else {
            search += `&${name}=${value}`
            query_name_values[name] = value
        }
    })

    try {
      const postgresql_response = await postgresql_server_request("GET", `${url}${search}`, {
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

      console.log(query_name_values)
      return json({...postgresql_response, query: search, query_name_values, parent, main});
    } catch (error) {
      console.log("err", error);
    }
}