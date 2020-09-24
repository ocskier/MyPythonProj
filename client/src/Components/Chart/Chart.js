import React, { useRef, useEffect } from "react";
import {
  axisBottom,
  axisLeft,
  extent,
  line,
  scaleLinear,
  scaleTime,
  select,
  max,
} from "d3";

function Chart(props) {
  const svgRef = useRef();
  useEffect(() => {
    const svgElement = select(svgRef.current);
    const x = scaleTime()
      .domain(
        extent(props.data, function (d) {
          return d.time;
        })
      )
      .range([0, 400]);
    const y = scaleLinear()
      .domain([
        0,
        max(props.data, function (d) {
          return +Math.floor(d.close);
        }) + 20,
      ])
      .range([400, 0]);
    const svgXSeries = svgElement
      .append("g")
      .style("font", "10px sans-serif")
      .attr("stroke", "steelblue")
      .attr("transform", "translate(-2,398)")
      .call(axisBottom(x));

    const svgYSeries = svgElement
      .append("g")
      .style("font", "10px sans-serif")
      .attr("stroke", "steelblue")
      .attr("transform", "translate(-2,-3)")
      .call(axisLeft(y));

    svgElement
      .append("path")
      .datum(props.data)
      .attr("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .attr(
        "d",
        line()
          .x((d) => x(d.time))
          .y((d) => y(Math.floor(d.close)))
      );
    svgElement.append("text").text(props.symbol).attr("x", 175).attr("y", 20);
  }, [props.data,props.symbol]);

  return (
    <svg
      ref={svgRef}
      width={400}
      height={400}
      style={{
        marginTop: "1rem",
        backgroundColor: "aliceblue",
        overflow: "inherit",
      }}
    ></svg>
  );
}

export default Chart;
