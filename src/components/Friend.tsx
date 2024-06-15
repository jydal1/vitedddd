import React, { useEffect, useState } from 'react';

interface Referral {
    user_id: number;
    name: string;
    clicks: number;
    last_claimed_clicks: number;
}

interface FriendsProps {
    addToCounter: (amount: number) => void;
}

const Friends: React.FC<FriendsProps> = ({ addToCounter }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [referralLink, setReferralLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loadingReferrals, setLoadingReferrals] = useState(true);
    const [earnedAmount, setEarnedAmount] = useState<number>(0);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('https://devbackend-f7a664bc1045.herokuapp.com/user/');
                if (response.ok) {
                    const data = await response.json();
                    setUserId(data.user_id);
                } else {
                    console.error('Failed to fetch user ID');
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchReferralLink = async () => {
            if (userId !== null) {
                try {
                    const response = await fetch(`https://devbackend-f7a664bc1045.herokuapp.com/referral/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setReferralLink(data.referral_link);
                    } else {
                        console.error('Failed to fetch referral link');
                    }
                } catch (error) {
                    console.error('Error fetching referral link:', error);
                }
            }
        };

        fetchReferralLink();
    }, [userId]);

    useEffect(() => {
        const fetchReferrals = async () => {
            if (userId !== null) {
                try {
                    const response = await fetch(`https://devbackend-f7a664bc1045.herokuapp.com/referrals/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setReferrals(data.referrals);
                        const totalEarned = data.referrals.reduce((acc: number, referral: Referral) => {
                            const newClicks = referral.clicks - (referral.last_claimed_clicks || 0);
                            return acc + Math.round(newClicks * 0.1);
                        }, 0);
                        setEarnedAmount(totalEarned);
                    } else {
                        console.error('Failed to fetch referrals');
                    }
                } catch (error) {
                    console.error('Error fetching referrals:', error);
                } finally {
                    setLoadingReferrals(false);
                }
            }
        };

        fetchReferrals();
    }, [userId]);

    const copyToClipboard = () => {
        if (referralLink) {
            navigator.clipboard.writeText(referralLink).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }).catch((error) => {
                console.error('Failed to copy:', error);
            });
        }
    };

    const claimEarnings = async () => {
        if (earnedAmount > 0 && userId !== null) {
            try {
                const response = await fetch(`https://devbackend-f7a664bc1045.herokuapp.com/referrals/claim/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ amount: earnedAmount })
                });
                if (response.ok) {
                    addToCounter(Math.round(earnedAmount));
                    setEarnedAmount(0);
                    alert(`+${Math.round(earnedAmount)}SX`);
                    const updatedReferrals = referrals.map(referral => ({
                        ...referral,
                        last_claimed_clicks: referral.clicks
                    }));
                    setReferrals(updatedReferrals);
                } else {
                    console.error('Failed to claim earnings');
                }
            } catch (error) {
                console.error('Error claiming earnings:', error);
            }
        }
    };

    useEffect(() => {
        if (referrals.length > 0) {
            const newEarnedAmount = referrals.reduce((acc, referral) => {
                const newClicks = referral.clicks - (referral.last_claimed_clicks || 0);
                return acc + Math.round(newClicks * 0.1);
            }, 0);
            setEarnedAmount(newEarnedAmount);
        }
    }, [referrals]);

    return (
        <div className="invite-container">
            <h1>📣Invite</h1>
            <div className="invite-earnings">
                <div className="earnings-header">Earned from referrals</div>
                <div className="earned">
                    <div className="earned-amount">🦈{Math.round(earnedAmount) || 0}</div>
                    <button className="claim-button" onClick={claimEarnings}>Claim</button>
                </div>
                <div className='ref-link'>
                    {referralLink ? (
                        <div>
                            <a>{referralLink}</a>
                        </div>
                    ) : (
                        <p>Loading your referral link...</p>
                    )}
                </div>
                <button className='copy-button' onClick={copyToClipboard}>{copied ? 'Link Copied' : 'Copy Link'}</button>
                <div className="invite-info">Get 10% from your referrals</div>
            </div>
            <br></br>
            <div className="invite-stats">
                <h2>{referrals.length} Referrals</h2>
                {loadingReferrals ? (
                    <p>Loading referrals...</p>
                ) : referrals.length === 0 ? (
                    <p>We haven't found any users that joined with your invite.</p>
                ) : (
                    <div>
                        {referrals.map(referral => (
                            <div key={referral.user_id} className="referral">
                                <span className="referral-name">{referral.name}</span>
                                <span className="referral-clicks">{referral.clicks} 🦈</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends;
