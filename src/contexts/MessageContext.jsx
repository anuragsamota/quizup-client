import React, { createContext, useContext, useState, useCallback } from 'react';

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [message, setMessage] = useState(null);
  const [type, setType] = useState('info');
  const [visible, setVisible] = useState(false);
  const showMessage = useCallback((msg, msgType = 'info', duration = 3000) => {
    setMessage(msg);
    setType(msgType);
    setVisible(true);
    setTimeout(() => setVisible(false), duration);
  }, []);
  return (
    <MessageContext.Provider value={{ showMessage, message, type, visible }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  return useContext(MessageContext);
}
