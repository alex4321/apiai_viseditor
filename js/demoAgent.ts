/// <reference path="apiai.ts" />

(function () {
    window['demoAgent'] = new ApiAi.Agent(
        {
            "language": "ru",
            "enabledDomainFeatures": [],
            "defaultTimezone": "Europe/Moscow",
            "customClassifierMode": "use.after",
            "mlMinConfidence": 0.2
        },
        [
            {
                "userSays": [
                    {
                        "id": "c353e4d8-886c-4ae2-bd86-cf01a4dd3dcd",
                        "data": [{"text": "Какие технологии применены в тебе?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "3d3ea05f-9423-4e19-8433-af4c0d4b392d",
                        "data": [{"text": "Расскажи о используемых в тебе технологиях"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "a19cd30f-74e6-49eb-96e5-145f0aa841e1",
                        "data": [{"text": "Расскажи о своём устройстве"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "3ee8cbcf-ddf1-4576-a1d0-8482ed04df89",
                        "data": [{"text": "Как ты устроен"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "e10f044a-9328-4303-a4a7-7c033f88a432",
                        "data": [{"text": "Кто ты"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "f0febfd0-82a4-4c12-9d67-6647828110dc",
                        "data": [{"text": "Что ты такое"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "717f154f-0a0c-4506-9d06-f588405099ea",
                        "data": [{"text": "Можете рассказать о себе?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "25601050-9084-4172-b9d3-000ac85cd109",
                        "data": [{"text": "Расскажите о себе"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "data": [
                            {
                                "text": "What are you"
                            }
                        ],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "3cc273b2-5108-4e6c-baf1-8ff35d69b0f4",
                        "data": [{"text": "Поговорим о тебе"}],
                        "isTemplate": false,
                        "count": 0
                    }
                ],
                "id": "fdcca689-4129-4408-b509-6c2d6a2187cf",
                "name": "about",
                "auto": true,
                "contexts": [],
                "responses": [
                    {
                        "resetContexts": false,
                        "affectedContexts": [{"name": "aboutcontext,", "lifespan": 5}],
                        "parameters": [],
                        "messages": [
                            {"type": 0, "speech": "Я - основанный на api.ai чатбот. Могу помочь чем-то ещё?"}
                        ]
                    }
                ],
                "priority": 500000,
                "webhookUsed": false,
                "webhookForSlotFilling": false,
                "fallbackIntent": false,
                "events": []
            },
            {
                "userSays": [
                    {
                        "id": "d97ff00c-43e2-4d88-88c3-65c67e9e49eb",
                        "data": [{"text": "Какой сервис?"}],
                        "isTemplate": false,
                        "count": 1
                    },
                    {
                        "id": "56cd90bf-a4d0-4a23-ac68-6b6582ce7dd1",
                        "data": [{"text": "Расскажи о используемом сервисе"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "6e75815f-4506-400a-839c-fd2bd6df760d",
                        "data": [{"text": "Что за api.ai"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "d57af654-a1c2-4b10-8b06-3e56adaa6093",
                        "data": [{"text": "Что такое api.ai"}],
                        "isTemplate": false,
                        "count": 0
                    }
                ],
                "id": "a2a15710-8092-4524-95a7-2eea6902fa12",
                "name": "api_ai",
                "auto": true,
                "contexts": [
                    "aboutcontext,"
                ],
                "responses": [
                    {
                        "resetContexts": false,
                        "affectedContexts": [],
                        "parameters": [],
                        "messages": [
                            {
                                "type": 0,
                                "speech": ["api.ai - сервис, который может быть применен для создания ботов с NLP."]
                            }
                        ]
                    }
                ],
                "priority": 500000,
                "webhookUsed": false,
                "webhookForSlotFilling": false,
                "fallbackIntent": false,
                "events": []
            },
            {
                "userSays": [
                    {
                        "id": "5417e62d-f703-4538-8277-c161bebd39ec",
                        "data": [{"text": "Не моросит?"}],
                        "isTemplate": false,
                        "count": 1
                    },
                    {
                        "id": "fa53b244-600c-4ed1-9567-db749d60e940",
                        "data": [{"text": "Будет ли метель?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "23b046d0-cb8f-4481-82a7-f6d0502f29f7",
                        "data": [{"text": "Какая ожидается влажность?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "077877c8-a14b-4e0a-b27d-5f7b5f38c18b",
                        "data": [{"text": "Будет ли влажная погода?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "47d00361-86e8-4500-a8b1-e5758ce6a790",
                        "data": [{"text": "Будет ли ветрено?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "7d333fb4-2c36-4065-a1e5-9486fd92d298",
                        "data": [{"text": "Будет сухо?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "8b759ff3-2fb7-416b-8d17-d3cc25981aff",
                        "data": [{"text": "Мы ожидаем снегопада?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "8a2f71c9-d453-4bc4-9c34-21bf4243bf71",
                        "data": [{"text": "Будет сильный ветер?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "56f5e77a-4d5b-42de-8a99-ddfe688f0b5f",
                        "data": [
                            {
                                "text": "Будет ли дождь?"
                            }
                        ],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "53d4c755-9c62-44ca-94e5-73255ac5e598",
                        "data": [{"text": "Будет ли у нас много снега?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "a028c2c9-a52d-4ec8-9723-db7247087b58",
                        "data": [{"text": "Сейчас солнечно?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "dd5c047c-7d99-4aa4-adc5-8c2452d9afa9",
                        "data": [{"text": "Сейчас облачно?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "2243b0e5-e967-45e8-8da5-e562265d81fc",
                        "data": [{"text": "Когда дождь утихнет?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "ccc946a5-4e30-4c7b-ab30-5233f21adaa0",
                        "data": [{"text": "Будет солнечно?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "455dfd2a-0a07-4cfc-b532-d41b345e7bbb",
                        "data": [{"text": "Какой прогноз насчёт снега?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "79b32e54-a57d-4dd4-bbdf-b0135ad6a98d",
                        "data": [{"text": "Сколько снега мы ждем?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "09d70cb9-ec1a-46a6-a512-9b0f50c5fc2d",
                        "data": [{"text": "Выпадет сильный дождь?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "505bf8fd-a592-4b05-be9f-90881b935fcc",
                        "data": [{"text": "Будет ли облачно?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "61443353-0da8-485b-b59b-b843d169b9e8",
                        "data": [{"text": "Будет пасмурно?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "3e9d4afb-d9be-4892-b6c5-e1864d278453",
                        "data": [{"text": "Будет солнечная погода?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "367cc497-4285-42c9-b473-3aac11cd9fc4",
                        "data": [{"text": "Каковы шансы на дождь?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "288f9d31-51ff-42d4-8e28-d404d3d519c7",
                        "data": [{"text": "Получим ли мы снег?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "d0e0ba7c-70c6-4815-a1b1-8289ec1e534b",
                        "data": [{"text": "Будет ли дождь "}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "9e4a35de-0478-42f8-8d6b-3a4a52100117",
                        "data": [{"text": "ветрено?"}],
                        "isTemplate": false,
                        "count": 0
                    }
                ],
                "id": "a53469a4-c034-4aea-925e-a800bdf01e16",
                "name": "conditions",
                "auto": true,
                "contexts": [],
                "responses": [
                    {
                        "resetContexts": false,
                        "action": "conditions",
                        "affectedContexts": [],
                        "parameters": [
                            {
                                "required": true,
                                "dataType": "@sys.geo-city",
                                "name": "geo-city",
                                "value": "$geo-city",
                                "prompts": ["Укажите город"],
                                "isList": false
                            }
                        ],
                        "messages": [{"type": 0,"speech": "Укажите название города"}]
                    }
                ],
                "priority": 500000,
                "webhookUsed": true,
                "webhookForSlotFilling": false,
                "fallbackIntent": false,
                "events": []
            },
            {
                "userSays": [],
                "id": "b8ed98a4-7e54-4245-a4ff-7a588e7d36be",
                "name": "Default Fallback Intent",
                "auto": false,
                "contexts": [],
                "responses": [
                    {
                        "resetContexts": false,
                        "action": "input.unknown",
                        "affectedContexts": [],
                        "parameters": [],
                        "messages": [{"type": 0,"speech": "В данный момент я не могу обработать ваш запрос"}]
                    }
                ],
                "priority": 500000,
                "webhookUsed": false,
                "webhookForSlotFilling": false,
                "fallbackIntent": true,
                "events": []
            },
            {
                "userSays": [],
                "id": "39854ba4-d163-4a6a-9d76-f3ac920c58d4",
                "name": "Default Welcome Intent",
                "auto": true,
                "contexts": [],
                "responses": [
                    {
                        "resetContexts": false,
                        "action": "input.welcome",
                        "affectedContexts": [],
                        "parameters": [],
                        "messages": [{"type": 0, "speech": ["Привет!", "Здравствуй!", "Добрый день!"]}]
                    }
                ],
                "priority": 500000,
                "webhookUsed": false,
                "webhookForSlotFilling": false,
                "fallbackIntent": false,
                "events": [{"name": "WELCOME"}]
            },
            {
                "userSays": [
                    {
                        "id": "338fee88-90f3-4954-8b03-bc33dcfeed30",
                        "data": [{"text": "Прохладно"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "a4df3002-562d-4de5-8f4c-577327b7ebca",
                        "data": [{"text": "Холодно?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "2754a27e-7476-451e-9ea2-d0b184369bb9",
                        "data": [{"text": "Тепло?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "f30bc22d-8e6f-42be-8992-1694a274d977",
                        "data": [{"text": "Когда жара спадет"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "ce11cc79-b72b-47ef-a746-dbb7c2d637e9",
                        "data": [{"text": "Какова ожидаемая температура"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "a858b951-0f4d-4c28-a791-1d065ed2368c",
                        "data": [{"text": "Будет ли это быть неприятно холодно?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "e08797ff-6846-4ff8-bc50-857c4242ac20",
                        "data": [{"text": "На улице холодно"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "fc3c1f94-037f-4eaf-aec3-5c4beca3267d",
                        "data": [{"text": " Как холодно сегодня"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "d9e8d4f7-0c93-4039-98e9-5f66e28b1dca",
                        "data": [{"text": "Будет жарко?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "f218ba80-62c1-4e87-a2cc-1e65b5d3c3d3",
                        "data": [{"text": "Не жарко?"}],
                        "isTemplate": false,
                        "count": 0
                    },
                    {
                        "id": "37f64058-3328-4fe6-9233-a01e96c7a37c",
                        "data": [{"text": "Как жарко сегодня"}],
                        "isTemplate": false,
                        "count": 0
                    }
                ],
                "id": "6db777f5-7aff-407c-9429-b35129e594a6",
                "name": "temperature",
                "auto": true,
                "contexts": [],
                "responses": [
                    {
                        "resetContexts": false,
                        "action": "temperature",
                        "affectedContexts": [],
                        "parameters": [
                            {
                                "dataType": "@sys.date",
                                "name": "date",
                                "value": "$date",
                                "isList": false
                            },
                            {
                                "required": true,
                                "dataType": "@sys.geo-city",
                                "name": "geo-city",
                                "value": "$geo-city",
                                "prompts": [
                                    "Укажите город"
                                ],
                                "isList": false
                            }
                        ],
                        "messages": [{"type": 0,"speech": "Укажите название города"}]
                    }
                ],
                "priority": 500000,
                "webhookUsed": true,
                "webhookForSlotFilling": false,
                "fallbackIntent": false,
                "events": []
            }
        ]);
}) ();