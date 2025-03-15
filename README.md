# Multi-Modal Next.js Chat App with Vercel AI SDK & LangGraph.js
This multi-modal chat platform, built with LangGraph.js, leverages the Vercel AI SDK to stream interactive React components from the server to the client. Users can ask questions, analyze uploaded images, convert content to audio, generate and download charts, display videos and documentation, provide website links, and create AI-generated images. A key feature is the use of custom LangChain.js callback events, enabling seamless streaming. As seen in the video, a React skeleton/loader component is first streamed to the client, which is then dynamically replaced with the final component—such as a chart or audio—once the server processes the request. The app is highly extensible, allowing for even more powerful integrations.


[LangGraph.js](https://langchain-ai.github.io/langgraphjs/) is a library for building stateful, multi-actor applications with LLMs, used to create agent and multi-agent workflows. Compared to other LLM frameworks, it offers these core benefits; cycles, controllability, and persistence.

[Vercel AI SDK](https://sdk.vercel.ai/) is a set of tools that enables developers to easily integrate AI capabilities, like natural language processing and machine learning, into their applications hosted on the Vercel platform.


![graph image](https://github.com/Ashot72/Multi-Modal-Chat/multimodal.png)

In the diagram, when a user asks a question, the response method depends on the prompt. Simple queries like 'Hi, how are you?' receive a plain text response. However, if the prompt requires tooling—such as 'Generate a video of Mount Ararat'—the appropriate tool, like the image generator, is invoked.

To get started.
```
       # Clone the repository

         git clone https://github.com/Ashot72/Multi-Modal-Chat
         cd Multi-Modal-Chat

       # Create the .env file based on the env.example.txt file and include the respective keys.
       
       # installs dependencies
         yarn install

       # to run locally
         npm run dev
    
       # to run in production mode
         npm run build
         npm start
         
```

Go to [Multi-Modal Next.js Chat App with Vercel AI SDK & LangGraph.js Video](https://youtu.be/6ZWi-TQI-l8) page

Go to [Multi-Modal Next.js Chat App with Vercel AI SDK & LangGraph.js Description](https://github.com/Ashot72/Multi-Modal-Chat/doc.html) page
