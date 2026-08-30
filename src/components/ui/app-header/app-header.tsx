import React, { FC, useRef } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';
export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const isConstructorActive = location.pathname === '/';
  const isFeedActive = location.pathname === '/feed';
  const isProfileActive = location.pathname === '/profile';
  console.log(isProfileActive);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <BurgerIcon type={isConstructorActive ? 'primary' : 'secondary'} />
          <NavLink
            to={'/'}
            className={({ isActive }) =>
              `text text_type_main-default ml-2 mr-10 ${
                styles.link
              } ${isActive ? styles.link_active : ''}`
            }
            end
          >
            Конструктор
          </NavLink>
          <>
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <NavLink
              to={'/feed'}
              className={({ isActive }) =>
                `text text_type_main-default ml-2 mr-10 ${
                  styles.link
                } ${isActive ? styles.link_active : ''}`
              }
              end
            >
              Лента заказов
            </NavLink>
          </>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <NavLink
            data-testid='user-name'
            to={'/profile'}
            className={({ isActive }) =>
              `text text_type_main-default ml-2 mr-10 ${
                styles.link
              } ${isActive ? styles.link_active : ''}`
            }
            end
          >
            {userName ? userName : 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
