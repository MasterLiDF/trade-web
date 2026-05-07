"use client";

import { useState } from "react";

interface InquiryButtonProps {
  productId: string;
  productName: string;
  isEn: boolean;
}

export default function InquiryButton({
  productId,
  productName,
  isEn,
}: InquiryButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // 模拟提交请求
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitting(false);
    setSubmitted(true);

    // 3秒后关闭弹窗
    setTimeout(() => {
      setShowModal(false);
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-10 py-4 bg-[#C9A87C] text-[#2C1810] text-sm tracking-widest hover:bg-[#B8986C] transition-colors duration-300"
      >
        {isEn ? "Inquiry Now" : "立即询盘"}
      </button>

      {/* 询盘弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#FAF8F5] rounded-sm max-w-md w-full p-6 relative">
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#8A8A8A] hover:text-[#2C1810]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {!submitted ? (
              <>
                <h3 className="text-xl font-medium text-[#2C1810] mb-2">
                  {isEn ? "Product Inquiry" : "产品询盘"}
                </h3>
                <p className="text-[#8A8A8A] text-sm mb-6">
                  {isEn ? "Inquiry for: " : "询盘产品："}
                  <span className="text-[#C9A87C]">{productName}</span>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#5A5A5A] mb-1">
                      {isEn ? "Your Name *" : "您的姓名 *"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#E8E2D9] rounded-sm bg-white focus:outline-none focus:border-[#C9A87C]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#5A5A5A] mb-1">
                      {isEn ? "Email *" : "电子邮箱 *"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#E8E2D9] rounded-sm bg-white focus:outline-none focus:border-[#C9A87C]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#5A5A5A] mb-1">
                      {isEn ? "Phone" : "联系电话"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#E8E2D9] rounded-sm bg-white focus:outline-none focus:border-[#C9A87C]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#5A5A5A] mb-1">
                      {isEn ? "Message" : "留言内容"}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-[#E8E2D9] rounded-sm bg-white focus:outline-none focus:border-[#C9A87C] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#C9A87C] text-[#2C1810] text-sm tracking-widest hover:bg-[#B8986C] transition-colors duration-300 disabled:opacity-50"
                  >
                    {submitting
                      ? isEn
                        ? "Submitting..."
                        : "提交中..."
                      : isEn
                        ? "Submit Inquiry"
                        : "提交询盘"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-[#C9A87C]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-[#C9A87C]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-[#2C1810] mb-2">
                  {isEn ? "Inquiry Submitted!" : "询盘已提交！"}
                </h3>
                <p className="text-[#8A8A8A] text-sm">
                  {isEn
                    ? "We will contact you soon."
                    : "我们将尽快与您联系。"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
