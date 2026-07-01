import {

  useState,

  useEffect,

} from "react";

export default function ResponsiveTable({

  desktop,

  mobile,

}) {

  const [

    mobileMode,

    setMobileMode,

  ] = useState(

    window.innerWidth < 768

  );

  useEffect(() => {

    const resize = () =>

      setMobileMode(

        window.innerWidth < 768

      );

    window.addEventListener(

      "resize",

      resize

    );

    return () =>

      window.removeEventListener(

        "resize",

        resize

      );

  }, []);

  return mobileMode

    ? mobile

    : desktop;

}
