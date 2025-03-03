const mainNews = {
    id: 1,
    title: "Sakala karikasarja V etapi tulemused",
    date: "12.03.2025",
    image: "https://uus.lauatennis.ee/wp-content/uploads/2024/10/463025810_1994239327691657_5655715395941921724_n-600x600.jpg",
    excerpt: "Taaskord, lauatennist ja muud sporti täis nädalavahetusel leidis tänasel kenal talvisel pühapäeval tee Viljandi spordihalli 57 lauatennisemängijat. Sel korral oli võistlema tulnud ka päris uusi mängijaid, mis on väga tore..."
  }
  
  const latestNews = [
    {
      id: 2,
      title: "Rahvapinksi 7. etapi võitsid Mart Vaarpu ja Andre Küüsvek",
      date: "29.02.2025",
      image: "https://uus.lauatennis.ee/wp-content/uploads/2025/02/Sakala-V-etapi-autasustatud-600x600.jpg"
    },
    {
      id: 3,
      title: "Kutse Lauatennisekeskuse karikasarja III etapile",
      date: "16.02.2025",
      image: "https://uus.lauatennis.ee/wp-content/uploads/2025/03/WhatsAppi-pilt-2025-03-01-kell-21.33.36_dc6b07ab-600x600.jpg"
    },
    {
      id: 4,
      title: "Pongfinity Cup 2025 / 1.02-2.02.2025 Helsingis",
      date: "02.02.2025",
      image: "https://uus.lauatennis.ee/wp-content/uploads/2025/02/DSC03281-600x600.jpg"
    },
    {
        id: 5,
        title: "Jalgpalliklubide meistrivõistlused lauatennises 2025 (lisatud video)",
        date: "30.01.2024",
        image: "https://uus.lauatennis.ee/wp-content/uploads/2025/02/476806306_943283267910869_3238725823865532970_n-600x600.jpg"
      }
  ]

const NewsWidget = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col pb-6">
        <a href="/" className="group hover:bg-stone-100/60 p-1 rounded-sm">
          <div className="w-full aspect-[16/9] sm:aspect-auto overflow-hidden rounded-sm">
            <img 
              src={mainNews.image} 
              className="w-full h-full sm:h-56 2xl:h-72 object-cover"
              alt={mainNews.title}
            />
          </div>
            <h4 className="font-bold leading-[109.9%] pt-2 group-hover:underline 2xl:text-2xl">{mainNews.title}</h4>
            <p className="pt-1 font-medium text-stone-700">{mainNews.date}</p>
            <p className="pt-4 leading-[20px]">{mainNews.excerpt}</p>
        </a>
      </div>

      <div className="flex flex-col space-y-3">
        {latestNews.map((news, index) => (
          <a key={news.id} href="/" className={`flex group border-b border-black/20 p-1 hover:bg-stone-100/60 rounded-t-sm ${index === 0 ? 'pb-2' : 'py-2'}` }>
            <div className="w-2/3 pr-2 flex flex-col justify-between">
              <h6 className="font-semibold leading-[109.9%] group-hover:underline 2xl:text-lg">{news.title}</h6>
              <p className="text-sm font-medium text-stone-700">{news.date}</p>
            </div>
            <div className="w-1/3 aspect-[4/3] overflow-hidden rounded-sm">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default NewsWidget
