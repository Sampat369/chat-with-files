import ollama


MODEL = "qwen3:4b"


def ask_llm(question, context):
    prompt = f"""
You are a local AI assistant that answers questions about a user's files.

Use ONLY the information provided in the context below.

If the answer cannot be found in the context, say:
"I couldn't find that information in the files."

Do not make up information.

CONTEXT:
{context}

QUESTION:
{question}

ANSWER:
"""

    response = ollama.chat(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]