import { Route } from "react-router-dom";
import { IonRouterOutlet, IonContent } from "@ionic/react";
import HomeCarousel from "../components/HomeCarousel";
import HomeProductSections from "../components/HomeProductSections";
import Product from "./Product";
import Category from "./Category";
import Search from "./Search";
import Checkout from "./Checkout";
import Order from "./Order";

const Home: React.FC = () => {
  return (
    <IonRouterOutlet>
      <IonContent>
        <div className="flex flex-col h-full">
          <Route path="/:tab(store)/orders/:orderId" component={Order} />
          <Route path="/:tab(store)/category" component={Category} />
          <Route
            path="/:tab(store)/products/:productId"
            component={Product}
            exact
          />
          <Route
            path="/:tab(store)/search/:searchTerm"
            component={Search}
            exact
          />
          <Route path="/:tab(store)/checkout" component={Checkout} exact />
          <Route path="/:tab(store)" exact>
            <IonContent className="py-[50px]">
              <div className="flex flex-col h-full">
                <HomeCarousel />
                <HomeProductSections />
              </div>
            </IonContent>
          </Route>
        </div>
      </IonContent>
    </IonRouterOutlet>
  );
};

export default Home;
