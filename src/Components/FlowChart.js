import React, { useCallback, useMemo, useState } from 'react'
import ReactFlow, { Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState, addNodes, applyNodeChanges, NodeProps } from 'reactflow'
import 'reactflow/dist/style.css';
import Node from './Node';
import {shallow} from "zustand/shallow"
import { useStore } from '../store';

const BRANCH_NODE = "branchNode"
const CUSTOM_NODE = "customNode"

const initialNodes = [{
    id: "id-1",
    position: {
        x: 0, y: 0
    },
    type: "customNode",
    data: {
        label: "Root Node",
        value: 123
    }
}]

const initialEdges = []

const selector = (store) => ({
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange: store.onNodesChange,
    onEdgesChange: store.onEdgesChange,
    addEdge: store.addEdge,
    createNode: store.createNode,
    removeNode: store.removeNode,
})

export default function FlowChart() {
    const store = useStore(selector, shallow)
    const [ nodes, setNodes, onNodesChange ] = useNodesState(initialNodes);
    const [ edges, setEdges, onEdgesChange ] = useEdgesState(initialEdges);

    const addNewNode = (data) => {
        console.log(data)
        store.createNode(CUSTOM_NODE, data.id, data.xPos, data.yPos)
    } 

    const removeNode = (id) => {
        console.log(id)
        store.removeNode(id)
    }

    const addBranchNode = (data) => {
        const node_0 = store.createNode(BRANCH_NODE, data.id, data.xPos, data.yPos)
        const node_1 = store.createNode(CUSTOM_NODE, node_0?.id, node_0?.position?.x, node_0?.position?.y, true, false)
        const node_2 = store.createNode(CUSTOM_NODE, node_0?.id, node_0?.position?.x, node_0?.position?.y, false, true)
    }

    const CustomNode = (props) => {
        // console.log(props)
        return <Node type="customNode" addBranchNode={addBranchNode} addNewNode={addNewNode} removeNode={removeNode} {...props}  />
    }

    const CustomBranchNode = (props) => {
        return <Node type="branchNode" addBranchNode={addBranchNode} addNewNode={addNewNode} removeNode={removeNode} {...props} />
    }

    const nodeTypes = useMemo(() => ({customNode: CustomNode, branchNode: CustomBranchNode}), [])

    const onConnect = useCallback(
        params => setEdges(edgs => addEdge(params, edgs))
        [setEdges]
    )

    

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={store.nodes}
          edges={store.edges}
          onNodesChange={store.onNodesChange}
          onEdgesChange={store.onEdgesChange}
          onConnect={store.addEdge}
          nodeTypes={nodeTypes}
        >
            <MiniMap />
            <Controls />
            <Background variant='dots' gap={12} size={1} />
        </ReactFlow>
    </div>
  )
}


