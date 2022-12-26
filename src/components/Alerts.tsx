import { AlertCategory, useAlerts } from "@context/AlertsContext";
import classNames from "classnames";
import { IoIosClose } from "react-icons/io";

const Alerts = () => {
  const { alerts, clearById } = useAlerts();

  return (
    <div className=" container absolute left-1/2 z-[100] mx-auto mt-5 w-fit max-w-lg -translate-x-1/2">
      <div className="z-[101] flex flex-col gap-y-2 text-center">
        {alerts &&
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={classNames(
                "flex w-full max-w-lg justify-between gap-x-3 rounded bg-neutral-100 py-1 px-2 text-neutral-900",
                { "bg-green-400": alert.category === AlertCategory.SUCCESS },
                { "bg-red-400": alert.category === AlertCategory.ERROR }
              )}
            >
              <div className="">{alert.message}</div>
              <button onClick={() => clearById(alert.id)}>
                <IoIosClose size="20" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Alerts;
