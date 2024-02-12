import React from 'react'

type Props = {}

const DropdownMenu = (props: Props) => {
  return (
    <div>
        <div className="dropdown-content">
            <button style={{border: "none", backgroundColor: "transparent"}}>Mute</button>
        </div>
    </div>
  )
}

export default DropdownMenu
