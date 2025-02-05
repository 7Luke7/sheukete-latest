import { createSignal, createEffect } from "solid-js";

export const PricingRange = (props) => {
  const min = 0;
  const max = 2000
  const [priceFrom, setPriceFrom] = createSignal(
    props.currentSearchParams.priceFrom 
    &&
    props.currentSearchURL.includes("priceFrom") ? props.currentSearchParams.priceFrom : min);
  const [priceTo, setPriceTo] = createSignal(
    props.currentSearchParams.priceTo 
    &&
    props.currentSearchURL.includes("priceTo") ? props.currentSearchParams.priceTo : max);

  let track;
  let thumbFrom;
  let thumbTo;
  let highlight; 
  let dragging = null;
  const fixedTrackWidth = 110;
  
  const updateThumbPositions = () => {
    const range = max - min;
    const posFrom = ((priceFrom() - min) / range) * fixedTrackWidth;
    const posTo = ((priceTo() - min) / range) * fixedTrackWidth;
  
    thumbFrom.style.left = `${posFrom}px`;
    thumbTo.style.left = `${posTo}px`;
    
    highlight.style.left = `${posFrom}px`;
    highlight.style.width = `${posTo - posFrom}px`;
  }
  
  createEffect(() => {
    updateThumbPositions()
  })
  
  const onMouseDown = (thumbName) => (e) => {
    dragging = thumbName;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging) return;
    const trackRect = track.getBoundingClientRect();
    let newValue = ((e.clientX - trackRect.left) / fixedTrackWidth) * (max - min) + min;
    newValue = Math.max(min, Math.min(newValue, max));

    if (dragging === "from") {
      if (newValue > priceTo()) newValue = priceTo();
      setPriceFrom(Math.round(newValue));
    } else if (dragging === "to") {
      if (newValue < priceFrom()) newValue = priceFrom();
      setPriceTo(Math.round(newValue));
    }
  };

  const onMouseUp = () => {
    dragging = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const adjustPrice = () => {
    const sp = new URLSearchParams(props.currentSearchURL)
    sp.set("priceFrom", priceFrom())
    sp.set("priceTo", priceTo())
    return window.location.search = sp.toString()
  }

  return (
    <div>
        <p class="text-md font-[bolder-font] font-bold">ფასი</p>
        <span class="font-[thin-font] text-sm font-bold">${priceFrom()} - ${priceTo()}</span>
        <div class="flex justify-between items-center">
        <div style={{
      position: "relative",
      width: "60%",
      height: "40px",
      userSelect: "none"
    }}>
      <div 
        ref={track} 
        style={{
          position: "absolute",
          top: "17px",
          left: "0",
          right: "0",
          height: "6px",
          width: `${fixedTrackWidth}px`,
          background: "#ddd",
          "border-radius": "16px"
        }}
      />
      <div 
        ref={highlight}
        style={{
          position: "absolute",
          top: "17px",
          height: "6px",
          background: "#14a800",
          "border-radius": "3px"
        }}
      />
      <div
        ref={thumbFrom}
        onMouseDown={onMouseDown("from")}
        style={{
          position: "absolute",
          top: "20px",
          width: "20px",
          height: "20px",
          "border-radius": "50%",
          background: "#fff",
          border: "2px solid #108a00",
          cursor: "pointer",
          transform: "translate(-50%, -50%)"
        }}
      >
      </div>
      <div
        ref={thumbTo}
        onMouseDown={onMouseDown("to")}
        style={{
          position: "absolute",
          top: "20px",
          width: "20px",
          height: "20px",
          "border-radius": "50%",
          background: "#fff",
          border: "2px solid #108a00",
          cursor: "pointer",
          transform: "translate(-50%, -50%)"
        }}
      >
      </div>
    </div>
        <button type="button" onClick={adjustPrice} class="text-sm rounded px-2 py-1 text-white font-[thin-font] font-bold bg-dark-green">
            გაფილტვრა
        </button>
        </div>
    </div>
  );
};