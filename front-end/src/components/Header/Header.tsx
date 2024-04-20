import salesyncIcon from 'assets/salesync_icon.png';

import { ThemeToggle, UserInfo, Search, QuickSetting } from './index';
import { cn } from '@/utils/utils';
import useAuth from '@/hooks/useAuth';

const Header = ({ className }: { className?: string }) => {
  const { company } = useAuth();
  return (
    <div
      className={cn(
        'fixed top-0 z-[100] flex h-16 w-[calc(100vw)] flex-grow items-center justify-between border-[1px] border-input-stroke bg-panel py-4 pl-3 pr-5 dark:border-input-stroke-dark  dark:bg-panel-dark',
        className
      )}
    >
      <a className='aspect-square h-10 w-10' href='/cheatsheet'>
        <img
          src={`${import.meta.env.VITE_STORAGE_SERVICE_HOST}/companies/${company?.avatar_url === 'default' ? 'default.svg' : company?.avatar_url}?lastmod=${new Date().getTime().toString()}`}
          className=''
          alt='header icon'
          onError={(e) => {
            e.currentTarget.src = salesyncIcon;
          }}
        />
      </a>
      <Search className='align-middle' />
      <div>
        <div className='justify-right relative flex w-fit align-middle'>
          <div className='flex gap-2'>
            <ThemeToggle />
            <QuickSetting />
          </div>
          <UserInfo />
        </div>
      </div>
    </div>
  );
};
export default Header;
