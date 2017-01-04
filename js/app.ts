/// <reference path="./angular/index.d.ts" />
/// <reference path="./apiai.ts" />
/// <reference path="./supportData.ts" />
/// <reference path="agentGraph/include.ts" />

(function () {
    angular.module('HelloWorldApp', [])
        .controller('HelloWorldController', function ($scope) {
            let agent: ApiAi.Agent = window['demoAgent'];
            let graph = new AgentGraph("myDiagramDiv");

            $scope.selection = {
                "intent": null,
                "context": null
            };

            function resetSelection() {
                $scope.propertiesMode = "none";
                $scope.selection = {
                    "intent": null,
                    "context": null
                };
            }
            resetSelection();

            graph.on("intentClicked", function (intent: String) {
                $scope.propertiesMode = "intent";
                const intentData = agent.intents.filter(function (agentIntent) {
                    return agentIntent.name === intent;
                })[0];
                $scope.selection.intent = {
                    "data": intentData
                };
                $scope.$apply();
                console.log("intentClicked", intent);
            });
            graph.on("contextClicked", function (context: String) {
                $scope.propertiesMode = "context";
                $scope.selection.context = context;
                $scope.$apply();
                console.log("contextClicked", context);
            });
            graph.on("connectionClicked", function (connection: ConnectionClickEventArguments) {
                console.log("connectionClicked", connection);
            });
            graph.on("selectionMoved", function (positions) {
                console.log("selectionMoved", positions)
            });

            function visualizeAgent() {
                let data = new AgentGraphData();
                agent.getContexts().map(function (context) {
                    data.addContext(context);
                });
                agent.intents.map(function (intent) {
                    data.addIntent(intent.name);
                    intent.contexts.map(function (context) {
                        data.addInputContextConnection(new GraphConnection(
                            intent.name,
                            context
                        ));
                    });
                    intent.getResponseContexts().map(function (context) {
                        data.addOutputContextConnection(new GraphConnection(
                            intent.name,
                            context.name
                        ));
                    });
                });
                graph.visualize(data.getInformation());
            }

            $scope.renameContext = function (oldName, newName) {
                agent.renameContext(oldName, newName);
                visualizeAgent();
            };

            $scope.removeContext = function (name) {
                agent.removeContext(name);
                resetSelection();
                visualizeAgent();
            };

            $scope.renameIntent = function (oldName, newName) {
                agent.intents.map(function (intent) {
                    if (intent.name === oldName) {
                        intent.name = newName;
                    }
                });
                resetSelection();
                visualizeAgent();
            };

            $scope.removeIntent = function(name) {
                agent.intents = agent.intents.filter(function (intent) {
                    return intent.name !== name;
                });
                resetSelection();
                visualizeAgent();
            };

            visualizeAgent();

            $scope.graph = graph;
            $scope.agent = agent;

            $scope.languages = SupportData.languages;
            $scope.timezones = SupportData.timezones;
        });
})();