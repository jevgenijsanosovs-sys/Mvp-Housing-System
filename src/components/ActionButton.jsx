export default function ActionButton({

  text,

  icon,

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
