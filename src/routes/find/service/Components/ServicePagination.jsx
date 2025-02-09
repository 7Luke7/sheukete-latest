import { A } from "@solidjs/router";

function Link(props) {
  return <>
  {props.active ? <span
      class={`flex flex-col cursor-pointer items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-sm font-normal transition-colors rounded-lg
        ${props.active ? "bg-green-600 text-white" : "text-green-500"}
        `}
    >
      {props.content}
    </span> : <A
      href={props.link}
      class={`flex flex-col cursor-pointer items-center justify-center w-9 h-9 shadow-[0_4px_10px_rgba(0,0,0,0.15)] text-sm font-normal transition-colors rounded-lg
        ${props.active ? "bg-green-600 text-white" : "text-green-500"}
        `}
    >
      {props.content}
    </A>}
  </>
}

export const ServicePagination = (props) => {
  const renderPageLinks = () => {    
    return props.links.map((l) => (
      <li>
        <Link
          content={l.page}
          active={l.active}
          link={l.link}
        />
      </li>
    ));
  };

  return (
    <ul class="flex mt-8 justify-center w-full gap-2">
      <li>
        <Link
          content={
            <div class="flex ml-1">
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
          link={props.left_btn_link}
        />
      </li>
      {renderPageLinks()}
      <li>
        <Link
          content={
            <div class="flex ml-1">
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
          link={props.right_btn_link}
        />
      </li>
    </ul>
  );
};
