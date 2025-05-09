'use client'

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import ProductCategories from "../app/components/ProductCategories";
import Link from "next/link";
import Image from "next/image";
import Testimonial from "../app/components/Testimonial";
import "swiper/css";
import "swiper/css/effect-fade";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import { SET_CART_ITEMS } from "./redux/types";
import { setWish } from "./redux/reducer/wishSlice";
import { useEffect } from "react";


export default function Home() {
  
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const wishList = useSelector((state) => state.wish.wishlist); 
  const images = [
    "https://relot.in/wp-content/uploads/2025/01/couple-winter-cloths-studio_1303-5887.avif",
    "https://relot.in/wp-content/uploads/2025/02/rl2br.jpg",
    "https://relot.in/wp-content/uploads/2025/02/hn2.png",
  ];
  
  const services = [
    {
      title: "Personalization",
      description:
        "Add a personal touch to bags, wallets, luggage, belts, leather accessories, and even items from our exclusive pet collection with initials, custom engravings, or unique designs.",
      image:
        "https://relot.in/wp-content/uploads/2025/02/Personalizationjknm.avif",
      link: "https://relot.in/personalisation/",
    },
    {
      title: "Relot Repairs",
      description:
        "We specialize in repairing a variety of items, from electronics like smartphones and tablets to home appliances. Get quick, efficient repair services that restore your items to original condition.",
      image: "https://relot.in/wp-content/uploads/2025/02/df.avif",
      link: "https://relot.in/relot-repairs/",
    },
    {
      title: "Art of Gifting",
      description:
        "Master the art of gifting with our curated gift solutions. From hampers to customized items, every piece is selected to create a memorable, heartfelt experience.",
      image:
        "https://relot.in/wp-content/uploads/2025/02/high-angle-view-woman-showing-seal-brown-envelop-with-craft-material-wooden-table_23-2148193635.avif",
      link: "https://relot.in/art-og-gifting/",
    },
  ];


  const fetchProducts = async () => {
    
    try {
      const res = await axios.get("http://localhost:3000/v1/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: SET_CART_ITEMS,
        payload: res.data.data.items,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWishProducts = async () => {
    
    try {
      const res = await axios.get(`http://localhost:3000/v1/wish/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const items = res.data?.data?.items || [];

      console.log(items)
      dispatch(setWish(items));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    debugger
    if (token) {
      fetchProducts();
      fetchWishProducts();
      console.log(wishList)
    }
  }, [token]);


  return (
   
    <div>
      <div className="relative w-full h-full text-white bg-gray-400 -z-10">
      {/* Background Slideshow */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="absolute inset-0 w-full h-[100vh] z-0"
      >
        {images.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${url})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center h-[100vh] z-10 bg-black/40 px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-bold">Relot Leather Goods</h2>
        <p className="text-xl mt-4">Built to last!</p>
        <a
          href="https://relot.in/shop/"
          className="mt-6 inline-block bg-white text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition"
        >
          EXPLORE THE COLLECTION
        </a>
      </div>

      {/* Announcement Bar */}
      <div className="absolute top-0 left-0 w-full bg-black/80 text-white text-sm md:text-base text-center py-2 z-20 ">
        Free Shipping on Orders Above ₹2000 · Exclusive Members-Only Sale
      </div>

      <Testimonial />
      <div className="flex justify-center ">
        <p className="mb-[30px] text-3xl">RELOT COLLECTION</p>
      </div>

      {/* Hero Image */}
      <div className="w-full flex justify-center items-center overflow-auto">
        <div className="relative w-full max-w-screen-2xl al flex justify-center">
          <div
            className="w-[98vw] h-[98vh] bg-cover bg-center m-1"
            style={{
              backgroundImage: `url("https://relot.in/wp-content/uploads/2025/02/mn.jpg")`,
            }}
          ></div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center overflow-auto">
        <div className="relative w-full max-w-screen-2xl flex justify-center">
          <div
            className="w-[98vw] h-[100vh] bg-cover bg-center"
            style={{
              backgroundImage: `url("https://relot.in/wp-content/uploads/2025/02/wmdcd.jpg")`,
            }}
          ></div>
        </div>
      </div>

      <ProductCategories />

      <section className="flex flex-col md:flex-row justify-center items-center gap-8 px-4 py-12 bg-white">
        {/* Women Handbag Section */}
        <div
          className=" p-8 rounded-lg shadow h-[70vh] w-full md:w-1/2 text-center"
          style={{
            backgroundImage: `url("/Mbag.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Women Handbag</h2>
          <Link
            href="#"
            className="inline-block bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition"
          >
            SHOP NOW
          </Link>
        </div>

        {/* Men Bag Section */}
        <div
          className=" p-8 rounded-lg shadow h-[70vh] w-full md:w-1/2 text-center"
          style={{
            backgroundImage: `url("/Wbag.webp")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h2 className="text-2xl font-bold mb-4">Men Bag</h2>
          <Link
            href="#"
            className="inline-block bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      <div className="flex justify-center items-center px-4 py-12">
        <div className="max-w-screen-lg w-full text-center">
          <h2 className="text-3xl font-bold uppercase tracking-wide">
            RELOT SERVICE&aposS
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-12 max-w-screen-xl mx-auto">
        {services.map((service, index) => (
          <a
            key={index}
            href={service.link}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="w-full h-64 relative">
              <Image
                src={service.image}
                alt={service.title}
                layout="fill"
                objectFit="cover"
                className="rounded-t-2xl"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
    </div>
   
  )
}