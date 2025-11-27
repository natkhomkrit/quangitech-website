import React from "react";
import GradientButton from "./GradientButton";
export default function CallToAction() {
    return (
        <section className="relative py-24 bg-gradient-to-b from-white to-orange-50/30 overflow-hidden">
            <div className="relative max-w-4xl mx-auto text-center px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-[0.1em] relative inline-block mb-6">
                    Ready to get startde with us?
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-500 mx-auto rounded-full mb-8"></div>

                <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10 font-light">
                    เรามีบริการครบวงจรด้านซอฟต์แวร์ เทคโนโลยีสารสนเทศ และดิจิทัล <br className="hidden md:block" />
                    ไม่ว่าจะเป็นการพัฒนาเว็บไซต์ แอปพลิเคชัน การจัดการฐานข้อมูล และการอบรมคอมพิวเตอร์
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                    <GradientButton
                        href="/contact"
                        className="bg-gray-900 text-white hover:bg-black font-medium rounded-full px-8 py-4 text-lg shadow-lg shadow-gray-400/20 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        เริ่มโครงการกับเรา
                    </GradientButton>
                </div>
            </div>
        </section>
    );
}
