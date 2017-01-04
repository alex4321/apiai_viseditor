class GraphConnection {
    public intent: String;
    public context: String;

    constructor(intent: String, context: String) {
        this.intent = intent;
        this.context = context;
    }
}


enum GraphNodeType {
    Intent = 0,
    Context
}


class GraphNode {
    public type: GraphNodeType;
    public name: String;
    public id: Number;

    constructor(type: GraphNodeType, name: String, id: Number) {
        this.type = type;
        this.name = name;
        this.id = id;
    }
}


class GraphLink {
    public from: Number;
    public to: Number;

    constructor(from: Number, to: Number) {
        this.from = from;
        this.to = to;
    }
}


class GraphBuildInformation {
    public nodes: Array<GraphNode>;
    public links: Array<GraphLink>;

    constructor(nodes: Array<GraphNode>, links: Array<GraphLink>) {
        this.nodes = nodes;
        this.links = links;
    }
}


class AgentGraphData {
    private intents: Array<String>;
    private contexts: Array<String>;
    private inputContextConnections: Array<GraphConnection>;
    private outputContextConnections: Array<GraphConnection>;
    private rootContext: String = "root";

    constructor() {
        this.intents = [];
        this.contexts = [this.rootContext];
        this.inputContextConnections = [];
        this.outputContextConnections = [];
    }

    private assert(condition: Boolean, message: string): void {
        if (! condition) {
            throw new Error(message);
        }
    }

    private intentIndex(name: String): number {
        const index = this.intents.indexOf(name);
        this.assert(index !== -1, "Intent not found");
        return index;
    }

    private contextIndex(name: String): number {
        const index = this.contexts.indexOf(name);
        this.assert(index !== -1, "Context not found");
        return index;
    }

    public addIntent(name: String): void {
        this.intents.push(name);
        this.intents.sort();
    }

    public removeIntent(name: String): void {
        this.intents.splice(this.intentIndex(name), 1);
        this.intents.sort();
    }

    public addContext(name: String): void {
        this.contexts.push(name);
        this.contexts.sort();
    }

    public removeContext(name: String): void {
        this.contexts.splice(this.contextIndex(name), 1);
        this.contexts.sort();
    }

    private addConnection(connections: Array<GraphConnection>, connection: GraphConnection): void {
        this.intentIndex(connection.intent);
        this.contextIndex(connection.context);
        connections.push(connection);
    }

    private filteredConnection(connections: Array<GraphConnection>, connection: GraphConnection): Array<GraphConnection> {
        this.intentIndex(connection.intent);
        this.contextIndex(connection.context);
        return connections.filter((iterConnection: GraphConnection) => {
            return iterConnection.context === connection.context &&
                    iterConnection.intent === connection.intent;
        });
    }

    public addInputContextConnection(connection: GraphConnection): void {
        this.addConnection(this.inputContextConnections, connection);
    }

    public removeInputContextConnection(connection: GraphConnection): void {
        this.inputContextConnections = this.filteredConnection(this.inputContextConnections, connection);
    }

    public addOutputContextConnection(connection: GraphConnection): void {
        this.addConnection(this.outputContextConnections, connection);
    }

    public removeOutputContextConnection(connection: GraphConnection): void {
        this.outputContextConnections = this.filteredConnection(this.outputContextConnections, connection);
    }

    public buildDefaultConnections(): void {
        let rootContext = this.rootContext;
        for (let i=0; i<this.intents.length; i++) {
            let intent = this.intents[i];
            let haveRootOutput = this.outputContextConnections.filter(function (connection) {
                return connection.context === rootContext && connection.intent === intent;
            }).length > 0;
            if (! haveRootOutput) {
                this.addOutputContextConnection(new GraphConnection(intent, rootContext));
            }
            let inputConnectionsCount = this.inputContextConnections.filter(function (connection) {
                return connection.intent === intent;
            }).length;
            if (inputConnectionsCount === 0) {
                this.addInputContextConnection(new GraphConnection(intent, rootContext));
            }
        }
    }

    private getGraphNodes(): Array<GraphNode> {
        let nodes: Array<GraphNode> = [];
        for (let i=0; i<this.intents.length; i++) {
            nodes.push(new GraphNode(
                GraphNodeType.Intent,
                this.intents[i],
                nodes.length
            ));
        }
        for (let i=0; i<this.contexts.length; i++) {
            nodes.push(new GraphNode(
                GraphNodeType.Context,
                this.contexts[i],
                nodes.length
            ));
        }
        return nodes;
    }

    private chooseGraphNodeId(nodes: Array<GraphNode>, type: GraphNodeType, name: String): Number {
        let filtered = nodes.filter((node) => {
            return node.type == type && node.name == name
        });
        this.assert(filtered.length > 0, "Not found right node");
        return filtered[0].id;
    }

    private getCraphLinks(nodes: Array<GraphNode>): Array<GraphLink> {
        let links: Array<GraphLink> = [];
        for (let i=0; i<this.outputContextConnections.length; i++) {
            let connection = this.outputContextConnections[i];
            let intentNodeId = this.chooseGraphNodeId(nodes, GraphNodeType.Intent, connection.intent);
            let contextNodeId = this.chooseGraphNodeId(nodes, GraphNodeType.Context, connection.context);
            links.push(new GraphLink(intentNodeId, contextNodeId));
        }
        for (let i=0; i<this.inputContextConnections.length; i++) {
            let connection = this.inputContextConnections[i];
            let contextNodeId = this.chooseGraphNodeId(nodes, GraphNodeType.Context, connection.context);
            let intentNodeId = this.chooseGraphNodeId(nodes, GraphNodeType.Intent, connection.intent);
            links.push(new GraphLink(contextNodeId, intentNodeId));
        }
        return links;
    }

    public getInformation(): GraphBuildInformation {
        this.buildDefaultConnections();
        const nodes = this.getGraphNodes();
        const links = this.getCraphLinks(nodes);
        return new GraphBuildInformation(nodes, links);
    }
}