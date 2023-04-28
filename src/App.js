// Create a react component that inputs a text area message then performs a fetch request to localhost:3001 gets back a response as a data.message and displays that message in a box below

import React, { useState } from 'react';
import './App.css'; 
import axios from "axios"
import {
    ChakraProvider, Heading, Container, Text, Button, Input, Image
} from "@chakra-ui/react"

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [image, updateImage] = useState('');
  const [prompt, updatePrompt] = useState('');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  // const [story, setStory] = useState(response.story);
  const [sentences, setSentences] = useState(["Create your story!"]);

  const imagePrompt = response.imagePrompt
  const story = response.story

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => setResponse(data.message));

  };

  

  function updateSentences(){
    if (story == undefined){
      setSentences(["Story time! Click Next to start the story."])
    }
    else{
      setSentences(story.split(/[\.\?!]['"]?\s+/));
    }
  }


  const handleNextClick = () => {
    if (sentenceIndex < 5) {
      setSentenceIndex(sentenceIndex + 1);
    }
  };


  // send to sd to get image
  const generateImage = async prompt =>{
    const imageResult = await axios.get(`http://127.0.0.1:8000/?prompt=${imagePrompt[sentenceIndex+1]} by Asaf Hanuka`)
    updateImage(imageResult.data)
  }

  const Reset = () => {
    
    setSentenceIndex(0);
    setSentences(["Create your story!"])
    setMessage('');
    
  };

 

  return (
    <ChakraProvider>
        <Container>
            <Heading>Chat Shadow</Heading>
            <form onSubmit={handleSubmit}>
                <Input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value) ;
                  updatePrompt(e.target.value);
                  }
                }
                ></Input>
                <Button onClick = {e => {
                  // generateImage(prompt);
                  updateSentences();
                  }} type="submit">Create</Button>
            </form>

            <Button onClick = {e => {
                  handleNextClick();
                  generateImage(prompt);
                  updateSentences();
                  
                }} >Next</Button>

            <Button onClick = {e => {
              Reset();
            }} >Reset</Button>

            {/* <Text>{story}</Text> */}
            <Text>{sentences[sentenceIndex]}</Text>
            {/* <Text>{sentenceIndex}</Text> */}

           {image ?<Image src={`data:image/png;base64,${image}`} alt="image" /> : null} 
          

        </Container>
        </ChakraProvider>
  );
}

export default App
 