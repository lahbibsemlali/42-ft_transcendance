import React from 'react'

type Props = {}

const JoinGroup = (props: Props) => {
    return (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span
                className="close">
              &times;
            </span>
            <input
              style={{ padding: "5px", marginBottom: "5px" }}
              placeholder="NAME"
              type="text"
              maxLength={7}
            />
            <select style={{ width: "20%", margin: "10px" }} id="cars">
              <option  value="volvo">
                public
              </option>
              <option value="saab">
                private
              </option>
              <option  value="opel">
                protected
              </option>
            </select>
            <button style={{ width: "20%" }}>
              Create
            </button>
          </div>
        </div>
      );
}

export default JoinGroup