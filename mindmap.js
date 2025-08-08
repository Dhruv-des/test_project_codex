const data = {
  name: "Dhruv",
  children: [
    {
      name: "Projects",
      children: [
        { name: "Modular Chair", type: "project", url: "#" },
        { name: "Sustainable Lamp", type: "project", url: "#" }
      ]
    },
    {
      name: "Skills",
      children: [
        { name: "Sketching", type: "reflection", url: "#" },
        { name: "3D Modeling", type: "video", url: "#" }
      ]
    },
    {
      name: "Tools",
      children: [
        { name: "Fusion 360", type: "video", url: "#" },
        { name: "Arduino", type: "project", url: "#" }
      ]
    },
    {
      name: "Collaborations",
      children: [
        { name: "Team Alpha", type: "project", url: "#" },
        { name: "Craft Collective", type: "reflection", url: "#" }
      ]
    },
    {
      name: "Insights",
      children: [
        { name: "Material Exploration", type: "reflection", url: "#" },
        { name: "User Empathy", type: "video", url: "#" }
      ]
    },
    {
      name: "Research",
      children: [
        { name: "Ergonomics Study", type: "project", url: "#" },
        { name: "Sustainability Trends", type: "reflection", url: "#" }
      ]
    }
  ]
};

const width = window.innerWidth;
const height = window.innerHeight;
const radius = Math.min(width, height) / 2;

const tree = d3.tree().size([2 * Math.PI, radius - 100]);
const root = d3.hierarchy(data);
tree(root);

const svg = d3.select("#mindmap")
  .attr("width", width)
  .attr("height", height);

const g = svg.append("g");

const zoom = d3.zoom().on("zoom", (event) => {
  g.attr("transform", event.transform);
});

svg.call(zoom).call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

const link = g.append("g")
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-opacity", 0.4)
  .attr("stroke-width", 1.5)
  .selectAll("path")
  .data(root.links())
  .join("path")
  .attr("d", d3.linkRadial()
    .angle(d => d.x)
    .radius(d => d.y)
  );

const node = g.append("g")
  .selectAll("g")
  .data(root.descendants())
  .join("g")
  .attr("class", "node")
  .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`);

node.append("circle")
  .attr("r", 4)
  .attr("fill", d => {
    if (!d.parent) return "#ff8c00"; // center node
    if (d.children) return "#ffce00"; // category nodes
    return d.data.type === "video" ? "#4ecdc4" :
           d.data.type === "reflection" ? "#1a535c" : "#ff6b6b";
  });

node.append("text")
  .attr("dy", "0.31em")
  .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
  .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
  .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
  .text(d => d.data.name);

function radialPoint(x, y) {
  return [y * Math.cos(x - Math.PI / 2), y * Math.sin(x - Math.PI / 2)];
}

node.on("click", (event, d) => {
  const [x, y] = radialPoint(d.x, d.y);
  svg.transition().duration(750)
    .call(zoom.transform,
      d3.zoomIdentity.translate(width / 2, height / 2).scale(2).translate(-x, -y));
  if (!d.children && d.data.url) {
    setTimeout(() => window.open(d.data.url, "_blank"), 750);
  }
});

