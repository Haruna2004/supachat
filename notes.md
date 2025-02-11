# https://developers.facebook.com/docs/whatsapp/cloud-api/get-started

// Whatsapp API setup

# https://chat.deepseek.com/a/chat/s/3ec589f1-b64f-47ea-b6f1-4b9931182d7e

// Brass SDK

# https://docs.trybrass.com/reference/getting-started-with-your-api

Channel integration

# https://app.bird.com/settings/channels?tab=%22channels%22

WORKING

# https://www.gupshup.io/whatsapp/overview?appId=9f7c22ca-c7bc-4ee5-b2a2-667c18d4e809

Docs

# https://docs.gupshup.io/docs/what-is-an-inbound-message

;

```js
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: process.env.AZURE_OPENAI_API_VERSION,


import gupshup from '@api/gupshup';

gupshup.postWaApiV1Msg({message: '{"text":"Welcome to Gupshup","type":"text","previewUrl":false}'})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err))
```
