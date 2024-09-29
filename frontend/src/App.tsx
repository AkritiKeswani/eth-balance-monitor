import React, { useState, useEffect } from "react";
import axios from "axios";
import BalanceChart from "./BalanceChart";
import "./App.css";

interface BalanceRecord {
  id: number;
  address: string;
  balance: number;
  timestamp: string;
}

const MONITOR_ADDRESS: string = "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e";

const App: React.FC = () => {
  const [balanceData, setBalanceData] = useState<BalanceRecord[]>([]);
  const [timeRange, setTimeRange] = useState<number>(24);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  useEffect(() => {
    fetchBalanceData();
    const interval = setInterval(fetchBalanceData, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, [timeRange]);

  const fetchBalanceData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/history`, {
        params: { hours: timeRange },
      });
      const sortedData = response.data.sort(
        (a: BalanceRecord, b: BalanceRecord) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      setBalanceData(sortedData);
      if (sortedData.length > 0) {
        setCurrentBalance(sortedData[sortedData.length - 1].balance);
      }
    } catch (error) {
      console.error("Error fetching balance data:", error);
    }
  };

  const handleTimeRangeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTimeRange(Number(event.target.value));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ETH Balance Monitor</h1>
      </header>
      <main className="App-main">
        <div className="info-panel">
          <p>
            Monitoring Address:{" "}
            <span className="address">{MONITOR_ADDRESS}</span>
          </p>
          <p>
            Current Balance:{" "}
            <span className="balance">
              {currentBalance !== null
                ? `${currentBalance.toFixed(6)} ETH`
                : "Loading..."}
            </span>
          </p>
          <div className="time-range-selector">
            <label htmlFor="timeRange">Time Range: </label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value={0.08}>5 minutes</option>
              <option value={0.25}>15 minutes</option>
              <option value={0.5}>30 minutes</option>
              <option value={1}>1 hour</option>
              <option value={3}>3 hours</option>
              <option value={24}>24 hours</option>
              <option value={72}>3 days</option>
              <option value={168}>1 week</option>
              <option value={720}>1 month</option> {/* Approx. 30 days */}
              <option value={8760}>1 year</option> {/* 365 days */}
            </select>
          </div>
        </div>
        <div className="chart-container">
          <BalanceChart data={balanceData} />
        </div>
      </main>
    </div>
  );
};

export default App;
