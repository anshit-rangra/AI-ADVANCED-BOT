# 🤖 Vidya and AI – Your AI Learning Companion

**Vidya and AI** is an AI-powered application built using **LLMs** (Large Language Models), inspired by Gemini. It leverages **short-term and long-term memory** with **vector databases**, **RAG pipelines**, and integrates **Pinecone** with **MongoDB** to deliver smart, context-aware responses.  

The app is built with **React.js** on the frontend and **Express.js** on the backend.

---

## 🚀 Project Overview

Vidya and AI is designed to act as a learning assistant, helping users interact with AI in a conversational way:

- Short-term memory stores recent interactions for context during a session.  
- Long-term memory retains knowledge across sessions using a **vector database** for better context understanding.  
- Retrieval-Augmented Generation (RAG) pipelines are used to fetch relevant knowledge from the database to improve response accuracy.  
- LLM is accessed via **Gemini free API key** for processing natural language queries.  

This setup ensures intelligent and context-aware interactions similar to advanced AI assistants.

---

## 🧠 How It Works

1. User interacts with Vidya and AI via chat interface (frontend built with React).  
2. User input is sent to the backend (Express.js) for processing.  
3. **Short-term memory** handles session-specific context.  
4. **Long-term memory** queries the **Pinecone vector database** for relevant prior knowledge.  
5. RAG pipeline combines knowledge from MongoDB + vector search results.  
6. LLM (Gemini API) generates context-aware responses.  
7. Responses are sent back to the frontend for display.  

---

## 🛠️ Tech Stack

| Layer | Technology Used |
|-------|------------------|
| Frontend | React.js |
| Backend | Express.js |
| Database | MongoDB + Pinecone (Vector DB) |
| AI | LLM via Gemini API |
| Memory | Short-term & Long-term memory with RAG pipeline |
| Hosting | Free hosting (Vercel / Render) |

---

## 🌐 Hosted Link

🔗 **Live App:** [https://ai-advanced-bot.onrender.com](https://ai-advanced-bot.onrender.com)

> ⚠️ **Note:** This app uses free hosting, so sometimes the server might be temporarily turned off. If the app doesn’t load, please keep trying and reload after a few seconds.  

---

## 💡 Features

- **Conversational AI** using LLM (Gemini API).  
- **Short-term memory** stores recent conversation for context.  
- **Long-term memory** allows persistent learning using Pinecone + MongoDB.  
- **RAG pipeline** fetches relevant knowledge from database to generate accurate answers.  
- **Interactive UI** built with React for smooth chat experience.  

---
