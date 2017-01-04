/// <reference path="./go.d.ts" />
/// <reference path="./agentGraphData.ts" />
var GraphConnectionDirectionType;
(function (GraphConnectionDirectionType) {
    GraphConnectionDirectionType[GraphConnectionDirectionType["IntentOutput"] = 0] = "IntentOutput";
    GraphConnectionDirectionType[GraphConnectionDirectionType["IntentInput"] = 1] = "IntentInput";
})(GraphConnectionDirectionType || (GraphConnectionDirectionType = {}));
var ConnectionClickEventArguments = (function () {
    function ConnectionClickEventArguments(connectionDirection, connection) {
        this.connectionDirection = connectionDirection;
        this.connection = connection;
    }
    return ConnectionClickEventArguments;
}());
var GraphNodePosition = (function () {
    function GraphNodePosition(type, name, x, y) {
        this.type = type;
        this.name = name;
        this.x = x;
        this.y = y;
    }
    return GraphNodePosition;
}());
var GraphConnection = (function () {
    function GraphConnection(intent, context) {
        this.intent = intent;
        this.context = context;
    }
    return GraphConnection;
}());
var GraphNodeType;
(function (GraphNodeType) {
    GraphNodeType[GraphNodeType["Intent"] = 0] = "Intent";
    GraphNodeType[GraphNodeType["Context"] = 1] = "Context";
})(GraphNodeType || (GraphNodeType = {}));
var GraphNode = (function () {
    function GraphNode(type, name, id) {
        this.type = type;
        this.name = name;
        this.id = id;
    }
    return GraphNode;
}());
var GraphLink = (function () {
    function GraphLink(from, to) {
        this.from = from;
        this.to = to;
    }
    return GraphLink;
}());
var GraphBuildInformation = (function () {
    function GraphBuildInformation(nodes, links) {
        this.nodes = nodes;
        this.links = links;
    }
    return GraphBuildInformation;
}());
(function () {
    window.AgentGraph = function (id) {
        this.eventHandlers = {
            "intentClicked": [],
            "contextClicked": [],
            "connectionClicked": [],
            "selectionMoved": []
        };
        this.data = null;
        this.id = id;
        this.diagram = this.buildDiagram();
    };
    AgentGraph.prototype.buildDiagram = function () {
        var $ = go.GraphObject.make;
        var diagram = $(go.Diagram, this.id, {
            initialContentAlignment: go.Spot.Center,
        });
        diagram.nodeTemplate = $(go.Node, "Auto", { locationSpot: go.Spot.Center }, $(go.Shape, "Rectangle", {
            fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
            stroke: "black"
        }), $(go.TextBlock, { font: "bold 10pt helvetica, bold arial, sans-serif", margin: 4 }, new go.Binding("text", "text")));
        diagram.linkTemplate = $(go.Link, $(go.Shape, { stroke: "black" }), $(go.Shape, { toArrow: "standard", stroke: "black" }));
        diagram.nodeTemplateMap.add("Intent", $(go.Node, "Spot", this.nodeStyle(), $(go.Panel, "Auto", $(go.Shape, "Rectangle", { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }), $(go.TextBlock, "Start", { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "whitesmoke" }, new go.Binding("text"))), 
        // three named ports, one on each side except the top, all output only:
        this.makePort("L", go.Spot.Left, true, false), this.makePort("R", go.Spot.Right, true, false), this.makePort("B", go.Spot.Bottom, true, false)));
        diagram.nodeTemplateMap.add("Context", $(go.Node, "Spot", this.nodeStyle(), $(go.Panel, "Auto", $(go.Shape, "Circle", { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }), $(go.TextBlock, "End", { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "whitesmoke" }, new go.Binding("text"))), 
        // three named ports, one on each side except the bottom, all input only:
        this.makePort("T", go.Spot.Top, false, true), this.makePort("L", go.Spot.Left, false, true), this.makePort("R", go.Spot.Right, false, true)));
        var obj = this;
        diagram.addDiagramListener("ObjectSingleClicked", function (e) {
            obj.diagramObjectClicked(e);
        });
        diagram.addDiagramListener("SelectionMoved", function () {
            obj.trigger("selectionMoved", obj.getPositions());
        });
        return diagram;
    };
    AgentGraph.prototype.diagramObjectClicked = function (e) {
        var part = e.subject.part;
        if (!(part instanceof go.Link)) {
            var node = this.data.nodes[part.data.key];
            console.log(node.type);
            if (node.type === GraphNodeType.Intent) {
                this.trigger("intentClicked", node.name);
            }
            else {
                this.trigger("contextClicked", node.name);
            }
        }
        else {
            var fromNode = this.data.nodes[part.data.from];
            var toNode = this.data.nodes[part.data.to];
            var args = void 0;
            if (toNode.type === GraphNodeType.Context) {
                args = new ConnectionClickEventArguments(GraphConnectionDirectionType.IntentOutput, new GraphConnection(fromNode.name, toNode.name));
            }
            else {
                args = new ConnectionClickEventArguments(GraphConnectionDirectionType.IntentInput, new GraphConnection(toNode.name, fromNode.name));
            }
            this.trigger("connectionClicked", args);
        }
    };
    AgentGraph.prototype.nodeStyle = function () {
        return [
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                locationSpot: go.Spot.Center,
            }
        ];
    };
    AgentGraph.prototype.makePort = function (name, spot, output, input) {
        var $ = go.GraphObject.make;
        return $(go.Shape, "Circle", {
            fill: "transparent",
            stroke: null,
            desiredSize: new go.Size(8, 8),
            alignment: spot, alignmentFocus: spot,
            portId: name,
            fromSpot: spot, toSpot: spot,
            fromLinkable: output, toLinkable: input,
            cursor: "pointer" // show a different cursor to indicate potential link point
        });
    };
    AgentGraph.prototype.visualize = function (data) {
        this.data = data;
        var nodes = data.nodes.map(function (node) {
            return {
                key: node.id,
                text: node.name,
                category: node.type === GraphNodeType.Intent ? "Intent" : "Context"
            };
        });
        var links = data.links.map(function (link) {
            return {
                from: link.from,
                to: link.to
            };
        });
        this.diagram.model = new go.GraphLinksModel(nodes, links);
    };
    AgentGraph.prototype.on = function (event, handler) {
        if (!this.eventHandlers.hasOwnProperty(event)) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    };
    AgentGraph.prototype.trigger = function (event, data) {
        if (!this.eventHandlers.hasOwnProperty(event)) {
            return;
        }
        for (var i = 0; i < this.eventHandlers[event].length; i++) {
            this.eventHandlers[event][i](data);
        }
    };
    AgentGraph.prototype.getPositions = function () {
        var nodes = this.data.nodes;
        var nodePositions = [];
        this.diagram.nodes.map(function (graphNode) {
            var node = nodes[graphNode.part.data.key];
            var position = new GraphNodePosition(node.type, node.name, graphNode.position.x, graphNode.position.y);
            nodePositions.push(position);
        });
        return nodePositions;
    };
    AgentGraph.prototype.setPositions = function (positions) {
        var obj = this;
        var $ = go.GraphObject.make;
        positions.map(function (node) {
            var filteredNodes = obj.data.nodes.filter(function (existingNode) {
                return existingNode.type === node.type && existingNode.name === node.name;
            });
            filteredNodes.map(function (filteredNode) {
                var nodeId = filteredNode.id;
                var position = $(go.Point, { "x": node.x, "y": node.y });
                obj.diagram.nodes.map(function (diagramNode) {
                    if (diagramNode.part.data.key === nodeId) {
                        diagramNode.setProperties({
                            "position": position
                        });
                    }
                });
            });
        });
    };
}) ();
