export const TourInfo = ({ tour: { title, description, stops } }) => {
  return (
    <div className="max-w-2xl">
      <h1 className="text-4xl font-semibold mb-4">{title}</h1>
      <p className="mb-4">{description}</p>
      {stops ? (
        <ul>
          {stops.map((stop) => (
            <li key={stop} className="mb-4 bg-base-100 p-4 rounded-xl">
              {stop}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};
