import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <BurgerIcon type={'primary'} />
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
        </>
        <>
          <ListIcon type={'primary'} />
          <NavLink
            to={'/feed'}
            className={({ isActive }) =>
              `text text_type_main-default ml-2 ${
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
        <ProfileIcon type={'primary'} />
        {userName && (
          <NavLink
            to={'/profile'}
            className={({ isActive }) =>
              `text text_type_main-default ml-2 ${
                styles.link
              } ${isActive ? styles.link_active : ''}`
            }
            end
          >
            {userName}
          </NavLink>
        )}
        {!userName && (
          <NavLink
            to={'/login'}
            className={({ isActive }) =>
              `text text_type_main-default ml-2 ${
                styles.link
              } ${isActive ? styles.link_active : ''}`
            }
            end
          >
            {'Личный кабинет'}
          </NavLink>
        )}
      </div>
    </nav>
  </header>
);
