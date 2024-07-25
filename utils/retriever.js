import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import { createClient } from '@supabase/supabase-js'

const SUPERBASE_API_KEY = "SUPERBASE_API_KEY"
const SUPABASE_URL_LC_CHATBOT = "https://uvoileuzxgajgexcxups.supabase.co"

const openAIApiKey = "openAIApiKey"

const embeddings = new OpenAIEmbeddings({ openAIApiKey })

const client = createClient(SUPABASE_URL_LC_CHATBOT, SUPERBASE_API_KEY)

const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'parent_polcy',
    queryName: 'match_documents_new'
})

const retriever = vectorStore.asRetriever()
console.log('Retriever', retriever)

export { retriever }