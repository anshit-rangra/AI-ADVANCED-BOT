const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.VECTOR_DB });


const longmemory = pc.Index('gpt-memory')

async function createMemoryVector({vectors, metadata, messageId}){

    await longmemory.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }])
}

async function getMemoryVector({queryVector , limit=5, metadata}){
    const data = await longmemory.query({
        vector:queryVector, 
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true

    })
    return data.matches;
}

module.exports = {
    createMemoryVector,
    getMemoryVector
}