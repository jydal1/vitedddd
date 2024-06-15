import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import coin from '../assets/coin.png';
import './App.css';
import Friends from './Friend';
import Tasks from './Task';
import BottomMenu from './BMenu';

interface FloatingElement {
id: string;
x: number;
y: number;
text: string;
}

function App() {
const [counter, setCounter] = useState<number>(0);
const [currentView, setCurrentView] = useState<string>('home');
const [floatingElements, setFloatingElements] = useState<FloatingElement[]>([]);
useEffect(() => {
    async function fetchCounter(user_id: string) {
        const response = await fetch(`https://devbackend-f7a664bc1045.herokuapp.com/counter/${user_id}`);
        const data = await response.json();
        setCounter(data.count);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const user_id = urlParams.get('user_id') || localStorage.getItem('user_id');
    if (user_id) {
        localStorage.setItem('user_id', user_id);
        fetchCounter(user_id);
    }

    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.expand();
    }
}, []);

async function handleClick(e: React.MouseEvent) {
    const clientX = e.clientX;
    const clientY = e.clientY;
    const user_id = localStorage.getItem('user_id');

    try {
        const response = await fetch('https://devbackend-f7a664bc1045.herokuapp.com/counter/increment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, amount: 1 }),
        });
        if (!response.ok) {
            throw new Error('Failed to increment counter');
        }
        const data = await response.json();
        setCounter(data.count);
        localStorage.setItem('Counter', data.count.toString());

        const currentTarget = e.currentTarget as HTMLElement | null;

        if (currentTarget) {
            const boxRect = currentTarget.getBoundingClientRect();
            const x = clientX - boxRect.left;
            const y = clientY - boxRect.top;
            addFloatingElement(x, y, '+1');
        }
    } catch (error) {
        console.error(error);
    }
}


function addFloatingElement(x: number, y: number, text: string) {
    const id = uuidv4();
    setFloatingElements(prevElements => [
        ...prevElements,
        { id, x, y, text }
    ]);

    setTimeout(() => {
        setFloatingElements(prevElements => prevElements.filter(el => el.id !== id));
    }, 1000);
}

function addToCounter(amount: number) {
    setCounter(prevCounter => prevCounter + amount);
}

function renderView() {
    switch (currentView) {
        case 'home':
            return (
                <>
                    <div className='hello'>
                        <h1>👋Hello, ss</h1>
                    </div>
                    <div className="box" style={{ position: 'relative' }}>
                        <span className='counter'>🦈{counter}</span>
                        <img src={coin} alt="coin" width={312} height={312} onClick={handleClick} style={{marginTop: '60px'}}/>
                        {floatingElements.map(el => (
                            <span key={el.id} className='floating-text' style={{ left: el.x, top: el.y }}>
                                {el.text}
                            </span>
                        ))}
                    </div>
                </>
            );
        case 'friends':
            return <Friends addToCounter={addToCounter} />;
        case 'tasks':
            return <Tasks />;
        default:
            return (
                <>
                    <div className='hello'>
                        <h1>👋Hello</h1>
                    </div>
                    <div className="box" style={{ position: 'relative' }}>
                        <span className='counter'>{counter}</span>
                        <img src={coin} alt="coin" width={256} height={256} onClick={handleClick} />
                    </div>
                </>
            );
    }
}

return (
    <>
        {renderView()}
        <BottomMenu setCurrentView={setCurrentView} />
    </>
);
}

export default App;