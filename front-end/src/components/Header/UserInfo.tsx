import defaultAvatar from '@/assets/default_avatar.png';
import { Button, DropDownList, Item } from '@/components/ui';
import useAuth from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const UserInfo = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState('Unknown');
  const [avatar_url, setAvatar] = useState('');
  const navigate = useNavigate();
  const { companyName = '' } = useParams();

  useEffect(() => {
    const updateInfo = async () => {
      if (user === null) {
        setName('Unknown');
        setAvatar(defaultAvatar);
      } else {
        setName(`${user.first_name} ${user.last_name}`);
        // const availability = await isImageShowableHead(avatar_url);
        if (avatar_url) {
          setAvatar(
            `${import.meta.env.VITE_STORAGE_SERVICE_HOST}/avatars/${user.avatar_url}-48.jpg?lastMod=${new Date().getTime()}`
          );
        } else {
          setAvatar(defaultAvatar);
        }
      }
    };
    updateInfo();
  }, [user]);

  return (
    <>
      {
        <div className='relative flex w-fit space-x-3 pl-2 align-middle'>
          <Button rounded='icon' className='h-10 w-10 p-0' intent='normal' onClick={() => {}}>
            <Bell strokeWidth={'2px'} name='notifications' className='size-[1.5rem]' />
          </Button>
          <div>
            <Button
              rounded='icon'
              className='mx-0 my-0 h-10 w-10 border-0 px-0 py-0'
              intent='link'
              onClick={() => {
                setMenuOpen(!isMenuOpen);
              }}
            >
              <img className='w-full rounded-full' src={avatar_url} alt='avatar'></img>
            </Button>
            <DropDownList
              open={isMenuOpen}
              onClose={() => {
                setMenuOpen(false);
              }}
              className='right-[.25rem] top-[3rem] mt-0 w-80'
              divide={false}
            >
              <div className='mb-2 border-b-2 border-button-stroke'>
                <Item title={name} icon={<img className='w-full rounded-full' src={avatar_url} alt='avatar'></img>} />
              </div>
              <Item
                className='py-0'
                icon={<Settings name='settings' size='1.5rem' />}
                title='Settings & Administration'
                onClick={() => {
                  navigate(`/${companyName}/setting/personal-information`);
                }}
              />
              <Item
                className='py-0'
                icon={<LogOut name='logout' size='1.5rem' />}
                title='Log out'
                onClick={() => {
                  navigate(`/${companyName}/home`);
                  logout();
                }}
              />
              <div className='h-2' />
            </DropDownList>
          </div>
        </div>
      }
    </>
  );
};
export default UserInfo;
