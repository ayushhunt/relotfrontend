"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { footerData } from "../../../data/footerData"
import { SocialIcon } from "./social-icons"
import { ContactItem } from "./contactItem"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function Footer() {
  const [openSections, setOpenSections] = useState([])

  const toggleSection = (title) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    )
  }

  return (
    <footer className="bg-white px-6 md:px-16 py-12 text-black " style={{marginTop: '213px'}}>
      <div className="container mx-auto">
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="inline-block mb-6 group">
              <Image
                src="/assets/logo.jpg"
                alt="Relot Logo"
                width={150}
                height={40}
                className="mb-4 transition-all duration-300 group-hover:scale-105"
              />
            </Link>
            <h2 className="font-bold text-xl mb-4 text-black">{footerData.tagline}</h2>
            <p className="font-medium  text-base leading-relaxed text-black ">{footerData.description}</p>
          </div>

          {/* Information Links */}
          <div>
            <h3 className="font-bold text-xl mb-5 border-b border-gray-300 pb-2 text-black">
              {footerData.informationTitle}
            </h3>
            <ul className="space-y-3">
              {footerData.informationLinks.map((link) => (
                <li key={link.text} className="font-medium text-base">
                  <div
                    className="flex items-center justify-between cursor-pointer text-black hover:text-red-600 transition-colors duration-300"
                    onClick={() => link.subsections && toggleSection(link.text)}
                  >
                    <Link href={link.href} className="hover:underline transition-all duration-300">
                      {link.text}
                    </Link>
                    {link.subsections && (
                      <span className="text-black hover:text-red-500 transition-colors duration-300">
                        {openSections.includes(link.text) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    )}
                  </div>
                  {link.subsections && openSections.includes(link.text) && (
                    <ul className="ml-4 mt-2 space-y-2 text-sm text-black">
                      {link.subsections.map((sublink) => (
                        <li key={sublink.text}>
                          <Link
                            href={sublink.href}
                            className="hover:text-red-600 hover:underline transition-colors duration-300"
                          >
                            {sublink.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Shop */}
          <div>
            <h3 className="font-bold text-xl mb-5 border-b border-gray-300 pb-2 text-black">
              {footerData.quickShopTitle}
            </h3>
            <ul className="space-y-3">
              {footerData.quickShopLinks.map((link) => (
                <li key={link.text} className="font-medium text-base">
                  <Link
                    href={link.href}
                    className="text-black hover:text-red-600 hover:underline transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-xl mb-5 border-b border-gray-300 pb-2 text-black">
              {footerData.contactTitle}
            </h3>
            <div className="space-y-4 font-medium">
              {footerData.contactInfo.map((item) => (
                <ContactItem key={item.type} icon={item.icon} content={item.content} />
              ))}
            </div>

            <h3 className="font-bold text-xl mt-8 mb-4 text-black">{footerData.socialTitle}</h3>
            <div className="flex gap-4 text-2xl text-black">
              {footerData.socialLinks.map((social) => (
                <div key={social.platform} className="hover:text-red-600 transition-colors duration-300">
                  <SocialIcon href={social.href} icon={social.icon} platform={social.platform} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer with Razorpay Integration */}
      <div className="border-t border-gray-300 mt-10 pt-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          {/* Copyright */}
          <div className="lining-nums text-center md:text-left">
            <p className="text-base text-black">{footerData.copyright}</p>
          </div>

          {/* Payment Section */}
          <div className="text-center md:text-right">
            <div className="flex flex-col items-center md:items-end gap-3">
              {/* Payment Method Text */}
              <p className="text-sm text-black font-medium">
                Secure Payment Powered by
              </p>

              {/* Razorpay Logo and Badge */}
              <div className="flex items-center gap-4">
                {/* Razorpay Logo */}
                {/* Razorpay Logo */}
                <div className="group cursor-pointer">
                  <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200 hover:border-red-300 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/razorpay.svg" // Replace with your actual Razorpay image path
                        alt="Razorpay"
                        width={120}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="group cursor-pointer">
                  <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 hover:bg-green-100 hover:border-green-300 transition-all duration-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="text-green-700 font-semibold text-sm">100% Secure</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Features */}
              <div className="flex flex-wrap justify-center md:justify-end gap-4 text-xs text-black">
                <div className="flex items-center gap-1 hover:text-red-600 transition-colors duration-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instant Refunds</span>
                </div>
                <div className="flex items-center gap-1 hover:text-red-600 transition-colors duration-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>UPI, Cards, Wallets</span>
                </div>
                <div className="flex items-center gap-1 hover:text-red-600 transition-colors duration-300">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Bank Grade Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </footer>
  )
}
