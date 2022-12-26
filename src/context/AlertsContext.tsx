/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from "react";

export enum AlertCategory {
  ALERT,
  ERROR,
  SUCCESS,
}

interface AddAlert {
  message: string;
  category?: AlertCategory;
}

interface Alert {
  id: number;
  message: string;
  category: AlertCategory;
}

const defaultApi = {
  alerts: [] as Alert[],
  add: (_alert: AddAlert) => {},
  clearById: (_id: number) => {},
  clear: () => {},
};

export type AlertsContextValue = typeof defaultApi;

export const AlertsContext =
  React.createContext<AlertsContextValue>(defaultApi);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = React.useState<Alert[]>(defaultApi.alerts);

  const add = React.useCallback(
    (alert: AddAlert) => {
      const nextAlerts = alerts.concat({
        id: alerts.length + 1,
        category: AlertCategory.ERROR,
        ...alert,
      } as Alert);
      setAlerts(nextAlerts);
    },
    [alerts, setAlerts]
  );

  const clearById = React.useCallback(
    (id: number) => {
      const nextAlerts = alerts.filter((n) => n.id !== id);
      setAlerts(nextAlerts);
    },
    [alerts, setAlerts]
  );

  const clear = React.useCallback(() => {
    setAlerts([]);
  }, [setAlerts]);

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        add,
        clearById,
        clear,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  return React.useContext(AlertsContext);
}
