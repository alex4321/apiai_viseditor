/// <reference path="./go.d.ts" />
/// <reference path="./agentGraphData.ts" />
declare var go;


enum GraphConnectionDirectionType {
    IntentOutput = 0,
    IntentInput
}


class ConnectionClickEventArguments {
    public connectionDirection: GraphConnectionDirectionType;
    public connection: GraphConnection;

    constructor(connectionDirection: GraphConnectionDirectionType, connection: GraphConnection) {
        this.connectionDirection = connectionDirection;
        this.connection = connection;
    }
}


class GraphNodePosition {
    public type: GraphNodeType;
    public name: String;
    public x: Number;
    public y: Number;

    constructor(type: GraphNodeType, name: String, x: Number, y: Number) {
        this.type = type;
        this.name = name;
        this.x = x;
        this.y = y;
    }
}


class AgentGraph {
    private id: String;
    private diagram: go.Diagram;
    private eventHandlers: { [event: string]: Array<(data: Object) => void> } = {
        "intentClicked": [],
        "contextClicked": [],
        "connectionClicked": [],
        "selectionMoved": []
    };
    private data: GraphBuildInformation = null;

    constructor(id: String) {
        this.id = id;
        this.diagram = this.buildDiagram();
    }

    private buildDiagram(): go.Diagram {
        let $ = go.GraphObject.make;
        let diagram =  $(go.Diagram, this.id, {
            initialContentAlignment: go.Spot.Center,
        });
        diagram.nodeTemplate = $(go.Node, "Auto",
            { locationSpot: go.Spot.Center },
            $(go.Shape, "Rectangle", {
                fill: $(go.Brush, "Linear", { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" }),
                stroke: "black"
            }),
            $(go.TextBlock,
                { font: "bold 10pt helvetica, bold arial, sans-serif", margin: 4 },
                new go.Binding("text", "text")));
        diagram.linkTemplate = $(go.Link,
            $(go.Shape, { stroke: "black" }),
            $(go.Shape, { toArrow: "standard", stroke: "black" })
        );
        diagram.nodeTemplateMap.add("Intent",
            $(go.Node, "Spot", this.nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Rectangle",
                        { minSize: new go.Size(40, 40), fill: "#79C900", stroke: null }),
                    $(go.TextBlock, "Start",
                        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "whitesmoke" },
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the top, all output only:
                this.makePort("L", go.Spot.Left, true, false),
                this.makePort("R", go.Spot.Right, true, false),
                this.makePort("B", go.Spot.Bottom, true, false)
            ));
        diagram.nodeTemplateMap.add("Context",
            $(go.Node, "Spot", this.nodeStyle(),
                $(go.Panel, "Auto",
                    $(go.Shape, "Circle",
                        { minSize: new go.Size(40, 40), fill: "#DC3C00", stroke: null }),
                    $(go.TextBlock, "End",
                        { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "whitesmoke" },
                        new go.Binding("text"))
                ),
                // three named ports, one on each side except the bottom, all input only:
                this.makePort("T", go.Spot.Top, false, true),
                this.makePort("L", go.Spot.Left, false, true),
                this.makePort("R", go.Spot.Right, false, true)
            ));
        let obj = this;
        diagram.addDiagramListener("ObjectSingleClicked", function(e: go.DiagramEvent) {
            obj.diagramObjectClicked(e);
        });
        diagram.addDiagramListener("SelectionMoved", function () {
            obj.trigger("selectionMoved", obj.getPositions());
        });
        return diagram;
    }

    private diagramObjectClicked(e: go.DiagramEvent): void {
        let part = e.subject.part;
        if (! (part instanceof go.Link)) {
            let node = this.data.nodes[part.data.key];
            console.log(node.type);
            if (node.type === GraphNodeType.Intent) {
                this.trigger("intentClicked", node.name);
            } else {
                this.trigger("contextClicked", node.name);
            }
        } else {
            let fromNode = this.data.nodes[part.data.from];
            let toNode = this.data.nodes[part.data.to];
            let args: ConnectionClickEventArguments;
            if (toNode.type === GraphNodeType.Context) {
                args = new ConnectionClickEventArguments(GraphConnectionDirectionType.IntentOutput,
                    new GraphConnection(fromNode.name, toNode.name));
            } else {
                args = new ConnectionClickEventArguments(GraphConnectionDirectionType.IntentInput,
                    new GraphConnection(toNode.name, fromNode.name));
            }
            this.trigger("connectionClicked", args);
        }
    }

    private nodeStyle(): Array<Object> {
        return [
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            {
                locationSpot: go.Spot.Center,
            }
        ];
    }

    private makePort(name, spot, output, input): go.Shape {
        let $ = go.GraphObject.make;
        return $(go.Shape, "Circle",
            {
                fill: "transparent",
                stroke: null,  // this is changed to "white" in the showPorts function
                desiredSize: new go.Size(8, 8),
                alignment: spot, alignmentFocus: spot,  // align the port on the main Shape
                portId: name,  // declare this object to be a "port"
                fromSpot: spot, toSpot: spot,  // declare where links may connect at this port
                fromLinkable: output, toLinkable: input,  // declare whether the user may draw links to/from here
                cursor: "pointer"  // show a different cursor to indicate potential link point
            }
        );
    }

    public visualize(data: GraphBuildInformation): void {
        this.data = data;
        let nodes: Array<Object> = data.nodes.map(function (node) {
            return {
                key: node.id,
                text: node.name,
                category: node.type === GraphNodeType.Intent ? "Intent": "Context"
            };
        });
        let links: Array<Object> = data.links.map(function (link) {
            return {
                from: link.from,
                to: link.to
            };
        });
        this.diagram.model = new go.GraphLinksModel(nodes, links);
    }

    public on(event: string, handler: (data: Object) => void): void {
        if (! this.eventHandlers.hasOwnProperty(event)) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }

    private trigger(event: string, data: Object): void {
        if (! this.eventHandlers.hasOwnProperty(event)) {
            return;
        }
        for (let i=0; i<this.eventHandlers[event].length; i++) {
            this.eventHandlers[event][i](data);
        }
    }

    public getPositions(): Array<GraphNodePosition> {
        const nodes = this.data.nodes;
        let nodePositions = [];
        this.diagram.nodes.map(function (graphNode: go.Node) {
            let node = nodes[graphNode.part.data.key];
            let position = new GraphNodePosition(
                node.type,
                node.name,
                graphNode.position.x,
                graphNode.position.y
            );
            nodePositions.push(position);
        });
        return nodePositions;
    }

    public setPositions(positions: Array<GraphNodePosition>): void {
        let obj = this;
        let $ = go.GraphObject.make;
        positions.map(function (node: GraphNodePosition) {
            let filteredNodes = obj.data.nodes.filter(function (existingNode) {
                return existingNode.type === node.type && existingNode.name === node.name;
            });
            filteredNodes.map(function (filteredNode) {
                let nodeId = filteredNode.id;
                let position = $(go.Point, {"x": node.x, "y": node.y});
                obj.diagram.nodes.map(function (diagramNode) {
                    if (diagramNode.part.data.key === nodeId) {
                        diagramNode.setProperties({
                            "position": position
                        });
                    }
                });
            });
        });
    }
}