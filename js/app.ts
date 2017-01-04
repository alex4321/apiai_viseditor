/// <reference path="./angular/index.d.ts" />
/// <reference path="./apiai.ts" />
/// <reference path="./supportData.ts" />
/// <reference path="agentGraph/include.ts" />

(function () {
    angular.module('HelloWorldApp', [])
        .controller('HelloWorldController', function ($scope) {
            let agent: ApiAi.Agent = window['demoAgent'];

            function propertiesEditorInitialize(type, object, visualizeAgent) {
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

                $scope.setIntentInputContext = function () {
                    if ($scope.selection.intent.inputContext) {
                        $scope.selection.intent.data.contexts = [$scope.selection.intent.inputContext];
                    } else {
                        $scope.selection.intent.data.contexts = [];
                    }
                    visualizeAgent();
                };

                $scope.setIntentOutputContext = function () {
                    if ($scope.selection.intent.outputContext.name) {
                        $scope.selection.intent.data.setResponseContexts([
                            $scope.selection.intent.outputContext
                        ]);
                    } else {
                        $scope.selection.intent.data.setResponseContexts([]);
                    }
                    visualizeAgent();
                };

                $scope.mode = "properties";
                $scope.propertiesMode = type;
                if (type === "intent") {
                    let inputContext = object.contexts[0];
                    if (! inputContext) {
                        inputContext = "";
                    }
                    let outputContext = object.getResponseContexts()[0];
                    if (! outputContext) {
                        outputContext = new ApiAi.ResponseContext({});
                    }
                    $scope.selection.intent = {
                        "data": object,
                        "inputContext": inputContext,
                        "outputContext": outputContext
                    };
                } else if (type === "context") {
                    $scope.selection.context = object;
                }
                $scope.$apply();
            }

            function agentGraphEditorInitialize() {
                $scope.mode = "graph";
                let graph = new AgentGraph("agentGraph");

                graph.on("intentClicked", function (intent: String) {
                    $scope.propertiesMode = "intent";
                    const intentData = agent.intents.filter(function (agentIntent) {
                        return agentIntent.name === intent;
                    })[0];
                    propertiesEditorInitialize("intent", intentData, visualizeAgent);
                });
                graph.on("contextClicked", function (context: String) {
                    propertiesEditorInitialize("context", context, visualizeAgent);
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

                visualizeAgent();

                $scope.graph = graph;
            }

            $scope.agent = agent;
            agentGraphEditorInitialize();

            $scope.languages = SupportData.languages;
            $scope.timezones = SupportData.timezones;
        });
})();