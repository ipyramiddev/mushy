import SampleProduct from "../../assets/img/sample-product.jpg";
import {ReactComponent as SolIcon} from "../../assets/icons/sol.svg";
import {ReactComponent as FavouriteIcon} from "../../assets/icons/favourite.svg";

export const ProductsList = () => {
    return (
        <div>
            <div className="w-full mt-36 md:px-32 md:pt-6 bg-header-pink md:pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-8">
                    <div className="bg-white border rounded-xl">
                        <img src={SampleProduct} alt="sample-product" className="w-full p-1 mb-4 border-white rounded-xl"/>
                        <div className="flex justify-between items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black">Lorem Ipsum</span>
                            <div className="w-7">
                                <FavouriteIcon className="h-8"/>
                            </div>
                        </div>
                        <div className="flex items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black mr-1">0.15</span>
                            <SolIcon />
                            <span className="text-xs text-purple-product-purple font-light ml-2">(4.77$)</span>
                        </div>
    
                    </div>
    
                    <div className="bg-white border rounded-xl">
                        <img src={SampleProduct} alt="sample-product" className="w-full p-1 mb-4 border-white rounded-xl"/>
                        <div className="flex justify-between items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black">Lorem Ipsum</span>
                            <div className="w-7">
                                <FavouriteIcon className="h-8"/>
                            </div>
                        </div>
                        <div className="flex items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black mr-1">0.15</span>
                            <SolIcon />
                            <span className="text-xs text-purple-product-purple font-light ml-2">(4.77$)</span>
                        </div>
    
                    </div>
    
                    <div className="bg-white border rounded-xl">
                        <img src={SampleProduct} alt="sample-product" className="w-full p-1 mb-4 border-white rounded-xl"/>
                        <div className="flex justify-between items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black">Lorem Ipsum</span>
                            <div className="w-7">
                                <FavouriteIcon className="h-8"/>
                            </div>
                        </div>
                        <div className="flex items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black mr-1">0.15</span>
                            <SolIcon />
                            <span className="text-xs text-purple-product-purple font-light ml-2">(4.77$)</span>
                        </div>
    
                    </div>
    
                    <div className="bg-white border rounded-xl">
                        <img src={SampleProduct} alt="sample-product" className="w-full p-1 mb-4 border-white rounded-xl"/>
                        <div className="flex justify-between items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black">Lorem Ipsum</span>
                            <div className="w-7">
                                <FavouriteIcon className="h-8"/>
                            </div>
                        </div>
                        <div className="flex items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black mr-1">0.15</span>
                            <SolIcon />
                            <span className="text-xs text-purple-product-purple font-light ml-2">(4.77$)</span>
                        </div>
    
                    </div>
    
                    <div className="bg-white border rounded-xl">
                        <img src={SampleProduct} alt="sample-product" className="w-full p-1 mb-4 border-white rounded-xl"/>
                        <div className="flex justify-between items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black">Lorem Ipsum</span>
                            <div className="w-7">
                                <FavouriteIcon className="h-8"/>
                            </div>
                        </div>
                        <div className="flex items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black mr-1">0.15</span>
                            <SolIcon />
                            <span className="text-xs text-purple-product-purple font-light ml-2">(4.77$)</span>
                        </div>
    
                    </div>
    
                    <div className="bg-white border rounded-xl">
                        <img src={SampleProduct} alt="sample-product" className="w-full p-1 mb-4 border-white rounded-xl"/>
                        <div className="flex justify-between items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black">Lorem Ipsum</span>
                            <div className="w-7">
                                <FavouriteIcon className="h-8"/>
                            </div>
                        </div>
                        <div className="flex items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black mr-1">0.15</span>
                            <SolIcon />
                            <span className="text-xs text-purple-product-purple font-light ml-2">(4.77$)</span>
                        </div>
    
                    </div>
    
                    <div className="bg-white border rounded-xl">
                        <img src={SampleProduct} alt="sample-product" className="w-full p-1 mb-4 border-white rounded-xl"/>
                        <div className="flex justify-between items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black">Lorem Ipsum</span>
                            <div className="w-7">
                                <FavouriteIcon className="h-8"/>
                            </div>
                        </div>
                        <div className="flex items-center px-4 mb-4">
                            <span className="text-purple-product-purple font-black mr-1">0.15</span>
                            <SolIcon />
                            <span className="text-xs text-purple-product-purple font-light ml-2">(4.77$)</span>
                        </div>
    
                    </div>
                </div>
            </div>
            <ViewMoreBtn />
        </div>
    );
}

export const ViewMoreBtn = ()=>{
    return(
        <div className="bg-header-pink text-center pb-20">
            <button className="border bg-header-pink border-header-purple rounded-2xl text-header-purple w-40 h-10 hover:text-white hover:bg-header-purple">
                View more
            </button>
        </div>
    );
}
