"use server";
import { json } from "@solidjs/router";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";
import jobs from "../../../Components/header-comps/jobs_list.json";

class ConstructBrowseLinks {
  constructor(req_url) {
    this.req_url = req_url;
  }

  categories(main, parent, category) {
    return {
      parent: jobs[0][main].some((a) => a["კატეგორია"] === parent)
        ? (() => {
            return jobs[0][main].map((a) => {
              return {
                content: a["კატეგორია"],
                link: `http://localhost:3000/find/service?category=${a["კატეგორია"]}&priceFrom=0&priceTo=2000`,
              };
            });
          })()
        : [],
      child: jobs[0][main].some((a) => a["კატეგორია"] === category)
        ? (() => {
            const found = jobs[0][main].find(
              (pc) => pc["კატეგორია"] === parent
            );
            if (!found) return [];

            return found["სამუშაოები"].map((s) => ({
              content: s,
              link: `http://localhost:3000/find/service?category=${s}&priceFrom=0&priceTo=2000`,
            }));
          })()
        : [],
    };
  }

  buildQueryString(baseParams, overrides = {}) {
    const finalParams = { ...baseParams, ...overrides };

    const parts = [];
    for (const key in finalParams) {
      if (finalParams[key] !== undefined && finalParams[key] !== null) {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(finalParams[key])}`
        );
      }
    }
    return parts.join("&");
  }

  paginate(curr_page, mergedParams, services, pageCount) {
    const links = [];
    const baseUrl = "http://localhost:3000/find/service?";

    let start = Math.max(curr_page - 2, 1);
    let end = start + 4;

    if (end > pageCount) {
      end = pageCount;
      start = Math.max(end - 4, 1);
    }

    let first_service;
    let last_service;
    if (curr_page - 1 > 0) {
      first_service = services.services[0];
    }
    if (curr_page + 1 <= pageCount) {
      last_service = services.services[services.services.length - 1];
    }
    if (curr_page === 1) {
      last_service = services.services[services.services.length - 1];
    }

    const serviceKey = mergedParams["sort"].split("-")[0];

    for (let i = start; i <= end; i++) {
      if (i < curr_page) {
        const overrides = {};

        if (i + 1 !== curr_page) {
          overrides.page = `prev-skipped_${i}`;
        } else {
          overrides.page = `prev-${i}`;
          overrides[`service-${serviceKey}`] = first_service[serviceKey];
          overrides["service-pid"] = first_service.publicId;
        }

        const queryString = this.buildQueryString(mergedParams, overrides);

        links.push({
          page: i,
          link: `${baseUrl}${queryString}`,
          active: i === curr_page,
        });
      } else if (i > curr_page) {
        const overrides = {};

        if (i - 1 !== curr_page) {
          overrides.page = `next-skipped_${i}`;
        } else {
          overrides.page = `next-${i}`;
          overrides[`service-${serviceKey}`] = last_service[serviceKey];
          overrides["service-pid"] = last_service.publicId;
        }

        const queryString = this.buildQueryString(mergedParams, overrides);

        links.push({
          page: i,
          link: `${baseUrl}${queryString}`,
          active: i === curr_page,
        });
      } else {
        links.push({
          page: i,
          link: null,
          active: i === curr_page,
        });
      }
    }

    delete mergedParams[`service-${serviceKey}`];
    delete mergedParams["service-pid"];
    const last_btn_query = this.buildQueryString(mergedParams, {
      page: `next-skipped_${pageCount}`,
    });
    const first_btn_query = this.buildQueryString(mergedParams, {
      page: `prev-skipped_${1}`,
    });

    return {
      links: links,
      btn_links: [
        `${baseUrl}${first_btn_query}`,
        `${baseUrl}${last_btn_query}`,
      ],
    };
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
    tsc: 0,
    avgrating: null,
    completeDJobFrom: null,
    distanceTo: null,
  };

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
      postgresql_response.services[i]["display_created_at"] = new Date(
        postgresql_response.services[i]["created_at"]
      ).toLocaleDateString();
      postgresql_response.services[i][
        "thumbnail_src"
      ] = `${process.env.FILESERVER_SERVER_DOMAIN}:${process.env.FILESERVER_SERVER_PORT}/static/xelosani/${postgresql_response.services[i].profId}/services/${postgresql_response.services[i].publicId}/thumbnail/browse/thumbnail.webp`;
      postgresql_response.services[i][
        "prof_pic_src"
      ] = `${process.env.FILESERVER_SERVER_DOMAIN}:${process.env.FILESERVER_SERVER_PORT}/static/xelosani/profile/browse/${postgresql_response.services[i].profId}.webp`;
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
    const currentPage =
      Number(mergedParams["page"]) ||
      Number(mergedParams["page"].split("-")[1]) ||
      Number(mergedParams["page"].split("_")[1]);

    mergedParams["tsc"] = postgresql_response.total_count
    const { displayCategories, paginateLinks } = {
      displayCategories: new ConstructBrowseLinks(req_url).categories(
        main,
        parent,
        mergedParams["category"]
      ),
      paginateLinks: new ConstructBrowseLinks(req_url).paginate(
        currentPage,
        mergedParams,
        postgresql_response,
        pageCount,
      ),
    };

    return json({
      ...postgresql_response,
      pageCount,
      query: search,
      main,
      links: paginateLinks.links,
      last_btn_link: paginateLinks.btn_links[1],
      first_btn_link: paginateLinks.btn_links[0],
      parent,
      priceFrom: mergedParams["priceFrom"],
      priceTo: mergedParams["priceTo"],
      region: mergedParams["region"],
      city: mergedParams["city"],
      sort: mergedParams["sort"],
      min_price_filter: 0,
      max_price_filter: 2000,
      category: mergedParams["category"],
      displayCategories,
    });
  } catch (error) {
    console.log("err", error);
  }
}
