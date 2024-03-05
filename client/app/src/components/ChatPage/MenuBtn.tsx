type Props = {
  action: number;
  str: string;
  ifMute: boolean;
  onChildClick?: (param1: boolean) => void;
  onChildClick7?: () => void;
  onChildClick6?: () => void;
  onChildClick5?: () => void;
  onChildClick2?: () => void;
};

const MenuBtn = (props: Props) => {
  const handleClick = () => {
    if (props.onChildClick && props.action == 1) props.onChildClick(props.ifMute);
    if (props.onChildClick7 && props.action == 7) props.onChildClick7();
    if (props.onChildClick6 && props.action == 6) props.onChildClick6();
    if (props.onChildClick5 && props.action == 5) props.onChildClick5();
    if (props.onChildClick2 && props.action == 2) props.onChildClick2();
  };

  return (
    <button onClick={handleClick} className="btnMenu" style={{ border: "none" }}>
      {props.str}
    </button>
  );
};

export default MenuBtn;
