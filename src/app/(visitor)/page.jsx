"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RecentWorks from "@/components/RecentWorks";
import CallToAction from "@/components/ui/calltoaction";
import Footer from "@/components/ui/footer";
import { useCounter } from "@/hooks/useCounter";
import {
  FaRocket,
  FaUsers,
  FaShieldAlt,
  FaHeadset,
  FaMicrochip,
  FaUserTie,
  FaHandshake,

} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AOS from "aos";
import "aos/dist/aos.css";
import GradientButton from "@/components/ui/GradientButton";

export default function Page() {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [newsItems, setNewsItems] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");
  const [eventsItems, setEventsItems] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState("");
  const { count: projectCount, ref: projectRef } = useCounter(50, 2000);
  const { count: experienceCount, ref: experienceRef } = useCounter(5, 2000);
  const { count: satisfactionCount, ref: satisfactionRef } = useCounter(98, 2000);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        setServicesError("");
        // fetch only posts in category "Service"
        const res = await fetch("/api/posts?category=Service&status=published&isFeatured=true");

        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        console.log("services:", data);

        setServices(data);
      } catch (err) {
        console.error(err);
        setServicesError(err.message || "Failed to load services");
      } finally {
        setServicesLoading(false);
      }
    };

    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        setNewsError("");
        const res = await fetch("/api/posts?category=News&status=published&isFeatured=true");
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        console.log("news items:", data);
        setNewsItems(data);
      } catch (err) {
        console.error(err);
        setNewsError(err.message || "Failed to load news");
      } finally {
        setNewsLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError("");
        const res = await fetch("/api/posts?category=Events&status=published&isFeatured=true");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        console.log("events items:", data);
        setEventsItems(data);
      } catch (err) {
        console.error(err);
        setEventsError(err.message || "Failed to load events");
      } finally {
        setEventsLoading(false);
      }
    };

    fetchServices();
    fetchNews();
    fetchEvents();
    // replace manual fetches with polling hook usage in component scope (see below)
  }, []);


  // Clients section data
  const clients = [
    "/img/client5.png",
    "/img/client2.png",
    "/img/client3.png",
    "/img/client7.png",
    "/img/client5.png",
    "/img/client6.png",
    "/img/client7.png",
    "/img/client8.png",
    "/img/client6.png",
    "/img/client2.png",
    "/img/client3.png",
    "/img/client8.png",
  ];

  // Features section data
  const features = [
    {
      icon: FaRocket,
      title: "พัฒนาเร็ว ทันใจ",
      description: "ทำงานรวดเร็ว มอบงานตรงเวลา พร้อมให้บริการตลอด 24 ชั่วโมง",
    },
    {
      icon: FaUsers,
      title: "ทีมงานมืออาชีพ",
      description: "ทีมงานมีประสบการณ์กว่า 5 ปี พร้อมให้คำปรึกษาอย่างเชี่ยวชาญ",
    },
    {
      icon: FaShieldAlt,
      title: "มาตรฐานคุณภาพ",
      description: "รับประกันคุณภาพงาน พร้อมบริการหลังการขายอย่างต่อเนื่อง",
    },
    {
      icon: FaHeadset,
      title: "บริการครบวงจร",
      description: "ให้คำปรึกษา พัฒนา และดูแลระบบแบบครบวงจรในที่เดียว",
    },
  ];

  // combine news + events for frontend (show all)
  const combinedItems = [...newsItems, ...eventsItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <section className="relative w-full min-h-[700px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/welcome_bg.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a5c48]/95 via-[#216452]/90 to-[#1a5c48]/95"></div>
        <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center justify-center px-6 md:px-12 text-center">
          <div
            className="flex-1 space-y-6 text-center"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold text-white tracking-[0.2em] uppercase leading-tight">
              Digital & IT <span className="bg-gradient-to-r from-[#ffb87a] to-[#e89f5d] bg-clip-text text-transparent animate-gradient">
                Solutions
              </span>
              <br /> Partner for Your Growth
            </h1>
            <p className="text-sm md:text-base text-white leading-[1.8] font-light max-w-2xl mx-auto">
              เราเป็นพันธมิตรด้านดิจิทัลและไอที ที่พร้อมวางแผน พัฒนา และดูแล
              ระบบครบวงจร เพื่อช่วยขับเคลื่อนธุรกิจของคุณในยุคดิจิทัล
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
              <Link href="/company">
                <Button
                  className="bg-[#ffb87a] text-black hover:bg-[#e89f5d] font-medium rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-all"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  ข้อมูลองค์กร
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-medium rounded-full px-8 py-4"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  ปรึกษาฟรี
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-start gap-12 py-20 px-6">
        <div className="flex-1 space-y-6" data-aos="fade-right">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
              About Our Company
            </span>
          </div>
          <h2 className="text-2xl font-medium text-gray-800 tracking-[0.2em] uppercase">
            บริษัท ควอนจิเทค จำกัด
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-[1.8] font-light leading-relaxed">
            บริษัท ควอนจิเทค จำกัด ก่อตั้งขึ้นในปี 2560 จากทีมผู้เชี่ยวชาญด้าน
            Quantum, Digital และ IT เพื่อช่วยองค์กรปรับตัวและเติบโตในยุคดิจิทัล
            ด้วยประสบการณ์มากกว่า 10 ปี
          </p>
          <div className="space-y-6">
            {[
              {
                icon: FaMicrochip,
                title: "นวัตกรรมและเทคโนโลยี",
                text: "มุ่งเน้นการพัฒนาโซลูชันด้วยเทคโนโลยีล้ำสมัย รองรับการเปลี่ยนแปลงในอนาคต",
              },
              {
                icon: FaUserTie,
                title: "ความเชี่ยวชาญและประสบการณ์",
                text: "ทีมงานมีประสบการณ์กว่า 10 ปีในด้าน Quantum, Digital และ IT",
              },
              {
                icon: FaHandshake,
                title: "พันธมิตรเพื่อการเติบโต",
                text: "สร้างความร่วมมือระยะยาว เพื่อขับเคลื่อนธุรกิจให้เติบโตอย่างยั่งยืน",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-4 items-start"
                data-aos="fade-up"
                data-aos-delay={200 * i}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-blue-500 text-xl" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-medium text-gray-800 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div data-aos="fade-left" className="relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-gray-100">
            <img
              src="img/default3.png"
              alt="ทีมงานมืออาชีพ"
              className="w-[500px] h-[450px] object-contain"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDYwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjE2NDUyIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPlRlYW0gSWxsdXN0cmF0aW9uPC90ZXh0Pgo8L3N2Zz4=";
              }}
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#f9fafb] py-20">
        <div className="max-w-[1140px] mx-auto text-center px-6">
          <h2
            className="text-3xl font-bold text-gray-800 tracking-[0.1em] uppercase mb-4"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            บริการของ <span className="text-[#ffb87a]">quangitech</span>
          </h2>
          <p
            className="text-[#555] max-w-2xl mx-auto mb-12 leading-relaxed"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            เราผสมผสานความคิดสร้างสรรค์ เทคโนโลยี และกลยุทธ์
            เพื่อสร้างโซลูชันดิจิทัลที่ทันสมัย และช่วยธุรกิจคุณเติบโตอย่างมั่นคง
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesLoading && (
              <div className="col-span-full text-center py-10 text-gray-500 text-sm">
                กำลังโหลดข้อมูล...
              </div>
            )}
            {servicesError && (
              <div className="col-span-full text-center py-10 text-red-600 text-sm">
                เกิดข้อผิดพลาดในการโหลดข้อมูล: {servicesError}
              </div>
            )}
            {/* Services List */}
            {!servicesLoading && !servicesError && services.map((service, i) => (
              <div
                key={i}
                className="group relative bg-gradient-to-br from-white to-gray-50/30 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 
                 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-gray-200/60
                 before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-transparent before:to-orange-50/20 
                 before:opacity-0 before:transition-all before:duration-500 hover:before:opacity-100"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay={i * 150}
              >
                <h4
                  className="text-gray-800 text-xl font-semibold mb-4 group-hover:text-[#ff9a56] 
                     transition-colors duration-300 leading-tight"
                >
                  {service.title}
                </h4>

                <p
                  className="text-gray-600 text-sm md:text-base font-normal leading-relaxed mb-8 
                    group-hover:text-gray-700 transition-colors duration-300"
                >
                  {service.excerpt}
                </p>

                <Link href={`/services/${service.slug}`}>
                  <Button
                    className="relative bg-gradient-to-r from-[#ffb87a] to-[#ff9a56] hover:from-[#ff9a56] hover:to-[#e6935a] 
                   text-white font-medium rounded-md px-8 py-3 
                   transform group-hover:scale-105 transition-all duration-300 
                   shadow-lg shadow-orange-200/40 hover:shadow-ml hover:shadow-orange-200/50
                   before:absolute before:inset-0 before:rounded-ml before:bg-white/20 before:opacity-0 
                   hover:before:opacity-100 before:transition-all before:duration-300
                   overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Learn more
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>
                <div
                  className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-orange-100/40 to-transparent 
                      rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                ></div>
                <div
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-orange-50/60 to-transparent 
                      rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100"
                ></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <RecentWorks />

      {/* News & Events Section */}
      <section className="bg-white py-20">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="text-center mb-10 flex flex-col items-center" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-800 tracking-[0.1em] uppercase">
              ข่าวสารและกิจกรรม
            </h2>
            <span className="my-2 w-24 h-1 bg-orange-400 rounded-full"></span>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ติดตามข่าวสารและกิจกรรมล่าสุดของเรา เพื่อไม่พลาดทุกความเคลื่อนไหว
            </p>
          </div>
          <section className="max-w-6xl mx-auto px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Loading UI */}
              {(newsLoading || eventsLoading) && (
                <div className="col-span-full text-center py-10 text-gray-500 text-sm">
                  กำลังโหลดข้อมูล...
                </div>
              )}
              {/* Error UI */}
              {(newsError || eventsError) && (
                <div className="col-span-full text-center py-10 text-red-600 text-sm">
                  เกิดข้อผิดพลาดในการโหลดข้อมูล: {newsError || eventsError}
                </div>
              )}
              {!(newsLoading || eventsLoading) && !(newsError || eventsError) && combinedItems.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white border border-gray-300 rounded-3xl overflow-hidden
              hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-gray-200
              transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.thumbnail || "/img/default.png"}
                      alt={item.title}
                      className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
                      {item.excerpt}
                    </p>
                    <Link href={`/news/${item.slug}`}>
                      <div className="inline-flex items-center gap-2 text-gray-600 font-medium
                  hover:text-gray-800 transition-all duration-200">
                        <span className="text-sm">อ่านเพิ่มเติม</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="text-center">
            <GradientButton href="/news">ดูข่าวสารทั้งหมด</GradientButton>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-white py-10">
        <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right" className="space-y-8">
            <div>
              <div className="inline-flex items-center space-x-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full"></div>
                <span className="text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-2xl font-medium text-gray-800 tracking-[0.2em] uppercase mb-4">
                ทำไมต้องเลือก เรา?
              </h2>
              <p className="text-sm md:text-base text-gray-600 leading-[1.8] font-light leading-relaxed">
                เราคือพันธมิตรด้านดิจิทัลที่เข้าใจธุรกิจคุณ
                พร้อมสร้างโซลูชันที่ตอบโจทย์และขับเคลื่อนการเติบโตอย่างยั่งยืน
              </p>
            </div>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                    <feature.icon className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-medium text-gray-800 leading-snug mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm md:text-base font-light text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6 pt-6" data-aos="fade-up">
              <div className="text-center" ref={projectRef}>
                <div className="text-4xl font-bold text-gray-800">{projectCount}+</div>
                <div className="text-sm text-gray-600">โปรเจกต์สำเร็จ</div>
              </div>
              <div className="text-center" ref={experienceRef}>
                <div className="text-4xl font-bold text-gray-800">{experienceCount}+</div>
                <div className="text-sm text-gray-600">ปีประสบการณ์</div>
              </div>
              <div className="text-center" ref={satisfactionRef}>
                <div className="text-4xl font-bold text-gray-800">{satisfactionCount}%</div>
                <div className="text-sm text-gray-600">ความพึงพอใจ</div>
              </div>
            </div>
          </div>
          <div data-aos="fade-left" className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-gray-100">
              <img
                src="/img/default2.png"
                alt="ทีมงานมืออาชีพ"
                className="w-[600px] h-[500px] object-contain"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDYwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMjE2NDUyIiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiPlRlYW0gSWxsdXN0cmF0aW9uPC90ZXh0Pgo8L3N2Zz4=";
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <CallToAction />
      <section className="bg-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-gray-400 tracking-[0.25em] uppercase">
              Clients
            </span>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView="auto"
              loop={true}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={3000}
              grabCursor={true}
              breakpoints={{
                320: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                640: {
                  slidesPerView: 4,
                  spaceBetween: 40,
                },
                768: {
                  slidesPerView: 5,
                  spaceBetween: 50,
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 60,
                },
                1280: {
                  slidesPerView: 7,
                  spaceBetween: 70,
                },
              }}
              className="clients-swiper"
            >
              {clients.map((logo, idx) => (
                <SwiperSlide key={idx} className="!w-auto">
                  <div className="flex-shrink-0 w-32 h-16 flex items-center justify-center group cursor-pointer">
                    <img
                      src={logo}
                      alt={`client ${idx + 1}`}
                      className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 transition-all duration-500 filter grayscale group-hover:grayscale-0 group-hover:scale-110"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {[...Array(Math.ceil(clients.length / 6))].map((_, idx) => (
                <button
                  key={idx}
                  className="w-2 h-2 rounded-full bg-gray-200 hover:bg-gray-400 transition-colors duration-300"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
