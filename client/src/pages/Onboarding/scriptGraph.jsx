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
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
`;

const ErrorMessage = styled.div`
  background: #ff4444;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  opacity: ${props => props.show ? '1' : '0'};
  transition: opacity 0.3s ease;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const GraphBuilder = ({ scriptData }) => {
  const [colourRot, setColourRot] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentNode, setCurrentNode] = useState(null);

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#FFA500', '#8E44AD', '#2980B9', '#27AE60'];
    return colors[colourRot % colors.length];
  };

  const createInitialNode = (key, index) => ({
    id: key,
    data: { 
      label: scriptData.scripts[key].name, 
      description: scriptData.scripts[key].description,
      heading: scriptData.scripts[key].heading 
    },
    position: { x: Math.random() * 250, y: Math.random() * 250 },
    draggable: true,
    style: {
      background: getRandomColor(),
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #555',
      width: 150,
    },
  });

  const initialNodes = Object.keys(scriptData.scripts).map(createInitialNode);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  const onNodeClick = (_, node) => {
    setColourRot(colourRot + 1);
    setNodes(nodes.map(n => {
      if (n.id === node.id) {
        return {
          ...n,
          style: {
            ...n.style,
            background: getRandomColor(),
          }
        };
      }
      return n;
    }));
  };

  const checkNodeEdges = (nodeId, edgeType, edges) => {
    const connections = edges.filter(edge => 
      edgeType === 'incoming' ? edge.target === nodeId : edge.source === nodeId
    );
    return {
      count: connections.length,
      hasConnection: connections.length > 0
    };
  };

  const canCreateConnection = (sourceId, targetId, edges) => {
    const outgoingEdges = checkNodeEdges(sourceId, 'outgoing', edges);
    const incomingEdges = checkNodeEdges(targetId, 'incoming', edges);

    if (outgoingEdges.count >= 1) {
      showErrorMessage(`Node '${sourceId}' already has an outgoing connection`);
      return false;
    }
    if (incomingEdges.count >= 1) {
      showErrorMessage(`Node '${targetId}' already has an incoming connection`);
      return false;
    }

    return true;
  };

  const onConnect = (params) => {
    if (!canCreateConnection(params.source, params.target, edges)) {
      return;
    }

    setEdges((eds) => {
      const newEdges = addEdge({
        ...params,
        animated: true,
        style: { stroke: '#fff' }
      }, eds);
      const partitions = createPartitions(newEdges);
      console.log(partitions);
      return newEdges;
    });
  };

  const createPartitions = (edges) => {
    const partitions = {};
    const colorGroups = {};
  
    nodes.forEach(node => {
      const color = node.style.background;
      if (!colorGroups[color]) {
        colorGroups[color] = [];
      }
      colorGroups[color].push(node.id);
    });

    Object.keys(colorGroups).forEach((color, index) => {
      const partitionKey = `partition${index + 1}`;
      partitions[partitionKey] = {};
  
      colorGroups[color].forEach(nodeId => {
        const outgoingEdge = edges.find(edge => edge.source === nodeId);
        const nextNodeId = outgoingEdge ? outgoingEdge.target : null;
  
        partitions[partitionKey][nodeId] = {
          nextEventId: nextNodeId
        };
      });
    });
  
    console.log(JSON.stringify(partitions, null, 2));
    return partitions;
  };

  const handleClick = () => {
    const partitions = createPartitions(edges);
    console.log(partitions);
    fetch('http://localhost:3001/api/onboarding/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(partitions)
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  const handleHover = (event, node) => {
    setCurrentNode(node);
  }

  const handleHoverExit = () => {
    setCurrentNode(null);
  }
  
  const DisplayPanel = ({ node }) => {
    if (!node) return null;

    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: '#333',
        color: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        maxWidth: '300px',
        zIndex: 10,
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{node.data.label}</h3>
        <p style={{ margin: '0 0 5px 0' }}><strong>Description:</strong> {node.data.description}</p>
        <p style={{ margin: '0' }}><strong>Heading:</strong> {node.data.heading}</p>
      </div>
    );
  };

  return (
    <>
    <Container>
      <h1>Script Graph</h1>
      {showError && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <GraphContainer>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodesDraggable
          nodesConnectable
          className="node"
          onNodeMouseEnter={handleHover}
          onNodeMouseLeave={handleHoverExit}
        >
          <MiniMap 
            nodeColor={node => node.style?.background || '#fff'}
            maskColor="rgba(0, 0, 0, 0.2)"
          />
          <Controls />
          <Background color="#666" gap={16} />
        </ReactFlow>
      </GraphContainer>
      <button onClick={handleClick}>Click to Send</button>
      <DisplayPanel node={currentNode} />
    </Container>
    </>
    
  );
};

export default GraphBuilder;