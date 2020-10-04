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
      .style("font", "12px sans-serif")
      .attr("stroke", "transparent")
      .attr("transform", "translate(-2,398)")
      .attr("class", "myXaxis");

    const svgYSeries = svgElement
      .append("g")
      .style("font", "12px sans-serif")
      .attr("stroke", "transparent")
      .attr("transform", "translate(-2,-3)")
      .attr("class", "myYaxis");

    const uX = svgElement
      .selectAll(".myXaxis")
      .transition()
      .duration(1500)
      .call(axisBottom(x));

    const uY = svgElement
      .selectAll(".myYaxis")
      .attr("transform", "translate(-2,-3)")
      .transition()
      .duration(1000)
      .call(axisLeft(y));

    const u = svgElement.selectAll(".linePts").data([props.data], function (d) {
      return d.time;
    });

    u.enter()
      .append("path")
      .attr("class", "linePts")
      .attr("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", 2)
      .merge(u)
      .transition()
      .duration(2000)
      .attr(
        "d",
        line()
          .x((d) => x(d.time))
          .y((d) => y(Math.floor(d.close)))
      );
    svgElement.selectAll(".textSymbol").remove();
    svgElement.append("text").attr('class','textSymbol').text(props.symbol).attr("x", 175).attr("y", 20);
  }, [props.data, props.symbol]);

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
