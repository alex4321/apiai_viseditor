namespace ApiAi {
    function clone(obj: Object): Object {
        let copy;
        if (null === obj || "object" !== typeof obj) {
            return obj;
        } else if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        } else if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        } else if (obj instanceof Object) {
            copy = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    function fill(src: Object, target: Object) {
        for (let property in src) {
            if (src.hasOwnProperty(property)) {
                target[property] = clone(src[property]);
            }
        }
    }

    export class AgentData {
        public language: String = "en";
        public enabledDomainFeatures: Array<Object> = [];
        public defaultTimezone: String = "Europe/London";
        public customClassifierMode: String = "use.after";
        public mlMinConfidence: Number = 0.2;

        constructor(data: Object) {
            fill(data, this);
        }
    }

    export class InputText {
        public text: String = "";

        constructor(data: Object) {
            fill(data, this);
        }
    }

    export class UserSays {
        public data: Array<InputText> = [];
        public isTemplate: boolean = false;
        public count: Number = 0;

        constructor(data: Object) {
            const cData = clone(data);
            cData['data'] = cData['data'].map(function(data) {
                return new InputText(data);
            });
            fill(cData, this);
        }
    }

    export class ResponseContext {
        public name: String = "";
        public lifespan: Number = 5;

        constructor(data: Object) {
            fill(data, this);
        }
    }

    export class Message {
        public type: Number = 0;
        public speech = "";

        constructor(data: Object) {
            fill(data, this);
        }
    }

    export class Parameter {
        public required: boolean = false;
        public dataType: String = "";
        public name: String = "";
        public value: String = "";
        public prompts: Array<String> = [];
        public isList: boolean = false;

        constructor(data: Object) {
            fill(data, this);
        }
    }

    export class Response {
        public resetContexts: boolean = false;
        public affectedContexts: Array<ResponseContext> = [];
        public parameters: Array<Parameter> = [];
        public messages: Array<Message> = [];
        public action: String = "";

        constructor(data: Object) {
            let cData = clone(data);
            cData['affectedContexts'] = cData['affectedContexts'].map(function (context) {
                return new ResponseContext(context);
            });
            cData['messages'] = cData['messages'].map(function (message) {
                return new Message(data);
            });
            cData['parameters'] = cData['parameters'].map(function (parameter) {
                return new Parameter(parameter);
            });
            fill(cData, this);
        }
    }

    export class Intent {
        public userSays: Array<UserSays> = [];
        public name: String = "";
        public auto: boolean = true;
        public contexts: Array<String> = [];
        public responses: Array<Response> = [];
        public priority: Number = 500000;
        public webhookUsed: boolean = false;
        public webhookForSlotFilling: boolean = false;
        public fallbackIntent: boolean = false;
        public events: Array<Object> = [];

        constructor(data: Object) {
            let cData = clone(data);
            cData['userSays'] = cData['userSays'].map(function (input) {
                return new UserSays(input);
            });
            cData['responses'] = cData['responses'].map(function (response) {
                return new Response(response);
            });
            fill(cData, this);
        }

        public getResponseContexts(): Array<ResponseContext> {
            let result = [];
            let pushed = {};
            this.responses.map(function (response) {
                response.affectedContexts.map(function (context) {
                    if (! pushed.hasOwnProperty(context.name.toString())) {
                        result.push(context);
                        pushed[context.name.toString()] = true;
                    }
                });
            });
            return result;
        }

        public setResponseContexts(contexts: Array<ResponseContext>) {
            this.responses.map(function (response) {
                response.affectedContexts = contexts;
            });
        }

        public getAction(): String {
            let result = {"action": ""};
            this.responses.map(function (response) {
                if (response.action !== "") {
                    result["action"] = response.action.toString();
                }
            });
            return result["action"];
        }

        public setAction(action: String) {
            this.responses.map(function (response) {
                response.action = action;
            });
        }

        public getParameters(): Array<Parameter> {
            let result = [];
            let pushed = {};
            this.responses.map(function (response) {
                response.parameters.map(function (parameter) {
                    if (! pushed.hasOwnProperty(parameter.name.toString())) {
                        result.push(parameter);
                        pushed[parameter.name.toString()] = true;
                    }
                });
            });
            return result;
        }

        public setParameters(parameters: Array<Parameter>): void {
            this.responses.map(function (response) {
                response.parameters = parameters;
            });
        }
    }

    export class Agent {
        public data: AgentData;
        public intents: Array<Intent>;

        constructor(data: Object, intents: Array<Object>) {
            this.data = new AgentData(data);
            this.intents = intents.map(function (intent) {
                return new Intent(intent);
            });
        }

        public getContexts(): Array<String> {
            let contexts = [];

            function addContext(name: String) {
                if (contexts.indexOf(name) === -1) {
                    contexts.push(name);
                }
            }

            this.intents.map(function (intent) {
                intent.contexts.map(function (context) {
                    addContext(context);
                });
                intent.getResponseContexts().map(function (context) {
                    addContext(context.name);
                });
            });

            return contexts;
        }

        public removeContext(name: String) {
            if (this.getContexts().indexOf(name) === -1) {
                return;
            }
            this.intents.map(function (intent) {
                const inputContextIndex = intent.contexts.indexOf(name);
                if (inputContextIndex !== -1) {
                    intent.contexts.splice(inputContextIndex, 1);
                }
                intent.setResponseContexts(intent.getResponseContexts().filter(
                    function (context) {
                        return context.name !== name;
                    }
                ));
            })
        }

        public renameContext(oldName: String, newName: String) {
            this.intents.map(function (intent) {
                const index = intent.contexts.indexOf(oldName);
                if (index !== -1) {
                    intent.contexts.splice(index, 1);
                    intent.contexts.push(newName);
                }
                let contexts = intent.getResponseContexts();
                contexts.map(function (context) {
                    if (context.name === oldName) {
                        context.name = newName;
                    }
                });
                intent.setResponseContexts(contexts);
            })
        }
    }
}