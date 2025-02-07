"use server";
import { json } from "@solidjs/router";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";
import jobs from "../../../Components/header-comps/jobs_list.json";

/*
  if (target !== 1) {
      if (currentPage + 1 === target) {
        const value = props.lastPageService[field];
        sp.set("page", `next-${target}`);
        sp.set(`service-${field}`, value);
        sp.set("service-pid", props.lastPageService.publicId);      
      } else if (currentPage - 1 === target) {
        const value = props.firstPageService[field];
        sp.set("page", `prev-${target}`);
        sp.set(`service-${field}`, value);
        sp.set("service-pid", props.firstPageService.publicId);
      } else if (currentPage + 1 !== target && currentPage - 1 !== target) {
        if (target < currentPage) {
          sp.set("page", `prev-skipped_${target}`);
        } else {
          sp.set("page", `next-skipped_${target}`);
        }
      }
    } else {
      sp.delete(`service-${field}`);
      sp.set("page", 1);
      sp.delete("service-pid");
    }
    return (window.location.search = sp.toString());
  };

    // Convert page to a number and compute zero-based index.
    
    
*/

class ConstructBrowseLinks {
  constructor(req_url) {
    this.req_url = req_url;
  }

  categories(main, parent) {
    return {
      parent: jobs[0][main].map((a) => {
        return a["კატეგორია"];
      }),
      child: jobs[0][main].find((pc) => pc["კატეგორია"] === parent)[
        "სამუშაოები"
      ],
    };
  }

  paginate(curr_page) {
    if (curr_page) {
      prev,
      next,
      skip,
    }
  }
}

export async function GET({ request }) {
  const params = {
    category: null,
    priceFrom: 0,
    priceTo: 2000,
    region: "ყველა",
    sort: "created_at-DESC",
    page: 1,
    city: "ყველა",
    update_count: true,
    avgrating: null,
    completeDJobFrom: null,
    distanceTo: null,
    update_count: false,
  }; /*this might be removed all it does is prepares default params for postgresql server request*/

  const req_url = new URL(request.url);
  const providedParams = Object.fromEntries(req_url.searchParams.entries());

  const mergedParams = { ...params, ...providedParams };
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(mergedParams)) {
    if (value !== null && value !== undefined) {
      searchParams.set(key, value);
    }
  }

  const search = "?" + searchParams.toString();

  const url = "get_browse_initial_services";
  const finalUrl = `${url}${search}`;

  try {
    const postgresql_response = await postgresql_server_request(
      "GET",
      finalUrl,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

    let pageCount;
    if (postgresql_response.total_count) {
      pageCount = Math.ceil(Number(postgresql_response.total_count) / 16);
    }

    const { main, parent } = {
      main: postgresql_response.services[0].categories[
        postgresql_response.services[0].categories.length - 2
      ],
      parent:
        postgresql_response.services[0].categories[
          postgresql_response.services[0].categories.length - 1
        ],
    };

    const currentPage = Number(mergedParams["page"]) || Number(mergedParams["page"].split("-")[1]) || Number(mergedParams["page"].split("_")[1])

    /* so we gotta create 5 links: */
    /*
      So what I think is we should track "currentPage" and  
    */
    const { displayCategories, paginateLinks } = {
      displayCategories: new ConstructBrowseLinks(req_url).categories(
        main,
        parent
      ),
      paginateLinks: new ConstructBrowseLinks(req_url).paginate(currentPage),
    };

    const current_sort = mergedParams["sort"]
    
    const lastPageSerivce = mergedParams["page"].includes("prev") ? postgresql_response.services[0] : postgresql_response.services[postgresql_response.services.length - 1]
    const lastPageServiceTargets = {
      last_serv_pid: lastPageSerivce.publicId,
      last_serv_key: current_sort.split("-")[0]
    }
    const firstPageService = mergedParams["page"].includes("prev") ? postgresql_response.services[postgresql_response.services.length - 1] : postgresql_response.services[0]
    const firstPageServiceTargets = {
      last_serv_pid: firstPageService.publicId,
      last_serv_key: current_sort.split("-")[0]
    }


    return json({
      ...postgresql_response,
      pageCount,
      query: search,
      main,
      parent,
      priceFrom: mergedParams["priceFrom"],
      priceTo: mergedParams["priceTo"],
      region: mergedParams["region"],
      city: mergedParams["city"],
      sort: current_sort,
      min_price_filter: 0,
      max_price_filter: 2000,
      category: mergedParams["category"],
      displayCategories,
    });
  } catch (error) {
    console.log("err", error);
  }
}
