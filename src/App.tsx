import { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonContent,
  IonPage,
  IonRouterOutlet,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Orders from './pages/Orders';
import Order from './pages/Order';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import Product from './pages/Product';
import EditProduct from './pages/EditProduct';
import HomeSlider from './pages/HomeSlider';
import NewHomeSlide from './pages/NewHomeSlide';
import EditHomeSlide from './pages/EditHomeSlide';
import ProductSections from './pages/ProductSections';
import CreateCustomProductSection from './pages/CreateCustomProductSection';
import CreateCategoryProductSelection from './pages/CreateCategoryProductSection';
import EditProductSection from './pages/EditProductSection';
import Categories from './pages/Categories';
import DeliveryPrices from './pages/DeliveryPrices';
import Users from './pages/Users';
import User from './pages/User';
import Login from './pages/Login';
import AboutPage from './pages/About';
import Contact from './pages/Contact';
import ContactMessages from './pages/ContactMessages';
import Admins from './pages/Admins';
import CreateAdmin from './pages/CreateAdmin';
import Admin from './pages/Admin';

import SideMenu from './components/SideMenu';
import TopHeader from './components/TopHeader';

import AutoAuthenticatingContext from './contexts/autoAuthenticating';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
// import "./theme/variables.css";

/* Tailwind CSS utils */
import './tailwind.css';

/* Custom CSS */
import './index.css';

setupIonicReact({ mode: 'md' });

const queryClient = new QueryClient();

const App: React.FC = () => {
  const autoAuthenticatingState = useState<boolean>(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AutoAuthenticatingContext.Provider value={autoAuthenticatingState}>
        <IonApp>
          <IonReactRouter>
            <SideMenu />
            <IonPage id='main-content'>
              <TopHeader />
              <IonRouterOutlet>
                <IonContent>
                  <div className='container flex flex-col min-h-full py-14'>
                    <Route exact path='/orders' component={Orders} />
                    <Route exact path='/orders/:orderId' component={Order} />
                    <Route exact path='/products' component={Products} />
                    <Route
                      exact
                      path='/products/new'
                      component={CreateProduct}
                    />
                    <Route
                      exact
                      path='/products/:productId/preview'
                      component={Product}
                    />
                    <Route
                      exact
                      path='/products/:productId/edit'
                      component={EditProduct}
                    />
                    <Route exact path='/home-slider' component={HomeSlider} />
                    <Route
                      exact
                      path='/home-slider/:homeSlideId/edit'
                      component={EditHomeSlide}
                    />
                    <Route
                      exact
                      path='/home-slider/new'
                      component={NewHomeSlide}
                    />
                    <Route
                      exact
                      path='/home-product-sections'
                      component={ProductSections}
                    />
                    <Route
                      exact
                      path='/home-product-sections/:sectionId/edit'
                      component={EditProductSection}
                    />
                    <Route
                      exact
                      path='/home-product-sections/new/custom'
                      component={CreateCustomProductSection}
                    />
                    <Route
                      exact
                      path='/home-product-sections/new/category'
                      component={CreateCategoryProductSelection}
                    />
                    <Route exact path='/categories' component={Categories} />
                    <Route
                      exact
                      path='/delivery-prices'
                      component={DeliveryPrices}
                    />
                    <Route exact path='/admins' component={Admins} />
                    {/* <Route exact path='/admins/:uid' component={Admin} /> */}
                    <Route exact path='/admins/new' component={CreateAdmin} />
                    <Route exact path='/users' component={Users} />
                    <Route exact path='/users/:uid' component={User} />
                    <Route exact path='/about' component={AboutPage} />
                    <Route exact path='/contact-settings' component={Contact} />
                    <Route
                      exact
                      path='/contact-messages'
                      component={ContactMessages}
                    />
                    <Route exact path='/login' component={Login} />
                    <Route
                      exact
                      path='/'
                      render={() => <Redirect to='/login' />}
                    />
                  </div>
                </IonContent>
              </IonRouterOutlet>
            </IonPage>
          </IonReactRouter>
        </IonApp>
      </AutoAuthenticatingContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
