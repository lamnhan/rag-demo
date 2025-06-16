# Build a RAG system, an introduction guide for JS developers

https://github.com/user-attachments/assets/6bde9237-8cbe-4291-9d57-dbb2b164af26


# What is RAG?

**RAG**, or **Retrieval-Augmented Generation**, is an AI technique that enhances the output of large language models (LLMs) by incorporating external knowledge bases. Read more: https://en.wikipedia.org/wiki/Retrieval-augmented_generation

A diagram from: https://www.dailydoseofds.com/a-crash-course-on-building-rag-systems-part-2-with-implementations/

![ragdiagram-ezgif com-resize](https://github.com/user-attachments/assets/74edda47-dba8-41a4-9b72-5dae8735114b)

Before diving into more details, let’s quickly review how RAG works:

1. **User query**: A user poses a question or request.
2. **Information retrieval**: The query is used to search a database for relevant information.
3. **Contextual augmentation**: The retrieved information is combined with the original query.
4. **Response generation**: The LLM uses this augmented context to generate a more informed answer.

An article from: https://surrealdb.com/blog/cooking-up-faster-rag-using-in-database-embeddings-in-surrealdb

## Semantical understanding through information retrieval and vector search

Vector search is a crucial component of RAG because it allows for semantic searches based on the meaning of the text, not just keywords. Instead of looking for exact matches, vector search finds the most relevant pieces of information based on the similarity of the embeddings.

**This is important because queries might not have the same keywords as the stored information, but can still be semantically similar.**

## Embeddings and embedding models

Embeddings are numerical representations of text (or other data types) in a high-dimensional vector space. Words, phrases, sentences, or documents with similar meanings are located closer to each other in the vector space. When you perform a vector search, the search query is also converted into an embedding vector.

The database then calculates the distances between this query vector and the embedding vectors of all stored items. **The closest vectors in the embedding space correspond to the most semantically similar items**.

All embedding models are trained on corpuses of data, each algorithm for training an embedding model has different tactics for conceptualizing the data and for optimizing the model to during the training process. Here is a high level overview of some popular modeling techniques.

- **Word-level embeddings**: These models represent individual words as fixed-length vectors, capturing semantic relationships, ex.: *GloVe*, *Word2Vec*, and *FastText*.
- **Contextual embeddings**: These models generate word representations that depend on the surrounding context, capturing nuanced meanings, ex.: *ELMo*, *BERT*, and *RoBERTa*.
- **Sentence embeddings**: These models are designed to create representations for entire sentences or paragraphs, capturing their overall meaning, ex.: *Sentence-BERT*, *Universal Sentence Encoder*, and *SimCSE*.
- **Proprietary embeddings**: These models are available via API service, ex.: OpenAI *text-embedding-3-large*, *gemini-embedding-001*, *voyage-3-large*, *Qwen3-Embedding-8B*, …

## LLMs

Large Language Models (LLMs) are AI systems, specifically deep learning models, trained on vast amounts of text data to understand and generate human-like text. **They can perform various natural language processing tasks like text generation, translation, and answering questions**. LLMs are known for their ability to handle complex language tasks and are often used in generative AI applications.

Top model families include: Google **Gemini/Gemma**, OpenAI **GPT**, Anthropic **Claude**, xAi **Grok**, Meta **Llama**, Alibaba **Qwen**, **DeepSeek**, **Mistral**, ...

![Screenshot 2025-06-09 at 5 57 53 PM](https://github.com/user-attachments/assets/a8d8676a-6247-45e5-9d9b-834a4efd3ac9)

Source: https://artificialanalysis.ai/

# Demo

## Stack overview

- **NodeJS**: is a cross-platform JavaScript runtime environment that executes JavaScript code outside of a web browser. Homepage: https://nodejs.org/en
- **SurrealDB**: is a cloud-native, multi-model database designed for modern applications. It combines the functionalities of a document database, a graph database, and a traditional relational database into a single, unified platform. Homepage: https://surrealdb.com/
- **tRPC**: is a framework for building end-to-end type-safe APIs in TypeScript. It simplifies client-server communication by allowing developers to define APIs with type safety, eliminating the need for manual API route definitions, request validation, and client-side fetching logic. Instead, frontend code can call backend functions as if they were local functions. Homepage: https://trpc.io/
- **Lit**: is a lightweight JavaScript framework focused on building fast, reusable web components using modern web standards like Custom Elements, Shadow DOM, and HTML templates. It's designed to be minimal, efficient, and easily integrated into existing web projects, even those using other frameworks. Homepage: https://lit.dev/
- **OpenAI** models: using [text-embedding-3-small](https://platform.openai.com/docs/models/text-embedding-3-small) for embedding and [gpt-4o-mini](https://platform.openai.com/docs/models/gpt-4o-mini) for answering. Homepage: https://platform.openai.com/docs/overview

## Development

### Project setup

- Install [NodeJS 22.x](https://nodejs.org/en) and [PNPM](https://pnpm.io/) if not already
- Clone the repo at https://github.com/lamnhan/rag-demo
- Install the dependencies by running `pnpm install`
- Rename `.env.sample` to `.env`, and provide [your OpenAI key](https://platform.openai.com/api-keys)

### Scripts introduction

PNPM scripts in the package.json are for local development purpose:

- **dev**: run both the server and client in development mode, via port `5173`
- **build**: build the server and client
- **preview**: preview the production build, via port `4173`

Beside, there are several built-in tools for interacting with the project, using the syntax `pnpm script <cmd> [args]` to run a command, source code at: https://github.com/lamnhan/rag-demo/tree/main/scripts/commands

Here is the brief introduction of the available CLI commands:

- **setup**: init the database schema, ex.: `pnpm script setup`
- **download**: fetch the sample data, ex.: `pnpm script download`
- **insert**: load the downloaded data and upsert sample products , ex.: `pnpm script insert`
- **query**: run a query against the database instance, ex.: `pnpm script query "SELECT id, title FROM products LIMIT 3"`

### Sample products

**A NOTE:** there is a sample set of 1000 products available in the repo under the [./database/raw-samples](https://github.com/lamnhan/rag-demo/tree/main/database/raw-samples) folder, those sample products are picked from the dataset at https://huggingface.co/datasets/milistu/AMAZON-Products-2023.

But, if you want to download more data or change the data picking strategy or choose a different dataset, please modify the `download` command at https://github.com/lamnhan/rag-demo/blob/main/scripts/commands/download.ts, then run the `pnpm script download` command.

### Database instance

For the purpose of demonstration, the app uses [a persisted SurrealKV instance](https://surrealdb.com/docs/sdk/javascript/engines/node) in NodeJS embedded mode, binary is stored in `./database/___surrealdb`.

To initialize the schema, run the `pnpm script setup` command, it will load and prepare the schema from https://github.com/lamnhan/rag-demo/blob/main/database/schema/setup.surql.

To insert the downloaded data to the database, run the `pnpm script insert` command.

Insert completed, run the `pnpm script query "SELECT count() FROM products GROUP ALL"` to verify inserted products, it should show the result:

```jsx
[ [ { count: 1000 } ] ]
```

Want to run more queries against the newly inserted data, please see https://surrealdb.com/docs/surrealql for more details.

### Project architecture

Here is the overview of the system, please see the source code of each components for more details. The below diagram is generated using GitDiagram, see full version at https://gitdiagram.com/lamnhan/rag-demo

1. **Data processing**
    - Internal tools: https://github.com/lamnhan/rag-demo/tree/main/scripts

![Screenshot 2025-06-16 at 6 16 27 PM](https://github.com/user-attachments/assets/36743616-ef31-4ce3-a621-6b26e8ea6162)


2. **The Backend**
    - Database schema: https://github.com/lamnhan/rag-demo/blob/main/database/schema/setup.surql
    - Backend source code: https://github.com/lamnhan/rag-demo/tree/main/server

![Screenshot 2025-06-16 at 6 16 54 PM](https://github.com/user-attachments/assets/156829a6-62ab-41c2-aac4-f64a815628a3)


3. **The Frontend**
    - Frontend source code: https://github.com/lamnhan/rag-demo/tree/main/client

![Screenshot 2025-06-16 at 6 17 44 PM](https://github.com/user-attachments/assets/de859857-9b35-4d82-ad66-c1cc17c233bd)

## Homeworks

Here are some ideas for expanding the demo app further:

1. **Set a SurrealDB server with proper security measures and scalability.**
    - https://surrealdb.com/docs/surrealdb/security
    - https://surrealdb.com/docs/surrealdb/deployment
2. **Implement both keyword search and semantic search in a single data source.**
    - Full-text search: https://surrealdb.com/docs/surrealdb/models/full-text-search
    - Vector search: https://surrealdb.com/docs/surrealdb/reference-guide/vector-search
3. **Add a special thinking mode which allows the model to preprocess a query before retrieving for the relevant products.**
4. **Allow the users to ask for more details about a certain product instead of pure suggestion every time.**
5. **Validate the performance and accuracy with a larger dataset.**
    - For example: 117,243 rows at https://huggingface.co/datasets/milistu/AMAZON-Products-2023
6. **Explore datasets in other languages and try different models.**
    - Datasets: https://huggingface.co/datasets?sort=trending&search=products
    - Models: https://artificialanalysis.ai/
7. **Setup the production deployment and CI/CD pipeline for the Stack.**
