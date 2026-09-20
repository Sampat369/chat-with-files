import chromadb
from sentence_transformers import SentenceTransformer


# Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")


# Create persistent ChromaDB database
client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection(
    name="file_documents"
)


def add_chunks(chunks, file_path):
    documents = []
    ids = []
    metadatas = []

    for i, chunk in enumerate(chunks):
        documents.append(chunk)
        ids.append(f"{file_path}_{i}")

        metadatas.append({
            "file": str(file_path),
            "chunk": i
        })

    if documents:
        embeddings = embedding_model.encode(documents).tolist()

        collection.add(
            documents=documents,
            embeddings=embeddings,
            ids=ids,
            metadatas=metadatas
        )


def search_chunks(query, n_results=5):
    query_embedding = embedding_model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=n_results
    )

    return results