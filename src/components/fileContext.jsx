import { createContext, useState } from 'react';

export const FileContext = createContext();

export const FileProvider = ({children}) => {
  const [fileContent, setFileContent] = useState('');

  return (
    <FileContext.Provider value={{ fileContent, setFileContent }}>
      {children}
    </FileContext.Provider>
  );
};
