const ads = [
  //  { url: "../../../public/pingpongtable.jpg" },
  {
    url: "/unicorn.png",
  },
];

const Adboard = () => {
  return (
    <div className="flex flex-col space-y-4">
      {ads.map((ad, index) => (
        <img key={index} src={ad.url} />
      ))}
    </div>
  );
};

export default Adboard;
