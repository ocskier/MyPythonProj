import React, { useRef, useEffect } from "react";
import {
  line,
  select,
} from "d3";

import {xScale,XAxis} from './XAxis';
import {yScale,YAxis} from './YAxis';

function Chart(props) {
  const svgRef = useRef();
  useEffect(() => {
    const svgElement = select(svgRef.current);

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
          .x((d) => xScale(props.data)(d.time))
          .y((d) => yScale(props.data)(Math.floor(d.close)))
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
    >
      <XAxis chartRef={svgRef} data={props.data} />
      <YAxis chartRef={svgRef} data={props.data} />
    </svg>
  );
}

export default Chart;
