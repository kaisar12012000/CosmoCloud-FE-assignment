import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

export const useStore = create((set, get) => ({
    nodes: [{
        id: "id-1",
        position: {
            x: 0, y: 0
        },
        type: "customNode",
        data: {
            label: "Root Node",
            value: 123
        }
    }],
    edges: [],
    occupied: new Map(),
    onNodesChange(changes) {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
    
    onEdgesChange(changes) {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    
    addEdge(data) {
      const id = nanoid(6);
      const edge = { id, ...data };
    
      set({ edges: [edge, ...get().edges] });
      return id
    },
    createNode(type, prevId = null, prevX = null, prevY = null, l = false, r = false) {
        const id = nanoid()
        const data = { label: "New Node", value: Math.floor(Math.random()*(1000-1)) }

        let x = prevX !== null ? l ? prevX - 150 : r ? prevX +150 : prevX : 150;
        let y = prevY !== null ? prevY + 150 : 150;

        let temp = get().occupied;
        if(get().occupied.get(y)) {
            x += get().occupied.get(y).length*300
            let newArr = get().occupied.get(y)
            newArr.push(x)
            temp.set(y, newArr)
        } else {
            temp.set(y, [x])
        }

        const position = { x: x, y: y }
        set({ nodes : [...get().nodes, {id, data, position, type: type}], occupied: temp })
        if (prevId !== null) {
            const edgeId = nanoid(6);
            const edge = { id: edgeId, source: prevId, target: id };

            if (l) {
                edge.label = "Yes"
            }

            if (r) {
                edge.label = "No"
            }

            set({ edges: [edge, ...get().edges] });
        }
        return ({id, data, position, type: type})
    },
    removeNode(nodeId) {
        const id = nodeId
        const curr = [...get().nodes]
        const node = curr.find(n => n.id === id)
        const index = curr.indexOf(node)

        curr.splice(index, 1)
        
        set({nodes: curr})
    }
}))