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
  const pageCount = 10;
  const pageIndex = Number(props.currentSearchParams.page) - 1
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1
  
  const gotoPage = (target) => {
    const sp = new URLSearchParams(props.currentSearchURL)
    if (props.currentSearchParams.sort  .includes("-")) {      
      const field = props.currentSearchParams.sort.split("-")[0]
      const value = props.lastPageService[props.currentSearchParams.sort.split("-")[0]]
      sp.set(`lastservice-${field}`, value)
      sp.set("lastservice-pid", props.lastPageService.publicId)
    } 
    sp.set("page", 1)
    console.log(props.lastPageService.publicId)
    return (window.location.search = sp.toString())
  }

  const renderPageLinks = () => {
    if (pageCount === 0) return null;
    const visiblePageButtonCount = 5;
    let numberOfButtons =
      pageCount < visiblePageButtonCount
        ? pageCount
        : visiblePageButtonCount;
    const pageIndices = [pageIndex];
    numberOfButtons--;

    Array.from({ length: numberOfButtons }).forEach((_, itemIndex) => {
      const pageNumberBefore = pageIndices[0] - 1;
      const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
      if (
        pageNumberBefore >= 0 &&
        (itemIndex < numberOfButtons / 2 ||
          pageNumberAfter > props.pageCount - 1)
      ) {
        pageIndices.unshift(pageNumberBefore);
      } else {
        pageIndices.push(pageNumberAfter);
      }
    });

    return pageIndices.map((pageIndexToMap) => (
      <li>
        <Button2
          content={pageIndexToMap + 1}
          onClick={() => gotoPage(pageIndexToMap)}
          active={pageIndex === pageIndexToMap}
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
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"
                  stroke="#14a800"
                  fill="#14a800"
                  stroke-width="0px"
                ></path>
              </svg>
            </div>
          }
          onClick={() => gotoPage(0)}
          disabled={canPreviousPage}
        />
      </li>
      {renderPageLinks()}
      <li>
        <Button2
          content={
            <div class="flex ml-1">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
                  stroke="#14a800"
                  fill="#14a800"
                  stroke-width="0px"
                ></path>
              </svg>{" "}
            </div>
          }
          onClick={() => gotoPage(pageCount - 1)}
          disabled={canNextPage}
        />
      </li>
    </ul>
  );
};
