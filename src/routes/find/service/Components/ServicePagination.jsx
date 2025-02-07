function Button2(props) {
  return (
    <button
      class={`flex flex-col cursor-pointer items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-sm font-normal transition-colors rounded-lg
          ${props.active ? "bg-green-600 text-white" : "text-green-500"}
          ${
            !props.disabled
              ? "hover:bg-green-400 hover:text-white"
              : "text-red-300 bg-white cursor-not-allowed"
          }
        `}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.content}
    </button>
  );
}

export const ServicePagination = (props) => {
  // Assume a fixed total page count (could come from props too)
  console.log(props.pageCount)
  const pageCount = props.pageCount;

  // Convert page to a number and compute zero-based index.
  const currentPage = props.currentSearchParams.page
    ? Number(props.currentSearchParams.page) ||
      Number(props.currentSearchParams.page.split("-")[1])
    : 1;
  const pageIndex = currentPage - 1;

  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  // The gotoPage function builds a new search string and updates window.location.search.
  const gotoPage = (target) => {
    const sp = new URLSearchParams(props.currentSearchURL);
    const field = props.currentSearchParams.sort.split("-")[0];

    // For direct neighboring pages (prev/next), set page as target.
    // For non-neighboring (skipped pages), optionally set a "skipped-" prefix.
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
        // here we might have to add how many they skipped or smth
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

  // Render a group of page buttons around the current page.
  const renderPageLinks = () => {
    if (pageCount === 0) return null;
    const visiblePageButtonCount = 5;
    let numberOfButtons = Math.min(pageCount, visiblePageButtonCount);

    // Start with the current page index.
    const pageIndices = [pageIndex];

    // Generate additional page indices around the current one.
    for (let i = 1; i < numberOfButtons; i++) {
      const lower = pageIndices[0] - 1;
      const upper = pageIndices[pageIndices.length - 1] + 1;
      // Prefer to add lower index if it's valid; otherwise add upper.
      if (
        lower >= 0 &&
        (pageIndices.length < visiblePageButtonCount / 2 ||
          upper > pageCount - 1)
      ) {
        pageIndices.unshift(lower);
      } else if (upper < pageCount) {
        pageIndices.push(upper);
      }
    }

    // Sort the indices just in case
    pageIndices.sort((a, b) => a - b);

    return pageIndices.map((pageIdx) => (
      <li key={pageIdx}>
        <Button2
          content={pageIdx + 1}
          onClick={() => gotoPage(pageIdx + 1)}
          active={pageIndex === pageIdx}
        />
      </li>
    ));
  };

  return (
    <ul class="flex mt-8 justify-center w-full gap-2">
      <li>
        <Button2
          content={
            <div class="flex ml-1">
              {/* Left arrow SVG */}
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"
                  stroke="#14a800"
                  fill="#14a800"
                ></path>
              </svg>
            </div>
          }
          onClick={() => gotoPage(1)}
          disabled={!canPreviousPage}
        />
      </li>
      {renderPageLinks()}
      <li>
        <Button2
          content={
            <div class="flex ml-1">
              {/* Right arrow SVG */}
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
                  stroke="#14a800"
                  fill="#14a800"
                ></path>
              </svg>
            </div>
          }
          onClick={() => gotoPage(pageCount)}
          disabled={!canNextPage}
        />
      </li>
    </ul>
  );
};
