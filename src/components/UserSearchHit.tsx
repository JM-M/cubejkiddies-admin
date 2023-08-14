import { Link } from "react-router-dom";
import { Highlight } from "react-instantsearch";

const UserSearchHit: React.FC<any> = ({ hit }) => {
  return (
    <Link to={`/users/${hit.objectID}`} className="block">
      <article className="mb-5">
        <div className="flex-[3]">
          <Highlight attribute="firstName" hit={hit} />
          <Highlight attribute="lastName" hit={hit} />
          <p className="text-gray-700">
            <Highlight attribute="email" hit={hit} />
          </p>
        </div>
      </article>
    </Link>
  );
};

export default UserSearchHit;
