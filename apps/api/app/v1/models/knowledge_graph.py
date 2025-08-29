"""Knowledge Graph schema and validation utilities."""

from typing import Optional

import jsonschema
from jsonschema import ValidationError

# JSON Schema for knowledge graph validation
KNOWLEDGE_GRAPH_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
        "nodes": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "data": {
                        "type": "object",
                        "properties": {"label": {"type": "string"}},
                        "required": ["label"],
                        "additionalProperties": False,
                    },
                },
                "required": ["id", "data"],
                "additionalProperties": False,
            },
        },
        "edges": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "data": {
                        "type": "object",
                        "properties": {"label": {"type": "string"}},
                        "required": ["label"],
                        "additionalProperties": False,
                    },
                    "source": {"type": "string"},
                    "target": {"type": "string"},
                },
                "required": ["id", "data", "source", "target"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["nodes", "edges"],
    "additionalProperties": False,
}


def validate_knowledge_graph(knowledge_graph_data: Optional[dict]) -> None:
    """Validate knowledge graph data against the schema.

    Args:
        knowledge_graph_data: The knowledge graph data to validate

    Raises:
        ValueError: If the data doesn't match the schema
    """
    if knowledge_graph_data is not None:
        try:
            jsonschema.validate(
                instance=knowledge_graph_data, schema=KNOWLEDGE_GRAPH_SCHEMA
            )
        except ValidationError as e:
            raise ValueError(f"Invalid knowledge graph format: {e.message}") from e


def create_empty_knowledge_graph() -> dict:
    """Create an empty knowledge graph with the correct structure.

    Returns:
        dict: Empty knowledge graph with nodes and edges arrays
    """
    return {"nodes": [], "edges": []}


def is_valid_knowledge_graph(knowledge_graph_data: Optional[dict]) -> bool:
    """Check if knowledge graph data is valid without raising an exception.

    Args:
        knowledge_graph_data: The knowledge graph data to validate

    Returns:
        bool: True if valid, False otherwise
    """
    try:
        validate_knowledge_graph(knowledge_graph_data)
        return True
    except ValueError:
        return False
