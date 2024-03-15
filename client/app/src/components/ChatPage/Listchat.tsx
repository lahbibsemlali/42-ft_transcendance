type ListchatProps = {
  id: number;
  isGroup: boolean;
  isAdmin: boolean;
  isOwner: boolean,
  url: string;
  name: string;
  last: string;
  status: number;
  isProtected: boolean;
  isMuted: boolean;
  onChildClick?: (param1: number, param2: boolean, param3: boolean, param4: boolean, param5: boolean, param6: boolean) => void;
};

const Listchat: React.FC<ListchatProps> = ({
  id,
  isGroup,
  isAdmin,
  isOwner,
  name,
  url,
  last,
  onChildClick,
  status,
  isProtected,
  isMuted,
}) => {

  const handleClick = () => {
    if (onChildClick) {
      onChildClick(id, isGroup, isAdmin, isProtected, isMuted, isOwner);
    }
  };

  let stat = false;
  if (status)
    stat = true;

  const isgroup = false;

  return (
    <div className="listchat" onClick={handleClick}>
      <div className="imgchat">
        <img
          src="/group5.jpeg"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            display: "block",
            height: "auto",
          }}
        />
      </div>
      {stat && !isgroup && (
        <i style={{ color: "#00ff2a" }} className="fa-solid fa-circle stat"></i>
      )}
      {!stat  && !isgroup && (
        <i style={{ color: "red" }} className="fa-solid fa-circle stat"></i>
      )}
      <div className="text-container">
        <div className="chat-name" style={{ fontSize: "30px" }}>
          {name}
        </div>
        <div className="last-msg">{last.substring(0, 15)}</div>
      </div>
    </div>
  );
};

export default Listchat;
