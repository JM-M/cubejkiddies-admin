import { Link } from "react-router-dom";
import { Highlight } from "react-instantsearch";

const UserSearchHit: React.FC<any> = ({ hit }) => {
  return (
    <Link to={`/users/${hit.objectID}`} className="block">
      <article className="mb-5 p-3">
        <p className="flex-[3] flex gap-2">
          <Highlight attribute="firstName" hit={hit} />
          <Highlight attribute="lastName" hit={hit} />
        </p>
        <p className="text-gray-500">
          <Highlight attribute="email" hit={hit} />
        </p>
      </article>
    </Link>
  );
};

export default UserSearchHit;
