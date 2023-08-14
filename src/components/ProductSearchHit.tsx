import { Link } from "react-router-dom";
import { IonImg } from "@ionic/react";
import { Highlight } from "react-instantsearch";
import { NAIRA } from "../constants/unicode";

const ProductSearchHit: React.FC<any> = ({ hit }) => {
  return (
    <Link to={`/products/${hit.objectID}/preview`} className="block">
      <article className="flex gap-3 mb-5">
        <IonImg className="flex-1" src={hit.image} alt={hit.name} />
        <div className="flex-[3]">
          <Highlight attribute="name" hit={hit} />
          <p className="text-gray-700">
            <Highlight attribute="category" hit={hit} />
          </p>
          <p className="text-lg">
            {NAIRA}
            {hit.price}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ProductSearchHit;
