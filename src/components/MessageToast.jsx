import { useMessage } from '../contexts/MessageContext';

const typeToClass = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
};

function MessageToast() {
  const { message, type, visible } = useMessage();
  if (!visible || !message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`alert ${typeToClass[type] || 'alert-info'} shadow-lg animate-fade-in`}
        role="alert">
        <span>{message}</span>
      </div>
    </div>
  );
}

export default MessageToast;
