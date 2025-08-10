from pydantic import BaseModel
from typing import List


class NodeDataSchema(BaseModel):
    label: str


class NodeSchema(BaseModel):
    id: str
    data: NodeDataSchema


class EdgeDataSchema(BaseModel):
    label: str


class EdgeSchema(BaseModel):
    id: str
    data: EdgeDataSchema
    source: str
    target: str


class KnowledgeGraph(BaseModel):
    nodes: List[NodeSchema]
    edges: List[EdgeSchema]
