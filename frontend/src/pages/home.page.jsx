import AnimateWrap from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component"
const HomePage = () => {
  return (
    <>
    <AnimateWrap>
        
        
        <section className="h-cover flex justify-center gap-10"> 
            <div className="w-full">

                <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>

                  <h1>Latest Blogs</h1>
                  <h1>Trending Blogs</h1>

                </InPageNavigation>

            </div>

            <div>

            </div>
            
        </section>
    </AnimateWrap>
    </>

  )
}

export default HomePage
