import React, { useEffect } from "react";
import { axisLeft, max, scaleLinear, select } from "d3";

export const yScale = function (data) {
  return scaleLinear()
    .domain([
      0,
      max(data, function (d) {
        return +Math.floor(d.close);
      }) + 20,
    ])
    .range([400, 0]);
};

export const YAxis = function ({ chartRef, data }) {
  useEffect(() => {
    const chartEl = select(chartRef.current);

    data.length > 0 &&
      chartEl
        .append("g")
        .style("font", "12px sans-serif")
        .attr("stroke", "transparent")
        .attr("transform", "translate(-2,-3)")
        .attr("class", "myYaxis");

    data.length > 0 &&
      chartEl
        .selectAll(".myYaxis")
        .attr("transform", "translate(-2,-3)")
        .transition()
        .duration(1000)
        .call(axisLeft(yScale(data)));
  }, [chartRef, data]);

  return <></>;
};
