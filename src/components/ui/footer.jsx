import React, { useState, useEffect } from "react";

export default function Footer() {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  useEffect(() => {
    const fetchFooterMenu = async () => {
      try {
        setServicesLoading(true);
        const res = await fetch("/api/menus?name=Footer");
        if (!res.ok) throw new Error("Failed to fetch footer menu");
        const data = await res.json();
        // Expecting API to return an array of menus; take the first one and its items
        const items = data?.[0]?.items || [];
        setServices(items);
      } catch (err) {
        console.error("Error fetching footer menu:", err);
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchFooterMenu();
  }, []);

  return (
    <footer className="bg-[#1a5c48] text-white">
      {/* Footer Top */}
      <div className="py-16">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">

            {/* Column 1 */}
            <div>
              <a href="/" className="inline-block mb-6">
                <img src="/img/logocontact.png" alt="Quangitech" className="w-40" />
              </a>
              <ul className="text-sm text-white/80 leading-[1.8] space-y-2">
                <li className="flex items-center gap-2">
                  <p className="text-sm text-white/80 uppercase leading-[1.8]">
                    ที่อยู่ : 234/145 ถนนเทพารักษ์ ตำบลบางเมืองใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ 10270
                  </p>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-sm text-white/80 leading-[1.8]">
                    เบอร์โทรศัพท์ :
                  </span>
                  <a
                    href="tel:9999999999"
                    className="text-white/80 hover:underline transition"
                  >
                    999-999-9999
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <p className="text-sm text-white/80 leading-[1.8]">
                    E-Mail :
                  </p>
                  <a
                    href="mailto:quangitech@gmail.com?subject=ติดต่อจากเว็บไซต์&body=สวัสดีครับ"
                    className="text-white/80 hover:underline transition"
                  >
                    quangitech@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <p className="text-sm text-white/80 leading-[1.8] font-normal">
                    Facebook :
                  </p>
                  <a
                    href="https://www.facebook.com/p/Quangitech-100063857449990/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/80 hover:underline transition"
                  >
                    Quangitech
                  </a>
                </li>

              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-medium text-[#ffb87a] tracking-[0.1em] mb-4">QUANGITECH CO., LTD.</h3>
              <p className="text-sm text-white/80 leading-[1.8]">
                บริษัท ควอนจิเทค จำกัด ผู้เชี่ยวชาญด้านการพัฒนาเว็บไซต์และระบบออนไลน์มากกว่า 10 ปี
                เราพร้อมเป็นที่ปรึกษาและเดินเคียงข้างคุณตั้งแต่ก้าวแรก
                เพื่อสร้างเว็บไซต์ที่ตอบโจทย์ธุรกิจและการเติบโตอย่างยั่งยืน
              </p>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-medium text-[#ffb87a] tracking-[0.1em] mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {servicesLoading ? (
                  <li className="text-white/60">กำลังโหลด...</li>
                ) : services.length > 0 ? (
                  services.map((item, idx) => (
                    <li key={idx}>
                      {item.children && item.children.length > 0 ? (
                        <div>
                          <div className="font-semibold text-white/90 mb-1">{item.title || item.name}</div>
                          <ul className="pl-2 space-y-1">
                            {item.children.map((child, cidx) => (
                              <li key={cidx}>
                                <a
                                  href={child.url || child.href || child.link || child.path || (child.slug ? `/${child.slug}` : "#")}
                                  className="inline-block text-sm text-white/80 hover:text-[#ffb87a] transition"
                                >
                                  {child.title || child.name || child.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <a
                          href={item.url || item.href || item.link || item.path || (item.slug ? `/${item.slug}` : "#")}
                          className="relative inline-block hover:text-[#ffb87a] transition"
                        >
                          {item.title || item.name}
                        </a>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-white/60">ไม่มีเมนู</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/20">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-center py-4 text-sm text-white/80">
            <p>© 2025 Quangitech. All Rights Reserved.</p>
            <p className="mt-2 sm:mt-0">Designed with by Quangitech</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
