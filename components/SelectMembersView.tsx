import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { IconButton } from './ui/IconButton';
import { ArrowLeftIcon, DialpadIcon } from './icons';

export const SelectMembersView: React.FC = () => {
  const { setCurrentView } = useContext(AppContext);

  return (
    <div className="bg-bg text-on-surface h-full flex flex-col">
      <header className="flex items-center p-4 shrink-0">
        <IconButton label="Back" onClick={() => setCurrentView('chatList')} className="-ml-2">
          <ArrowLeftIcon className="h-6 w-6" />
        </IconButton>
        <h1 className="text-xl font-bold ml-4">Select members</h1>
      </header>

      <main className="flex-grow overflow-y-auto px-4">
        <div className="relative mb-4">
          <input
            type="search"
            placeholder="Search name or number"
            className="w-full bg-surface-alt rounded-full py-3 pl-5 pr-12 text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            <DialpadIcon className="h-6 w-6 text-on-surface-variant" />
          </div>
        </div>
        {/* Contact list would be rendered here */}
      </main>

      <footer className="p-4 shrink-0">
        <button
          onClick={() => setCurrentView('groupName')}
          className="bg-surface text-on-surface-variant w-full py-3 rounded-full font-semibold text-lg"
        >
          Skip
        </button>
      </footer>
    </div>
  );
};
