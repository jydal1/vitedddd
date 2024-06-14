// BottomMenu.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserFriends, faTasks, faHome } from '@fortawesome/free-solid-svg-icons';
import './App.css';

interface BottomMenuProps {
  setCurrentView: (view: string) => void;
}

const BottomMenu: React.FC<BottomMenuProps> = ({ setCurrentView }) => {
  return (
    <div className='bottomenu'>
      <div className='menucontainer'>
        <button className='button-55' onClick={() => setCurrentView('home')}>
          <FontAwesomeIcon icon={faHome}/> HOME
        </button>
        <button className='button-55' onClick={() => setCurrentView('friends')}>
          <FontAwesomeIcon icon={faUserFriends}/> FRIENDS
        </button>
        <button className='button-55' onClick={() => setCurrentView('tasks')}>
          <FontAwesomeIcon icon={faTasks}/> TASKS
        </button>
      </div>
    </div>
  );
}

export default BottomMenu;
