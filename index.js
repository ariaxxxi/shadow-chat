
const { Configuration, OpenAIApi } = require('openai');


const configuration = new Configuration({
    organization: "org-3SX3WVjicXNKuqgqYY71R2T8",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);


// A express server, which will handle api request coming in and respond back with a json object, it will use body parser as well as cross 


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/', async (req, res) => {
    const { message } = req.body;
    // const response = await openai.createCompletion({
    //     "model": "text-davinci-003",
    //     "prompt": `Generate a story for children based on ${message}, and pretend you are a graphic designer generating creative for stable diffusion. Stable diffusion is an app that can generate AI art from prompts. Give me 5 long prompts that matches to each sentence in the story that I can feed into stable diffusion, but do not generate the object described in message, generate prompts for background image only.Make sure they are creative and descriptive. Example: Topic: Allien. Robert was bored of sitting around waiting for his sister to finish her homework, so he decided to go outside and play in the garden. Wearily, he plopped himself down on the grass and stared grumpily up at the sky, before realising that there was something strange up there. “What on earth is that?” he yelled, terrified, as the strange object zoomed down until it was only a few feet away, revealing rows and rows of weird green faces staring at him out of grey, circular windows. Suddenly, he heard a call, “Roooo-bert”, and, blinking, turned his head to gabble at his sister in shock, but when he turned back, the spaceship was gone!  Had it ever really been there at all? Topic: ${message}. Five-Sentence Children Story:`, 

    //     "max_tokens": 250,
    //     "temperature": 1
    // });

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content": "You are a children story writer and designer that creates fairy tales for kids and generates stable diffusion prompt based on that story."},
          {"role": "user", "content": "Create a 5-sentence children story that has the main character of a duck and generate 5 prompts for stable diffusion."},
          {"role": "assistant", "content": "Rudy the cat was always up for an adventure. One morning, he wandered out of the house and into the garden, imersed in the sights and smells around him. Just then, he heard a rustling noise and he immediately assumed the worst; cats did not usually come by these parts! Bewildered, Rudy warily stepped forward, expecting danger, but what he saw astonished him - out from the undergrowth stepped a majestic lion! Rudy couldn't believe his eyes; the lion merely glanced at him with a gentle smile before bounding away! Rudy's heart was beating fast with excitement and he was filled with awe and reverence for this wonderful creature.\n Prompts:\n 1. A sun-dappled garden scene with soft touches of bright foliage.\n 2. Glinting beams of morning sunlight, cascading through the trees.\n 3. A fuzzy, out of focus view of some tall grass and wildflowers.\n 4. A peaceful river, winding under the shade of willow trees.\n 5. A magical meadow filled with colorful wildflowers and butterflies."},
          {"role": "user", "content": "Create a 5-sentence children story that has the main character of a "+`${message}` + " and generate 5 prompts for stable diffusion."},
    ],
        temperature: 0.9,
        max_tokens: 500,
        presence_penalty: 0,
        frequency_penalty: 0,
    })
        

    //const textResponse = response.data.choices[0].text;
    const textResponse = response.data.choices[0].message?.content;
    console.log(textResponse)


    const [originalStory, promptString] = textResponse.split('Prompts:');
    const story = "Click Next to start the story. " + originalStory;
    const sentences = story.split(/[\.\?!]['"]?\s+/);
    const imagePrompt = promptString.split('\n').slice(1).map(prompt => prompt.trim());
    imagePrompt.unshift("Prompt:");

    console.log(sentences)
    console.log(imagePrompt)

    const responseData = { textResponse, imagePrompt, sentences, story };
    if(textResponse){
        res.json({message: responseData})
    }


});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
