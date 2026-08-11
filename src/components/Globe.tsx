import { onMount, onCleanup, createSignal, Show } from "solid-js";
import * as d3 from "d3";
import worldData from "../lib/world.json";
import { SITE } from "../site-config";

type Props = {
  isStatic?: boolean;
  class?: string;
  enableHover?: boolean;
};

const GlobeComponent = ({ isStatic, class: className, enableHover }: Props) => {
  let mapContainer: HTMLDivElement | undefined;
  // Signal to control loading state until D3 finishes initializing
  const [isLoading, setIsLoading] = createSignal(true);

  const rawVisited = SITE.visitedCountries || [
    "India", "Laos", "Singapore", "Malaysia", "Thailand", 
    "Vietnam", "Indonesia", "Japan", "China"
  ];

  onMount(() => {
    if (!mapContainer) return;

    const size = 650;
    const width = size;
    const height = size;
    const sensitivity = 75;

    const tempDiv = document.createElement("div");
    tempDiv.style.color = "var(--primary-500, #10b981)";
    document.body.appendChild(tempDiv);
    const primaryColor = getComputedStyle(tempDiv).color || "#10b981";
    tempDiv.style.color = "var(--primary-400, #34d399)";
    const primaryHoverColor = getComputedStyle(tempDiv).color || "#34d399";
    tempDiv.style.color = "var(--primary-300, #6ee7b7)";
    const primaryBorderColor = getComputedStyle(tempDiv).color || "#6ee7b7";
    document.body.removeChild(tempDiv);

    let projection = d3
      .geoOrthographic()
      .scale(290)
      .center([0, 0])
      .rotate([-82, -20])
      .translate([width / 2, height / 2]);

    let pathGenerator = d3.geoPath().projection(projection);

    let canvas = d3
      .select(mapContainer)
      .selectAll("canvas")
      .data([null])
      .join("canvas")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block")
      .style("position", "absolute")
      .style("left", "50%")
      .style("top", "50%")
      .style("transform", "translate(-50%, -50%)")
      .style("pointer-events", "auto");

    const context = (canvas.node() as HTMLCanvasElement).getContext("2d");
    if (context) pathGenerator.context(context);

    let svg = d3
      .select(mapContainer)
      .selectAll("svg")
      .data([null])
      .join("svg")
      .attr("width", width)
      .attr("height", height)
      .style("position", "absolute")
      .style("left", "50%")
      .style("top", "50%")
      .style("transform", "translate(-50%, -50%)")
      .style("pointer-events", "none");

    const radius = projection.scale();
    const ringOffset = 24;
    const outerRadius = radius + ringOffset;
    const cx = width / 2;
    const cy = height / 2;

    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", outerRadius)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 255, 255, 0.1)")
      .attr("stroke-width", "1");

    const directions = [
      { label: "N", x: cx, y: cy - outerRadius },
      { label: "S", x: cx, y: cy + outerRadius },
      { label: "E", x: cx + outerRadius, y: cy },
      { label: "W", x: cx - outerRadius, y: cy }
    ];

    const labels = svg
      .selectAll(".direction-label")
      .data(directions)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    labels
      .append("rect")
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", "#0f172a");

    labels
      .append("text")
      .attr("dy", "0.3em")
      .attr("text-anchor", "middle")
      .style("fill", "rgba(255, 255, 255, 0.4)")
      .style("font-family", "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace")
      .style("font-size", "12px")
      .style("letter-spacing", "1px")
      .text((d) => d.label);

    let tooltip: any = null;
    if (enableHover) {
      tooltip = d3.select("body")
        .selectAll(".globe-tooltip")
        .data([null])
        .join("div")
        .attr("class", "globe-tooltip font-sans")
        .style("position", "absolute")
        .style("background", "rgba(15, 15, 20, 0.95)")
        .style("backdrop-filter", "blur(4px)")
        .style("border", "1px solid rgba(255,255,255,0.1)")
        .style("color", "white")
        .style("padding", "6px 12px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("z-index", 1000)
        .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.5)");
    }

    let hoveredCountry: string | null = null;
    let isPaused = false;
    let isDragging = false;
    let previousMousePosition: [number, number] | null = null;

    const render = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height);

      context.beginPath();
      pathGenerator({ type: "Sphere" } as any);
      context.fillStyle = "#0f172a";
      context.fill();
      context.strokeStyle = "rgba(255, 255, 255, 0.05)";
      context.lineWidth = 1;
      context.stroke();

      worldData.features.forEach((d: any) => {
        const countryName = d.properties.name || "";
        
        const isVisited = rawVisited.some((v: string) => {
          const target = v.toLowerCase();
          const current = countryName.toLowerCase();
          return current === target || current.includes(target) || target.includes(current);
        });

        const isHovered = hoveredCountry === countryName;

        context.beginPath();
        pathGenerator(d);

        if (isHovered) {
          context.fillStyle = isVisited ? primaryHoverColor : "rgba(255, 255, 255, 0.25)";
          context.strokeStyle = "rgba(255, 255, 255, 0.6)";
          context.lineWidth = 1;
        } else if (isVisited) {
          context.fillStyle = primaryColor;
          context.strokeStyle = primaryBorderColor;
          context.lineWidth = 0.8;
        } else {
          context.fillStyle = "rgba(255, 255, 255, 0.1)";
          context.strokeStyle = "rgba(255, 255, 255, 0.3)";
          context.lineWidth = 0.5;
        }

        context.fill();
        context.stroke();
      });
    };

    canvas
      .on("mouseenter", () => { isPaused = true; })
      .on("mouseleave", () => {
        isPaused = false;
        hoveredCountry = null;
        if (tooltip) tooltip.style("opacity", 0);
        render();
      })
      .on("mousemove", function(event) {
        if (!enableHover || isDragging) return;
        const rect = (this as HTMLCanvasElement).getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const inv = (projection as any).invert([mouseX, mouseY]);
        let found: string | null = null;

        if (inv) {
          const match = worldData.features.find((d: any) => d3.geoContains(d, inv));
          if (match) found = match.properties.name;
        }

        if (found !== hoveredCountry) {
          hoveredCountry = found;
          render();
        }

        if (hoveredCountry && tooltip) {
          tooltip
            .html(hoveredCountry)
            .style("opacity", 1)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        } else if (tooltip) {
          tooltip.style("opacity", 0);
        }
      })
      .call(
        (d3.drag() as any)
          .on("start", (event: any) => {
            isDragging = true;
            isPaused = true;
            previousMousePosition = [event.x, event.y];
            if (tooltip) tooltip.style("opacity", 0);
          })
          .on("drag", (event: any) => {
            if (previousMousePosition) {
              const rotate = projection.rotate();
              const dx = event.x - previousMousePosition[0];
              const dy = event.y - previousMousePosition[1];
              const k = sensitivity / projection.scale();
              projection.rotate([
                rotate[0] + dx * k,
                Math.max(-90, Math.min(90, rotate[1] - dy * k))
              ]);
              previousMousePosition = [event.x, event.y];
              render();
            }
          })
          .on("end", () => {
            isDragging = false;
            previousMousePosition = null;
          })
      );

    const timer = d3.timer(() => {
      if (!isPaused && !isStatic && !isDragging) {
        const rotate = projection.rotate();
        const k = sensitivity / projection.scale();
        projection.rotate([rotate[0] - 1.5 * k, rotate[1]]);
      }
      render();
    });

    // Globe rendering setup complete
    setIsLoading(false);

    onCleanup(() => {
      timer.stop();
      if (canvas) {
        canvas.on(".drag", null);
        canvas.on("mouseenter", null);
        canvas.on("mouseleave", null);
        canvas.on("mousemove", null);
      }
      if (tooltip && typeof tooltip.remove === "function") {
        tooltip.remove();
      }
    });
  });

  return (
    <div class={`flex flex-col text-white justify-center items-center w-full min-h-[700px] relative pointer-events-none ${className || ""}`}>
      {/* Fallback loader inside component container */}
      <Show when={isLoading()}>
        <div class="absolute inset-0 flex flex-col items-center justify-center space-y-4 pointer-events-none z-10">
          <div class="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-sm text-slate-400 font-mono tracking-wider animate-pulse">
            LOADING GLOBE...
          </p>
        </div>
      </Show>

      {/* Main globe canvas container */}
      <div
        class={`w-full h-[650px] relative transition-opacity duration-500 ${isLoading() ? 'opacity-0' : 'opacity-100'}`}
        ref={mapContainer}
      ></div>

      {/* Caption text comfortably placed below the direction ring */}
      {enableHover && !isLoading() && (
        <p class="text-xs text-slate-400 font-mono tracking-wider text-center pointer-events-none mt-2">
          Click and drag to rotate
        </p>
      )}
    </div>
  );
};

export default GlobeComponent;