(function() {
    'use strict';

    var graph;
    var graphIntents = {};

    window.ApiAiInjections = {};
    ApiAiInjections.getAgent = function (id, handler) {
        $.ajax({
            "url": "https://console.api.ai/api-client/agents/" + id,
            success: function (result) {
                handler(result);
            }
        });
    };
    ApiAiInjections.getAgentId = function () {
        return window.location.href.split("/")[6];
    };
    ApiAiInjections.getDeveloperToken = function (handler) {
        ApiAiInjections.getAgent(ApiAiInjections.getAgentId(), function (data) {
            handler(data.agent.primaryKey);
        });
    };
    ApiAiInjections.getIntents = function (developerToken, handler) {
        $.ajax({
            "url": "https://console.api.ai/api/intents",
            "beforeSend": function (request) {
                request.setRequestHeader("Authorization", "Bearer " + developerToken);
            },
            success: function (result) {
                handler(result);
            }
        });
    };

    function visualizeAgentGraph() {
        ApiAiInjections.getDeveloperToken(function (token) {
            ApiAiInjections.getIntents(token, function(data) {
                showVisualizationPanel(data);
            });
        });
    }

    function addVisualizationLink() {
        var visualizeLi = $("<li></li>");
        var visualizeLink = $("<a></a>").attr("href", "#").text("Visualize");
        visualizeLi.append(visualizeLink);
        visualizeLink.click(function () {
            visualizeAgentGraph();
            return false;
        });
        $("#control-panel nav ul a").click(function () {
            hideVisualizationPanel();
        });
        $("#control-panel nav ul").eq(0).append(visualizeLi);
    }

    function addVisualizationPanel() {
        var panel = $("<div></div>").addClass("content-box");
        var topPanel = $("<div></div>").addClass("top-panel");
        topPanel.html('<span class="right-margin"></span>' +
            '<span class="left-margin"></span>' +
            '<div id="inner-header" class="inner-header"><div class="wrap">' +
            '<div class="view-header ng-isolate-scope" inner-header="headerConfig">' +
            '<div class="wrap-actions loaded">' +
            '<h1><span>Visualization</span></h1></div></div></div></div>');
        panel.append(topPanel);
        panel.css({
            position: "relative",
            display: "none"
        });
        panel.addClass("visualization-panel");
        panel.append($("<div class=\"workplace ng-scope\" ui-view=\"workplace\"><div id=\"visualization-graph\"></div></div>"));
        $("#main").append(panel);
        $("#visualization-graph").css({
            width: "100%",
            height: 600,
        });
        graph = new AgentGraph("visualization-graph");
        graph.on("intentClicked", function (intent) {
            hideVisualizationPanel();
            window.location.href = "https://console.api.ai/api-client/#/agent/" + ApiAiInjections.getAgentId() +
                "/editIntent/" + graphIntents[intent] + "/";
        });
        graph.on("selectionMoved", function (positions) {
            $.cookie("positions-" + ApiAiInjections.getAgentId(), JSON.stringify(positions));
        });
    }

    function getNotVisualizationPanel() {
        var collection = $("#main > div");
        for (var i=0; i<collection.length; i++) {
            var item = collection.eq(i);
            if (! item.hasClass("visualization-panel")) {
                return item;
            }
        }
    }

    function showVisualizationPanel(data) {
        getNotVisualizationPanel().css({display: "none"});
        $(".visualization-panel").css({display: "flex"});
        var contexts = [];
        graphIntents = {};
        var intents = data.map(function (intent) {
            graphIntents[intent.name] = intent.id;
            intent.contextIn.map(function (context) {
                if (contexts.indexOf(context) === -1) {
                    contexts.push(context);
                }
            });
            intent.contextOut.map(function (context) {
                if (contexts.indexOf(context.name) === -1) {
                    contexts.push(context.name);
                }
            });
            return intent.name;
        });
        contexts.push("");
        contexts.sort();
        intents.sort();
        var nodes = [];
        var intentNodeIds = {};
        var contextNodeIds = {};
        for (var i=0; i<intents.length; i++) {
            var id = nodes.length;
            nodes.push(new GraphNode(GraphNodeType.Intent, intents[i], id));
            intentNodeIds[intents[i]] = id;
        }
        for (var i=0; i<contexts.length; i++) {
            var id = nodes.length;
            nodes.push(new GraphNode(GraphNodeType.Context, contexts[i], id));
            contextNodeIds[contexts[i]] = id;
        }
        var rootContextNid = contextNodeIds[""];
        var links = [];
        data.map(function (intent) {
            var intentNid = intentNodeIds[intent.name];
            intent.contextIn.map(function (context) {
                var contextNid = contextNodeIds[context];
                links.push(new GraphLink(contextNid, intentNid));
            });
            if (intent.contextIn.length === 0) {
                links.push(new GraphLink(rootContextNid, intentNid));
            }
            intent.contextOut.map(function (context) {
                var contextNid = contextNodeIds[context.name];
                links.push(new GraphLink(intentNid, contextNid));
            });
            if (intent.contextOut.length === 0) {
                links.push(new GraphLink(intentNid, rootContextNid));
            }
        });
        var info = new GraphBuildInformation(nodes, links);
        graph.visualize(info);
        setTimeout(function () {
            var positionsString = $.cookie("positions-" + ApiAiInjections.getAgentId());
            var positions = [];
            if (positionsString) {
                positions = JSON.parse(positionsString);
            }
            graph.setPositions(positions);
        }, 10);
    }

    function hideVisualizationPanel() {
        getNotVisualizationPanel().css({display: "flex"});
        $(".visualization-panel").css({display: "none"});
    }

    window.onload = function () {
        function waitForUi() {
            console.log(1);
            if (window['jQuery'] === undefined) {
                console.log(2);
                setTimeout(waitForUi, 1000);
            } else {
                console.log(3);
                InitializeJqueryCookies();
                if ($("#control-panel nav ul").length === 0) {
                    setTimeout(waitForUi, 1000);
                } else {
                    addVisualizationLink();
                    addVisualizationPanel();
                }
            }
        }
        waitForUi();
    };
})();