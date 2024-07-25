import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from '@langchain/core/output_parsers'
import { retriever } from './utils/retriever.js'
import { combineDocuments } from './utils/combineDocuments.js'
import { ChatAnthropic } from "@langchain/anthropic"
import { RunnableSequence } from "@langchain/core/runnables"

import dotenv from 'dotenv'
dotenv.config()

const prompt1 = PromptTemplate.fromTemplate(
    `What is the city {person} is from? Only respond with the name of the city.`
  );
  const prompt2 = PromptTemplate.fromTemplate(
    `What country is the city {city} in? Respond in {language}.`
  );
  
const openAIApiKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })
  
  const chain = prompt1.pipe(llm).pipe(new StringOutputParser())
  
  const combinedChain = RunnableSequence.from([
    {
      city: chain,
      language: (input) => input.language,
    },
    prompt2,
    llm,
    new StringOutputParser(),
  ]);
  
  const result = await combinedChain.invoke({
    person: "Obama",
    language: "English",
  });
  
  console.log('RES', result);