import {
  activeButton,
  menuButton,
} from "../styles/theme";

export default function MenuButton({
  title,
  onClick,
  active = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={
        active
          ? "page"
          : undefined
      }
      style={
        active
          ? activeButton
          : menuButton
      }
    >
      {title}
    </button>
  );
}
