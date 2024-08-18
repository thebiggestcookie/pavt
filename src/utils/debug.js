let debugLog = [];

export const debug = (message, data = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    message,
    data
  };
  debugLog.push(logEntry);
  console.log(`[DEBUG] ${timestamp} - ${message}`, data);
};

export const getDebugLog = () => {
  return JSON.stringify(debugLog, null, 2);
};

export const clearDebugLog = () => {
  debugLog = [];
};

