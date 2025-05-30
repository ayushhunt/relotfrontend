"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { footerData } from "../../../data/footerData"
import { SocialIcon } from "./social-icons"
import { ContactItem } from "./contactItem"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function Footer() {
  // Initialize openSections as an empty array
  const [openSections, setOpenSections] = useState([]);

  const toggleSection = (title) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]
    )
  }

  return (
    <footer className="bg-red-600 text-white px-6 md:px-16 py-12">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/assets/logo.jpg" 
                alt="Relot Logo" 
                width={150} 
                height={40} 
                className="mb-4" 
              />
            </Link>
            <h2 className="font-bold text-xl mb-4">{footerData.tagline}</h2>
            <p className="text-base leading-relaxed">{footerData.description}</p>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-bold text-xl mb-5 border-b border-white pb-2">
              {footerData.informationTitle}
            </h3>
            <ul className="space-y-3">
              {footerData.informationLinks.map((link) => (
                <li key={link.text} className="text-base">
                  <div 
                    className="flex items-center justify-between cursor-pointer" 
                    onClick={() => link.subsections && toggleSection(link.text)}
                  >
                    <Link href={link.text} className="hover:underline">
                      {link.text}
                    </Link>
                    {link.subsections && (
                      <span>
                        {openSections.includes(link.text) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    )}
                  </div>
                  {link.subsections && openSections.includes(link.text) && (
                    <ul className="ml-4 mt-2 space-y-2 text-sm">
                      {link.subsections.map((sublink) => (
                        <li key={sublink.text}>
                          <Link href={sublink.href} className="hover:underline">
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
            <h3 className="font-bold text-xl mb-5 border-b border-white pb-2">{footerData.quickShopTitle}</h3>
            <ul className="space-y-3">
              {footerData.quickShopLinks.map((link) => (
                <li key={link.text} className="text-base hover:underline transition-all">
                  <Link href={link.href}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-xl mb-5 border-b border-white pb-2">{footerData.contactTitle}</h3>

            {footerData.contactInfo.map((item) => (
              <ContactItem key={item.type} icon={item.icon} content={item.content} />
            ))}

            <h3 className="font-bold text-xl mt-8 mb-4">{footerData.socialTitle}</h3>
            <div className="flex gap-5 text-2xl">
              {footerData.socialLinks.map((social) => (
                <SocialIcon key={social.platform} href={social.href} icon={social.icon} platform={social.platform} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/30 mt-10 pt-6 text-center">
        <p className="text-base">{footerData.copyright}</p>
      </div>
    </footer>
  )
}
