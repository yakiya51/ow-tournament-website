import type { ReactNode } from "react";
import { useEffect } from "react";

export default function Modal({
  children,
  show,
  hide,
}: {
  children: ReactNode;
  show: boolean;
  hide: () => void;
}) {
  useEffect(() => {
    const hideModalOnEsc = (e: globalThis.KeyboardEvent) => {
      if (e.keyCode === 27) {
        hide();
      }
    };
    window.addEventListener("keydown", hideModalOnEsc);
    return () => window.removeEventListener("keydown", hideModalOnEsc);
  }, [hide]);

  if (show) {
    return (
      <div className="fixed top-0 left-0 z-50 flex h-screen w-full">
        <div
          onClick={hide}
          className="absolute h-full w-full bg-black p-5 opacity-50"
        ></div>

        <div className="z-50 mx-3 mt-[10%] h-fit w-full max-w-screen-sm overflow-y-auto rounded bg-neutral-900 py-7 px-6 text-left sm:mx-auto">
          {children}
        </div>
      </div>
    );
  }

  return <></>;
}
