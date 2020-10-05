import React, { useEffect } from "react";
import { axisBottom, extent, scaleTime, select } from "d3";

export const xScale = function (data) {
  return scaleTime()
    .domain(
      extent(data, function (d) {
        return d.time;
      })
    )
    .range([0, 400]);
};

export const XAxis = function ({ chartRef, data }) {
  useEffect(() => {
    const chartEl = select(chartRef.current);

    data.length > 0 &&
      chartEl
        .append("g")
        .style("font", "12px sans-serif")
        .attr("stroke", "transparent")
        .attr("transform", "translate(-2,398)")
        .attr("class", "myXaxis");

    data.length > 0 &&
      chartEl
        .selectAll(".myXaxis")
        .transition()
        .duration(1500)
        .call(axisBottom(xScale(data)));
  }, [chartRef, data]);

  return <></>;
};
