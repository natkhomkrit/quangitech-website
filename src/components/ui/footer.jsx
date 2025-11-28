import React, { useState, useEffect } from "react";

export default function Footer() {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState("/img/logocontact.png");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data && data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      }
    };
    fetchSettings();

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
    <footer className="bg-gray-900 w-full h-auto text-white">
      {/* Footer Top */}
      <div className="py-16">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-8">

            {/* Column 1 */}
            <div>
              <a href="/" className="inline-block mb-6">
                <img src={logoUrl} alt="Quangitech" className="w-40" />
              </a>
              <ul className="text-sm text-white/50 leading-[1.8] space-y-2">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white mt-1 flex-shrink-0">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-white/50 uppercase leading-[1.8]">
                    ที่อยู่ : 234/145 ถนนเทพารักษ์ ตำบลบางเมืองใหม่ อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ 10270
                  </p>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.625 1.694l-1.457 1.457c-.347.347-.94.44-1.474.214l-.72-.36a11.25 11.25 0 006.062 6.062l-.36-.72c-.226-.534-.133-1.127.214-1.474l1.457-1.457a1.875 1.875 0 011.694-.625l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-white/50 leading-[1.8]">
                    เบอร์โทรศัพท์ :
                  </span>
                  <a
                    href="tel:9999999999"
                    className="text-white/50 hover:text-[#ffb87a] transition"
                  >
                    999-999-9999
                  </a>
                </li>

                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.58 5.72a3 3 0 01-3.42 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 6.476a1.5 1.5 0 001.712 0L22.5 6.908z" />
                  </svg>
                  <p className="text-sm text-white/50 leading-[1.8]">
                    E-Mail :
                  </p>
                  <a
                    href="mailto:quangitech@gmail.com?subject=ติดต่อจากเว็บไซต์&body=สวัสดีครับ"
                    className="text-white/50 hover:text-[#ffb87a] transition"
                  >
                    quangitech@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-4 h-4 text-white" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                  </svg>
                  <p className="text-sm text-white/50 leading-[1.8] font-normal">
                    Facebook :
                  </p>
                  <a
                    href="https://www.facebook.com/p/Quangitech-100063857449990/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/50 hover:text-[#ffb87a] transition"
                  >
                    Quangitech
                  </a>
                </li>

              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-medium text-white tracking-[0.1em] mb-4">QUANGITECH CO., LTD.</h3>
              <p className="text-sm text-white/50 leading-[1.8]">
                บริษัท ควอนจิเทค จำกัด ผู้เชี่ยวชาญด้านการพัฒนาเว็บไซต์และระบบออนไลน์มากกว่า 10 ปี
                เราพร้อมเป็นที่ปรึกษาและเดินเคียงข้างคุณตั้งแต่ก้าวแรก
                เพื่อสร้างเว็บไซต์ที่ตอบโจทย์ธุรกิจและการเติบโตอย่างยั่งยืน
              </p>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="font-medium text-white tracking-[0.1em] mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {servicesLoading ? (
                  <li className="text-white/60">กำลังโหลด...</li>
                ) : services.length > 0 ? (
                  services.map((item, idx) => (
                    <li key={idx}>
                      {item.children && item.children.length > 0 ? (
                        <div className="space-y-2">
                          <div className="font-medium text-white uppercase tracking-wider mb-2">{item.title || item.name}</div>
                          <ul className="space-y-2 pl-4 border-l border-white/10">
                            {item.children.map((child, cidx) => (
                              <li key={cidx}>
                                <a
                                  href={child.url || child.href || child.link || child.path || (child.slug ? `/${child.slug}` : "#")}
                                  className="flex items-center gap-3 text-white/70 hover:text-[#ffb87a] transition-colors group text-sm"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 group-hover:bg-[#ffb87a] transition-colors"></span>
                                  <span className="uppercase tracking-wide">{child.title || child.name || child.label}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <a
                          href={item.url || item.href || item.link || item.path || (item.slug ? `/${item.slug}` : "#")}
                          className="flex items-center gap-3 text-white/70 hover:text-[#ffb87a] transition-colors group text-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-[#ffb87a] transition-colors"></span>
                          <span className="uppercase tracking-wide">{item.title || item.name}</span>
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
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center text-center py-4 text-sm text-white">
            <p className="text-center sm:mx-auto">© 2025 Quangitech. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
