import { menuButton } from "../styles/theme";

export default function MenuButton({
  title,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={menuButton}
    >
      {title}
    </button>
  );
}