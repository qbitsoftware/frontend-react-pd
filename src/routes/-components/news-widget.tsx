import { Blog } from "@/types/types"
import { Link } from "@tanstack/react-router"

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('et-EE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

interface Props {
  blogs: Blog[] | null
}

const NewsWidget = ({ blogs }: Props) => {

  if (!blogs) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 rounded-sm">
        <p className="text-lg text-gray-600">Error retrieving news. Please try again later.</p>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-gray-100 rounded-sm">
        <p className="text-lg text-gray-600">There are currently no news to display.</p>
      </div>
    )
  }

  return (
    <div>
      <ul className="space-y-6">
      {blogs.slice(0, 5).map((post) => (

        <li key={post.id} className="px-2 group border-b pb-2">
                  <Link href={`/uudised/${post.id}`} className="group">

          <p>{formatDate(post.created_at)}</p>
          <h6 className="font-medium group-hover:underline">{post.title}</h6>
          </Link>
        </li>
      ))}

        
        </ul>
    </div>
  )

}
  
  {/*}
  const secondaryNews = blogs.slice(1, 6);
  const placeholdersNeeded = Math.max(0, 4 - secondaryNews.length);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col pb-6">
        <Link href={`/uudised/${blogs[0].id}`} className="group p-1 rounded-sm">
          {blogs[0].has_image && blogs[0].image_url && (
            <div className="w-full aspect-[16/9] sm:aspect-auto overflow-hidden rounded-sm">
              <img
                src={blogs[0].image_url}
                className="w-full h-full sm:h-56 2xl:h-72 object-cover"
                alt={blogs[0].title}
              />
            </div>
          )}
          <h4 className={`font-bold leading-[109.9%] ${blogs[0].has_image ? 'pt-2' : 'pt-0'} group-hover:underline 2xl:text-2xl`}>
            {blogs[0].title}
          </h4>
          <p className="pt-1 font-medium text-stone-700">{formatDate(blogs[0].created_at)}</p>
          <p className="pt-4 leading-[20px]">{blogs[0].description}</p>
        </Link>
      </div>

      <div className="flex flex-col space-y-2">
        {secondaryNews.map((news, index) => (
          <Link key={index} href={`/uudised/${news.id}`} className={`flex group p-1 border rounded-sm py-2`}>
            <div className="w-full px-1 flex flex-col justify-start space-y-1">
              <h6 className="font-semibold leading-[109.9%] group-hover:underline 2xl:text-lg">{news.title}</h6>
              <p className="text-sm text-stone-700">{formatDate(news.created_at)}</p>
              } <p className="text-sm pt-1 text-gray-700 line-clamp-2">{news.description}</p> 
            </div>
          </Link>
        ))}
        

        {placeholdersNeeded > 0 && Array.from({ length: placeholdersNeeded }).map((_, index) => (
          <div key={`placeholder-${index}`} className="flex p-1 bg-[#f9f9f9] rounded-t-sm py-2">
            <div className="w-1/3 aspect-[4/3] overflow-hidden rounded-sm bg-gray-200"></div>
            <div className="w-2/3 pl-2 flex flex-col justify-start">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}

        {secondaryNews.length === 0 && (
          <div className="flex items-center justify-center p-6 bg-gray-100 h-full rounded-sm">
            <p className="text-gray-600">No additional news available.</p>
          </div>
        )}
      </div>
    </div>
  )

    */}


export default NewsWidget
