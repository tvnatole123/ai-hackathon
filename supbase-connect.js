import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { promises as fsPromises } from 'fs';

import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import dotenv from 'dotenv'
dotenv.config()

try {
    const text = await fsPromises.readFile('./large_document.txt', 'utf-8')

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        separators: ['\n\n', '\n', ' ', ''],
        chunkOverlaps: 50
    })
    const output = await splitter.createDocuments([text])

    const sbApiKey = process.env.SUPERBASE_API_KEY
    const sbUrl = process.env.SUPABASE_URL_LC_CHATBOT
    const openAIApiKey = process.env.OPENAI_API_KEY
    const client = createClient(sbUrl, sbApiKey)

    await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings( {openAIApiKey} ),
        {
            client,
            tableName: 'parent_policy',
            insertColumns: ['content', 'embedding', 'metadata']
        }
    )
    console.log(output)
} catch (err) {
    console.log(err)
}