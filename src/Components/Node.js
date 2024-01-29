import React, { useCallback, useState } from 'react'
import { Handle, Position } from 'reactflow'
import 'reactflow/dist/style.css';
import "./styles/node.css"

const handleStyle = { left: 10 };

export default function Node(props) {
    const [editing, setEditting] = useState(false)
    const [nodeLabel, setNodeLabel] = useState("Click Here to edit")

    const handleTextClick = () => {
      setEditting(true)
      document.getElementById('text')?.focus()
    }

    const onChange = evt => {
          setNodeLabel(evt.target.value)
    }

    return (
      <div>
          <Handle type='target' position={Position.Top} />
          <div className='node'>
            {!editing ? <p onClick={handleTextClick}>{nodeLabel}</p> : 
             <><input autoFocus id="text" name="text" value={nodeLabel} onKeyDown={(e) => {
              if (e.key == "Enter") {
                console.log("Enter is pressed")
                setEditting(false)
              }
            }} onChange={onChange} className="nodrag" /> <br />
            <em style={{ color: "#aaa", fontSize: "10px" }}>Press enter to confirm changes.</em>
            </>}
            <div className='btn-row'>
              <span onClick={() => props.addNewNode({id: props.id,xPos: props.xPos, yPos: props.yPos})} className='btn'>+</span>
              <span onClick={() => props.addBranchNode({id: props.id,xPos: props.xPos, yPos: props.yPos})} className='btn'>++</span>
              <span onClick={() => props.removeNode(props.id)} className='btn'>X</span>
            </div>
          </div>
          <Handle type="source" position={Position.Bottom} id="a" />
      </div>
    )
}
