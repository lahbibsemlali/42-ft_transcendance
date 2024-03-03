type Props = {
  action: number;
  str: string;
  ifMute: boolean;
  onChildClick?: (param1: boolean) => void;
  onChildClick7?: () => void;
};

const MenuBtn = (props: Props) => {
  const handleClick = () => {
    if (props.onChildClick && props.action == 1) props.onChildClick(props.ifMute);
    if (props.onChildClick7 && props.action == 7) props.onChildClick7();
  };

  return (
    <button onClick={handleClick} className="btnMenu" style={{ border: "none" }}>
      {props.str}
    </button>
  );
};

export default MenuBtn;
