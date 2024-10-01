const App = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [lastElement, setLastElement] = useState(null);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPageNum((no) => no + 1);
      }
    }),
  );

  const callUser = async () => {
    setLoading(true);
    let response = await axios.get(
      `https://randomuser.me/api/?page=${pageNum}&results=25&seed=abc`,
    );
    let all = new Set([...allUsers, ...response.data.results]);
    setAllUsers([...all]);
    setLoading(false);
  };

  useEffect(() => {
    if (pageNum <= TOTAL_PAGES) {
      callUser();
    }
  }, [pageNum]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  const UserCard = ({ data }) => {
    return (
      <div className="flex items-center p-4 bg-white border border-gray-500 rounded">
        <div>
          <img
            src={data.picture.medium}
            className="w-16 h-16 border-2 border-green-600 rounded-full"
            alt="user"
          />
        </div>

        <div className="ml-3">
          <p className="text-base font-bold">
            {data.name.first} {data.name.last}
          </p>
          <p className="text-sm text-gray-800">
            {data.location.city}, {data.location.country}
          </p>
          <p className="text-sm text-gray-500 break-all">{data.email}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 mx-44">
      <h1 className="mt-4 mb-10 text-3xl text-center">All users</h1>

      <div className="grid grid-cols-3 gap-4">
        {allUsers.length > 0 &&
          allUsers.map((user, i) => {
            return i === allUsers.length - 1 &&
              !loading &&
              pageNum <= TOTAL_PAGES ? (
              <div key={`${user.name.first}-${i}`} ref={setLastElement}>
                <UserCard data={user} />
              </div>
            ) : (
              <UserCard data={user} key={`${user.name.first}-${i}`} />
            );
          })}
      </div>
      {loading && <p className="text-center">loading...</p>}

      {pageNum - 1 === TOTAL_PAGES && <p className="my-10 text-center">♥</p>}
    </div>
  );
};
