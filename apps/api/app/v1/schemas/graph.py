from pydantic import BaseModel
from typing import List


class NodeData(BaseModel):
    label: str


class Node(BaseModel):
    id: str
    data: NodeData


class EdgeData(BaseModel):
    label: str


class Edge(BaseModel):
    id: str
    data: EdgeData
    source: str
    target: str


class Graph(BaseModel):
    nodes: List[Node]
    edges: List[Edge]
