import MenuBtn from "./MenuBtn";

type Props = {};

const MenuImg = (props: Props) => {
  return (
    <div style={{ margin: "5px" }}>
      <MenuBtn str="add admin" />
      <MenuBtn str="kick out" />
    </div>
  );
};

export default MenuImg;
