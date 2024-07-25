import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from '@langchain/core/output_parsers'
import { retriever } from './utils/retriever.js'
import { combineDocuments } from './utils/combineDocuments.js'
import { ChatAnthropic } from "@langchain/anthropic"
import { RunnableSequence } from "@langchain/core/runnables"

import dotenv from 'dotenv'
dotenv.config()


const openAIApiKey = process.env.OPENAI_API_KEY
const llm = new ChatOpenAI({ openAIApiKey })

const standaloneQuestionTemplate = 'Given a question, convert it to a standalone question. question: {question} standalone question:'

const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question about parents and school based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email help@scrimba.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
context: {context}
question: {question}
answer:
`

const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)

const chain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever).pipe(combineDocuments).pipe(answerPrompt)
console.log('chain', chain)
const response = await chain.invoke({
    question: 'What are the parents involvement?'
})

console.log('Response', response)