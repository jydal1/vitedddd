import React, { useState, useEffect } from 'react';
import './App.css';

const Tasks: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  useEffect(() => {
    const isTaskDone = localStorage.getItem('isSubscribed');
    if (isTaskDone === 'true') {
      setIsSubscribed(true);
    }
  }, []);

  const handleClick = (url: string) => {
    window.location.href = url;
    localStorage.setItem('isSubscribed', 'true');
    setIsSubscribed(true);
  };

  const handleClaim = async () => {
    try {
      const response = await fetch(`/referrals/claim/1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 50000 }),
      });

      if (response.ok) {
        setIsClaimed(true);
        localStorage.setItem('isClaimed', 'true');
        alert('+50000SX claimed!');
      } else {
        alert('Failed to claim rewards.');
      }
    } catch (error) {
      console.error('Error claiming rewards:', error);
      alert('Failed to claim rewards. Please try again later.');
    }
  };

  return (
    <div className="tasks-container">
      <h1>📌Tasks</h1>
      <div className="task-box">
        <div className="task-text">
          <p>Subscribe Telegram</p>
          <p className="reward">+50000SX</p>
        </div>
        {isSubscribed && !isClaimed ? (
          <button className="claim-button" onClick={handleClaim}>Claim</button>
        ) : isClaimed ? (
          <span>✅</span>
        ) : (
          <button className="task-button" onClick={() => handleClick('https://t.me/SharkX_Community')}>Do</button>
        )}
      </div>
      {/* Other tasks */}
    </div>
  );
};

export default Tasks;
