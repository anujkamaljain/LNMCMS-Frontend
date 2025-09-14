import { useSelector } from "react-redux";
import { translations } from "./translations";

export const useTranslation = () => {
  const language = useSelector((state) => state.language.language);
  
  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return { t, language };
};
