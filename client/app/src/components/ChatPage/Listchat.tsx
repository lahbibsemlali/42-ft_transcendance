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
  idUser: number;
  onChildClick?: (param1: number, param2: boolean, param3: boolean, param4: boolean, param5: boolean, param6: boolean, param7: number) => void;
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
  idUser,
}) => {

  const handleClick = () => {
    if (onChildClick) {
      onChildClick(id, isGroup, isAdmin, isProtected, isMuted, isOwner, idUser);
    }
  };

  let stat = false;
  if (status)
    stat = true;

  return (
    <div className="listchat" onClick={handleClick}>
      <div className="imgchat">
        {isGroup ? <img
          src="https://pics.craiyon.com/2023-11-24/nogjsbGmTRaAI8eYNclAQw.webp"
          style={{
            width: "100px",
            display: "block",
            height: "auto",
          }}
        /> : <img
        src={url}
        style={{
          width: "100px",
          display: "block",
          height: "auto",
        }}
      />}
      </div>
      {stat && !isGroup && (
        <i style={{ color: "#00ff2a" }} className="fa-solid fa-circle stat"></i>
      )}
      {!stat  && !isGroup && (
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
