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
import useAuth from '../hooks/useAuth';

type LinkType = { display: string; path: string };

const SideMenu = () => {
  const {
    routeInfo: { pathname },
  } = useIonRouter();

  const { admin, isLoggedIn } = useAuth();

  const links: LinkType[] = [
    { display: 'Admins', path: '/admins' },
    { display: 'Users', path: '/users' },
    { display: 'Products', path: '/products' },
    { display: 'Home product sections', path: '/home-product-sections' },
    { display: 'Orders', path: '/orders' },
    { display: 'Categories', path: '/categories' },
    { display: 'Logistics', path: '/logistics' },
    // { display: "Delivery prices", path: "/delivery-prices" },
    { display: 'Home slider', path: '/home-slider' },
    { display: 'About', path: '/about' },
    { display: 'Contact settings', path: '/contact-settings' },
    { display: 'Contact messages', path: '/contact-messages' },
  ]
    // .sort((a: LinkType, b: LinkType) => {
    //   if (a.display > b.display) return 1;
    //   if (a.display < b.display) return -1;
    //   return 0;
    // })
    .filter(({ path }: LinkType) => path !== '/admins' || admin?.primary);

  if (!isLoggedIn) return null;

  return (
    <IonMenu type='push' contentId='main-content'>
      <IonHeader className='container ion-no-border bg-gray-200'>
        <IonToolbar color='transparent'>
          <IonTitle className='ion-no-padding bg-gray-200'>
            CubeJKiddies
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='container !pr-0 h-full flex flex-col justify-end pb-20 bg-gray-200'>
          <ul>
            {links.map((link) => {
              const { display, path } = link;
              const active = pathname.startsWith(`${path}`);
              return (
                <li key={path}>
                  <IonMenuToggle>
                    <Link
                      to={path}
                      className={cx(
                        'side-menu-link flex items-center h-10 pl-5 ml-5 mb-2 rounded-l-full',
                        { 'bg-white': active }
                      )}
                    >
                      {display}
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
