import React, { useState } from 'react';
import ReactFlow, { 
    MiniMap, 
    Controls, 
    Background, 
    addEdge,
    useNodesState,
    useEdgesState,
} from 'react-flow-renderer';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #282c34;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const GraphContainer = styled.div`
  width: 80%;
  height: 80%;
  background: #1e1e2f;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
`;

const AdjacencyMatrix = styled.pre`
  margin-top: 20px;
  padding: 10px;
  background: #333;
  border-radius: 5px;
  color: #bada55;
  height: 200px;
`;

const GraphBuilder = ({ scriptData }) => {
  const initialNodes = Object.keys(scriptData.scripts).map((key, index) => ({
    id: key,
    data: { label: key },
    position: { x: Math.random() * 250, y: Math.random() * 250 },
    draggable: true,
  }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [adjacencyMatrix, setAdjacencyMatrix] = useState({});

  const updateAdjacencyMatrix = (edges) => {
    const matrix = {};
    nodes.forEach((node) => {
      matrix[node.id] = nodes.map((n) => 0);
    });
    edges.forEach((edge) => {
      const sourceIndex = nodes.findIndex((n) => n.id === edge.source);
      const targetIndex = nodes.findIndex((n) => n.id === edge.target);
      if (sourceIndex !== -1 && targetIndex !== -1) {
        matrix[edge.source][targetIndex] = 1;
      }
    });
    setAdjacencyMatrix(matrix);
  };

  const onConnect = (params) => {
    setEdges((eds) => {
      const newEdges = addEdge(params, eds);
      updateAdjacencyMatrix(newEdges);
      return newEdges;
    });
  };

  return (
    <Container>
      <h1>Script Graph</h1>
      <GraphContainer>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange} // Track node changes for drag events
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          style={{ background: '#282c34' }}
        >
          <MiniMap />
          <Controls />
          <Background color="#888" gap={16} />
        </ReactFlow>
      </GraphContainer>
      <AdjacencyMatrix >
        <h2>Adjacency Matrix:</h2>
        {JSON.stringify(adjacencyMatrix, null, 2)}
      </AdjacencyMatrix>
    </Container>
  );
};

export default GraphBuilder;