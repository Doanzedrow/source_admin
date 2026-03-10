import { App } from 'antd';


export const useAppNotify = () => {
  const { message, notification, modal } = App.useApp();

  return {
    message,
    notification,
    modal,
  };
};
