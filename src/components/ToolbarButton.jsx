export default function ToolbarButton({

  icon,

  text,

  onClick,

}) {

  return (

    <button
      onClick={onClick}
    >

      {icon} {text}

    </button>

  );

}
