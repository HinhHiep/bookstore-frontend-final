import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
    customPaging: (i: number) => (
      <div
        className={`w-12 h-1 rounded-full transition-all ${
          i === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
        }`}
      />
    ),
    appendDots: (dots: React.ReactNode) => (
      <div className="bottom-6">
        <ul className="flex items-center justify-center gap-2"> {dots} </ul>
      </div>
    ),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <Slider {...settings}>
          {/* Slide 1 - From provided image */}
          {/* <div className="outline-none">
            <img
              src='https://images.unsplash.com/photo-1583078156135-8e04f60c2606?crop=entropy&cs=tinysrgb&fit=max&fm=jpg'
              alt="Khuyến mãi sách"
              className="w-full h-[500px] object-cover"
            />
          </div>*/}

          {/* Slide 2 - Additional promotional banner */}
          <div className="outline-none">
            <div className="relative h-[500px] bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center">
              <div className="text-center text-white z-10 px-8">
                <h2 className="text-6xl font-bold mb-4">SALE CUỐI NĂM</h2>
                <p className="text-3xl mb-6">Giảm đến 60% toàn bộ kho sách</p>
                <button className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-colors">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="outline-none">
            <div className="relative h-[500px] bg-gradient-to-br from-green-400 via-teal-400 to-blue-400 flex items-center justify-center">
              <div className="text-center text-white z-10 px-8">
                <h2 className="text-6xl font-bold mb-4">SÁCH MỚI 2026</h2>
                <p className="text-3xl mb-6">Cập nhật những đầu sách mới nhất</p>
                <button className="bg-white text-teal-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-colors">
                  Khám phá
                </button>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}
