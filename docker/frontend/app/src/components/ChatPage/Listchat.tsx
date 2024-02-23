type ListchatProps = {
  url: string;
  name: string;
  last: string;
  status: boolean;
  onChildClick?: (param: string) => void;
};

const Listchat: React.FC<ListchatProps> = ({
  name,
  url,
  last,
  onChildClick,
  status,
}) => {

  const handleClick = () => {
    if (onChildClick) {
      onChildClick(name);
    }
  };

  const isgroup = false;

  return (
    <div className="listchat" onClick={handleClick}>
      <div className="imgchat">
        <img
          src={url}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            display: "block",
            height: "auto",
          }}
        />
      </div>
      {status && !isgroup && (
        <i style={{ color: "#00ff2a" }} className="fa-solid fa-circle stat"></i>
      )}
      {!status  && !isgroup && (
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
