import useLocalStorage from "../Hooks/useLocalStorage";
import style from '../styles/HistoryPage.module.css';
import HistoryImageComponent from "../components/HistoryImageComponent";
import { useState } from "react";

const HistoryPage = () => {
  const [historyValue,] = useLocalStorage<string[]>('searchHistory', []);
  const [selectedValue, setSelectedValue] = useState<string>('');

  const onHistoryClick = (item: string) => {
    setSelectedValue(item);
  };

  return (
    <div className={style.history}>
      <div className={style.historyElements}>
        {historyValue.map((item, index) => (
          <div className={style.historyElemet} onClick={() => onHistoryClick(item)} key={index}>{item}</div>
        ))}
      </div>
      <div>
        <HistoryImageComponent value={selectedValue} />
      </div>
    </div>
  );
};

export default HistoryPage;