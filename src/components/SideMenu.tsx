import { Link } from 'react-router-dom';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonMenuToggle,
  useIonRouter,
} from '@ionic/react';
import cx from 'classnames';

const links = [
  'orders',
  'products',
  'home-product-sections',
  'categories',
  'users',
];

const SideMenu = () => {
  const {
    routeInfo: { pathname },
  } = useIonRouter();

  return (
    <IonMenu type='push' contentId='main-content'>
      <IonHeader className='container ion-no-border bg-gray-200'>
        <IonToolbar color='transparent'>
          <IonTitle className='ion-no-padding bg-gray-200'>Admin</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='container !pr-0 h-full flex flex-col justify-end pb-20 bg-gray-200'>
          <ul>
            {links.map((path) => {
              const active = pathname.startsWith(`/${path}`);
              return (
                <li key={path}>
                  <IonMenuToggle>
                    <Link
                      to={`/${path}`}
                      className={cx(
                        'side-menu-link flex items-center h-10 pl-5 ml-5 mb-2 rounded-l-full capitalize',
                        { 'bg-white': active }
                      )}
                    >
                      {path.replaceAll('-', ' ')}
                      {active && (
                        <>
                          <span className='side-menu-link-curve top'></span>
                          <span className='side-menu-link-curve bottom'></span>
                        </>
                      )}
                    </Link>
                  </IonMenuToggle>
                </li>
              );
            })}
          </ul>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
