import AnimateWrap from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTab } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";

const HomePage = () => {
  let [blogs, setBlog] = useState(null);
  let [trendingBlogs, setTrendingBlog] = useState(null);
  let [pageState, setPageState] = useState("home");

  let categories = [
    "technology",
    "travel",
    "health",
    "personal finance",
    "speed",
    "fashion",
    "education",
    "lifestyle",
    "good",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page: page,
          countRoute: "/all-latest-blogs-count",
        });
        setBlog(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlog(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page: page,
          countRoute: "/search-blogs-count",
          data_to_send: { tags: pageState },
        });
        setBlog(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();

    setBlog(null);

    if (pageState == category) {
      setPageState("home");
      return;
    }

    setPageState(category);
  };

  useEffect(() => {
    activeTab.current.click();

    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <>
      <AnimateWrap>
        <section className="h-cover flex justify-center gap-10">
          <div className="w-full">
            <InPageNavigation
              routes={[pageState, "trending blogs"]}
              defaultHidden={["trending blogs"]}
            >
              <>
                {blogs != null && blogs.results.length ? (
                  <>
                    {blogs.results.map((blog, i) => {
                      return (
                        <AnimateWrap
                          transition={{ duration: 1, delay: i * 0.1 }}
                          key={i}
                        >
                          <BlogPostCard
                            content={blog}
                            author={blog.author.personal_info}
                          />
                        </AnimateWrap>
                      );
                    })}
                    <LoadMoreDataBtn
                      state={blogs}
                      fetchDataFun={
                        pageState === "home"
                          ? fetchLatestBlogs
                          : fetchBlogsByCategory
                      }
                    />
                  </>
                ) : (
                  <NoDataMessage message={"Nothing for Now :/"} />
                )}
              </>

              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <AnimateWrap
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </AnimateWrap>
                  );
                })
              ) : (
                <NoDataMessage message={"Trending is not in Trend"} />
              )}
            </InPageNavigation>
          </div>

          <div className="min-w-[40% ]  lg:min-w-[400px] max-w-min  border-l border-grey pl-8 pt-3 max-md:hidden">
            <div className="flex flex-col gap-10">
              <div>
                <h1 className="font-medium text-xl mb-8">
                  Stories From All Interest
                </h1>

                <div className="flex gap-5 flex-wrap">
                  {categories.map((category, i) => {
                    return (
                      <button
                        onClick={loadBlogByCategory}
                        className={
                          "tag " +
                          (pageState === category ? "bg-black text-white" : " ")
                        }
                        key={i}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h1 className="font-medium text-2xl mb-8">
                  Trending&nbsp;
                  <i className="fi-rr-fire-flame-curved text-2xl"></i>
                </h1>

                {trendingBlogs == null ? (
                  <Loader />
                ) : trendingBlogs.length ? (
                  trendingBlogs.map((blog, i) => {
                    return (
                      <AnimateWrap
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <MinimalBlogPost blog={blog} index={i} />
                      </AnimateWrap>
                    );
                  })
                ) : (
                  <NoDataMessage message={"Trending is not in Trend"} />
                )}
              </div>
            </div>
          </div>
        </section>
      </AnimateWrap>
    </>
  );
};

export default HomePage;
